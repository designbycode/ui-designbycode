import { useEffect, useRef } from 'react';
import { useThemeStore } from '@/store/use-theme-store';

interface ThemeCssVars {
    background?: string;
    foreground?: string;
    card?: string;
    'card-foreground'?: string;
    popover?: string;
    'popover-foreground'?: string;
    primary?: string;
    'primary-foreground'?: string;
    secondary?: string;
    'secondary-foreground'?: string;
    muted?: string;
    'muted-foreground'?: string;
    accent?: string;
    'accent-foreground'?: string;
    destructive?: string;
    'destructive-foreground'?: string;
    border?: string;
    input?: string;
    ring?: string;
    'chart-1'?: string;
    'chart-2'?: string;
    'chart-3'?: string;
    'chart-4'?: string;
    'chart-5'?: string;
    radius?: string;
    sidebar?: string;
    'sidebar-foreground'?: string;
    'sidebar-primary'?: string;
    'sidebar-primary-foreground'?: string;
    'sidebar-accent'?: string;
    'sidebar-accent-foreground'?: string;
    'sidebar-border'?: string;
    'sidebar-ring'?: string;
    'font-sans'?: string;
    'font-serif'?: string;
    'font-mono'?: string;
    'shadow-2xs'?: string;
    'shadow-xs'?: string;
    'shadow-sm'?: string;
    shadow?: string;
    'shadow-md'?: string;
    'shadow-lg'?: string;
    'shadow-xl'?: string;
    'shadow-2xl'?: string;
    [key: string]: string | undefined;
}
interface ThemeConfig {
    theme?: {
        'font-sans'?: string;
        'font-serif'?: string;
        'font-mono'?: string;
        radius?: string;
        'shadow-color'?: string;
        'shadow-opacity'?: string;
        'shadow-blur'?: string;
        'shadow-spread'?: string;
        'shadow-offset-x'?: string;
        'shadow-offset-y'?: string;
        [key: string]: string | undefined;
    };
    light?: ThemeCssVars;
    dark?: ThemeCssVars;
    registryDependencies?: string[];
    cssVars?: ThemeConfig;
}

interface DefaultThemeVars {
    light: ThemeCssVars;
    dark: ThemeCssVars;
}

