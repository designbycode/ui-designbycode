import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

interface PackageManagerState {
    selectedManager: PackageManager;
    setSelectedManager: (manager: PackageManager) => void;
}

export const usePackageManagerStore = create<PackageManagerState>()(
    persist(
        (set) => ({
            selectedManager: 'npm',
            setSelectedManager: (manager) => set({ selectedManager: manager }),
        }),
        {
            name: 'package-manager-storage',
        },
    ),
);
