import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

function ThemeToggle({ className }: { className?: string }) {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('appearance') ?? 'system';
        const dark =
            stored === 'dark' ||
            (stored === 'system' &&
                window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDark(dark);
    }, []);

    const toggleTheme = () => {
        const newMode = isDark ? 'light' : 'dark';
        localStorage.setItem('appearance', newMode);
        document.cookie = `appearance=${newMode};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`;
        document.documentElement.classList.toggle('dark', newMode === 'dark');
        document.documentElement.style.colorScheme =
            newMode === 'dark' ? 'dark' : 'light';
        setIsDark(!isDark);
    };

    return (
        <button
            className={className}
            onClick={toggleTheme}
            type="button"
            suppressHydrationWarning
            aria-label={
                mounted
                    ? `Switch to ${isDark ? 'light' : 'dark'} mode`
                    : 'Toggle theme'
            }
        >
            {!mounted ? (
                <Sun className="size-4" />
            ) : isDark ? (
                <Moon className="size-4" />
            ) : (
                <Sun className="size-4" />
            )}
        </button>
    );
}

export default ThemeToggle;
