'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

type Appearance = 'light' | 'dark' | 'system';

const DEFAULT_APPEARANCE: Appearance = 'system';

function getStoredAppearance(): Appearance {
    if (typeof window === 'undefined') {
        return DEFAULT_APPEARANCE;
    }

    return (localStorage.getItem('appearance') as Appearance) || DEFAULT_APPEARANCE;
}

function setStoredAppearance(appearance: Appearance): void {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.setItem('appearance', appearance);
    document.cookie = `appearance=${appearance};path=/;max-age=31536000;SameSite=Lax`;
}

function prefersDark(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function isDarkMode(appearance: Appearance): boolean {
    if (appearance === 'dark') {
        return true;
    }

    if (appearance === 'light') {
        return false;
    }

    return prefersDark();
}

function applyAppearance(appearance: Appearance): void {
    if (typeof document === 'undefined') {
        return;
    }

    const isDark = isDarkMode(appearance);
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
}

const listeners = new Set<() => void>();
let currentAppearance: Appearance = DEFAULT_APPEARANCE;

function subscribe(callback: () => void) {
    listeners.add(callback);

    return () => listeners.delete(callback);
}

function notify(): void {
    listeners.forEach((listener) => listener());
}

function getClientSnapshot(): Appearance {
    return currentAppearance;
}

function getServerSnapshot(): Appearance {
    return getStoredAppearance();
}

export function useDarkMode() {
    const appearance = useSyncExternalStore(
        subscribe,
        getClientSnapshot,
        getServerSnapshot,
    );

    const isDark = useMemo(() => isDarkMode(appearance), [appearance]);

    const setAppearance = useCallback((newAppearance: Appearance) => {
        currentAppearance = newAppearance;
        setStoredAppearance(newAppearance);
        applyAppearance(newAppearance);
        notify();
    }, []);

    const toggleDarkMode = useCallback(() => {
        setAppearance(isDark ? 'light' : 'dark');
    }, [isDark, setAppearance]);

    return {
        appearance,
        isDark,
        setAppearance,
        toggleDarkMode,
    };
}

export function initializeDarkMode(): void {
    if (typeof window === 'undefined') {
        return;
    }

    currentAppearance = getStoredAppearance();
    applyAppearance(currentAppearance);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
        if (currentAppearance === 'system') {
            applyAppearance('system');
            notify();
        }
    });
}