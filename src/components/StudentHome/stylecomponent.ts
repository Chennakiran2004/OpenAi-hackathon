const STUDENT_STYLE_ID = 'tf-student-home-styles';

const studentCss = `
.sh-section {
  min-height: 100vh;
  background: #111111;
  padding: 2rem 1.25rem 2.5rem;
}

.sh-inner {
  max-width: 980px;
  margin: 0 auto;
  display: grid;
  gap: 1.5rem;
}

.sh-header {
  margin-bottom: 0.25rem;
}

.sh-header h2 {
  margin: 0;
  color: #E0E0E0;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.sh-header p {
  margin: 0.6rem 0 0;
  color: #999999;
  font-size: 0.9375rem;
  line-height: 1.5;
  max-width: 56ch;
}

.sh-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.sh-panel {
  background: #282828;
  border: 1px solid rgba(102, 102, 102, 0.3);
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.sh-panel h3 {
  margin: 0;
  color: #E0E0E0;
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.sh-form-grid {
  margin: 1.25rem 0 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem 1.5rem;
}

.sh-label {
  display: grid;
  gap: 0.4rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #b0b0b0;
  letter-spacing: 0.01em;
}

.sh-input {
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

.sh-input::placeholder {
  color: #666666;
}

.sh-input:hover {
  background: #222222;
  border-color: rgba(102, 102, 102, 0.6);
}

.sh-input:focus {
  background: #252525;
  border-color: #0d9488;
}

.sh-file-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.sh-file-wrap input[type="file"] {
  font-size: 0.8125rem;
  color: #E0E0E0;
  padding: 0.35rem 0;
  cursor: pointer;
}

.sh-file-wrap input[type="file"]::file-selector-button {
  padding: 0.45rem 0.9rem;
  margin-right: 0.6rem;
  border: 1px solid rgba(102, 102, 102, 0.5);
  border-radius: 8px;
  background: #333333;
  color: #E0E0E0;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.sh-file-wrap input[type="file"]::file-selector-button:hover {
  background: #404040;
  border-color: #666666;
}

.sh-input:focus-visible,
.sh-btn-primary:focus-visible {
  outline: 2px solid #888888;
  outline-offset: 2px;
}

.sh-btn-primary {
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

.sh-btn-primary:hover {
  background: #0f766e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.4);
}

.sh-btn-primary:active {
  transform: translateY(0);
}

.sh-list {
  margin: 1.125rem 0 0;
  padding-left: 1.35rem;
  color: #999999;
  font-size: 0.9rem;
  line-height: 1.6;
}

.sh-list li + li {
  margin-top: 0.55rem;
}

.sh-list li::marker {
  color: #0d9488;
}

.sh-table-wrap {
  margin-top: 1.125rem;
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid rgba(102, 102, 102, 0.3);
}

.sh-table {
  width: 100%;
  border-collapse: collapse;
  background: #282828;
  font-size: 0.9rem;
}

.sh-table th,
.sh-table td {
  text-align: left;
  vertical-align: middle;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(102, 102, 102, 0.25);
}

.sh-table th {
  background: #1f1f1f;
  color: #E0E0E0;
  font-weight: 600;
  font-size: 0.8125rem;
  text-transform: none;
  letter-spacing: 0.02em;
}

.sh-table tbody tr:last-child td {
  border-bottom: none;
}

.sh-table td {
  color: #b0b0b0;
}

.sh-table .sh-cell-company {
  font-weight: 600;
  color: #E0E0E0;
}

.sh-table .sh-cell-muted {
  color: #888888;
  font-size: 0.875rem;
}

@media (max-width: 1024px) {
  .sh-two-col,
  .sh-form-grid {
    grid-template-columns: 1fr;
  }
}
`;

if (typeof document !== 'undefined' && !document.getElementById(STUDENT_STYLE_ID)) {
  const styleEl = document.createElement('style');
  styleEl.id = STUDENT_STYLE_ID;
  styleEl.textContent = studentCss;
  document.head.appendChild(styleEl);
}

export const studentHomeStyles = {
  section: 'sh-section',
  inner: 'sh-inner',
  header: 'sh-header',
  twoCol: 'sh-two-col',
  panel: 'sh-panel',
  formGrid: 'sh-form-grid',
  label: 'sh-label',
  input: 'sh-input',
  fileWrap: 'sh-file-wrap',
  list: 'sh-list',
  primaryButton: 'sh-btn-primary',
  tableWrap: 'sh-table-wrap',
  table: 'sh-table',
  cellCompany: 'sh-cell-company',
  cellMuted: 'sh-cell-muted'
};
