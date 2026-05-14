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
  // Drives
  getDrives: () => adminApi.get('/drives'),
  getDriveById: (id) => adminApi.get(`/drives/${id}`),
  createDrive: (data) => adminApi.post('/drives', data),
  updateDrive: (id, data) => adminApi.put(`/drives/${id}`, data),
  deleteDrive: (id) => adminApi.delete(`/drives/${id}`),
  updateDriveStatus: (id, status) => adminApi.put(`/drives/${id}/status`, { status }),
  getDriveStats: (id) => adminApi.get(`/drives/${id}/stats`),

  // Drive Applications (Kanban)
  getDriveApplications: (driveId) => adminApi.get(`/applications/stages/drive/${driveId}`),
  moveToStage: (applicationId, stageId) => adminApi.post(`/applications/stages/${applicationId}/stage`, { stageId }),
  updateStageStatus: (applicationId, stageId, status, notes) => adminApi.put(`/applications/stages/${applicationId}/stage/${stageId}`, { status, notes }),

  // Global Applications
  getAllApplications: () => adminApi.get('/applications/all'),

  // Notifications (admin can view own)
  getNotifications: () => adminApi.get('/notifications'),
  getUnreadNotificationCount: () => adminApi.get('/notifications/unread-count'),
  markNotificationRead: (id) => adminApi.put(`/notifications/${id}/read`),
  deleteNotification: (id) => adminApi.delete(`/notifications/${id}`),

  // Job descriptions
  getJobDescriptions: () => adminApi.get('/job-descriptions'),
  getJobDescriptionById: (id) => adminApi.get(`/job-descriptions/${id}`),
  createJobDescription: (data) => adminApi.post('/job-descriptions', data),
  updateJobDescription: (id, data) => adminApi.put(`/job-descriptions/${id}`, data),
  deleteJobDescription: (id) => adminApi.delete(`/job-descriptions/${id}`),
  matchJobDescription: (id, topN = 5) => adminApi.post(`/job-descriptions/${id}/match`, { topN }),
  triggerFullSync: () => adminApi.post('/sync/all'),

  // User management
  getUsers: (page = 1, limit = 20) => adminApi.get('/users', { params: { page, limit } }),
  getUserById: (id) => adminApi.get(`/users/${id}`),
  updateUserRole: (id, role) => adminApi.put(`/users/${id}/role`, { role }),
  updateUserStatus: (id, status) => adminApi.put(`/users/${id}/status`, { status }),

  // Analytics
  getAnalytics: () => adminApi.get('/analytics/dashboard'),
};

export { adminApi, adminService };
