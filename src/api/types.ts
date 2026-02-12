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
  ranking_category: string;
  ranking_score: number;
};

/** Optimize success response (201) */
export type OptimizeResponse = {
  id: number;
  crop_name: string;
  state_name: string;
  district_name: string;
  required_quantity_tonnes: number;
  created_at: string;
  results: OptimizeResultItem[];
};

/** Result detail with AI summary (GET /api/v1/results/{id}/) */
export type ResultDetailResponse = OptimizeResponse & {
  ai_summary: string | null;
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

/** Prediction part of predict response */
export type PredictionData = {
  prediction_year_1?: number;
  prediction_year_2?: number;
  confidence?: string;
  reasoning?: string;
  error?: string;
};

/** Predict response (GET /api/v1/predict/{crop_id}/) */
export type PredictResponse = {
  crop: CropOption;
  state?: string;
  historical_data: HistoricalDataPoint[];
  prediction: PredictionData;
};
