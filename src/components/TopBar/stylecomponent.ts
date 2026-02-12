const TOP_BAR_STYLE_ID = 'tf-topbar-styles';

const topBarCss = `
.tb-header {
  position: sticky;
  top: 0;
  z-index: 30;
  padding: 0.5rem 1rem;
  background: #F5F7FA;
  transition: padding 0.25s ease;
}

.tb-header.tb-header-scrolled {
  padding: 0.5rem 0.75rem;
}

.tb-navbar {
  width: min(980px, calc(100% - 1.5rem));
  margin: 0 auto;
  background: #F5F7FA;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-gray-200);
  border-radius: 16px;
  padding: 0.625rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 52px;
  box-shadow: var(--shadow);
  transition: all 0.25s ease;
  will-change: width, border-radius, padding, background;
}

.tb-navbar.tb-navbar-scrolled {
  width: 100%;
  border-radius: 12px;
  padding: 0.625rem 1rem;
}

.tb-brand-button {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
}

.tb-brand-button:hover {
  transform: scale(1.02);
}

.tb-brand {
  color: var(--color-gray-900);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.84rem;
  font-weight: 800;
  white-space: nowrap;
}

.tb-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.tb-btn {
  min-height: 38px;
  border-radius: 10px;
  border: 1px solid transparent;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tb-btn:focus-visible {
  outline: 2px solid var(--color-brand-accent);
  outline-offset: 2px;
}

.tb-btn-primary {
  background: var(--color-brand-primary);
  color: #ffffff;
  border: 1px solid var(--color-brand-primary);
  box-shadow: var(--shadow-sm);
}

.tb-btn-primary:hover {
  background: var(--color-primary-700);
  border-color: var(--color-primary-700);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.tb-btn-primary:active {
  transform: translateY(0);
}

.tb-btn-secondary {
  background: #ffffff;
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-300);
  box-shadow: none;
}

.tb-btn-secondary:hover {
  background: var(--color-primary-50);
  border-color: var(--color-primary-300);
  color: var(--color-brand-primary);
}

.tb-btn-secondary:active {
  transform: translateY(0);
}

@media (max-width: 1024px) {
  .tb-header {
    padding: 0.5rem 0.75rem;
  }

  .tb-header.tb-header-scrolled {
    padding: 0.5rem 0.75rem;
  }

  .tb-navbar {
    width: calc(100% - 1rem);
    padding: 0.625rem 0.875rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    min-height: auto;
  }

  .tb-navbar.tb-navbar-scrolled {
    width: 100%;
    border-radius: 12px;
    padding: 0.625rem 0.875rem;
  }

  .tb-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .tb-header {
    padding: 0.5rem;
  }

  .tb-navbar {
    padding: 0.625rem 0.75rem;
  }

  .tb-navbar.tb-navbar-scrolled {
    padding: 0.625rem 0.75rem;
  }

  .tb-btn {
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
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
