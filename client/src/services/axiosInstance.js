import axios from 'axios';

const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const normalizedBase = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

const axiosInstance = axios.create({
  baseURL: normalizedBase.endsWith('/api') ? normalizedBase : `${normalizedBase}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
