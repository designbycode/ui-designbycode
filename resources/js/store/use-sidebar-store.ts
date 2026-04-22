import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SidebarSection = 'platform' | 'admin';

interface SidebarState {
    activeSection: SidebarSection;
    setActiveSection: (section: SidebarSection) => void;
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set) => ({
            activeSection: 'platform',
            setActiveSection: (section) => set({ activeSection: section }),
        }),
        {
            name: 'sidebar-storage',
        },
    ),
);
