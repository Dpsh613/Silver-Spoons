import { create } from 'zustand';

export const useChatStore = create((set) => ({
  isOpen: false,
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
}));