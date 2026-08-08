import { axiosInstance } from './axiosInstance';
import { ApiResponse, Story, StoryChapter } from '@/types';

export const storyApi = {
  getStories: async (params?: Record<string, string | number>): Promise<ApiResponse<Story[]>> => {
    const res = await axiosInstance.get('/stories', { params });
    return res.data;
  },

  getPublicStories: async (params?: Record<string, string | number>): Promise<ApiResponse<Story[]>> => {
    const res = await axiosInstance.get('/stories', { params: { isPublic: 'true', ...params } });
    return res.data;
  },

  getStoryById: async (id: string): Promise<ApiResponse<Story & { chapters?: StoryChapter[] }>> => {
    const res = await axiosInstance.get(`/stories/${id}`);
    return res.data;
  },

  createStory: async (data: Partial<Story>): Promise<ApiResponse<Story>> => {
    const res = await axiosInstance.post('/stories', data);
    return res.data;
  },

  updateStory: async (id: string, data: Partial<Story>): Promise<ApiResponse<Story>> => {
    const res = await axiosInstance.patch(`/stories/${id}`, data);
    return res.data;
  },

  deleteStory: async (id: string): Promise<ApiResponse<void>> => {
    const res = await axiosInstance.delete(`/stories/${id}`);
    return res.data;
  },

  publishStory: async (id: string): Promise<ApiResponse<Story>> => {
    const res = await axiosInstance.post(`/stories/${id}/publish`);
    return res.data;
  },

  likeStory: async (id: string): Promise<ApiResponse<{ liked: boolean; likeCount: number }>> => {
    const res = await axiosInstance.post(`/stories/${id}/like`);
    return res.data;
  },

  bookmarkStory: async (id: string): Promise<ApiResponse<{ bookmarked: boolean }>> => {
    const res = await axiosInstance.post(`/stories/${id}/bookmark`);
    return res.data;
  }
};
