import axios, { AxiosError } from 'axios';
import type {
  RegisterPayload,
  RegisterResponse,
  LoginResponse,
  StoredUser,
  StateOption,
  DistrictOption,
  PaginatedResponse,
  CropOption,
  CropAvailabilityResponse,
  OptimizePayload,
  OptimizeResponse,
  ResultDetailResponse,
  HistoryItem,
  ImpactResponse,
  PredictResponse,
  ProductionData,
  DemandSupply,
  CropPrice,
  PetroleumFilterOptions,
  PetroleumTradeBalanceResponse,
  PetroleumIntelligenceResponse,
  PetroleumCrudeForecastResponse,
  PetroleumRefineryAnalysisResponse,
  PetroleumDemandSupplyGapResponse,
  PetroleumImportCostAnalysisResponse,
  PetroleumCrudeProductionRecord,
  PetroleumRefineryProcessingRecord,
  PetroleumProductProductionRecord,
  PetroleumImportExportSnapshotRecord,
  PetroleumTradeRecord,
} from '../types';
import type { Role } from '../../components/types';

// const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://10.10.27.98:8000';
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://testy-jenny-agriwow-8b798c0c.koyeb.app';
const ACCESS_TOKEN_KEY = 'tf_access_token';
const ROLE_KEY = 'tf_role';
const STORED_USER_KEY = 'tf_stored_user';
const SECTOR_KEY = 'tf_sector';

export type UserSector = 'agriculture' | 'petroleum';

const API_PATHS = {
  register: '/api/v1/auth/register/',
  login: '/api/v1/auth/login/',
  logout: '/api/v1/auth/logout/',
  states: '/api/v1/states/',
  districts: '/api/v1/districts/',
  crops: '/api/v1/crops/',
  cropDetail: (id: number) => `/api/v1/crops/${id}/`,
  cropAvailability: '/api/v1/crop-availability/',
  optimize: '/api/v1/optimize/',
  result: (id: string) => `/api/v1/results/${id}/`,
  history: '/api/v1/history/',
  impact: '/api/v1/impact/',
  predict: (cropId: number) => `/api/v1/predict/${cropId}/`,
  production: '/api/v1/production/',
  demandSupply: '/api/v1/demand-supply/',
  prices: '/api/v1/prices/',
  petroleum: {
    filters: '/api/v1/petroleum/filters/',
    crudeProduction: '/api/v1/petroleum/crude-production/',
    refineryProcessing: '/api/v1/petroleum/refinery-processing/',
    productProduction: '/api/v1/petroleum/product-production/',
    importExportSnapshot: '/api/v1/petroleum/import-export-snapshot/',
    trade: '/api/v1/petroleum/trade/',
    forecastCrude: '/api/v1/petroleum/forecast/crude/',
    analysisRefinery: '/api/v1/petroleum/analysis/refinery/',
    analysisDemandSupplyGap: '/api/v1/petroleum/analysis/demand-supply-gap/',
    analysisImportCosts: '/api/v1/petroleum/analysis/import-costs/',
    dashboardTradeBalance: '/api/v1/petroleum/dashboard/trade-balance/',
    intelligence: '/api/v1/petroleum/intelligence/',
  },
} as const;

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(STORED_USER_KEY);
  localStorage.removeItem(SECTOR_KEY);
}

export function getStoredRole(): Role | null {
  const r = localStorage.getItem(ROLE_KEY);
  if (r === 'state_officer' || r === 'central_admin') return r;
  return null;
}

export function setStoredRole(role: Role): void {
  localStorage.setItem(ROLE_KEY, role);
}

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem(STORED_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: StoredUser): void {
  localStorage.setItem(STORED_USER_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem(STORED_USER_KEY);
}

export function getStoredSector(): UserSector | null {
  const raw = localStorage.getItem(SECTOR_KEY);
  if (raw === 'agriculture' || raw === 'petroleum') return raw;
  return null;
}

export function setStoredSector(sector: UserSector): void {
  localStorage.setItem(SECTOR_KEY, sector);
}

export function clearStoredSector(): void {
  localStorage.removeItem(SECTOR_KEY);
}

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const AUTH_HEADER_PREFIX = 'Token';

client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `${AUTH_HEADER_PREFIX} ${token}`;
  }
  return config;
});

