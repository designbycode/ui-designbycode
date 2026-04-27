import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/use-theme-store';

function ThemeToggle({ className }: { className?: string }) {
    const { appearance, setAppearance } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const isDark =
            appearance === 'dark' ||
            (appearance === 'system' &&
                window.matchMedia('(prefers-color-scheme: dark)').matches);

        document.documentElement.classList.toggle('dark', isDark);
    }, [appearance]);

    useEffect(() => {
        const handleAppearanceChange = () => {
            window.dispatchEvent(new CustomEvent('theme-appearance-changed'));
        };

        window.addEventListener('theme-appearance-changed', handleAppearanceChange);
        const interval = setInterval(handleAppearanceChange, 500);

        return () => {
            window.removeEventListener(
                'theme-appearance-changed',
                handleAppearanceChange,
            );
            clearInterval(interval);
        };
    }, []);

    const toggleTheme = () => {
        const newMode = appearance === 'dark' ? 'light' : 'dark';
        setAppearance(newMode);
        document.cookie = `appearance=${newMode};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`;
        document.documentElement.style.colorScheme = newMode === 'dark' ? 'dark' : 'light';
    };

    const isDark =
        mounted &&
        (appearance === 'dark' ||
            (appearance === 'system' &&
                window.matchMedia('(prefers-color-scheme: dark)').matches));

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