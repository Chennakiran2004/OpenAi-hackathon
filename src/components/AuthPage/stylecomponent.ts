const AUTH_STYLE_ID = 'tf-auth-styles';

const authCss = `
.auth-shell {
  max-width: 560px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.auth-card {
  background: #282828;
  border: 1px solid rgba(102, 102, 102, 0.3);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
}

.auth-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #E0E0E0;
  margin-bottom: 0.5rem;
}

.auth-subtle {
  margin: 0 0 1.5rem 0;
  font-size: 0.875rem;
  color: #B0B0B0;
  line-height: 1.5;
}

.auth-role-toggle {
  margin-bottom: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  padding: 0;
  background: transparent;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
}

.auth-role-btn {
  min-height: 42px;
  border: 1px solid rgba(102, 102, 102, 0.3);
  border-radius: 8px;
  background: #333333;
  color: #B0B0B0;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.auth-role-btn:hover {
  background: rgba(102, 102, 102, 0.1);
  color: #E0E0E0;
}

.auth-role-btn-active {
  border-color: #666666;
  background: #666666;
  color: #E0E0E0;
}

.auth-role-btn-active:hover {
  background: #555555;
  border-color: #555555;
}

.auth-form {
  display: grid;
  gap: 1rem;
  width: 100%;
}

.auth-label {
  display: grid;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #E0E0E0;
  width: 100%;
}

.auth-input {
  width: 100%;
  min-height: 36px;
  border: 1px solid rgba(102, 102, 102, 0.3);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  background: #333333;
  color: #E0E0E0;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.auth-input::placeholder {
  color: #808080;
}

.auth-input:hover {
  border-color: rgba(102, 102, 102, 0.5);
}

.auth-input:focus {
  outline: none;
  border-color: #666666;
  box-shadow: 0 0 0 2px rgba(102, 102, 102, 0.2);
}

.auth-input:focus-visible {
  outline: 2px solid #888888;
  outline-offset: 2px;
}

.auth-btn-primary {
  min-height: 44px;
  border: 1px solid #666666;
  border-radius: 8px;
  background: #666666;
  color: #E0E0E0;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
  width: 100%;
  box-sizing: border-box;
}

.auth-btn-primary:hover {
  background: #555555;
  border-color: #555555;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.auth-btn-primary:active {
  transform: translateY(0);
}

.auth-btn-primary:focus-visible {
  outline: 2px solid #888888;
  outline-offset: 2px;
}

.auth-switch {
  margin: 1.5rem 0 0;
  text-align: center;
  font-size: 0.875rem;
  color: #B0B0B0;
}

.auth-link-btn {
  border: none;
  padding: 0;
  background: none;
  color: #666666;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
  font-weight: 600;
  transition: color 0.2s ease;
}

.auth-link-btn:hover {
  color: #888888;
}

.auth-link-btn:focus-visible {
  outline: 2px solid #888888;
  outline-offset: 2px;
  border-radius: 2px;
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
