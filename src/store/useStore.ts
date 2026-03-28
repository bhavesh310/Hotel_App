import { create } from 'zustand';

interface AppState {
  selectedVibe: string | null;
  searchQuery: string;
  guestCount: number;
  setVibe: (vibe: string | null) => void;
  setSearchQuery: (q: string) => void;
  setGuestCount: (count: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedVibe: null,
  searchQuery: '',
  guestCount: 2,
  setVibe: (vibe) => set({ selectedVibe: vibe }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setGuestCount: (count) => set({ guestCount: count }),
}));
