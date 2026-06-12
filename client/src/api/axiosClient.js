import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:3000/api' : '/api',
  withCredentials: true, // Required for cookies (refresh token)
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // We will retrieve the access token from localStorage for now
    // In production it might be kept in memory
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401s (token expiration)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Special handling for rotate token loop prevention
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/refresh-token' && originalRequest.url !== '/login') {
      originalRequest._retry = true;
      try {
        const res = await api.get('/refresh-token');
        const newAccessToken = res.data.payload.accessToken;
        
        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        return api(originalRequest);
      } catch (refreshErr) {
        // Refresh token failed, meaning session is completely expired
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
