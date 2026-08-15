import type { ApiResponse, User } from '@washcut/shared';

const TOKEN_KEY = 'washcut.token';
const USER_KEY = 'washcut.user';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setSession(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export async function login(email: string, password: string): Promise<ApiResponse<{ accessToken: string; user: User }>> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok || !json.ok) throw json as ApiResponse<never>;
  setSession(json.data.accessToken, json.data.user);
  return json as ApiResponse<{ accessToken: string; user: User }>;
}

export async function authFetch<T>(path: string, opts: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(path, {
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(opts.headers || {}),
      },
    });
  } catch {
    throw { ok: false, error: { code: 'NETWORK', message: 'Tidak dapat terhubung ke server' } } as ApiResponse<never>;
  }
  const json = await res.json();
  if (!res.ok || !json.ok) throw json as ApiResponse<never>;
  return json as ApiResponse<T>;
}
