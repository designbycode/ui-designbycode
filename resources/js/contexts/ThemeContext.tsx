import type { ReactNode } from 'react';
import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import type { Theme, ThemeColors, ThemeContextValue, ThemeStyle } from '@/types/theme';

interface ThemeProviderProps {
    children: ReactNode;
    initialThemes?: Theme[];
    initialThemeName?: string;
}

/* eslint-disable react-hooks/set-state-in-effect */
function setStoredThemeName(name: string): void {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.setItem('selected-theme', name);
    document.cookie = `selected-theme=${name};path=/;max-age=31536000;SameSite=Lax`;
}

function generateThemeCSS(theme: Theme): string {
    const lightColors = theme.cssVars?.light as ThemeColors | undefined;
    const darkColors = theme.cssVars?.dark as ThemeColors | undefined;
    const themeStyle = theme.cssVars?.theme as ThemeStyle | undefined;

    const varsToCss = (vars: Record<string, string | undefined>): string => {
        return Object.entries(vars || {})
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => `  --${key}: ${value};`)
            .join('\n');
    };

    const lightCss = varsToCss({ ...lightColors, ...themeStyle });
    const darkCss = varsToCss(darkColors || {});

    return `:root {
${lightCss}
}

.dark {
${darkCss}
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
    children,
    initialThemes = [],
    initialThemeName: initialThemeNameProp,
}: ThemeProviderProps) {
    const [themes, setThemes] = useState<Theme[]>(initialThemes);
    const [selectedThemeName, setSelectedThemeName] = useState<string>(() =>
        initialThemeNameProp || 'theme-default',
    );
    const [isClient, setIsClient] = useState(false);

    const currentTheme = useMemo(() => {
        if (selectedThemeName === 'theme-default') {
            return null;
        }

        return themes.find((t) => t.name === selectedThemeName) || null;
    }, [themes, selectedThemeName]);

    const themeCSS = useMemo(() => {
        if (!currentTheme || !currentTheme.cssVars) {
            return '';
        }

        return generateThemeCSS(currentTheme);
    }, [currentTheme]);

    const handleSetTheme = useCallback((name: string) => {
        setSelectedThemeName(name);
        setStoredThemeName(name);
    }, []);

    useEffect(() => {
        if (initialThemes.length > 0) {
            return;
        }

        async function fetchThemes() {
            try {
                const response = await fetch('/api/themes');

                if (response.ok) {
                    const data = await response.json();
                    setThemes(data);
                }
            } catch (error) {
                console.error('Failed to fetch themes:', error);
            }
        }

        fetchThemes();
    }, [initialThemes.length]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'selected-theme' && e.newValue) {
                setSelectedThemeName(e.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const value = useMemo<ThemeContextValue>(
        () => ({
            themes,
            currentTheme,
            selectedThemeName,
            setTheme: handleSetTheme,
            appearance: 'system',
            setAppearance: () => {},
            isDark: false,
        }),
        [themes, currentTheme, selectedThemeName, handleSetTheme],
    );

    return (
        <ThemeContext.Provider value={value}>
            <div data-theme={selectedThemeName}>
                {isClient && themeCSS && <style>{themeCSS}</style>}
                {children}
            </div>
        </ThemeContext.Provider>
    );
}