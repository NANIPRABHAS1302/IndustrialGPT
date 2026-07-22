import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
  passwordConfirmation: string;
};

const STORAGE_KEYS = {
  accessToken: 'auth_token',
  refreshToken: 'refresh_token',
  user: 'auth_user'
} as const;

export function persistAuthSession(session: AuthSession, rememberMe: boolean) {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(STORAGE_KEYS.accessToken, session.accessToken);
  storage.setItem(STORAGE_KEYS.refreshToken, session.refreshToken);
  storage.setItem(STORAGE_KEYS.user, JSON.stringify(session.user));

  if (!rememberMe) {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.user);
  }
}

export function readStoredSession(): AuthSession | null {
  const accessToken = sessionStorage.getItem(STORAGE_KEYS.accessToken) ?? localStorage.getItem(STORAGE_KEYS.accessToken);
  const refreshToken = sessionStorage.getItem(STORAGE_KEYS.refreshToken) ?? localStorage.getItem(STORAGE_KEYS.refreshToken);
  const storedUser = sessionStorage.getItem(STORAGE_KEYS.user) ?? localStorage.getItem(STORAGE_KEYS.user);

  if (!accessToken || !refreshToken || !storedUser) {
    return null;
  }

  try {
    return {
      accessToken,
      refreshToken,
      user: JSON.parse(storedUser) as AuthUser
    };
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.user);
  sessionStorage.removeItem(STORAGE_KEYS.accessToken);
  sessionStorage.removeItem(STORAGE_KEYS.refreshToken);
  sessionStorage.removeItem(STORAGE_KEYS.user);
}

export async function loginUser(payload: LoginPayload) {
  const { email, password, rememberMe } = payload;
  const response = await apiClient.post<{ access_token: string; refresh_token: string; user?: AuthUser }>(
    endpoints.auth.login,
    { email, password }
  );

  const user: AuthUser = response.data.user ?? {
    id: 'user-admin',
    name: 'Admin User',
    email,
    role: 'Admin'
  };

  const session: AuthSession = {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    user
  };

  persistAuthSession(session, rememberMe ?? false);

  return session;
}

export async function logoutUser() {
  clearAuthSession();
  await apiClient.post(endpoints.auth.logout);
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  return apiClient.post(endpoints.auth.forgotPassword, payload);
}

export async function resetPassword(payload: ResetPasswordPayload) {
  return apiClient.post(endpoints.auth.resetPassword, payload);
}

export async function refreshToken(refreshToken: string) {
  const response = await apiClient.post<{ access_token: string; refresh_token: string; user: AuthUser }>(
    endpoints.auth.refresh,
    { refresh_token: refreshToken }
  );

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    user: response.data.user
  } satisfies AuthSession;
}
