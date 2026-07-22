import { beforeEach, describe, expect, it } from 'vitest';
import { clearAuthSession, persistAuthSession, readStoredSession } from './authService';

describe('authService persistence helpers', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('persists a session in localStorage when remember me is enabled', () => {
    persistAuthSession(
      {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: '1',
          name: 'Ada Lovelace',
          email: 'ada@example.com',
          role: 'admin'
        }
      },
      true
    );

    expect(localStorage.getItem('auth_token')).toBe('access-token');
    expect(localStorage.getItem('refresh_token')).toBe('refresh-token');
    expect(sessionStorage.getItem('auth_token')).toBeNull();
  });

  it('reads a stored session from sessionStorage when remember me is false', () => {
    sessionStorage.setItem('auth_token', 'session-token');
    sessionStorage.setItem('refresh_token', 'session-refresh');
    sessionStorage.setItem('auth_user', JSON.stringify({ id: '1', name: 'Ada', email: 'ada@example.com', role: 'admin' }));

    const session = readStoredSession();

    expect(session?.accessToken).toBe('session-token');
    expect(session?.refreshToken).toBe('session-refresh');
    expect(session?.user?.name).toBe('Ada');
  });

  it('removes persisted tokens and user data on logout', () => {
    persistAuthSession(
      {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: '1',
          name: 'Ada Lovelace',
          email: 'ada@example.com',
          role: 'admin'
        }
      },
      true
    );

    clearAuthSession();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
  });
});