type ErrorData = {
  detail?: string | unknown;
  email?: string[];
  username?: string[];
  message?: string;
  error?: string;
};

function extractErrorMessage(err: unknown): string {
  if (!axios.isAxiosError(err)) {
    return 'Something went wrong. Please try again.';
  }
  const ax = err as AxiosError<ErrorData>;
  const data = ax.response?.data;
  if (data?.username?.length) return data.username[0];
  if (data?.error) return data.error;
  if (data?.detail) {
    return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
  }
  if (data?.email?.length) return data.email[0];
  if (data?.message) return data.message;
  if (ax.response?.status === 401) return 'Invalid credentials';
  if (ax.response?.status === 400) return 'Invalid request. Please check your input.';
  return 'Something went wrong. Please try again.';
}

export const getErrorMessage = extractErrorMessage;

function ensureResultsArray<T>(data: unknown): T[] {
  if (data && typeof data === 'object' && 'results' in data && Array.isArray((data as { results: T[] }).results)) {
    return (data as { results: T[] }).results;
  }
  return [];
}

function ensurePaginatedResponse<T>(data: unknown): PaginatedResponse<T> {
  if (
    data &&
    typeof data === 'object' &&
    'count' in data &&
    'next' in data &&
    'previous' in data &&
    'results' in data &&
    Array.isArray((data as PaginatedResponse<T>).results)
  ) {
    return data as PaginatedResponse<T>;
  }
  return {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };
}

function buildQueryString(
  params: Record<string, string | number | undefined | null>
): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      query.set(key, String(value));
    }
  });
  const q = query.toString();
  return q ? `?${q}` : '';
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await client.post<RegisterResponse>(API_PATHS.register, payload);
  return data;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const { data } = await client.post<LoginResponse>(API_PATHS.login, { username, password });
  return data;
}

export async function logout(): Promise<void> {
  await client.post(API_PATHS.logout);
}

export async function getStates(): Promise<StateOption[]> {
  const { data } = await client.get<PaginatedResponse<StateOption>>(API_PATHS.states);
  return ensureResultsArray<StateOption>(data);
}

export async function getDistricts(stateId?: number): Promise<DistrictOption[]> {
  const url = stateId != null ? `${API_PATHS.districts}?state=${stateId}` : API_PATHS.districts;
  const { data } = await client.get<PaginatedResponse<DistrictOption>>(url);
  return ensureResultsArray<DistrictOption>(data);
}

export async function getCrops(search?: string, page?: number): Promise<CropOption[]> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (page != null) params.set('page', String(page));
  const query = params.toString();
  const url = query ? `${API_PATHS.crops}?${query}` : API_PATHS.crops;
  const { data } = await client.get<PaginatedResponse<CropOption>>(url);
  return ensureResultsArray<CropOption>(data);
}

export async function getCropAvailability(cropId: number): Promise<CropAvailabilityResponse> {
  const { data } = await client.get<CropAvailabilityResponse>(
    `${API_PATHS.cropAvailability}?crop=${cropId}`
  );
  return data;
}

export async function optimize(payload: OptimizePayload): Promise<OptimizeResponse> {
  const { data } = await client.post<OptimizeResponse>(API_PATHS.optimize, payload);
  return data;
}

export async function getResult(queryId: string): Promise<ResultDetailResponse> {
  const { data } = await client.get<ResultDetailResponse>(API_PATHS.result(queryId));
  return data;
}

export async function getHistory(): Promise<HistoryItem[]> {
  const { data } = await client.get<HistoryItem[]>(API_PATHS.history);
  return Array.isArray(data) ? data : [];
}

