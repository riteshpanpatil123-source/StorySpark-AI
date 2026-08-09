import { axiosInstance } from './axiosInstance';
import { ApiResponse, Character } from '@/types';

export const characterApi = {
  getCharacters: async (): Promise<ApiResponse<Character[]>> => {
    const res = await axiosInstance.get('/characters');
    return res.data;
  },

  getCharacterById: async (id: string): Promise<ApiResponse<Character>> => {
    const res = await axiosInstance.get(`/characters/${id}`);
    return res.data;
  },

  createCharacter: async (data: Partial<Character>): Promise<ApiResponse<Character>> => {
    const res = await axiosInstance.post('/characters', data);
    return res.data;
  },

  updateCharacter: async (id: string, data: Partial<Character>): Promise<ApiResponse<Character>> => {
    const res = await axiosInstance.patch(`/characters/${id}`, data);
    return res.data;
  },

  deleteCharacter: async (id: string): Promise<ApiResponse<void>> => {
    const res = await axiosInstance.delete(`/characters/${id}`);
    return res.data;
  },
};
