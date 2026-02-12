import type { OptimizeResultItem, ImpactResponse } from './types';
import type { Recommendation, ImpactSummary } from '../components/types';

const CARBON_KG_TO_TONNES = 0.001;

function parseDecimal(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function mapRankingCategoryToHighlight(category: string): Recommendation['highlight'] {
  if (category === 'best_cost' || category === 'fastest' || category === 'lowest_carbon') {
    return category;
  }
  return null;
}

/**
 * Maps a single optimize result item from API to UI Recommendation.
 */
export function mapResultItemToRecommendation(
  item: OptimizeResultItem,
  cropName: string,
  maxTotalCost: number
): Recommendation {
  const totalCost = parseDecimal(item.total_cost);
  const savingsVsMax = Math.max(0, maxTotalCost - totalCost);
  return {
    id: String(item.id),
    sourceState: item.supplier_state_name,
    crop: cropName,
    pricePerTonne: parseDecimal(item.price_per_tonne),
    distanceKm: item.distance_km,
    transportCost: parseDecimal(item.transportation_cost),
    totalCost,
    etaDays: item.estimated_delivery_days,
    carbonTons: item.carbon_footprint_kg * CARBON_KG_TO_TONNES,
    savingsVsMax,
    highlight: mapRankingCategoryToHighlight(item.ranking_category),
    confidence: Math.round((1 - item.ranking_score) * 100),
  };
}

/**
 * Maps full optimize response results to Recommendation array.
 */
export function mapOptimizeResultsToRecommendations(
  items: OptimizeResultItem[],
  cropName: string
): Recommendation[] {
  if (items.length === 0) return [];
  const costs = items.map((i) => parseDecimal(i.total_cost));
  const maxTotalCost = Math.max(...costs);
  return items.map((item) =>
    mapResultItemToRecommendation(item, cropName, maxTotalCost)
  );
}

/**
 * Maps impact API response to UI ImpactSummary.
 */
export function mapImpactResponseToSummary(response: ImpactResponse): ImpactSummary {
  const totalCarbon = response.total_carbon_footprint_kg || 1;
  const carbonReductionPct =
    totalCarbon > 0 ? (response.carbon_saved_kg / totalCarbon) * 100 : 0;
  return {
    totalSavings: response.total_optimized_cost,
    carbonReductionPct,
    timeSavedHours: 0,
    confidence: response.total_queries > 0 ? 85 : 0,
    monthlySavings: response.total_optimized_cost,
    monthlyCarbonReduced: response.carbon_saved_kg * CARBON_KG_TO_TONNES,
    avgDeliveryImprovementDays: 0,
    optimizedTransactions: response.total_queries,
  };
}
