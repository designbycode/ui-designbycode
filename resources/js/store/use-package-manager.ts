import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

interface PackageManagerState {
    selectedManager: PackageManager;
    selectedRegistry: string;
    setSelectedManager: (manager: PackageManager) => void;
    setSelectedRegistry: (registry: string) => void;
}

export const usePackageManagerStore = create<PackageManagerState>()(
    persist(
        (set) => ({
            selectedManager: 'npm',
            selectedRegistry: 'glow-conic',
            setSelectedManager: (manager) => set({ selectedManager: manager }),
            setSelectedRegistry: (registry) =>
                set({ selectedRegistry: registry }),
        }),
        {
            name: 'package-manager-storage',
        },
    ),
);
