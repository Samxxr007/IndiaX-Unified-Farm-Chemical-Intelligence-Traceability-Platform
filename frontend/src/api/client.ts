/**
 * API Base URL from environment variable.
 * Set VITE_API_URL in frontend/.env to your backend URL.
 * Defaults to localhost:5000/api/v1 for development.
 */
const BASE_URL = ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:5000/api/v1';


const TOKEN_KEY = 'indiax_access_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

/**
 * Core HTTP client. All API calls go through this.
 * - Auto-injects Authorization: Bearer <token>
 * - Auto-redirects to login on 401
 * - Parses { success, data } or { success, error } responses consistently
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with query params
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle 401 — token expired or invalid
  if (response.status === 401) {
    if (token && !token.startsWith('demo-')) {
      clearToken();
    }
    throw new Error('Session expired or unauthorized.');
  }

  const json = await response.json();

  if (!response.ok || json.success === false) {
    const errorMessage = json.error?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage) as Error & { code?: string; details?: unknown };
    error.code = json.error?.code;
    error.details = json.error?.details;
    throw error;
  }

  return json.data as T;
}

// HTTP method helpers
export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
