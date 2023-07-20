import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

export const AUTH_COOKIE = 'authtoken';

const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    timeout: 15000,
  });

  // Read the cookie per request: a token captured when this module loaded would be stale after sign-in.
  instance.interceptors.request.use((config) => {
    const token = Cookies.get(AUTH_COOKIE);

    if (token) {
      config.headers.authtoken = token;
    } else {
      delete config.headers.authtoken;
    }

    return config;
  });

  return instance;
};

export const baseService = createApiClient();
