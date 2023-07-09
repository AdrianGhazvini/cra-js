import axios from 'axios';
import jwt_decode from 'jwt-decode';
// config
import { HOST_API } from 'src/config-global';

const isTokenExpiring = (token) => {
  const decodedToken = jwt_decode(token);
  const expiresIn = decodedToken.exp;
  const currentTime = Date.now() / 1000;
  return (expiresIn - currentTime) < 60 * 10; // less than 10 minutes remaining
};

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.request.use(async config => {
  const STORAGE_KEY = 'access_token';
  const REFRESH_KEY = 'refresh_token';
  const accessToken = sessionStorage.getItem(STORAGE_KEY);

  if (accessToken && isTokenExpiring(accessToken)) {
    const refreshToken = sessionStorage.getItem(REFRESH_KEY);
    const response = await axiosInstance.post('/auth/refresh', { refresh: refreshToken });

    const { access: newAccessToken } = response.data;

    sessionStorage.setItem(STORAGE_KEY, newAccessToken);

    // Apply the new access token to the request
    config.headers.Authorization = `Bearer ${newAccessToken}`;
  }

  return config;
}, error => Promise.reject(error));

axiosInstance.interceptors.response.use(
  res => res,
  error => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

export const getUserImages = async (userId) => {
  const url = endpoints.user_images.get(userId);
  try {
    const response = await fetcher(url);
    return response;
  } catch (error) {
    console.error('Failed to fetch user images:', error);
    throw error;
  }
};

export const fetcher = async args => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.get(url, { ...config });
  return res.data;
};

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: 'http://localhost:8000/api/auth/me',
    login: 'http://localhost:8000/login/',
    register: 'http://localhost:8000/signup/',
  },
  mail: {
    list: 'http://localhost:8000/api/content/credit-check-item/',
    details: 'http://localhost:8000/api/content/dispute-reason-item/',
    labels: 'http://localhost:8000/api/content/email-template-item/',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  user_images: {
    upload: 'http://localhost:8000/api/user-images/upload/',
    get: (userId) => `http://localhost:8000/api/user-images/get/?user_id=${userId}`,
  },
};
