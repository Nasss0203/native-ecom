import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';
import { getSession } from '../storage/authStorage';

const TIMEOUT = 15000;
const BASE_URL = 'https://2d4c6f25b47a.ngrok-free.app/api/v1';

console.log('🔎 AXIOS BASE_URL =', BASE_URL);
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  async config => {
    const session = await getSession();

    if (session?.access_token) {
      // đảm bảo headers tồn tại
      if (!config.headers) {
        config.headers;
      }

      // thêm Authorization
      (config.headers as any).Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  error => {
    // console.log('❌ Request Error:', error);
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  response => {
    // console.log('📥 Response:', response.data);
    return response;
  },
  async error => {
    // console.log('❌ API ERROR:', error?.response?.data);

    const originalRequest = error.config;
    const status = error?.response?.status;

    // =============================
    // 5. Tự động Refresh Token
    // =============================
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('Refresh token missing');
        }

        const res = await axios.post(`${Config.BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const newToken = res.data.accessToken;

        // Lưu token mới
        await AsyncStorage.setItem('accessToken', newToken);

        // Gắn token mới vào header của request cũ
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return instance(originalRequest);
      } catch (refreshError) {
        // console.log('❌ Refresh token failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
