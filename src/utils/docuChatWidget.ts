let loadPromise: Promise<void> | null = null;
let launcherEl: HTMLElement | null = null;
let launcherOriginalStyle: string | null = null;

function isLikelyLauncher(el: HTMLElement): boolean {
  const style = window.getComputedStyle(el);
  if (style.position !== "fixed") return false;
  if (style.visibility === "hidden" || style.display === "none") return false;

  const rect = el.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  if (w < 40 || w > 110 || h < 40 || h > 110) return false;

  const nearRight = window.innerWidth - rect.right < 40;
  const nearBottom = window.innerHeight - rect.bottom < 60;
  return nearRight && nearBottom;
}

async function detectDocuChatLauncher(): Promise<HTMLElement | null> {
  if (launcherEl) return launcherEl;

  // Quick scan first.
  const elements = Array.from(document.querySelectorAll("body *"));
  for (const node of elements) {
    if (node instanceof HTMLElement && isLikelyLauncher(node)) {
      launcherEl = node;
      launcherEl.dataset.docuchatLauncher = "true";
      return launcherEl;
    }
  }

  // Observe briefly for widget insertion.
  return new Promise((resolve) => {
    const deadline = window.setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, 1500);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const added of Array.from(mutation.addedNodes)) {
          if (!(added instanceof HTMLElement)) continue;
          const candidates: HTMLElement[] = [added, ...Array.from(added.querySelectorAll("*")) as HTMLElement[]];
          for (const candidate of candidates) {
            if (candidate instanceof HTMLElement && isLikelyLauncher(candidate)) {
              launcherEl = candidate;
              launcherEl.dataset.docuchatLauncher = "true";
              window.clearTimeout(deadline);
              observer.disconnect();
              resolve(launcherEl);
              return;
            }
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}

export function setDocuChatLauncherVisible(visible: boolean) {
  if (typeof document === "undefined") return;
  if (visible) {
    document.body.classList.add("docuchat-launcher-visible");
  } else {
    document.body.classList.remove("docuchat-launcher-visible");
  }

  if (launcherEl) {
    launcherEl.dataset.visible = visible ? "true" : "false";
  }
}

export function dockDocuChatLauncher(params: {
  docked: boolean;
  baseRightPx: number;
  baseBottomPx: number;
  gapPx: number;
  fabSizePx: number;
}) {
  if (typeof document === "undefined") return;
  if (!launcherEl) return;

  if (params.docked) {
    if (launcherOriginalStyle == null) {
      launcherOriginalStyle = launcherEl.getAttribute("style");
    }

    launcherEl.dataset.docked = "true";
    launcherEl.style.position = "fixed";
    launcherEl.style.right = `${params.baseRightPx}px`;
    launcherEl.style.bottom = `${params.baseBottomPx + params.gapPx + params.fabSizePx}px`;
    launcherEl.style.left = "auto";
    launcherEl.style.top = "auto";
    launcherEl.style.zIndex = "72";
    setDocuChatLauncherVisible(true);
    return;
  }

  launcherEl.dataset.docked = "false";
  if (launcherOriginalStyle == null) {
    launcherEl.removeAttribute("style");
  } else {
    launcherEl.setAttribute("style", launcherOriginalStyle);
  }
  setDocuChatLauncherVisible(false);
}

function findDocuChatCandidate(): HTMLElement | null {
  const selectors = [
    '[id*="docuchat"]',
    '[class*="docuchat"]',
    'iframe[src*="docuchat"]',
    'iframe[src*="docu"]',
    'script[src*="docuchat"]',
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el instanceof HTMLElement) return el;
    if (el instanceof HTMLIFrameElement) return el;
    if (el instanceof HTMLScriptElement) return el;
  }

  // Try common launcher buttons (best-effort).
  const buttons = Array.from(document.querySelectorAll("button, div, a"));
  const match = buttons.find((node) => {
    const id = (node as HTMLElement).id || "";
    const cls = (node as HTMLElement).className || "";
    const aria = (node as HTMLElement).getAttribute("aria-label") || "";
    const text = (node as HTMLElement).textContent || "";
    const hay = `${id} ${cls} ${aria} ${text}`.toLowerCase();
    return hay.includes("docuchat") || hay.includes("docu chat");
  });
  return (match as HTMLElement) || null;
}

export function loadDocuChatWidget(chatbotId: string): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(
      'script[src="https://app.docuchat.io/widget/widget.min.js"]'
    );
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://app.docuchat.io/widget/widget.min.js";
    script.type = "text/javascript";
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.dataset.chatbotId = chatbotId;
    script.dataset.chatbotAvatarUrl = "";
    script.dataset.visibleUrls = "";
    script.onload = async () => {
      try {
        await detectDocuChatLauncher();
        setDocuChatLauncherVisible(false);
      } finally {
        resolve();
      }
    };
    script.onerror = () => reject(new Error("Failed to load DocuChat widget."));
    document.body.appendChild(script);
  });

  return loadPromise;
}

export async function openDocuChatWidget(chatbotId: string): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  await loadDocuChatWidget(chatbotId);

  // Strategy 1: known global API (best-effort).
  const w = window as unknown as {
    DocuChatWidget?: { open?: () => void; show?: () => void };
    docuChatWidget?: { open?: () => void; show?: () => void };
  };
  const api =
    w.DocuChatWidget?.open ||
    w.DocuChatWidget?.show ||
    w.docuChatWidget?.open ||
    w.docuChatWidget?.show;
  if (api) {
    api();
    return;
  }

  // Strategy 2: observe DOM for launcher insertion, then click a candidate.
  const clickCandidate = (): boolean => {
    const candidate = findDocuChatCandidate();
    if (!candidate) return false;

    // If iframe/script found, look for nearby clickable element first.
    if (candidate instanceof HTMLIFrameElement || candidate instanceof HTMLScriptElement) {
      const clickable = findDocuChatCandidate();
      if (clickable && clickable instanceof HTMLElement) {
        clickable.click();
        return true;
      }
      return false;
    }

    (candidate as HTMLElement).click();
    return true;
  };

  if (clickCandidate()) return;

  await new Promise<void>((resolve) => {
    const timeout = window.setTimeout(() => {
      observer.disconnect();
      resolve();
    }, 1500);

    const observer = new MutationObserver(() => {
      if (clickCandidate()) {
        window.clearTimeout(timeout);
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}
