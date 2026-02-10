const AUTH_STYLE_ID = 'tf-auth-styles';

const authCss = `
.auth-shell {
  max-width: 560px;
  margin: 0 auto;
}

.auth-card {
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 14px;
  padding: 1.35rem;
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.06);
}

.auth-title {
  margin: 0;
  font-size: 1.5rem;
  color: #0f172a;
}

.auth-subtle {
  margin: 0.55rem 0 0;
  color: #64748b;
}

.auth-role-toggle {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.auth-role-btn {
  min-height: 42px;
  border: 1px solid rgba(15, 23, 42, 0.18);
  border-radius: 10px;
  background: #fff;
  color: #334155;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
}

.auth-role-btn-active {
  border-color: #0f766e;
  background: rgba(15, 118, 110, 0.08);
  color: #0f766e;
}

.auth-form {
  margin-top: 0.95rem;
  display: grid;
  gap: 0.82rem;
}

.auth-label {
  display: grid;
  gap: 0.34rem;
  font-size: 0.92rem;
  font-weight: 700;
  color: #334155;
}

.auth-input {
  width: 100%;
  min-height: 44px;
  border: 1px solid rgba(15, 23, 42, 0.2);
  border-radius: 10px;
  padding: 0.65rem 0.72rem;
  background: #fff;
  color: #0f172a;
}

.auth-input:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

.auth-btn-primary {
  min-height: 44px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: #0f766e;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
}

.auth-btn-primary:hover {
  background: #115e59;
  transform: translateY(-1px);
}

.auth-btn-primary:focus-visible,
.auth-link-btn:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

.auth-switch {
  margin: 0.85rem 0 0;
  color: #64748b;
}

.auth-link-btn {
  border: none;
  padding: 0;
  background: none;
  color: #0f766e;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
}
`;

if (typeof document !== 'undefined' && !document.getElementById(AUTH_STYLE_ID)) {
  const styleEl = document.createElement('style');
  styleEl.id = AUTH_STYLE_ID;
  styleEl.textContent = authCss;
  document.head.appendChild(styleEl);
}

export const authPageStyles = {
  shell: 'auth-shell',
  card: 'auth-card',
  title: 'auth-title',
  subtle: 'auth-subtle',
  roleToggle: 'auth-role-toggle',
  roleButton: 'auth-role-btn',
  active: 'auth-role-btn-active',
  form: 'auth-form',
  label: 'auth-label',
  input: 'auth-input',
  primaryButton: 'auth-btn-primary',
  switchText: 'auth-switch',
  linkButton: 'auth-link-btn'
};
