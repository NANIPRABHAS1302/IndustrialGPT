import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  clearAuthSession,
  forgotPassword,
  loginUser,
  logoutUser,
  readStoredSession,
  refreshToken,
  resetPassword,
  type AuthSession,
  type ForgotPasswordPayload,
  type LoginPayload,
  type ResetPasswordPayload
} from '@/features/auth/services/authService';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  isAuthenticated: boolean;
  status: AuthStatus;
  user: AuthSession['user'] | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (payload: ForgotPasswordPayload) => Promise<void>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const navigate = useNavigate();

  useEffect(() => {
    const storedSession = readStoredSession();
    if (storedSession) {
      setSession(storedSession);
      setStatus('authenticated');
      return;
    }

    setStatus('unauthenticated');
  }, []);

  async function handleLogin(payload: LoginPayload) {
    setStatus('loading');
    try {
      const nextSession = await loginUser(payload);
      setSession(nextSession);
      setStatus('authenticated');
    } catch (error) {
      setStatus('unauthenticated');
      throw error;
    }
  }

  async function handleLogout() {
    setStatus('loading');
    try {
      await logoutUser();
    } finally {
      clearAuthSession();
      setSession(null);
      setStatus('unauthenticated');
      navigate('/login', { replace: true });
    }
  }

  async function handleResetPassword(payload: ResetPasswordPayload) {
    setStatus('loading');
    try {
      await resetPassword(payload);
    } finally {
      setStatus(session ? 'authenticated' : 'unauthenticated');
    }
  }

  async function handleRequestPasswordReset(payload: ForgotPasswordPayload) {
    setStatus('loading');
    try {
      await forgotPassword(payload);
    } finally {
      setStatus(session ? 'authenticated' : 'unauthenticated');
    }
  }

  useEffect(() => {
    if (!session?.refreshToken) {
      return;
    }

    const timer = window.setTimeout(() => {
      void refreshToken(session.refreshToken)
        .then((nextSession) => {
          setSession(nextSession);
        })
        .catch(() => {
          void handleLogout();
        });
    }, 1000 * 60 * 50);

    return () => window.clearTimeout(timer);
  }, [session?.refreshToken]);

  const value = useMemo(
    () => ({
      isAuthenticated: status === 'authenticated' && Boolean(session),
      status,
      user: session?.user ?? null,
      login: handleLogin,
      logout: handleLogout,
      requestPasswordReset: handleRequestPasswordReset,
      resetPassword: handleResetPassword
    }),
    [session, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
