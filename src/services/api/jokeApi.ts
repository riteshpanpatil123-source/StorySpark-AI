import { axiosInstance } from './axiosInstance';
import { ApiResponse, Joke } from '@/types';

export const jokeApi = {
  getJokes: async (): Promise<ApiResponse<Joke[]>> => {
    const res = await axiosInstance.get('/jokes');
    return res.data;
  },

  createJoke: async (data: Partial<Joke>): Promise<ApiResponse<Joke>> => {
    const res = await axiosInstance.post('/jokes', data);
    return res.data;
  },
};