export async function getImpact(): Promise<ImpactResponse> {
  const { data } = await client.get<ImpactResponse>(API_PATHS.impact);
  return data;
}

export async function getPredict(cropId: number, stateId?: number): Promise<PredictResponse> {
  const url = stateId != null ? `${API_PATHS.predict(cropId)}?state=${stateId}` : API_PATHS.predict(cropId);
  const { data } = await client.get<PredictResponse>(url);
  return data;
}

export async function getCropDetail(cropId: number): Promise<CropOption> {
  const { data } = await client.get<CropOption>(API_PATHS.cropDetail(cropId));
  return data;
}

export async function getProduction(
  cropId?: number,
  stateId?: number,
  cropYear?: number,
  season?: string,
  page?: number
): Promise<ProductionData[]> {
  const params = new URLSearchParams();
  if (cropId != null) params.set('crop', String(cropId));
  if (stateId != null) params.set('state', String(stateId));
  if (cropYear != null) params.set('crop_year', String(cropYear));
  if (season) params.set('season', season);
  if (page != null) params.set('page', String(page));
  const query = params.toString();
  const url = query ? `${API_PATHS.production}?${query}` : API_PATHS.production;
  const { data } = await client.get<PaginatedResponse<ProductionData>>(url);
  return ensureResultsArray<ProductionData>(data);
}

export async function getDemandSupply(): Promise<DemandSupply[]> {
  const { data } = await client.get<PaginatedResponse<DemandSupply>>(API_PATHS.demandSupply);
  return ensureResultsArray<DemandSupply>(data);
}

export async function getCropPrices(
  cropId?: number,
  stateId?: number,
  year?: number,
  page?: number
): Promise<CropPrice[]> {
  const params = new URLSearchParams();
  if (cropId != null) params.set('crop', String(cropId));
  if (stateId != null) params.set('state', String(stateId));
  if (year != null) params.set('year', String(year));
  if (page != null) params.set('page', String(page));
  const query = params.toString();
  const url = query ? `${API_PATHS.prices}?${query}` : API_PATHS.prices;
  const { data } = await client.get<PaginatedResponse<CropPrice>>(url);
  return ensureResultsArray<CropPrice>(data);
}

/** ---------------- Petroleum sector APIs ---------------- */

export async function getPetroleumFilters(): Promise<PetroleumFilterOptions> {
  const { data } = await client.get<PetroleumFilterOptions>(
    API_PATHS.petroleum.filters
  );
  return data;
}

export async function listPetroleumCrudeProduction(params?: {
  year?: number;
  company_name?: string;
  search?: string;
  ordering?: string;
  page?: number;
}): Promise<PaginatedResponse<PetroleumCrudeProductionRecord>> {
  const query = buildQueryString({
    year: params?.year,
    company_name: params?.company_name,
    search: params?.search,
    ordering: params?.ordering,
    page: params?.page,
  });
  const { data } = await client.get<PaginatedResponse<PetroleumCrudeProductionRecord>>(
    `${API_PATHS.petroleum.crudeProduction}${query}`
  );
  return ensurePaginatedResponse<PetroleumCrudeProductionRecord>(data);
}

export async function listPetroleumRefineryProcessing(params?: {
  year?: number;
  refinery_name?: string;
  search?: string;
  ordering?: string;
  page?: number;
}): Promise<PaginatedResponse<PetroleumRefineryProcessingRecord>> {
  const query = buildQueryString({
    year: params?.year,
    refinery_name: params?.refinery_name,
    search: params?.search,
    ordering: params?.ordering,
    page: params?.page,
  });
  const { data } = await client.get<PaginatedResponse<PetroleumRefineryProcessingRecord>>(
    `${API_PATHS.petroleum.refineryProcessing}${query}`
  );
  return ensurePaginatedResponse<PetroleumRefineryProcessingRecord>(data);
}

