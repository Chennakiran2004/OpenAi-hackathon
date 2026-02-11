const TOP_BAR_STYLE_ID = 'tf-topbar-styles';

const topBarCss = `
.tb-header {
  position: sticky;
  top: 0;
  z-index: 30;
  padding: 1.5rem 1rem 1rem;
  background: transparent;
  transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tb-header.tb-header-scrolled {
  padding: 0.75rem 0;
  background: rgba(17, 17, 17, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.tb-navbar {
  width: min(900px, calc(100% - 2rem));
  margin: 0 auto;
  background: rgba(40, 40, 40, 0.7);                                                                                      
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(102, 102, 102, 0.25);
  border-radius: 50px;
  padding: 0.875rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  min-height: 60px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: width, border-radius, padding, background;                                                                                                                     
}

.tb-navbar.tb-navbar-scrolled {
  width: 100%;
  border-radius: 0;
  padding: 0.875rem 3rem;
  border-left: none;
  border-right: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  background: rgba(17, 17, 17, 0.9);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid rgba(102, 102, 102, 0.2);
  border-bottom: 1px solid rgba(102, 102, 102, 0.2);
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
  color: #E0E0E0;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.9rem;
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
  min-height: 42px;
  border-radius: 12px;
  border: 1px solid transparent;
  padding: 0.64rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tb-btn:focus-visible {
  outline: 2px solid #888888;
  outline-offset: 2px;
}

.tb-btn-primary {
  background: #666666;
  color: #E0E0E0;
  border: 1px solid #666666;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.tb-btn-primary:hover {
  background: #555555;
  border-color: #555555;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
}

.tb-btn-primary:active {
  transform: translateY(0);
}

.tb-btn-secondary {
  background: transparent;
  color: #E0E0E0;
  border: 1px solid rgba(102, 102, 102, 0.5);
  box-shadow: none;
}

.tb-btn-secondary:hover {
  background: rgba(102, 102, 102, 0.1);
  border-color: #666666;
  color: #E0E0E0;
}

.tb-btn-secondary:active {
  transform: translateY(0);
}

@media (max-width: 1024px) {
  .tb-header {
    padding: 0.75rem 1rem;
  }

  .tb-header.tb-header-scrolled {
    padding: 0.5rem 0;
  }

  .tb-navbar {
    width: calc(100% - 2rem);
    padding: 0.75rem 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    min-height: auto;
  }

  .tb-navbar.tb-navbar-scrolled {
    width: 100%;
    border-radius: 0;
    padding: 0.75rem 2rem;
  }

  .tb-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .tb-header {
    padding: 1rem 0.75rem 0.75rem;
  }

  .tb-navbar {
    padding: 0.75rem 1.25rem;
  }

  .tb-navbar.tb-navbar-scrolled {
    padding: 0.75rem 1.5rem;
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
