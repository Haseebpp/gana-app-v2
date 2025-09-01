import axios from "axios";

const baseURL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({ baseURL, withCredentials: true });

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers || {};
    (config.headers as any)["Authorization"] = `Bearer ${authToken}`;
  }
  return config;
});

export type User = { id: string; name: string; number: string };
export type AuthResponse = { token: string; user: User };

export async function register(payload: { name: string; number: string; password: string }): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(`/auth/register`, payload);
  return data;
}

export async function login(payload: { number: string; password: string }): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(`/auth/login`, payload);
  return data;
}

export async function me(): Promise<{ user: User }> {
  const { data } = await api.get<{ user: User }>(`/auth/me`);
  return data;
}
