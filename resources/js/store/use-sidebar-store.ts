import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SidebarSection = 'platform' | 'admin';

interface SidebarState {
    isOpen: boolean;
    activeSection: SidebarSection;
    setIsOpen: (open: boolean) => void;
    toggleSidebar: () => void;
    setActiveSection: (section: SidebarSection) => void;
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set) => ({
            isOpen: true,
            activeSection: 'platform',
            setIsOpen: (open) => set({ isOpen: open }),
            toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
            setActiveSection: (section) => set({ activeSection: section }),
        }),
        {
            name: 'sidebar-storage',
        },
    ),
);
