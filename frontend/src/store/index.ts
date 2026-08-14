import { create } from 'zustand';

interface AppState {
  currentSeason: number;
  selectedDriver: string | null;
  setSelectedDriver: (driverId: string | null) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  currentSeason: new Date().getFullYear(),
  selectedDriver: null,
  setSelectedDriver: (driverId) => set({ selectedDriver: driverId }),
}));
