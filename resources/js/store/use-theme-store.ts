import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AppearanceMode = 'light' | 'dark' | 'system';

interface ThemeState {
    selectedTheme: string;
    appearance: AppearanceMode;
    setSelectedTheme: (theme: string) => void;
    setAppearance: (mode: AppearanceMode) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            selectedTheme: 'theme-default',
            appearance: 'system',
            setSelectedTheme: (theme) => set({ selectedTheme: theme }),
            setAppearance: (mode) => set({ appearance: mode }),
        }),
        {
            name: 'theme-storage',
        },
    ),
);