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
  
export const getUserLetters = async (userId) => {
  const url = endpoints.letter.get(userId);
  try {
    const response = await fetcher(url);
    return response;
  } catch (error) {
    console.error('Failed to fetch user letters:', error);
    throw error;
  }
};

export const fetcher = async args => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.get(url, { ...config });
  return res.data;
};

export const endpoints = {
  auth: {
    me: 'http://localhost:8000/api/auth/me',
    login: 'http://localhost:8000/api/auth/login/',
    register: 'http://localhost:8000/api/auth/signup/',
    logout: 'http://localhost:8000/api/auth/logout/',
  },
  mail: {
    list: 'http://localhost:8000/api/content/credit-check-item/',
    details: 'http://localhost:8000/api/content/dispute-reason-item/',
    labels: 'http://localhost:8000/api/content/email-template-item/',
  },
  user_images: {
    upload: 'http://localhost:8000/api/user-images/upload/',
    get: (userId) => `http://localhost:8000/api/user-images/get/?user_id=${userId}`,
  },
  letter: {
    save: 'http://localhost:8000/api/content/save-letter/',
    get: (userId) => `http://localhost:8000/api/content/get-letters/?user_id=${userId}`,
    delete: 'http://localhost:8000/api/content/delete-letter/',
    update_letter: 'http://localhost:8000/api/content/update-letter/',
    update_letter_sent_status: 'http://localhost:8000/api/content/update-letter-sent-status/',
  },
  support: {
    send: 'http://localhost:8000/api/support/send/',
  }
};
