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
} from '../types';
import type { Role } from '../../components/types';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
const ACCESS_TOKEN_KEY = 'tf_access_token';
const ROLE_KEY = 'tf_role';
const STORED_USER_KEY = 'tf_stored_user';

const API_PATHS = {
  register: '/api/v1/auth/register/',
  login: '/api/v1/auth/login/',
  logout: '/api/v1/auth/logout/',
  states: '/api/v1/states/',
  districts: '/api/v1/districts/',
  crops: '/api/v1/crops/',
  cropAvailability: '/api/v1/crop-availability/',
  optimize: '/api/v1/optimize/',
  result: (id: number) => `/api/v1/results/${id}/`,
  history: '/api/v1/history/',
  impact: '/api/v1/impact/',
  predict: (cropId: number) => `/api/v1/predict/${cropId}/`,
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

export async function getResult(queryId: number): Promise<ResultDetailResponse> {
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
