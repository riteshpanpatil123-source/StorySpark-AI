import { axiosInstance } from './axiosInstance';
import { ApiResponse, User } from '@/types';

export const authApi = {
  login: async (credentials: Record<string, string>): Promise<ApiResponse<{ user: User; accessToken: string }>> => {
    const res = await axiosInstance.post('/auth/login', credentials);
    return res.data;
  },

  register: async (userData: Record<string, string>): Promise<ApiResponse<{ user: User; accessToken: string }>> => {
    const res = await axiosInstance.post('/auth/register', userData);
    return res.data;
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const res = await axiosInstance.post('/auth/logout');
    return res.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const res = await axiosInstance.get('/auth/me');
    return res.data;
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const res = await axiosInstance.patch('/users/profile', data);
    return res.data;
  },

  googleLogin: async (idToken: string): Promise<ApiResponse<{ user: User; accessToken: string }>> => {
    const res = await axiosInstance.post('/auth/google', { idToken });
    return res.data;
  }
};
