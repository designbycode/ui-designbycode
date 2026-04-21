import { Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

function ThemeToggle({ className }: { className?: string }) {
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        const newMode = resolvedAppearance === 'dark' ? 'light' : 'dark';
        updateAppearance(newMode);
    };

    return (
        <button
            className={className}
            onClick={toggleTheme}
            type="button"
            aria-label={`Switch to ${resolvedAppearance === 'dark' ? 'light' : 'dark'} mode`}
        >
            {resolvedAppearance === 'dark' ? (
                <Moon className="size-4" />
            ) : (
                <Sun className="size-4" />
            )}
        </button>
    );
}

export default ThemeToggle;
