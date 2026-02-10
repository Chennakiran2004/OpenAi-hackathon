import React from 'react';
import { Candidate, ProcessingStatus } from '../types';
import { recruiterHomeStyles as styles } from './stylecomponent';

type RecruiterHomeProps = {
  name: string;
  bulkSize: number;
  processed: number;
  progress: number;
  status: ProcessingStatus;
  blindMode: boolean;
  etaSeconds: string;
  throughput: string;
  ranked: Candidate[];
  onBulkSizeChange: (value: number) => void;
  onBlindModeChange: (value: boolean) => void;
  onStartProcessing: () => void;
};

function RecruiterHome({
  name,
  bulkSize,
  processed,
  progress,
  status,
  blindMode,
  etaSeconds,
  throughput,
  ranked,
  onBulkSizeChange,
  onBlindModeChange,
  onStartProcessing
}: RecruiterHomeProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Recruiter Home</h2>
        <p>Welcome {name}. Create jobs, upload resume batches, and shortlist candidates with explainable fair ranking.</p>
      </div>

      <div className={styles.twoCol}>
        <article className={styles.panel}>
          <h3>Create Job Post</h3>
          <div className={styles.formGrid}>
            <label className={styles.label}>
              Job title
              <input className={styles.input} placeholder="Senior ML Engineer" />
            </label>
            <label className={styles.label}>
              Key skills
              <input className={styles.input} placeholder="Python, NLP, MLOps, SQL" />
            </label>
            <label className={styles.label}>
              Experience range
              <input className={styles.input} placeholder="2-5 years" />
            </label>
            <label className={styles.label}>
              Location
              <input className={styles.input} placeholder="Bengaluru" />
            </label>
          </div>
          <button className={styles.primaryButton} type="button">
            Save Job Description
          </button>
        </article>

        <article className={styles.demoPanel}>
          <h3>Bulk Resume Processing</h3>
          <label className={styles.label} htmlFor="bulkSize">
            Resume batch size
          </label>
          <input
            className={styles.input}
            id="bulkSize"
            type="number"
            min={100}
            max={10000}
            value={bulkSize}
            onChange={(e) => onBulkSizeChange(Number(e.target.value) || 100)}
          />
          <label className={styles.label} htmlFor="resumeUpload">
            Upload CSV/ZIP
          </label>
          <input className={styles.input} id="resumeUpload" type="file" accept=".csv,.zip" />
          <div className={styles.progressWrap} aria-live="polite">
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <p>{status === 'idle' ? 'Waiting to start.' : `Processed ${processed}/${bulkSize} resumes (${progress}%)`}</p>
            <p>
              ETA: {etaSeconds === '--' ? '--' : `${etaSeconds}s`} | Throughput: {throughput} resumes/min
            </p>
          </div>
          <button className={styles.primaryButton} type="button" onClick={onStartProcessing}>
            {status === 'running' ? 'Re-run Processing' : 'Start Processing'}
          </button>
        </article>
      </div>

      <article className={styles.panel}>
        <div className={styles.sectionHead}>
          <h3>Ranked Shortlist</h3>
          <label className={styles.blindToggle} htmlFor="blindMode">
            <input id="blindMode" type="checkbox" checked={blindMode} onChange={(e) => onBlindModeChange(e.target.checked)} />
            Blind screening mode
          </label>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Candidate</th>
                <th>Role Fit</th>
                <th>Final Score</th>
                <th>Explainability</th>
                <th>Skill Gaps</th>
              </tr>
            </thead>
            <tbody>
              {ranked.length === 0 && (
                <tr>
                  <td colSpan={6}>No shortlist yet. Run processing to generate top candidates.</td>
                </tr>
              )}
              {ranked.map((candidate, index) => (
                <tr key={candidate.id}>
                  <td>#{index + 1}</td>
                  <td>
                    <p>{blindMode ? `Candidate ${candidate.id}` : candidate.name}</p>
                    <small className={styles.smallText}>{blindMode ? 'Hidden profile' : `${candidate.college}, ${candidate.location}`}</small>
                  </td>
                  <td>{candidate.role}</td>
                  <td>{candidate.finalScore.toFixed(1)}%</td>
                  <td>
                    <small className={styles.smallText}>
                      Skill {candidate.skillMatch.toFixed(0)} | Projects {candidate.projectSimilarity.toFixed(0)} | Exp {candidate.experienceFit.toFixed(0)}
                    </small>
                  </td>
                  <td>{candidate.skillGaps.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

export default RecruiterHome;
