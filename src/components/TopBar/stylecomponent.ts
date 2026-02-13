const TOP_BAR_STYLE_ID = 'tf-topbar-styles';

const topBarCss = `
.tb-header {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 1rem;
  background: rgba(245, 250, 248, 0.8);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid rgba(43, 182, 115, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tb-header.tb-header-scrolled {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.95);
  border-bottom-color: rgba(43, 182, 115, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.tb-navbar {
  width: min(1200px, calc(100% - 2rem));
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.tb-brand-button {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.tb-brand-button:hover {
  transform: scale(1.02);
}

.tb-brand-button:focus-visible {
  outline: 2px solid var(--color-brand-accent);
  outline-offset: 4px;
  border-radius: 4px;
}

.tb-brand {
  color: var(--color-brand-primary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.9rem;
  font-weight: 800;
  white-space: nowrap;
  background: linear-gradient(135deg, var(--color-brand-primary), var(--color-primary-700));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tb-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.tb-btn {
  min-height: 42px;
  border-radius: 12px;
  border: 1px solid transparent;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.tb-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.tb-btn:hover::before {
  left: 100%;
}

.tb-btn:focus-visible {
  outline: 2px solid var(--color-brand-accent);
  outline-offset: 2px;
}

.tb-btn-primary {
  background: var(--color-brand-primary);
  color: #ffffff;
  border: 1px solid var(--color-brand-primary);
  box-shadow: 0 2px 8px rgba(43, 182, 115, 0.3);
}

.tb-btn-primary:hover {
  background: var(--color-primary-700);
  border-color: var(--color-primary-700);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(43, 182, 115, 0.4);
}

.tb-btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(43, 182, 115, 0.3);
}

.tb-btn-secondary {
  background: #ffffff;
  color: var(--color-brand-primary);
  border: 1px solid var(--color-primary-200);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.tb-btn-secondary:hover {
  background: var(--color-primary-50);
  border-color: var(--color-brand-primary);
  color: var(--color-primary-700);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(43, 182, 115, 0.15);
}

.tb-btn-secondary:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

@media (max-width: 1024px) {
  .tb-header {
    padding: 0.75rem 0.5rem;
  }

  .tb-navbar {
    width: calc(100% - 1rem);
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .tb-header {
    padding: 0.75rem 0.5rem;
  }

  .tb-navbar {
    width: calc(100% - 1rem);
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .tb-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .tb-btn {
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
    min-height: 38px;
  }

  .tb-brand {
    font-size: 0.85rem;
  }
}
`;

if (typeof document !== 'undefined' && !document.getElementById(TOP_BAR_STYLE_ID)) {
  const styleEl = document.createElement('style');
  styleEl.id = TOP_BAR_STYLE_ID;
  styleEl.textContent = topBarCss;
  document.head.appendChild(styleEl);
}

export const topBarStyles = {
  header: 'tb-header',
  headerScrolled: 'tb-header-scrolled',
  navbar: 'tb-navbar',
  navbarScrolled: 'tb-navbar-scrolled',
  brandButton: 'tb-brand-button',
  brand: 'tb-brand',
  actions: 'tb-actions',
  secondaryButton: 'tb-btn tb-btn-secondary',
  primaryButton: 'tb-btn tb-btn-primary'
};
