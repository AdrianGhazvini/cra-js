// api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/', // Replace with your own API's base URL
});

api.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
            // eslint-disable-next-line dot-notation
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        Promise.reject(error)
    });


export default api;
