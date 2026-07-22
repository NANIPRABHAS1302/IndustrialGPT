export const endpoints = {
  dashboard: '/dashboard',
  chat: '/chat',
  documents: '/documents',
  graph: '/graph',
  maintenance: '/maintenance',
  analytics: '/analytics',
  settings: '/settings',
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    refresh: '/auth/refresh'
  }
} as const;
