const STUDENT_STYLE_ID = 'tf-student-home-styles';

const studentCss = `
.sh-section {
  display: grid;
  gap: 1rem;
}

.sh-header h2 {
  margin: 0;
  color: #0f172a;
}

.sh-header p {
  margin: 0.45rem 0 0;
  color: #64748b;
}

.sh-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.sh-panel {
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.sh-panel h3 {
  margin: 0;
  color: #0f172a;
}

.sh-form-grid {
  margin: 0.85rem 0 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}

.sh-label {
  display: grid;
  gap: 0.34rem;
  font-size: 0.92rem;
  font-weight: 700;
  color: #334155;
}

.sh-input {
  width: 100%;
  min-height: 44px;
  border: 1px solid rgba(15, 23, 42, 0.2);
  border-radius: 10px;
  padding: 0.65rem 0.72rem;
  background: #fff;
  color: #0f172a;
}

.sh-input:focus-visible,
.sh-btn-primary:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

.sh-btn-primary {
  min-height: 44px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: #0f766e;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
}

.sh-btn-primary:hover {
  background: #115e59;
  transform: translateY(-1px);
}

.sh-list {
  margin: 0.85rem 0 0;
  padding-left: 1rem;
  color: #64748b;
}

.sh-list li + li {
  margin-top: 0.45rem;
}

.sh-table-wrap {
  margin-top: 0.8rem;
  overflow-x: auto;
}

.sh-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.1);
}

.sh-table th,
.sh-table td {
  text-align: left;
  vertical-align: top;
  padding: 0.7rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.sh-table th {
  background: #f1f5f9;
  color: #0f172a;
  font-size: 0.88rem;
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
  header: 'sh-header',
  twoCol: 'sh-two-col',
  panel: 'sh-panel',
  formGrid: 'sh-form-grid',
  label: 'sh-label',
  input: 'sh-input',
  list: 'sh-list',
  primaryButton: 'sh-btn-primary',
  tableWrap: 'sh-table-wrap',
  table: 'sh-table'
};
