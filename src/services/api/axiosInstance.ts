import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For HttpOnly refresh token cookies
});

// Request Interceptor: Attach Access Token from Local/Redux Storage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors & Token Refresh Logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Token Expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
        const newToken = refreshResponse.data.data.accessToken;
        
        localStorage.setItem('access_token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token failed -> Logout user
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Display Error Toast for Server or Network Errors
    if (error.code === 'ERR_NETWORK' || !error.response) {
      toast.error('Backend API server unavailable. Operating in local sandbox mode.');
    } else {
      const errorMessage = error.response?.data?.error?.message || error.message || 'An unexpected error occurred';
      if (error.response?.status !== 401) {
        toast.error(errorMessage);
      }
    }

    return Promise.reject(error);
  }
);
