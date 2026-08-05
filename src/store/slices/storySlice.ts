import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Story } from '@/types';

interface StoryState {
  stories: Story[];
  currentStory: Story | null;
  activeGenreFilter: string;
  searchQuery: string;
  isLoading: boolean;
}

const initialState: StoryState = {
  stories: [],
  currentStory: null,
  activeGenreFilter: 'All',
  searchQuery: '',
  isLoading: false,
};

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setStories: (state, action: PayloadAction<Story[]>) => {
      state.stories = action.payload;
    },
    setCurrentStory: (state, action: PayloadAction<Story | null>) => {
      state.currentStory = action.payload;
    },
    setGenreFilter: (state, action: PayloadAction<string>) => {
      state.activeGenreFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setStories, setCurrentStory, setGenreFilter, setSearchQuery, setLoading } = storySlice.actions;
export default storySlice.reducer;
