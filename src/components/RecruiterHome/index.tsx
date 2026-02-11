import React from 'react';
import { ImpactSummary, ProcessingStatus, Recommendation, WeightConfig } from '../types';
import { recruiterHomeStyles as styles } from './stylecomponent';

type RecruiterHomeProps = {
  name: string;
  crop: string;
  quantity: number;
  urgency: string;
  deliveryWindow: string;
  priceCap: string;
  climateMode: boolean;
  weights: WeightConfig;
  recommendations: Recommendation[];
  impacts: ImpactSummary | null;
  status: ProcessingStatus;
  progress: number;
  onSetCrop: (value: string) => void;
  onSetQuantity: (value: number) => void;
  onSetUrgency: (value: string) => void;
  onSetDeliveryWindow: (value: string) => void;
  onSetPriceCap: (value: string) => void;
  onToggleClimateMode: (value: boolean) => void;
  onSetWeights: (value: WeightConfig) => void;
  onRunOptimization: () => void;
};

function RecruiterHome({
  name,
  crop,
  quantity,
  urgency,
  deliveryWindow,
  priceCap,
  climateMode,
  weights,
  recommendations,
  impacts,
  status,
  progress,
  onSetCrop,
  onSetQuantity,
  onSetUrgency,
  onSetDeliveryWindow,
  onSetPriceCap,
  onToggleClimateMode,
  onSetWeights,
  onRunOptimization
}: RecruiterHomeProps) {
  const onWeightChange = (key: keyof WeightConfig) => (value: number) => {
    onSetWeights({ ...weights, [key]: value });
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2>State Procurement Workspace</h2>
          <p>Welcome {name}. Plan and optimize inter-state crop sourcing with live cost, time, and carbon insights.</p>
        </div>

        <div className={styles.twoCol}>
          <article className={styles.panel}>
            <h3>Demand & Constraints</h3>
            <div className={styles.formGrid}>
              <label className={styles.label}>
                Crop
                <select className={styles.input} value={crop} onChange={(e) => onSetCrop(e.target.value)}>
                  <option value="tomato">Tomatoes</option>
                  <option value="rice">Rice</option>
                  <option value="wheat">Wheat</option>
                </select>
              </label>
              <label className={styles.label}>
                Quantity (tonnes)
                <input
                  className={styles.input}
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => onSetQuantity(Number(e.target.value) || 1)}
                />
              </label>
              <label className={styles.label}>
                Urgency
                <select className={styles.input} value={urgency} onChange={(e) => onSetUrgency(e.target.value)}>
                  <option>Standard</option>
                  <option>High (48h)</option>
                  <option>Emergency (24h)</option>
                </select>
              </label>
              <label className={styles.label}>
                Delivery window
                <select className={styles.input} value={deliveryWindow} onChange={(e) => onSetDeliveryWindow(e.target.value)}>
                  <option>3-5 days</option>
                  <option>1-2 days</option>
                  <option>Same day</option>
                </select>
              </label>
              <label className={styles.label}>
                Price cap (optional)
                <input
                  className={styles.input}
                  type="number"
                  placeholder="INR/tonne"
                  value={priceCap}
                  onChange={(e) => onSetPriceCap(e.target.value)}
                />
              </label>
              <label className={styles.blindToggle} htmlFor="climateMode">
                <input
                  id="climateMode"
                  type="checkbox"
                  checked={climateMode}
                  onChange={(e) => onToggleClimateMode(e.target.checked)}
                />
                Climate-adjusted mode
              </label>
            </div>
          </article>

          <article className={styles.panel}>
            <h3>Weights (Cost / Time / Carbon)</h3>
            <div className={styles.formGrid}>
              <label className={styles.label}>
                Cost weight
                <input
                  className={styles.input}
                  type="range"
                  min={0}
                  max={100}
                  value={weights.cost}
                  onChange={(e) => onWeightChange('cost')(Number(e.target.value))}
                />
                <small className={styles.smallText}>{weights.cost}%</small>
              </label>
              <label className={styles.label}>
                Time weight
                <input
                  className={styles.input}
                  type="range"
                  min={0}
                  max={100}
                  value={weights.time}
                  onChange={(e) => onWeightChange('time')(Number(e.target.value))}
                />
                <small className={styles.smallText}>{weights.time}%</small>
              </label>
              <label className={styles.label}>
                Carbon weight
                <input
                  className={styles.input}
                  type="range"
                  min={0}
                  max={100}
                  value={weights.carbon}
                  onChange={(e) => onWeightChange('carbon')(Number(e.target.value))}
                />
                <small className={styles.smallText}>{weights.carbon}%</small>
              </label>
            </div>
            <div className={styles.progressWrap} aria-live="polite">
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <p>{status === 'idle' ? 'Waiting to run optimization.' : `Generating recommendations (${progress}%)`}</p>
            </div>
            <button className={styles.primaryButton} type="button" onClick={onRunOptimization}>
              {status === 'running' ? 'Running...' : 'Run Optimization Demo'}
            </button>
          </article>
        </div>

        <article className={styles.panel}>
          <div className={styles.sectionHead}>
            <h3>Ranked Recommendations</h3>
            <span className={styles.smallText}>Best cost • Fastest • Lowest carbon</span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Source State</th>
                  <th>Price / tonne</th>
                  <th>Distance (km)</th>
                  <th>Transport</th>
                  <th>Total Cost</th>
                  <th>ETA (days)</th>
                  <th>Carbon (tCO₂e)</th>
                  <th>Savings vs max</th>
                  <th>Highlight</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.length === 0 && (
                  <tr>
                    <td colSpan={10}>No results yet. Run optimization to view ranked options.</td>
                  </tr>
                )}
                {recommendations.map((rec, index) => (
                  <tr key={rec.id}>
                    <td className={styles.rank}>#{index + 1}</td>
                    <td>{rec.sourceState}</td>
                    <td>₹{rec.pricePerTonne.toLocaleString()}</td>
                    <td>{rec.distanceKm}</td>
                    <td>₹{rec.transportCost.toLocaleString()}</td>
                    <td className={styles.score}>₹{rec.totalCost.toLocaleString()}</td>
                    <td>{rec.etaDays}</td>
                    <td>{rec.carbonTons.toFixed(3)}</td>
                    <td className={styles.percentage}>₹{rec.savingsVsMax.toLocaleString()}</td>
                    <td>{rec.highlight ? rec.highlight.replace('_', ' ') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className={styles.panel}>
          <h3>Impact Snapshot</h3>
          <div className={styles.formGrid}>
            <div>
              <p className={styles.smallText}>Total savings</p>
              <p className={styles.score}>₹{(impacts?.totalSavings ?? 0).toLocaleString()}</p>
            </div>
            <div>
              <p className={styles.smallText}>Carbon reduction</p>
              <p className={styles.score}>{(impacts?.carbonReductionPct ?? 0).toFixed(1)}%</p>
            </div>
            <div>
              <p className={styles.smallText}>Time saved</p>
              <p className={styles.score}>{(impacts?.timeSavedHours ?? 0).toFixed(1)} hrs</p>
            </div>
            <div>
              <p className={styles.smallText}>Confidence</p>
              <p className={styles.score}>{(impacts?.confidence ?? 0).toFixed(0)}%</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default RecruiterHome;
