import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

// Function to create Axios instance
const apiService = (): AxiosInstance => {
  // Default options for Axios instance
  const defaultOptions = {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      authtoken: Cookies.get('authtoken'),
    },
  };
  // Creating Axios instance
  const instance = axios.create(defaultOptions);

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = Cookies.get('authtoken');

      if (token) {
        config.headers.authtoken = token;
      } else {
        delete config.headers.authtoken;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (err) => Promise.reject(err)
  );

  return instance;
};

// Exporting base Axios instance
export const baseService = apiService();
