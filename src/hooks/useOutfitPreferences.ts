import { create } from "zustand";

export type EventType = "Marriage" | "Birthday" | "Party" | "Other";
export type TimeOfDay = "Morning" | "Night" | "Custom";
export type Season = "Summer" | "Winter" | "Spring" | "Fall";

export interface OutfitPreferences {
  event: EventType | null;
  customEvent: string;
  timeOfDay: TimeOfDay | null;
  customTime: string;
  season: Season | null;
}

interface OutfitPreferencesStore {
  preferences: OutfitPreferences;
  setEvent: (event: EventType, customEvent?: string) => void;
  setTimeOfDay: (time: TimeOfDay, customTime?: string) => void;
  setSeason: (season: Season) => void;
  resetPreferences: () => void;
  isComplete: () => boolean;
}

const initialPreferences: OutfitPreferences = {
  event: null,
  customEvent: "",
  timeOfDay: null,
  customTime: "",
  season: null,
};

export const useOutfitPreferencesStore = create<OutfitPreferencesStore>((set, get) => ({
  preferences: initialPreferences,
  
  setEvent: (event, customEvent = "") => {
    set((state) => ({
      preferences: { ...state.preferences, event, customEvent },
    }));
  },
  
  setTimeOfDay: (timeOfDay, customTime = "") => {
    set((state) => ({
      preferences: { ...state.preferences, timeOfDay, customTime },
    }));
  },
  
  setSeason: (season) => {
    set((state) => ({
      preferences: { ...state.preferences, season },
    }));
  },
  
  resetPreferences: () => {
    set({ preferences: initialPreferences });
  },
  
  isComplete: () => {
    const { event, timeOfDay, season, customEvent, customTime } = get().preferences;
    const hasEvent = event && (event !== "Other" || customEvent.trim());
    const hasTime = timeOfDay && (timeOfDay !== "Custom" || customTime.trim());
    return Boolean(hasEvent && hasTime && season);
  },
}));
