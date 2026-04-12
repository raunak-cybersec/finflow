import axios from 'axios';

const api = axios.create({
  baseURL: 'https://finflow-backend-qt03.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // keep this for auth/cookies if needed
});

// ✅ Add token dynamically before every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Handle errors nicely
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;