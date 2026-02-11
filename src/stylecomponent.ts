const APP_STYLE_ID = 'tf-app-styles';

const appCss = `
.app-shell {
  min-height: 100vh;
  background: #111111;
  color: #E0E0E0;
}

.app-container {
  width: 100%;
  margin: 0;
}

.app-main {
  padding: 0;
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
