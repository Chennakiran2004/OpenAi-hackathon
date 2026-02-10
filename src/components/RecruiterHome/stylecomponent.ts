const RECRUITER_STYLE_ID = 'tf-recruiter-home-styles';

const recruiterCss = `
.rh-section {
  display: grid;
  gap: 1rem;
}

.rh-header h2 {
  margin: 0;
  color: #0f172a;
}

.rh-header p {
  margin: 0.45rem 0 0;
  color: #64748b;
}

.rh-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.rh-panel {
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.rh-panel h3 {
  margin: 0;
  color: #0f172a;
}

.rh-form-grid {
  margin: 0.85rem 0 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}

.rh-label {
  display: grid;
  gap: 0.34rem;
  font-size: 0.92rem;
  font-weight: 700;
  color: #334155;
}

.rh-input {
  width: 100%;
  min-height: 44px;
  border: 1px solid rgba(15, 23, 42, 0.2);
  border-radius: 10px;
  padding: 0.65rem 0.72rem;
  background: #fff;
  color: #0f172a;
}

.rh-input:focus-visible,
.rh-btn-primary:focus-visible,
.rh-blind-toggle input:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

.rh-demo-panel {
  display: grid;
  gap: 0.65rem;
}

.rh-progress-wrap {
  margin-top: 0.45rem;
}

.rh-progress-wrap p {
  margin: 0.45rem 0 0;
  color: #64748b;
}

.rh-progress-track {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.16);
  background: #e2e8f0;
  overflow: hidden;
}

.rh-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0f766e, #10b981);
  transition: width 0.2s ease;
}

.rh-btn-primary {
  margin-top: 0.25rem;
  min-height: 44px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: #0f766e;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
}

.rh-btn-primary:hover {
  background: #115e59;
  transform: translateY(-1px);
}

.rh-section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.rh-blind-toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #64748b;
  font-size: 0.92rem;
}

.rh-table-wrap {
  margin-top: 0.8rem;
  overflow-x: auto;
}

.rh-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.1);
}

.rh-table th,
.rh-table td {
  text-align: left;
  vertical-align: top;
  padding: 0.7rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.rh-table th {
  background: #f1f5f9;
  color: #0f172a;
  font-size: 0.88rem;
}

.rh-table p {
  margin: 0;
}

.rh-small {
  color: #64748b;
  font-size: 0.8rem;
}

@media (max-width: 1024px) {
  .rh-two-col,
  .rh-form-grid {
    grid-template-columns: 1fr;
  }

  .rh-section-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
`;

if (typeof document !== 'undefined' && !document.getElementById(RECRUITER_STYLE_ID)) {
  const styleEl = document.createElement('style');
  styleEl.id = RECRUITER_STYLE_ID;
  styleEl.textContent = recruiterCss;
  document.head.appendChild(styleEl);
}

export const recruiterHomeStyles = {
  section: 'rh-section',
  header: 'rh-header',
  twoCol: 'rh-two-col',
  panel: 'rh-panel',
  formGrid: 'rh-form-grid',
  label: 'rh-label',
  input: 'rh-input',
  demoPanel: 'rh-panel rh-demo-panel',
  progressWrap: 'rh-progress-wrap',
  progressTrack: 'rh-progress-track',
  progressFill: 'rh-progress-fill',
  primaryButton: 'rh-btn-primary',
  sectionHead: 'rh-section-head',
  blindToggle: 'rh-blind-toggle',
  tableWrap: 'rh-table-wrap',
  table: 'rh-table',
  smallText: 'rh-small'
};
