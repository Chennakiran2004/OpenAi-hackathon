const RECRUITER_STYLE_ID = 'tf-recruiter-home-styles';

const recruiterCss = `
.rh-section {
  min-height: 100vh;
  background: #111111;
  padding: 2rem 1.25rem 2.5rem;
}

.rh-inner {
  max-width: 980px;
  margin: 0 auto;
  display: grid;
  gap: 1.5rem;
}

.rh-header {
  margin-bottom: 0.25rem;
}

.rh-header h2 {
  margin: 0;
  color: #E0E0E0;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.rh-header p {
  margin: 0.6rem 0 0;
  color: #999999;
  font-size: 0.9375rem;
  line-height: 1.5;
  max-width: 56ch;
}

.rh-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.rh-panel {
  background: #282828;
  border: 1px solid rgba(102, 102, 102, 0.3);
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.rh-panel h3 {
  margin: 0;
  color: #E0E0E0;
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.rh-form-grid {
  margin: 1.25rem 0 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem 1.5rem;
}

.rh-label {
  display: grid;
  gap: 0.4rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #b0b0b0;
  letter-spacing: 0.01em;
}

.rh-input {
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

.rh-input::placeholder {
  color: #666666;
}

.rh-input:hover {
  background: #222222;
  border-color: rgba(102, 102, 102, 0.6);
}

.rh-input:focus {
  background: #252525;
  border-color: #0d9488;
}

.rh-input[type="file"] {
  font-size: 0.8125rem;
  color: #E0E0E0;
  padding: 0.35rem 0;
  cursor: pointer;
}

.rh-input[type="file"]::file-selector-button {
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

.rh-input[type="file"]::file-selector-button:hover {
  background: #404040;
  border-color: #666666;
}

.rh-input:focus-visible,
.rh-btn-primary:focus-visible,
.rh-blind-toggle input:focus-visible {
  outline: 2px solid #888888;
  outline-offset: 2px;
}

.rh-demo-panel {
  display: grid;
  gap: 0.75rem;
}

.rh-progress-wrap {
  margin-top: 0.5rem;
}

.rh-progress-wrap p {
  margin: 0.5rem 0 0;
  color: #999999;
  font-size: 0.9rem;
}

.rh-progress-track {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  border: 1px solid rgba(102, 102, 102, 0.4);
  background: #1a1a1a;
  overflow: hidden;
}

.rh-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0f766e, #0d9488);
  transition: width 0.2s ease;
}

.rh-btn-primary {
  margin-top: 0.5rem;
  min-height: 46px;
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

.rh-btn-primary:hover {
  background: #0f766e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.4);
}

.rh-btn-primary:active {
  transform: translateY(0);
}

.rh-section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.rh-section-head h3 {
  margin: 0;
}

.rh-blind-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #b0b0b0;
  font-size: 0.875rem;
  cursor: pointer;
}

.rh-blind-toggle input[type="checkbox"] {
  accent-color: #0d9488;
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.rh-table-wrap {
  margin-top: 1.125rem;
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid rgba(102, 102, 102, 0.3);
}

.rh-table {
  width: 100%;
  border-collapse: collapse;
  background: #282828;
  font-size: 0.9rem;
}

.rh-table th,
.rh-table td {
  text-align: left;
  vertical-align: middle;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(102, 102, 102, 0.25);
}

.rh-table th {
  background: #1f1f1f;
  color: #E0E0E0;
  font-weight: 600;
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
}

.rh-table tbody tr:last-child td {
  border-bottom: none;
}

.rh-table td {
  color: #b0b0b0;
}

.rh-table p {
  margin: 0;
  color: #E0E0E0;
}

.rh-small {
  color: #888888;
  font-size: 0.8rem;
  margin-top: 0.2rem;
}

.rh-technical-metric,
.rh-score,
.rh-percentage,
.rh-rank,
.rh-eta,
.rh-throughput {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-feature-settings: 'liga' 1, 'calt' 1;
}

.rh-eta,
.rh-throughput {
  color: #888888;
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
  inner: 'rh-inner',
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
  smallText: 'rh-small',
  technicalMetric: 'rh-technical-metric',
  score: 'rh-score',
  percentage: 'rh-percentage',
  rank: 'rh-rank',
  eta: 'rh-eta',
  throughput: 'rh-throughput'
};
