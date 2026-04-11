import axios from 'axios';

const api = axios.create({
 baseURL: 'https://finflow-backend-qt03.onrender.com/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
