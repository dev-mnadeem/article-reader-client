import axios, { AxiosError, AxiosInstance } from 'axios';

import { tokenStore } from './tokenStore';

const HTTP_UNAUTHORIZED = 401;

/**
 * `REACT_APP_API_URL` is inlined at build time. Falling back to a same-origin
 * `/api` keeps the bundle working behind a reverse proxy, and keeps a missing
 * variable from producing the classic `undefined/api` base URL.
 */
export const apiBaseUrl = process.env.REACT_APP_API_URL || '/api';

type UnauthorizedHandler = () => void;

const unauthorizedHandlers = new Set<UnauthorizedHandler>();

/**
 * Lets the auth layer react to an expired or rejected token without the HTTP
 * client importing React. Returns an unsubscribe function.
 */
export const onUnauthorized = (handler: UnauthorizedHandler): (() => void) => {
  unauthorizedHandlers.add(handler);

  return () => {
    unauthorizedHandlers.delete(handler);
  };
};

export const createHttpClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: apiBaseUrl,
    headers: { 'Content-Type': 'application/json' },
  });

  // The token is read per request, not once at module load: it does not exist
  // yet when this module is first imported, and it changes on sign in/out.
  instance.interceptors.request.use((config) => {
    const token = tokenStore.read();

    if (token) {
      config.headers.set('authtoken', token);
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === HTTP_UNAUTHORIZED) {
        tokenStore.clear();
        unauthorizedHandlers.forEach((handler) => handler());
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const httpClient = createHttpClient();
