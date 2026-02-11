import React from 'react';
import { studentHomeStyles as styles } from './stylecomponent';

type StudentHomeProps = {
  name: string;
};

function StudentHome({ name }: StudentHomeProps) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2>Student Home</h2>
          <p>Welcome {name}. Upload your resume, set preferences, and view your top job matches with skill-gap insights.</p>
        </div>

        <div className={styles.twoCol}>
          <article className={styles.panel}>
            <h3>Profile & Preferences</h3>
            <div className={styles.formGrid}>
              <label className={styles.label}>
                Upload resume
                <div className={styles.fileWrap}>
                  <input className={styles.input} type="file" accept=".pdf,.doc,.docx" />
                </div>
              </label>
              <label className={styles.label}>
                Location preference
                <input className={styles.input} placeholder="Bengaluru" defaultValue="Bengaluru" />
              </label>
              <label className={styles.label}>
                Preferred role
                <input className={styles.input} placeholder="ML Engineer" defaultValue="ML Engineer" />
              </label>
              <label className={styles.label}>
                Salary band
                <input className={styles.input} placeholder="10-18 LPA" defaultValue="10-18 LPA" />
              </label>
            </div>
            <button className={styles.primaryButton} type="button">
              Save preferences
            </button>
          </article>

          <article className={styles.panel}>
            <h3>Interview Readiness</h3>
            <ul className={styles.list}>
              <li>Resume ATS score: 82/100.</li>
              <li>Strong sections: projects, quantified impact, tools.</li>
              <li>Improve: add measurable outcomes for internships.</li>
              <li>Skill gaps for target roles: MLOps, system design.</li>
            </ul>
          </article>
        </div>

        <article className={styles.panel}>
          <h3>Your Top Job Matches</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Match %</th>
                  <th>Skill Gaps</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.cellCompany}>Nova Labs</td>
                  <td>ML Engineer</td>
                  <td>Bengaluru</td>
                  <td className={styles.cellMuted}>92%</td>
                  <td className={styles.cellMuted}>MLOps, monitoring</td>
                </tr>
                <tr>
                  <td className={styles.cellCompany}>Sparrow AI</td>
                  <td>Data Scientist</td>
                  <td>Hyderabad</td>
                  <td className={styles.cellMuted}>88%</td>
                  <td className={styles.cellMuted}>Experiment design</td>
                </tr>
                <tr>
                  <td className={styles.cellCompany}>Canopy Systems</td>
                  <td>Backend Engineer</td>
                  <td>Pune</td>
                  <td className={styles.cellMuted}>84%</td>
                  <td className={styles.cellMuted}>Distributed systems</td>
                </tr>
                <tr>
                  <td className={styles.cellCompany}>Atlas Insights</td>
                  <td>Product Analyst</td>
                  <td>Delhi NCR</td>
                  <td className={styles.cellMuted}>81%</td>
                  <td className={styles.cellMuted}>Roadmap metrics</td>
                </tr>
                <tr>
                  <td className={styles.cellCompany}>VectorWorks</td>
                  <td>Full Stack Engineer</td>
                  <td>Remote</td>
                  <td className={styles.cellMuted}>79%</td>
                  <td className={styles.cellMuted}>Accessibility testing</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}

export default StudentHome;
