import React from 'react';
import { studentHomeStyles as styles } from './stylecomponent';
import { ImpactSummary, Recommendation } from '../types';

type StudentHomeProps = {
  name: string;
  impacts: ImpactSummary | null;
  recommendations: Recommendation[];
};

function StudentHome({ name, impacts, recommendations }: StudentHomeProps) {
  const corridorSource = recommendations.length
    ? recommendations.slice(0, 3).map((r) => ({
        corridor: `${r.sourceState} → Telangana`,
        volume: `${Math.max(8, Math.round(12 - r.etaDays))} kt`,
        savings: `₹${r.savingsVsMax.toLocaleString()}`
      }))
    : [
        { corridor: 'Andhra Pradesh → Telangana', volume: '12 kt', savings: '₹1,200,000' },
        { corridor: 'Odisha → Telangana', volume: '9 kt', savings: '₹750,000' },
        { corridor: 'Karnataka → Telangana', volume: '8 kt', savings: '₹640,000' }
      ];

  const surplusWatch = [
    { state: 'Andhra Pradesh', crop: 'Rice', status: 'Surplus', urgency: 'Medium' },
    { state: 'Odisha', crop: 'Tomatoes', status: 'Surplus', urgency: 'High' },
    { state: 'Telangana', crop: 'Pulses', status: 'Deficit', urgency: 'Medium' }
  ];

  const riskCrops = [
    { crop: 'Tomatoes', risk: 'High spoilage risk in 3 days' },
    { crop: 'Onions', risk: 'Shelf-life 10 days; monitor humidity' },
    { crop: 'Bananas', risk: 'Expedite cold chain routes' }
  ];

  const alerts = [
    'Heatwave alert for Punjab could lower wheat yield by 8%.',
    'Heavy rain forecast in Odisha; expect 2-day delay risk.',
    'Fuel price spike scenario: transport cost +4% next week.'
  ];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2>Central Admin Dashboard</h2>
          <p>Welcome {name}. Monitor national procurement efficiency, risks, and inter-state trade corridors.</p>
        </div>

        <div className={styles.twoCol}>
          <article className={styles.panel}>
            <h3>Impact KPIs</h3>
            <div className={styles.formGrid}>
              <div>
                <p className={styles.cellMuted}>Monthly savings</p>
                <p className={styles.cellCompany}>₹{(impacts?.monthlySavings ?? 7200000).toLocaleString()}</p>
              </div>
              <div>
                <p className={styles.cellMuted}>Carbon reduced</p>
                <p className={styles.cellCompany}>{(impacts?.monthlyCarbonReduced ?? 12).toFixed(1)} tCO₂e</p>
              </div>
              <div>
                <p className={styles.cellMuted}>Avg delivery improvement</p>
                <p className={styles.cellCompany}>{(impacts?.avgDeliveryImprovementDays ?? 1.2).toFixed(1)} days</p>
              </div>
              <div>
                <p className={styles.cellMuted}>Optimized transactions</p>
                <p className={styles.cellCompany}>{impacts?.optimizedTransactions ?? 128}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button className={styles.primaryButton} type="button">Export PDF</button>
              <button className={styles.primaryButton} type="button">Export XLS</button>
            </div>
          </article>

          <article className={styles.panel}>
            <h3>Disaster & Climate Alerts</h3>
            <ul className={styles.list}>
              {alerts.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </article>
        </div>

        <article className={styles.panel}>
          <h3>Top Trade Corridors</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Corridor</th>
                  <th>Volume</th>
                  <th>Savings</th>
                </tr>
              </thead>
              <tbody>
                {corridorSource.map((c) => (
                  <tr key={c.corridor}>
                    <td className={styles.cellCompany}>{c.corridor}</td>
                    <td className={styles.cellMuted}>{c.volume}</td>
                    <td className={styles.cellMuted}>{c.savings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className={styles.panel}>
          <h3>Surplus / Deficit Watchlist</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>State</th>
                  <th>Crop</th>
                  <th>Status</th>
                  <th>Urgency</th>
                </tr>
              </thead>
              <tbody>
                {surplusWatch.map((row) => (
                  <tr key={`${row.state}-${row.crop}`}>
                    <td className={styles.cellCompany}>{row.state}</td>
                    <td>{row.crop}</td>
                    <td className={styles.cellMuted}>{row.status}</td>
                    <td className={styles.cellMuted}>{row.urgency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className={styles.panel}>
          <h3>High-Risk Crops (Wastage)</h3>
          <ul className={styles.list}>
            {riskCrops.map((r) => (
              <li key={r.crop}>
                <strong>{r.crop}</strong>: {r.risk}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

export default StudentHome;
