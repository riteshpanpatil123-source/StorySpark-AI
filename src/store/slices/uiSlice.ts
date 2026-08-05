import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isSidebarOpen: boolean;
  isCommandPaletteOpen: boolean;
  activeModal: string | null;
  activeModalData: any;
}

const initialState: UIState = {
  isSidebarOpen: true,
  isCommandPaletteOpen: false,
  activeModal: null,
  activeModalData: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    toggleCommandPalette: (state) => {
      state.isCommandPaletteOpen = !state.isCommandPaletteOpen;
    },
    setCommandPaletteOpen: (state, action: PayloadAction<boolean>) => {
      state.isCommandPaletteOpen = action.payload;
    },
    openModal: (state, action: PayloadAction<{ modalId: string; data?: any }>) => {
      state.activeModal = action.payload.modalId;
      state.activeModalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.activeModalData = null;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleCommandPalette,
  setCommandPaletteOpen,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
