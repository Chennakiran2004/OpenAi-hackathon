import React, { useEffect, useRef } from "react";
import { HiMicrophone } from "react-icons/hi";
import type { VoiceAgentSector } from "../../api/types";
import VoiceAgent, { type VoiceAgentHandle } from "../VoiceAgent";
import {
  dockDocuChatLauncher,
  loadDocuChatWidget,
  setDocuChatLauncherVisible,
} from "../../utils/docuChatWidget";

interface AssistLauncherProps {
  sector: VoiceAgentSector;
}

const DOCUCHAT_ID = "71522dbb-2ff1-4ede-a422-03a19b16d6a8";

export default function AssistLauncher({ sector }: AssistLauncherProps) {
  const voiceRef = useRef<VoiceAgentHandle | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initDockedStack() {
      await loadDocuChatWidget(DOCUCHAT_ID);
      if (cancelled) return;

      const isMobile =
        window.matchMedia?.("(max-width: 768px)").matches ?? false;
      const baseRightPx = isMobile ? 16 : 24;
      const baseBottomPx = isMobile ? 16 : 24;

      // Dock DocuChat launcher at the bottom icon position.
      dockDocuChatLauncher({
        docked: true,
        baseRightPx,
        baseBottomPx,
        gapPx: 0,
        fabSizePx: 0,
      });
      setDocuChatLauncherVisible(true);
    }

    initDockedStack();
    return () => {
      cancelled = true;
      setDocuChatLauncherVisible(false);
      dockDocuChatLauncher({
        docked: false,
        baseRightPx: 24,
        baseBottomPx: 24,
        gapPx: 0,
        fabSizePx: 0,
      });
    };
  }, []);

  function openVoice() {
    voiceRef.current?.open();
  }

  return (
    <>
      <div className="assist-stack" aria-label="Assistant actions">
        <button
          type="button"
          className="assist-stack-voice"
          onClick={openVoice}
          aria-label="Open voice agent"
          title="Voice Agent"
          style={{ width: "48px", height: "48px" }}
        >
          <HiMicrophone className="w-6 h-6" />
        </button>
      </div>

      <VoiceAgent ref={voiceRef} sector={sector} hideFab />
    </>
  );
}