const DEFAULT_THEME: DefaultThemeVars = {
    light: {
        background: 'oklch(1 0 0)',
        foreground: 'oklch(0.145 0 0)',
        card: 'oklch(1 0 0)',
        'card-foreground': 'oklch(0.145 0 0)',
        popover: 'oklch(1 0 0)',
        'popover-foreground': 'oklch(0.145 0 0)',
        primary: 'oklch(0.205 0 0)',
        'primary-foreground': 'oklch(0.985 0 0)',
        secondary: 'oklch(0.97 0 0)',
        'secondary-foreground': 'oklch(0.205 0 0)',
        muted: 'oklch(0.97 0 0)',
        'muted-foreground': 'oklch(0.556 0 0)',
        accent: 'oklch(0.97 0 0)',
        'accent-foreground': 'oklch(0.205 0 0)',
        destructive: 'oklch(0.577 0.245 27.325)',
        'destructive-foreground': 'oklch(0.577 0.245 27.325)',
        border: 'oklch(0.922 0 0)',
        input: 'oklch(0.922 0 0)',
        ring: 'oklch(0.87 0 0)',
        'chart-1': 'oklch(0.646 0.222 41.116)',
        'chart-2': 'oklch(0.6 0.118 184.704)',
        'chart-3': 'oklch(0.398 0.07 227.392)',
        'chart-4': 'oklch(0.828 0.189 84.429)',
        'chart-5': 'oklch(0.769 0.188 70.08)',
        radius: '0.625rem',
        sidebar: 'oklch(0.985 0 0)',
        'sidebar-foreground': 'oklch(0.145 0 0)',
        'sidebar-primary': 'oklch(0.205 0 0)',
        'sidebar-primary-foreground': 'oklch(0.985 0 0)',
        'sidebar-accent': 'oklch(0.97 0 0)',
        'sidebar-accent-foreground': 'oklch(0.205 0 0)',
        'sidebar-border': 'oklch(0.922 0 0)',
        'sidebar-ring': 'oklch(0.87 0 0)',
        'font-sans': 'Inter, ui-sans-serif, system-ui, sans-serif',
        'font-serif': 'ui-serif, Georgia, serif',
        'font-mono': 'ui-monospace, SFMono-Regular, monospace',
        'shadow-2xs': '0 1px 1px rgb(0 0 0 / 0.05)',
        'shadow-xs': '0 1px 2px rgb(0 0 0 / 0.05)',
        'shadow-sm': '0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)',
        shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'shadow-md':
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        'shadow-lg':
            '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'shadow-xl':
            '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'shadow-2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    },
    dark: {
        background: 'oklch(0.145 0 0)',
        foreground: 'oklch(0.985 0 0)',
        card: 'oklch(0.145 0 0)',
        'card-foreground': 'oklch(0.985 0 0)',
        popover: 'oklch(0.145 0 0)',
        'popover-foreground': 'oklch(0.985 0 0)',
        primary: 'oklch(0.985 0 0)',
        'primary-foreground': 'oklch(0.205 0 0)',
        secondary: 'oklch(0.269 0 0)',
        'secondary-foreground': 'oklch(0.985 0 0)',
        muted: 'oklch(0.269 0 0)',
        'muted-foreground': 'oklch(0.708 0 0)',
        accent: 'oklch(0.269 0 0)',
        'accent-foreground': 'oklch(0.985 0 0)',
        destructive: 'oklch(0.396 0.141 25.723)',
        'destructive-foreground': 'oklch(0.637 0.237 25.331)',
        border: 'oklch(0.269 0 0)',
        input: 'oklch(0.269 0 0)',
        ring: 'oklch(0.439 0 0)',
        'chart-1': 'oklch(0.488 0.243 264.376)',
        'chart-2': 'oklch(0.696 0.17 162.48)',
        'chart-3': 'oklch(0.769 0.188 70.08)',
        'chart-4': 'oklch(0.627 0.265 303.9)',
        'chart-5': 'oklch(0.645 0.246 16.439)',
        radius: '0.625rem',
        sidebar: 'oklch(0.205 0 0)',
        'sidebar-foreground': 'oklch(0.985 0 0)',
        'sidebar-primary': 'oklch(0.985 0 0)',
        'sidebar-primary-foreground': 'oklch(0.985 0 0)',
        'sidebar-accent': 'oklch(0.269 0 0)',
        'sidebar-accent-foreground': 'oklch(0.985 0 0)',
        'sidebar-border': 'oklch(0.269 0 0)',
        'sidebar-ring': 'oklch(0.439 0 0)',
        'font-sans': 'Inter, ui-sans-serif, system-ui, sans-serif',
        'font-serif': 'ui-serif, Georgia, serif',
        'font-mono': 'ui-monospace, SFMono-Regular, monospace',
        'shadow-2xs': '0 1px 1px rgb(0 0 0 / 0.05)',
        'shadow-xs': '0 1px 2px rgb(0 0 0 / 0.05)',
        'shadow-sm': '0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)',
        shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'shadow-md':
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        'shadow-lg':
            '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'shadow-xl':
            '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'shadow-2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    },
};

const loadedFonts = new Set<string>();

const CSS_VAR_KEYS = [
    'background',
    'foreground',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'destructive',
    'destructive-foreground',
    'border',
    'input',
    'ring',
    'chart-1',
    'chart-2',
    'chart-3',
    'chart-4',
    'chart-5',
    'radius',
    'sidebar',
    'sidebar-foreground',
    'sidebar-primary',
    'sidebar-primary-foreground',
    'sidebar-accent',
    'sidebar-accent-foreground',
    'sidebar-border',
    'sidebar-ring',
    'font-sans',
    'font-serif',
    'font-mono',
    'shadow-2xs',
    'shadow-xs',
    'shadow-sm',
    'shadow',
    'shadow-md',
    'shadow-lg',
    'shadow-xl',
    'shadow-2xl',
] as const;

