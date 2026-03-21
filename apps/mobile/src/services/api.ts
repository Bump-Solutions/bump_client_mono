import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../context/auth/AuthContext';

const API = axios.create({
  baseURL: 'https://api.yourdomain.com',
});

API.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) throw error;
      const { accessToken, refreshToken: newRefresh } = await refreshTokenApi(refreshToken);
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', newRefresh);
      error.config.headers['Authorization'] = `Bearer ${accessToken}`;
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);

export const loginApi = async (email: string, password: string) => {
  const { data } = await API.post('/auth/login', { email, password });
  return data; // { accessToken, refreshToken, user }
};

export const refreshTokenApi = async (refreshToken: string) => {
  const { data } = await API.post('/auth/refresh', { refreshToken });
  return data; // { accessToken, refreshToken }
};

export default API;