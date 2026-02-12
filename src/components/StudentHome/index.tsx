import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRecruiter } from '../../contexts/RecruiterContext';
import { studentHomeStyles as styles } from './stylecomponent';

const FALLBACK_CORRIDORS = [
  { corridor: 'Andhra Pradesh → Telangana', volume: '12 kt', savings: '₹1,200,000' },
  { corridor: 'Odisha → Telangana', volume: '9 kt', savings: '₹750,000' },
  { corridor: 'Karnataka → Telangana', volume: '8 kt', savings: '₹640,000' },
];

const SURPLUS_WATCH = [
  { state: 'Andhra Pradesh', crop: 'Rice', status: 'Surplus', urgency: 'Medium' },
  { state: 'Odisha', crop: 'Tomatoes', status: 'Surplus', urgency: 'High' },
  { state: 'Telangana', crop: 'Pulses', status: 'Deficit', urgency: 'Medium' },
];

const RISK_CROPS = [
  { crop: 'Tomatoes', risk: 'High spoilage risk in 3 days' },
  { crop: 'Onions', risk: 'Shelf-life 10 days; monitor humidity' },
  { crop: 'Bananas', risk: 'Expedite cold chain routes' },
];

const ALERTS = [
  'Heatwave alert for Punjab could lower wheat yield by 8%.',
  'Heavy rain forecast in Odisha; expect 2-day delay risk.',
  'Fuel price spike scenario: transport cost +4% next week.',
];

function formatVolume(tonnes: number): string {
  if (tonnes >= 1000) return `${(tonnes / 1000).toFixed(1)} kt`;
  return `${tonnes} t`;
}

function StudentHome() {
  const { user } = useAuth();
  const name = user?.name ?? '';
  const { recommendations, impacts, recentQueries, impactsLoading } = useRecruiter();

  const corridorSource =
    recentQueries.length > 0
      ? recentQueries.slice(0, 5).map((q) => {
          const first = q.results[0];
          const supplier = first?.supplier_state_name ?? '—';
          const volume = formatVolume(q.required_quantity_tonnes);
          const savings = first ? `₹${Number(first.total_cost).toLocaleString()}` : '—';
          return {
            corridor: `${supplier} → ${q.state_name}`,
            volume,
            savings,
          };
        })
      : recommendations.length > 0
        ? recommendations.slice(0, 3).map((r) => ({
            corridor: `${r.sourceState} → ${user?.profile?.state_name ?? 'State'}`,
            volume: formatVolume(Math.max(8, Math.round(12 - r.etaDays)) * 1000),
            savings: `₹${r.savingsVsMax.toLocaleString()}`,
          }))
        : FALLBACK_CORRIDORS;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2>Central Admin Dashboard</h2>
          <p>
            Welcome {name}. Monitor national procurement efficiency, risks, and inter-state trade
            corridors.
          </p>
        </div>

        <div className={styles.twoCol}>
          <article className={styles.panel}>
            <h3>Impact KPIs</h3>
            {impactsLoading ? (
              <p className={styles.cellMuted}>Loading impact…</p>
            ) : (
              <div className={styles.formGrid}>
                <div>
                  <p className={styles.cellMuted}>Total savings</p>
                  <p className={styles.cellCompany}>
                    ₹{(impacts?.totalSavings ?? 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className={styles.cellMuted}>Carbon reduced</p>
                  <p className={styles.cellCompany}>
                    {(impacts?.monthlyCarbonReduced ?? 0).toFixed(1)} tCO₂e
                  </p>
                </div>
                <div>
                  <p className={styles.cellMuted}>Avg delivery improvement</p>
                  <p className={styles.cellCompany}>
                    {(impacts?.avgDeliveryImprovementDays ?? 0).toFixed(1)} days
                  </p>
                </div>
                <div>
                  <p className={styles.cellMuted}>Optimized transactions</p>
                  <p className={styles.cellCompany}>{impacts?.optimizedTransactions ?? 0}</p>
                </div>
              </div>
            )}
            <div
              style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}
            >
              <button className={styles.primaryButton} type="button">
                Export PDF
              </button>
              <button className={styles.primaryButton} type="button">
                Export XLS
              </button>
            </div>
          </article>

          <article className={styles.panel}>
            <h3>Disaster & Climate Alerts</h3>
            <ul className={styles.list}>
              {ALERTS.map((a) => (
                <li key={a}>{a}</li>
              ))}
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
                {SURPLUS_WATCH.map((row) => (
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
            {RISK_CROPS.map((r) => (
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
