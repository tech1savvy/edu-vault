import adminApi from '../services/adminApi';

const setupAxiosInterceptors = (logout) => {
  adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        logout(); // Clear authentication state
        window.location.href = '/login'; // Redirect to login page
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
