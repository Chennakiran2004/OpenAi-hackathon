/** Register request body (POST /api/v1/auth/register/) */
export type RegisterPayload = {
  username: string;
  password: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  state_id?: number;
  district_id?: number;
  designation?: string;
};

/** Register success response (201) */
export type RegisterResponse = {
  token: string;
  user_id: number;
  username: string;
  profile?: LoginProfile;
};

/** Login request body (POST /api/v1/auth/login/) */
export type LoginPayload = {
  username: string;
  password: string;
};

/** Profile object in login response */
export type LoginProfile = {
  state?: number;
  state_name?: string;
  district?: number;
  district_name?: string;
  designation?: string;
  phone?: string;
};

/** Login success response (200) */
export type LoginResponse = {
  token: string;
  user_id: number;
  username: string;
  profile: LoginProfile;
};

/** Stored user shape (persisted after login/register) */
export type StoredUser = {
  user_id: number;
  username: string;
  profile?: LoginProfile;
};

/** State option (GET /api/v1/states/) */
export type StateOption = {
  id: number;
  name: string;
  code?: string | null;
  capital_city?: string;
};

/** District option (GET /api/v1/districts/) */
export type DistrictOption = {
  id: number;
  name: string;
  state?: number;
  state_name?: string;
};

/** Paginated list response (states, districts, crops, etc.) */
export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

/** Crop option (GET /api/v1/crops/) */
export type CropOption = {
  id: number;
  name: string;
  group?: string;
  typical_season?: string;
};

/** State entry in crop availability (GET /api/v1/crop-availability/) */
export type CropAvailabilityState = {
  state__id: number;
  state__name: string;
  total_production: number;
  total_area: number;
  district_count: number;
};

/** Crop availability response */
export type CropAvailabilityResponse = {
  crop: CropOption;
  data_year: number;
  states: CropAvailabilityState[];
};

/** Optimize request (POST /api/v1/optimize/) */
export type OptimizePayload = {
  crop_id: number;
  state_id: number;
  district_id: number;
  quantity_tonnes: number;
  transport_mode?: string;
};

/** Single result item from optimize/result */
export type OptimizeResultItem = {
  id: number;
  supplier_state_name: string;
  available_supply_tonnes: number;
  price_per_tonne: string;
  transportation_cost: string;
  total_cost: string;
  distance_km: number;
  estimated_delivery_days: number;
  carbon_footprint_kg: number;
  transport_mode?: string;
  ranking_category: string;
  ranking_score: number;
};

/** Optimize success response (201) */
export type OptimizeResponse = {
  id: string;
  crop_name: string;
  state_name: string;
  district_name: string;
  required_quantity_tonnes: number;
  created_at: string;
  results: OptimizeResultItem[];
};

/** AI Summary structure */
export type AISummary = {
  headline: string;
  points: string[];
  generated_at?: string;
  model?: string;
};

/** Result detail with AI summary (GET /api/v1/results/{id}/) */
export type ResultDetailResponse = OptimizeResponse & {
  ai_summary: string | AISummary | null;
};

/** History item (GET /api/v1/history/) */
export type HistoryItem = OptimizeResponse;

/** Impact response (GET /api/v1/impact/) */
export type ImpactResponse = {
  total_queries: number;
  total_optimized_cost: number;
  total_carbon_footprint_kg: number;
  carbon_saved_kg: number;
  recent_queries: OptimizeResponse[];
};

/** Historical data point (predict response) */
export type HistoricalDataPoint = {
  year: number;
  production: number;
  area: number;
};

/** Forecast data point */
export type ForecastPoint = {
  year: number;
  predicted_demand_tonnes: number;
  confidence: number;
  suggestion: string;
};

/** Prediction part of predict response */
export type PredictionData = {
  current_year: number;
  trend: string;
  confidence: number;
  analysis: string;
  forecast: ForecastPoint[];
  error?: string;
};

/** Predict response (GET /api/v1/predict/{crop_id}/) */
export type PredictResponse = {
  crop: CropOption;
  state?: string;
  historical_data: HistoricalDataPoint[];
  prediction: PredictionData;
};

/** Production data (GET /api/v1/production/) */
export type ProductionData = {
  id: number;
  state_name: string;
  district_name: string;
  crop_name: string;
  crop_year: number;
  season: string;
  area: number; // hectares
  production: number; // tonnes
};

/** Demand & Supply projection (GET /api/v1/demand-supply/) */
export type DemandSupply = {
  id: number;
  crop_group: string;
  projected_demand_2016_17: number; // million tonnes
  projected_demand_2020_21: number; // million tonnes
  projected_supply_2016_17_low: number; // million tonnes
  projected_supply_2016_17_high: number; // million tonnes
  actual_production_2006_07: number; // million tonnes
  actual_production_2011_12: number; // million tonnes
};

/** Crop price (GET /api/v1/prices/) */
export type CropPrice = {
  id: number;
  crop: number;
  crop_name: string;
  state: number;
  state_name: string;
  price_per_tonne: string;
  year: number;
  source: string;
};

