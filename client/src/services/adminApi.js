import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Assuming jwt-decode is available or will be installed

const API_URL = 'http://localhost:8000/api';

const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach the token
adminApi.interceptors.request.use(
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

// Response interceptor will be set up externally by setupAxiosInterceptors.js

// Admin-specific API calls
const adminService = {
  getJobDescriptions: () => adminApi.get('/job-descriptions'),
  getJobDescriptionById: (id) => adminApi.get(`/job-descriptions/${id}`),
  createJobDescription: (data) => adminApi.post('/job-descriptions', data),
  updateJobDescription: (id, data) => adminApi.put(`/job-descriptions/${id}`, data),
  deleteJobDescription: (id) => adminApi.delete(`/job-descriptions/${id}`),
  matchJobDescription: (id, topN = 5) => adminApi.post(`/job-descriptions/${id}/match`, { topN }),
  triggerFullSync: () => adminApi.post('/sync/all'),
};

export default adminService;
