import { axiosInstance } from './axiosInstance';
import { ApiResponse, World } from '@/types';

export const worldApi = {
  getWorlds: async (): Promise<ApiResponse<World[]>> => {
    const res = await axiosInstance.get('/worlds');
    return res.data;
  },

  getWorldById: async (id: string): Promise<ApiResponse<World>> => {
    const res = await axiosInstance.get(`/worlds/${id}`);
    return res.data;
  },

  createWorld: async (data: Partial<World>): Promise<ApiResponse<World>> => {
    const res = await axiosInstance.post('/worlds', data);
    return res.data;
  },

  updateWorld: async (id: string, data: Partial<World>): Promise<ApiResponse<World>> => {
    const res = await axiosInstance.patch(`/worlds/${id}`, data);
    return res.data;
  },

  deleteWorld: async (id: string): Promise<ApiResponse<void>> => {
    const res = await axiosInstance.delete(`/worlds/${id}`);
    return res.data;
  },
};
