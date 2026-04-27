'use client';

import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/hooks/use-dark-mode';

function ThemeToggle({ className }: { className?: string }) {
    const { isDark, toggleDarkMode } = useDarkMode();

    return (
        <button
            className={className}
            onClick={toggleDarkMode}
            type="button"
            suppressHydrationWarning
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            {isDark ? (
                <Sun className="size-4" />
            ) : (
                <Moon className="size-4" />
            )}
        </button>
    );
}

export default ThemeToggle;