import axios, { AxiosError } from 'axios';
import type { SignupPayload, SignupResponse, SigninResponse, ProfileResponse } from '../types';
import type { Role } from '../../components/types';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
const ACCESS_TOKEN_KEY = 'tf_access_token';
const REFRESH_TOKEN_KEY = 'tf_refresh_token';
const ROLE_KEY = 'tf_role';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function getStoredRole(): Role | null {
  const r = localStorage.getItem(ROLE_KEY);
  if (r === 'student' || r === 'recruiter') return r;
  return null;
}

export function setStoredRole(role: Role): void {
  localStorage.setItem(ROLE_KEY, role);
}

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<{ detail?: string; email?: string[]; message?: string }>;
    const data = ax.response?.data;
    if (data?.detail) return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
    if (data?.email?.length) return data.email[0];
    if (data?.message) return data.message;
    if (ax.response?.status === 401) return 'Invalid email or password.';
    if (ax.response?.status === 400) return 'Invalid request. Please check your input.';
  }
  return 'Something went wrong. Please try again.';
}

export async function signup(payload: SignupPayload): Promise<SignupResponse> {
  const { data } = await client.post<SignupResponse>('/api/auth/signup/', payload);
  return data;
}

export async function signin(email: string, password: string): Promise<SigninResponse> {
  const { data } = await client.post<SigninResponse>('/api/auth/signin/', { email, password });
  return data;
}

export async function getProfile(): Promise<ProfileResponse['user']> {
  const { data } = await client.get<ProfileResponse>('/api/auth/profile/');
  return data.user;
}

export { getErrorMessage };
