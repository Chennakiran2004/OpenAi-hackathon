import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRecruiter } from '../../contexts/RecruiterContext';
import { WeightConfig } from '../types';
import { recruiterHomeStyles as styles } from './stylecomponent';
import SearchableSelect from '../ui/SearchableSelect';

function RecruiterHome() {
  const { user } = useAuth();
  const name = user?.name ?? '';
  const {
    cropId,
    setCropId,
    cropOptions,
    cropOptionsLoading,
    quantity,
    setQuantity,
    urgency,
    setUrgency,
    deliveryWindow,
    setDeliveryWindow,
    transportMode,
    setTransportMode,
    priceCap,
    setPriceCap,
    climateMode,
    setClimateMode,
    weights,
    setWeights,
    recommendations,
    impacts,
    impactsLoading,
    status,
    progress,
    aiSummary,
    optimizationError,
    runOptimization,
    loadImpact,
    cropAvailability,
    cropAvailabilityLoading,
    history,
    historyLoading,
    prediction,
    predictionLoading,
  } = useRecruiter();

  useEffect(() => {
    loadImpact();
  }, [loadImpact]);

  const onWeightChange = (key: keyof WeightConfig) => (value: number) => {
    setWeights({ ...weights, [key]: value });
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2>State Procurement Workspace</h2>
          <p>
            Welcome {name}. Plan and optimize inter-state crop sourcing with live cost, time, and
            carbon insights.
          </p>
        </div>

        <div className={styles.twoCol}>
          <article className={styles.panel}>
            <h3>Demand & Constraints</h3>
            <div className={styles.formGrid}>
              <div className={styles.label}>
                <SearchableSelect
                  label="Crop"
                  required
                  value={cropId ?? ''}
                  onChange={(value) => setCropId(value === '' ? null : Number(value))}
                  options={cropOptions.map(c => ({ value: c.id, label: c.name }))}
                  placeholder={cropOptionsLoading ? 'Loading crops...' : 'Select crop'}
                  disabled={cropOptionsLoading}
                />
              </div>
              <label className={styles.label}>
                Quantity (tonnes)
                <input
                  className={styles.input}
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                />
              </label>
              <label className={styles.label}>
                Urgency
                <select
                  className={styles.input}
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                >
                  <option>Standard</option>
                  <option>High (48h)</option>
                  <option>Emergency (24h)</option>
                </select>
              </label>
              <label className={styles.label}>
                Delivery window
                <select
                  className={styles.input}
                  value={deliveryWindow}
                  onChange={(e) => setDeliveryWindow(e.target.value)}
                >
                  <option>3-5 days</option>
                  <option>1-2 days</option>
                  <option>Same day</option>
                </select>
              </label>
              <label className={styles.label}>
                Transport Mode
                <select
                  className={styles.input}
                  value={transportMode}
                  onChange={(e) => setTransportMode(e.target.value)}
                >
                  <option value="both">Both (Road + Rail)</option>
                  <option value="road">Road Only</option>
                  <option value="rail">Rail Only</option>
                </select>
              </label>
              <label className={styles.label}>
                Price cap (optional)
                <input
                  className={styles.input}
                  type="number"
                  placeholder="INR/tonne"
                  value={priceCap}
                  onChange={(e) => setPriceCap(e.target.value)}
                />
              </label>
              <label className={styles.blindToggle} htmlFor="climateMode">
                <input
                  id="climateMode"
                  type="checkbox"
                  checked={climateMode}
                  onChange={(e) => setClimateMode(e.target.checked)}
                />
                Climate-adjusted mode
              </label>
            </div>
            {cropId != null && (
              <div className={styles.cropAvailability}>
                <h4>States producing this crop</h4>
                {cropAvailabilityLoading ? (
                  <p className={styles.smallText}>Loading…</p>
                ) : cropAvailability ? (
                  <>
                    <p className={styles.smallText}>Data year: {cropAvailability.data_year}</p>
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>State</th>
                            <th>Production (t)</th>
                            <th>Area (ha)</th>
                            <th>Districts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cropAvailability.states.slice(0, 10).map((s) => (
                            <tr key={s.state__id}>
                              <td className={styles.cellCompany}>{s.state__name}</td>
                              <td>{(s.total_production ?? 0).toLocaleString()}</td>
                              <td>{(s.total_area ?? 0).toLocaleString()}</td>
                              <td>{s.district_count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <p className={styles.smallText}>No availability data for this crop.</p>
                )}
              </div>
            )}
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
              <p>
                {status === 'idle'
                  ? 'Select crop and run optimization.'
                  : `Generating recommendations (${progress}%)`}
              </p>
            </div>
            {optimizationError && (
              <p className={styles.error} role="alert">
                {optimizationError}
              </p>
            )}
            <button
              className={styles.primaryButton}
              type="button"
              onClick={runOptimization}
              disabled={status === 'running' || cropId == null}
            >
              {status === 'running' ? 'Running…' : 'Run Optimization'}
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
          {aiSummary && (
            <div className={styles.aiSummary}>
              <h4>AI Recommendation</h4>
              {typeof aiSummary === 'string' ? (
                <p>{aiSummary}</p>
              ) : (
                <>
                  {aiSummary.headline && <p><strong>{aiSummary.headline}</strong></p>}
                  {aiSummary.points && Array.isArray(aiSummary.points) && (
                    <ul>
                      {aiSummary.points.map((point: string, index: number) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          )}
        </article>

        <article className={styles.panel}>
          <h3>Impact Snapshot</h3>
          {impactsLoading ? (
            <p className={styles.smallText}>Loading impact…</p>
          ) : (
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
                <p className={styles.smallText}>Optimized transactions</p>
                <p className={styles.score}>{impacts?.optimizedTransactions ?? 0}</p>
              </div>
            </div>
          )}
        </article>

        <article className={styles.panel}>
          <h3>Query history</h3>
          {historyLoading ? (
            <p className={styles.smallText}>Loading…</p>
          ) : history.length === 0 ? (
            <p className={styles.smallText}>No past queries yet. Run optimization to see history.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Crop</th>
                    <th>State</th>
                    <th>District</th>
                    <th>Quantity (t)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 10).map((q) => (
                    <tr key={q.id}>
                      <td className={styles.cellCompany}>{q.crop_name}</td>
                      <td>{q.state_name}</td>
                      <td>{q.district_name}</td>
                      <td>{q.required_quantity_tonnes}</td>
                      <td className={styles.smallText}>
                        {new Date(q.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        {cropId != null && (
          <article className={styles.panel}>
            <h3>Demand prediction</h3>
            {predictionLoading ? (
              <p className={styles.smallText}>Loading…</p>
            ) : prediction ? (
              <div className={styles.predictionBlock}>
                {prediction.state && (
                  <p className={styles.smallText}>State: {prediction.state}</p>
                )}
                {prediction.prediction.error ? (
                  <p className={styles.error}>{prediction.prediction.error}</p>
                ) : (
                  <>
                    {prediction.historical_data.length > 0 && (
                      <div>
                        <h4 className={styles.predictionSubhead}>Recent history</h4>
                        <div className={styles.tableWrap}>
                          <table className={styles.table}>
                            <thead>
                              <tr>
                                <th>Year</th>
                                <th>Production (t)</th>
                                <th>Area (ha)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {prediction.historical_data
                                .slice(-5)
                                .reverse()
                                .map((d) => (
                                  <tr key={d.year}>
                                    <td>{d.year}</td>
                                    <td>{(d.production ?? 0).toLocaleString()}</td>
                                    <td>{(d.area ?? 0).toLocaleString()}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    {/* <div className={styles.predictionSummary}>
                      {prediction.prediction.prediction_year_1 != null && (
                        <p>Prediction year 1: {prediction.prediction.prediction_year_1.toLocaleString()} t</p>
                      )}
                      {prediction.prediction.prediction_year_2 != null && (
                        <p>Prediction year 2: {prediction.prediction.prediction_year_2?.toLocaleString()} t</p>
                      )}
                      {prediction.prediction.confidence && (
                        <p className={styles.smallText}>Confidence: {prediction.prediction.confidence}</p>
                      )}
                      {prediction.prediction.reasoning && (
                        <p className={styles.smallText}>{prediction.prediction.reasoning}</p>
                      )}
                    </div> */}
                  </>
                )}
              </div>
            ) : (
              <p className={styles.smallText}>Select a crop to see prediction.</p>
            )}
          </article>
        )}
      </div>
    </section>
  );
}

export default RecruiterHome;
