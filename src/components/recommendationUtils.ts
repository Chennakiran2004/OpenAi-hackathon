import { Recommendation, WeightConfig, ImpactSummary } from './types';

type RecommendationInput = {
  crop: string;
  quantity: number; // in tonnes
  weights: WeightConfig;
};

const emissionFactorPerTonneKm = 0.00012; // tCO2e per tonne-km (mock)
const transportCostPerTonneKm = 2.8; // INR per tonne per km (mock)

const fixtures = {
  states: [
    { code: 'AP', name: 'Andhra Pradesh' },
    { code: 'TS', name: 'Telangana' },
    { code: 'OD', name: 'Odisha' },
    { code: 'KA', name: 'Karnataka' },
    { code: 'MH', name: 'Maharashtra' }
  ],
  crops: {
    tomato: { name: 'Tomatoes', basePrice: 12000 },
    rice: { name: 'Rice', basePrice: 18000 },
    wheat: { name: 'Wheat', basePrice: 16000 }
  },
  distancesKm: {
    // from TS (Hyderabad) to others
    AP: 280,
    OD: 770,
    KA: 620,
    MH: 710
  },
  etaDays: {
    AP: 1,
    OD: 3,
    KA: 2,
    MH: 3
  }
};

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export function createRecommendations({ crop, quantity, weights }: RecommendationInput): Recommendation[] {
  const cropInfo = fixtures.crops[crop as keyof typeof fixtures.crops] || fixtures.crops.tomato;
  const options: Recommendation[] = fixtures.states
    .filter((s) => s.code !== 'TS')
    .map((state, idx) => {
      const distance = fixtures.distancesKm[state.code as keyof typeof fixtures.distancesKm] || 600;
      const etaDays = fixtures.etaDays[state.code as keyof typeof fixtures.etaDays] || 3;
      const basePrice = cropInfo.basePrice + idx * 400; // small variance
      const transportCost = round2(distance * transportCostPerTonneKm * quantity);
      const cropCost = round2(basePrice * quantity);
      const totalCost = round2(cropCost + transportCost);
      const carbonTons = round2(distance * emissionFactorPerTonneKm * quantity);
      return {
        id: `${state.code}-${crop}`,
        sourceState: state.name,
        crop: cropInfo.name,
        pricePerTonne: basePrice,
        distanceKm: distance,
        transportCost,
        totalCost,
        etaDays,
        carbonTons,
        savingsVsMax: 0, // fill later
        highlight: null,
        confidence: 82 - idx * 5
      };
    });

  const maxCost = Math.max(...options.map((o) => o.totalCost));
  const minCost = Math.min(...options.map((o) => o.totalCost));
  const minEta = Math.min(...options.map((o) => o.etaDays));
  const minCarbon = Math.min(...options.map((o) => o.carbonTons));

  return options.map((o) => {
    const savingsVsMax = round2(maxCost - o.totalCost);
    let highlight: Recommendation['highlight'] = null;
    if (o.totalCost === minCost) highlight = 'best_cost';
    else if (o.etaDays === minEta) highlight = 'fastest';
    else if (o.carbonTons === minCarbon) highlight = 'lowest_carbon';

    // weighted score not displayed but could be used later
    const normalizedCost = (o.totalCost - minCost) / (maxCost - minCost || 1);
    const normalizedTime = (o.etaDays - minEta) / (Math.max(...options.map((x) => x.etaDays)) - minEta || 1);
    const normalizedCarbon = (o.carbonTons - minCarbon) / (Math.max(...options.map((x) => x.carbonTons)) - minCarbon || 1);
    const score =
      (1 - normalizedCost) * (weights.cost / 100) +
      (1 - normalizedTime) * (weights.time / 100) +
      (1 - normalizedCarbon) * (weights.carbon / 100);

    return { ...o, savingsVsMax, confidence: round2(o.confidence + score * 10) };
  });
}

export function aggregateImpacts(recs: Recommendation[]): ImpactSummary {
  const totalSavings = round2(recs.reduce((sum, r) => sum + r.savingsVsMax, 0));
  const carbonReductionPct = recs.length
    ? round2(((Math.max(...recs.map((r) => r.carbonTons)) - Math.min(...recs.map((r) => r.carbonTons))) /
        Math.max(...recs.map((r) => r.carbonTons)) || 0) * 100)
    : 0;
  const timeSavedHours = recs.length
    ? round2((Math.max(...recs.map((r) => r.etaDays)) - Math.min(...recs.map((r) => r.etaDays))) * 24)
    : 0;
  const confidence = recs.length ? round2(recs.reduce((sum, r) => sum + r.confidence, 0) / recs.length) : 0;

  return {
    totalSavings,
    carbonReductionPct,
    timeSavedHours,
    confidence,
    monthlySavings: round2(totalSavings * 6),
    monthlyCarbonReduced: round2(carbonReductionPct * 1.2),
    avgDeliveryImprovementDays: round2(timeSavedHours / 24 / 2 || 0),
    optimizedTransactions: 128
  };
}

export const recommendationFixtures = fixtures;
