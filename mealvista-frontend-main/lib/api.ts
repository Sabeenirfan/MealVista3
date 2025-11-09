import axios from 'axios';
import Constants from 'expo-constants';

import { getStoredToken } from './authStorage';

const getBaseURL = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL
    || Constants.expoConfig?.extra?.apiUrl
    || Constants.manifest2?.extra?.apiUrl;

  if (envUrl) {
    return envUrl;
  }

  // Default fallback for local development
  return 'http://localhost:5000';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await getStoredToken();

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

export default api;