export async function listPetroleumProductProduction(params?: {
  year?: number;
  product?: string;
  search?: string;
  ordering?: string;
  page?: number;
}): Promise<PaginatedResponse<PetroleumProductProductionRecord>> {
  const query = buildQueryString({
    year: params?.year,
    product: params?.product,
    search: params?.search,
    ordering: params?.ordering,
    page: params?.page,
  });
  const { data } = await client.get<PaginatedResponse<PetroleumProductProductionRecord>>(
    `${API_PATHS.petroleum.productProduction}${query}`
  );
  return ensurePaginatedResponse<PetroleumProductProductionRecord>(data);
}

export async function listPetroleumImportExportSnapshot(params?: {
  import_export?: 'Import' | 'Export';
  product?: string;
  search?: string;
  page?: number;
}): Promise<PaginatedResponse<PetroleumImportExportSnapshotRecord>> {
  const query = buildQueryString({
    import_export: params?.import_export,
    product: params?.product,
    search: params?.search,
    page: params?.page,
  });
  const { data } = await client.get<PaginatedResponse<PetroleumImportExportSnapshotRecord>>(
    `${API_PATHS.petroleum.importExportSnapshot}${query}`
  );
  return ensurePaginatedResponse<PetroleumImportExportSnapshotRecord>(data);
}

export async function listPetroleumTrade(params?: {
  year?: number;
  product?: string;
  trade_type?: 'Import' | 'Export';
  search?: string;
  ordering?: string;
  page?: number;
}): Promise<PaginatedResponse<PetroleumTradeRecord>> {
  const query = buildQueryString({
    year: params?.year,
    product: params?.product,
    trade_type: params?.trade_type,
    search: params?.search,
    ordering: params?.ordering,
    page: params?.page,
  });
  const { data } = await client.get<PaginatedResponse<PetroleumTradeRecord>>(
    `${API_PATHS.petroleum.trade}${query}`
  );
  return ensurePaginatedResponse<PetroleumTradeRecord>(data);
}

export async function getPetroleumCrudeForecast(
  company?: string
): Promise<PetroleumCrudeForecastResponse> {
  const query = buildQueryString({ company });
  const { data } = await client.get<PetroleumCrudeForecastResponse>(
    `${API_PATHS.petroleum.forecastCrude}${query}`
  );
  return data;
}

export async function getPetroleumRefineryAnalysis(params?: {
  refinery?: string;
  year?: number;
}): Promise<PetroleumRefineryAnalysisResponse> {
  const query = buildQueryString({
    refinery: params?.refinery,
    year: params?.year,
  });
  const { data } = await client.get<PetroleumRefineryAnalysisResponse>(
    `${API_PATHS.petroleum.analysisRefinery}${query}`
  );
  return data;
}

export async function getPetroleumDemandSupplyGap(params?: {
  product?: string;
  year?: number;
}): Promise<PetroleumDemandSupplyGapResponse> {
  const query = buildQueryString({
    product: params?.product,
    year: params?.year,
  });
  const { data } = await client.get<PetroleumDemandSupplyGapResponse>(
    `${API_PATHS.petroleum.analysisDemandSupplyGap}${query}`
  );
  return data;
}

export async function getPetroleumImportCosts(
  year?: number
): Promise<PetroleumImportCostAnalysisResponse> {
  const query = buildQueryString({ year });
  const { data } = await client.get<PetroleumImportCostAnalysisResponse>(
    `${API_PATHS.petroleum.analysisImportCosts}${query}`
  );
  return data;
}

export async function getPetroleumTradeBalance(
  year?: number
): Promise<PetroleumTradeBalanceResponse> {
  const query = buildQueryString({ year });
  const { data } = await client.get<PetroleumTradeBalanceResponse>(
    `${API_PATHS.petroleum.dashboardTradeBalance}${query}`
  );
  return data;
}

export async function getPetroleumIntelligence(): Promise<PetroleumIntelligenceResponse> {
  const { data } = await client.get<PetroleumIntelligenceResponse>(
    API_PATHS.petroleum.intelligence
  );
  return data;
}
