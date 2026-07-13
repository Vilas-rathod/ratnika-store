import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiResponse, AuthTokens } from '@/types';
import { API_BASE_URL, USE_MOCK_API } from '@/lib/constants';
import { handleMock, MockHttpError } from '@/mock/handlers';

const ACCESS_KEY = 'ratnika_access_token';
const REFRESH_KEY = 'ratnika_refresh_token';

export const tokenStore = {
  get access() {
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  set(tokens: AuthTokens) {
    localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

/** Normalised error surfaced to the UI layer. */
export interface ApiError {
  status: number;
  message: string;
}

function toApiError(err: unknown): ApiError {
  if (err instanceof MockHttpError) return { status: err.status, message: err.message };
  if (err instanceof AxiosError) {
    const data = err.response?.data as ApiResponse<unknown> | undefined;
    return {
      status: err.response?.status ?? 0,
      message: data?.message ?? err.message ?? 'Network error. Please try again.',
    };
  }
  return { status: 0, message: (err as Error)?.message ?? 'Unexpected error' };
}

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401 (single-flight)
let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = tokenStore.refresh;
  if (!refresh) return null;
  try {
    const tokens = await rawRequest<AuthTokens>({
      method: 'POST',
      url: '/auth/refresh',
      data: { refreshToken: refresh },
    });
    tokenStore.set(tokens);
    return tokens.accessToken;
  } catch {
    tokenStore.clear();
    return null;
  }
}

instance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (error.response?.status === 401 && original && !original._retry && tokenStore.refresh) {
      original._retry = true;
      refreshing ??= refreshAccessToken();
      const newToken = await refreshing;
      refreshing = null;
      if (newToken) {
        original.headers = { ...original.headers, Authorization: `Bearer ${newToken}` };
        return instance(original);
      }
    }
    return Promise.reject(error);
  },
);

/** Low-level request used by the refresh flow (no interceptor recursion). */
async function rawRequest<T>(config: AxiosRequestConfig): Promise<T> {
  if (USE_MOCK_API) {
    const data = await handleMock({
      method: config.method ?? 'GET',
      url: (config.url ?? '') + queryString(config.params),
      body: config.data,
      headers: authHeader(),
    });
    return data as T;
  }
  const res = await axios.request<ApiResponse<T>>({ baseURL: API_BASE_URL, ...config });
  return res.data.data;
}

function authHeader(): Record<string, string> {
  const token = tokenStore.access;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function queryString(params?: Record<string, unknown>): string {
  if (!params) return '';
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v == null) return;
    if (Array.isArray(v)) v.forEach((item) => sp.append(k, String(item)));
    else sp.append(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
}

/**
 * Unified request helper. Routes to the mock handler when
 * VITE_USE_MOCK_API is on, otherwise hits the real backend and
 * unwraps the ApiResponse envelope.
 */
async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    if (USE_MOCK_API) {
      const data = await handleMock({
        method: config.method ?? 'GET',
        url: (config.url ?? '') + queryString(config.params),
        body: config.data,
        headers: authHeader(),
      });
      return data as T;
    }
    const res = await instance.request<ApiResponse<T>>(config);
    return res.data.data;
  } catch (err) {
    throw toApiError(err);
  }
}

export const http = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    request<T>({ method: 'GET', url, params }),
  post: <T>(url: string, data?: unknown) => request<T>({ method: 'POST', url, data }),
  put: <T>(url: string, data?: unknown) => request<T>({ method: 'PUT', url, data }),
  patch: <T>(url: string, data?: unknown) => request<T>({ method: 'PATCH', url, data }),
  delete: <T>(url: string, data?: unknown) => request<T>({ method: 'DELETE', url, data }),
};

export { toApiError };
