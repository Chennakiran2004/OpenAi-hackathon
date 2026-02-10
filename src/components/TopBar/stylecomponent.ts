const TOP_BAR_STYLE_ID = 'tf-topbar-styles';

const topBarCss = `
.tb-header {
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
}

.tb-row {
  width: min(1200px, calc(100% - 2rem));
  margin: 0 auto;
  min-height: 78px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.tb-brand-button {
  all: unset;
  cursor: pointer;
  display: grid;
  gap: 0.3rem;
}

.tb-brand {
  color: #f8fafc;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.9rem;
  font-weight: 800;
}

.tb-tag {
  color: rgba(248, 250, 252, 0.84);
  font-size: 0.86rem;
}

.tb-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.tb-btn {
  min-height: 42px;
  border-radius: 10px;
  border: 1px solid transparent;
  padding: 0.64rem 1rem;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
}

.tb-btn:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

.tb-btn-primary {
  background: #0f766e;
  color: #f8fafc;
}

.tb-btn-primary:hover {
  background: #115e59;
  transform: translateY(-1px);
}

.tb-btn-secondary {
  background: transparent;
  color: #f8fafc;
  border-color: rgba(248, 250, 252, 0.48);
}

.tb-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
}

@media (max-width: 1024px) {
  .tb-row {
    min-height: auto;
    padding: 0.7rem 0;
    flex-direction: column;
    align-items: flex-start;
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
  row: 'tb-row',
  brandButton: 'tb-brand-button',
  brand: 'tb-brand',
  tag: 'tb-tag',
  actions: 'tb-actions',
  secondaryButton: 'tb-btn tb-btn-secondary',
  primaryButton: 'tb-btn tb-btn-primary'
};