/** ---------------- Petroleum sector types ---------------- */

export type PetroleumCrudeProductionRecord = {
  id: number;
  month: string;
  year: number;
  company_name: string;
  quantity: number;
};

export type PetroleumRefineryProcessingRecord = {
  id: number;
  month: string;
  year: number;
  refinery_name: string;
  quantity: number;
};

export type PetroleumProductProductionRecord = {
  id: number;
  month: string;
  year: number;
  product: string;
  quantity: number;
};

export type PetroleumImportExportSnapshotRecord = {
  id: number;
  import_export: "Import" | "Export";
  product: string;
  monthly_data: Record<string, number>;
  total: number;
};

export type PetroleumTradeRecord = {
  id: number;
  month: number;
  year: number;
  product: string;
  trade_type: "Import" | "Export";
  quantity: number;
  value_inr_crore: number;
  value_usd_million: number;
  date_updated: string;
};

export type PetroleumFilterOptions = {
  companies: string[];
  refineries: string[];
  production_products: string[];
  trade_products: string[];
  years: {
    crude_production: number[];
    refinery_processing: number[];
    product_production: number[];
    trade: number[];
  };
};

export type PetroleumCrudeForecastHistoricalPoint = {
  year: number;
  company_name: string;
  total_quantity: number;
};

export type PetroleumCrudeForecastPoint = {
  year: number;
  predicted_quantity: number;
};

export type PetroleumCrudeForecastAI = {
  forecast: PetroleumCrudeForecastPoint[];
  trend: "increasing" | "stable" | "declining" | string;
  confidence: number;
  import_implication: string;
  analysis: string;
  error?: string;
};

export type PetroleumCrudeForecastResponse = {
  company: string;
  historical_data: PetroleumCrudeForecastHistoricalPoint[];
  forecast: PetroleumCrudeForecastAI;
};

export type PetroleumRefineryYearlyTrend = {
  year: number;
  refinery_name: string;
  total_processed: number;
};

export type PetroleumRefinerySeasonalPoint = {
  month: string;
  avg_quantity: number;
};

export type PetroleumRefineryAnalysisResponse = {
  refinery: string;
  year_filter: number | null;
  yearly_trends: PetroleumRefineryYearlyTrend[];
  seasonal_pattern: PetroleumRefinerySeasonalPoint[];
};

export type PetroleumDemandSupplyProductionPoint = {
  product: string;
  year: number;
  domestic_production: number;
};

export type PetroleumDemandSupplyImportPoint = {
  product: string;
  year: number;
  import_quantity: number;
  import_value_inr: number;
};

export type PetroleumDemandSupplyExportPoint = {
  product: string;
  year: number;
  export_quantity: number;
  export_value_inr: number;
};

export type PetroleumDemandSupplyGapResponse = {
  product_filter: string;
  year_filter: number | null;
  production: PetroleumDemandSupplyProductionPoint[];
  imports: PetroleumDemandSupplyImportPoint[];
  exports: PetroleumDemandSupplyExportPoint[];
};

export type PetroleumImportCostItem = {
  year: number;
  product: string;
  total_quantity: number;
  total_value_inr: number;
  total_value_usd: number;
};

export type PetroleumImportCostForecastPoint = {
  year: number;
  estimated_bill_inr_crore: number;
  estimated_bill_usd_million: number;
};

export type PetroleumImportCostAIForecast = {
  forecast?: PetroleumImportCostForecastPoint[];
  key_drivers?: string[];
  risk_factors?: string[];
  analysis?: string;
  error?: string;
  confidence?: number;
};

export type PetroleumImportCostAnalysisResponse = {
  year_filter: number | null;
  import_data: PetroleumImportCostItem[];
  ai_forecast: PetroleumImportCostAIForecast;
};

export type PetroleumTradeBalanceProduct = {
  product: string;
  import_quantity: number;
  export_quantity: number;
  net_quantity: number;
  status: "net_importer" | "net_exporter" | string;
  import_value_inr_crore: number;
  export_value_inr_crore: number;
};

export type PetroleumTradeBalanceResponse = {
  year_filter: number | null;
  products: PetroleumTradeBalanceProduct[];
};

export type PetroleumIntelligenceFinding = {
  title: string;
  detail: string;
};

export type PetroleumIntelligenceResponse = {
  headline: string;
  key_findings: PetroleumIntelligenceFinding[];
  strategic_recommendations: string[];
  risk_assessment: string;
};

/** ---------------- Voice agent types ---------------- */

export type VoiceAgentSector = "agriculture" | "petroleum";

export type VoiceAgentDomain =
  | "agriculture"
  | "petroleum"
  | "unsupported";

export type VoiceAgentConfidence = "low" | "medium" | "high";

export type VoiceAgentRequest = {
  sector: VoiceAgentSector;
  transcript: string;
  language?: string;
  context?: string;
  prompt_version?: string;
};

export type VoiceAgentResponse = {
  reply_text: string;
  confidence?: VoiceAgentConfidence | string;
  data_timestamp?: string;
  domain?: VoiceAgentDomain | string;
  language?: string;
};
