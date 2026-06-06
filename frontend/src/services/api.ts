import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

const ACCESS_KEY = 'sms_access_token';
const REFRESH_KEY = 'sms_refresh_token';

export const tokenStore = {
  get access() {
    return typeof window !== 'undefined' ? localStorage.getItem(ACCESS_KEY) : null;
  },
  get refresh() {
    return typeof window !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null;
  },
  set(access: string, refresh: string) {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = tokenStore.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, try a one-time refresh then replay the original request.
let refreshing: Promise<string | null> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retried?: boolean };
    if (error.response?.status === 401 && !original._retried && tokenStore.refresh) {
      original._retried = true;
      refreshing ??= refreshAccessToken();
      const newAccess = await refreshing;
      refreshing = null;
      if (newAccess) {
        original.headers = { ...original.headers, Authorization: `Bearer ${newAccess}` };
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);

async function refreshAccessToken(): Promise<string | null> {
  try {
    const { data } = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken: tokenStore.refresh,
    });
    const { accessToken, refreshToken } = data.data;
    tokenStore.set(accessToken, refreshToken);
    return accessToken;
  } catch {
    tokenStore.clear();
    return null;
  }
}

/** Extracts a friendly message from an Axios error. */
export function apiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { error?: string })?.error ?? err.message;
  }
  return 'Unexpected error';
}
