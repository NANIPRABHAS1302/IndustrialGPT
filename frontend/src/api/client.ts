import axios from 'axios';
import { config } from '@/config/env';

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((request) => {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('auth_token') : null;

  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }

  return request;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('auth_token');
      }
    }

    return Promise.reject(error);
  }
);
