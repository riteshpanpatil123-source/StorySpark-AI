import { axiosInstance } from './axiosInstance';
import { ApiResponse, AIGenerateStoryPayload, AIGenerateJokePayload, AIWritingCoachPayload, AIWritingCoachResponse, Story, Joke } from '@/types';

export const aiApi = {
  generateStory: async (payload: AIGenerateStoryPayload): Promise<ApiResponse<{ story: Story; chapterContent: string }>> => {
    const res = await axiosInstance.post('/ai/generate-story', payload);
    return res.data;
  },

  generateJoke: async (payload: AIGenerateJokePayload): Promise<ApiResponse<Joke>> => {
    const res = await axiosInstance.post('/ai/generate-joke', payload);
    return res.data;
  },

  analyzeWriting: async (payload: AIWritingCoachPayload): Promise<ApiResponse<AIWritingCoachResponse>> => {
    const res = await axiosInstance.post('/ai/writing-coach', payload);
    return res.data;
  },

  generateImage: async (payload: { prompt: string; aspectRatio?: string }): Promise<ApiResponse<{ imageUrl: string }>> => {
    const res = await axiosInstance.post('/ai/generate-image', payload);
    return res.data;
  },

  generateVoiceNarration: async (payload: { text: string; voice: string }): Promise<ApiResponse<{ audioUrl: string }>> => {
    const res = await axiosInstance.post('/ai/generate-voice', payload);
    return res.data;
  }
};
