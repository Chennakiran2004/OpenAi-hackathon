import React from 'react';
import { studentHomeStyles as styles } from './stylecomponent';

type StudentHomeProps = {
  name: string;
};

function StudentHome({ name }: StudentHomeProps) {
  return (
    <section className={styles.section}>
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
              <input className={styles.input} type="file" accept=".pdf,.doc,.docx" />
            </label>
            <label className={styles.label}>
              Preferred role
              <input className={styles.input} placeholder="ML Engineer" defaultValue="ML Engineer" />
            </label>
            <label className={styles.label}>
              Location preference
              <input className={styles.input} placeholder="Bengaluru" defaultValue="Bengaluru" />
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
                <td>Nova Labs</td>
                <td>ML Engineer</td>
                <td>Bengaluru</td>
                <td>92%</td>
                <td>MLOps, monitoring</td>
              </tr>
              <tr>
                <td>Sparrow AI</td>
                <td>Data Scientist</td>
                <td>Hyderabad</td>
                <td>88%</td>
                <td>Experiment design</td>
              </tr>
              <tr>
                <td>Canopy Systems</td>
                <td>Backend Engineer</td>
                <td>Pune</td>
                <td>84%</td>
                <td>Distributed systems</td>
              </tr>
              <tr>
                <td>Atlas Insights</td>
                <td>Product Analyst</td>
                <td>Delhi NCR</td>
                <td>81%</td>
                <td>Roadmap metrics</td>
              </tr>
              <tr>
                <td>VectorWorks</td>
                <td>Full Stack Engineer</td>
                <td>Remote</td>
                <td>79%</td>
                <td>Accessibility testing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

export default StudentHome;