function registerFont(fontUrl: string): void {
    const fontName = fontUrl.split('/').pop()?.replace('.json', '') ?? '';

    if (fontName && !loadedFonts.has(fontName)) {
        loadedFonts.add(fontName);
    }
}

function loadFontsForTheme(registryDependencies?: string[]): void {
    if (!registryDependencies?.length) {
        return;
    }

    registryDependencies
        .filter((dep) => dep.includes('/font-'))
        .forEach(registerFont);
}

function getIsDark(): boolean {
    const { appearance } = useThemeStore.getState();

    return (
        appearance === 'dark' ||
        (appearance === 'system' &&
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
}

function applyCssVars(cssVars: ThemeCssVars): void {
    if (typeof document === 'undefined') {
        return;
    }

    const root = document.documentElement;

    const styleEntries: string[] = [];

    for (const key of CSS_VAR_KEYS) {
        const value = cssVars[key];

        if (value) {
            styleEntries.push(`--${key}: ${value}`);
        }
    }

    if (styleEntries.length > 0) {
        // Reset existing CSS vars before applying new ones to avoid accumulation
        CSS_VAR_KEYS.forEach((key) => {
            root.style.removeProperty(`--${key}`);
        });

        root.style.cssText += styleEntries.join('; ') + ';';
    }
}

function resetToDefault(): void {
    if (typeof document === 'undefined') {
        return;
    }

    const isDark = getIsDark();
    applyCssVars(isDark ? DEFAULT_THEME.dark : DEFAULT_THEME.light);
    document.documentElement.classList.toggle('dark', isDark);
}

function applyThemeConfig(config: ThemeConfig): void {
    if (typeof document === 'undefined') {
        return;
    }

    const isDark = getIsDark();
    const cssVars = isDark ? config.dark : config.light;
    const themeVars = config.theme;

    if (!cssVars) {
        return;
    }

    if (themeVars) {
        const root = document.documentElement.style;
        Object.entries(themeVars).forEach(([key, value]) => {
            if (value) {
                root.setProperty(key, value);
            }
        });
    }

    applyCssVars(cssVars);
}

export default function useThemeChanger() {
    const { selectedTheme, setSelectedTheme } = useThemeStore();
    const themeCache = useRef<Map<string, ThemeConfig>>(new Map());

    const applyTheme = async (themeName: string): Promise<void> => {
        if (themeName === 'theme-default') {
            resetToDefault();

            return;
        }

        try {
            let config = themeCache.current.get(themeName);

            if (!config) {
                const response = await fetch(`/r/${themeName}.json`);

                if (!response.ok) {
                    console.error(
                        `Failed to load theme: ${themeName} - HTTP ${response.status}`,
                    );

                    return;
                }

                config = (await response.json()) as ThemeConfig;

                if (config) {
                    themeCache.current.set(themeName, config);
                }
            }

            if (!config?.cssVars) {
                console.warn(`No cssVars found for theme: ${themeName}`);

                return;
            }

            loadFontsForTheme(config.registryDependencies);
            applyThemeConfig(config.cssVars);
        } catch (error) {
            console.error(`Failed to apply theme: ${themeName}`, error);
        }
    };

    useEffect(() => {
        if (selectedTheme) {
            void applyTheme(selectedTheme);
        }
    }, [selectedTheme]);

    useEffect(() => {
        const handleAppearanceChange = () => {
            if (selectedTheme) {
                void applyTheme(selectedTheme);
            }
        };

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const storageHandler = (e: StorageEvent) => {
            if (e.key === 'appearance') {
                handleAppearanceChange();
            }
        };

        window.addEventListener(
            'theme-appearance-changed',
            handleAppearanceChange,
        );
        mediaQuery.addEventListener('change', handleAppearanceChange);
        window.addEventListener('storage', storageHandler);

        const observer = new MutationObserver(handleAppearanceChange);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => {
            window.removeEventListener(
                'theme-appearance-changed',
                handleAppearanceChange,
            );
            mediaQuery.removeEventListener('change', handleAppearanceChange);
            window.removeEventListener('storage', storageHandler);
            observer.disconnect();
        };
    }, [selectedTheme]);

    return { selectedTheme, setSelectedTheme };
}
