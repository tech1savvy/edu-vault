import axios from 'axios';
// Removed jwtDecode import

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

// Response interceptor for error handling, especially 401
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle 401 errors: clear localStorage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

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

export { adminApi, adminService };
