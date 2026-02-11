const PROFILE_STYLE_ID = 'tf-profile-page-styles';

const profileCss = `
.pf-section {
  min-height: 100vh;
  background: #111111;
  padding: 2rem 1.25rem 2.5rem;
}

.pf-inner {
  max-width: 560px;
  margin: 0 auto;
  display: grid;
  gap: 1.5rem;
}

.pf-header {
  margin-bottom: 0.25rem;
}

.pf-header h2 {
  margin: 0;
  color: #E0E0E0;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.pf-header p {
  margin: 0.6rem 0 0;
  color: #999999;
  font-size: 0.9375rem;
  line-height: 1.5;
}

.pf-panel {
  background: #282828;
  border: 1px solid rgba(102, 102, 102, 0.3);
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.pf-panel h3 {
  margin: 0 0 1.25rem;
  color: #E0E0E0;
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.pf-field {
  display: grid;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}

.pf-field:last-of-type {
  margin-bottom: 0;
}

.pf-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #b0b0b0;
  letter-spacing: 0.01em;
}

.pf-input {
  width: 100%;
  box-sizing: border-box;
  min-height: 42px;
  border: 1px solid rgba(102, 102, 102, 0.5);
  border-radius: 10px;
  padding: 0.55rem 0.75rem;
  background: #1a1a1a;
  color: #E0E0E0;
  font-size: 0.9rem;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.pf-input::placeholder {
  color: #666666;
}

.pf-input:hover {
  background: #222222;
  border-color: rgba(102, 102, 102, 0.6);
}

.pf-input:focus {
  background: #252525;
  border-color: #0d9488;
}

.pf-input:focus-visible,
.pf-btn-primary:focus-visible,
.pf-btn-secondary:focus-visible {
  outline: 2px solid #888888;
  outline-offset: 2px;
}

.pf-readonly {
  min-height: 42px;
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  background: #1a1a1a;
  border: 1px solid rgba(102, 102, 102, 0.3);
  color: #b0b0b0;
  font-size: 0.9rem;
  text-transform: capitalize;
}

.pf-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.pf-btn-primary {
  min-height: 46px;
  padding: 0.65rem 1.5rem;
  border: none;
  border-radius: 10px;
  background: #0d9488;
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.12s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(13, 148, 136, 0.35);
}

.pf-btn-primary:hover {
  background: #0f766e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.4);
}

.pf-btn-primary:active {
  transform: translateY(0);
}

.pf-btn-secondary {
  min-height: 46px;
  padding: 0.65rem 1.5rem;
  border-radius: 10px;
  background: transparent;
  color: #E0E0E0;
  border: 1px solid rgba(102, 102, 102, 0.5);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.pf-btn-secondary:hover {
  background: rgba(102, 102, 102, 0.15);
  border-color: #666666;
}
`;

if (typeof document !== 'undefined' && !document.getElementById(PROFILE_STYLE_ID)) {
  const styleEl = document.createElement('style');
  styleEl.id = PROFILE_STYLE_ID;
  styleEl.textContent = profileCss;
  document.head.appendChild(styleEl);
}

export const profilePageStyles = {
  section: 'pf-section',
  inner: 'pf-inner',
  header: 'pf-header',
  panel: 'pf-panel',
  field: 'pf-field',
  label: 'pf-label',
  input: 'pf-input',
  readonly: 'pf-readonly',
  actions: 'pf-actions',
  primaryButton: 'pf-btn-primary',
  secondaryButton: 'pf-btn-secondary'
};
