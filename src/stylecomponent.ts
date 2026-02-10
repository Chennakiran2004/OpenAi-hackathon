const APP_STYLE_ID = 'tf-app-styles';

const appCss = `
.app-shell {
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
}

.app-container {
  width: min(1200px, calc(100% - 2rem));
  margin: 0 auto;
}

.app-main {
  padding: 2rem 0 3rem;
}
`;

if (typeof document !== 'undefined' && !document.getElementById(APP_STYLE_ID)) {
  const styleEl = document.createElement('style');
  styleEl.id = APP_STYLE_ID;
  styleEl.textContent = appCss;
  document.head.appendChild(styleEl);
}

export const appStyles = {
  shell: 'app-shell',
  container: 'app-container',
  main: 'app-main'
};
