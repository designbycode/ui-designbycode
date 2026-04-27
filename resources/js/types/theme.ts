export type Appearance = 'light' | 'dark' | 'system';

export interface ThemeFont {
    family?: string;
    url?: string;
    weights?: number[];
    subsets?: string[];
}

export interface ThemeColors {
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

export interface ThemeStyle {
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
}

export interface ThemeMeta {
    category?: string;
    description?: string;
    preview?: string;
    tags?: string[];
    [key: string]: unknown;
}

export interface Theme {
    name: string;
    title: string;
    description: string | null;
    author: string | null;
    baseColor: string | null;
    style: ThemeStyle | null;
    font: ThemeFont | null;
    cssVars: ThemeColors | null;
    css: string[] | null;
    registryDependencies: string[];
    meta: ThemeMeta;
}

export interface ThemeContextValue {
    themes: Theme[];
    currentTheme: Theme | null;
    selectedThemeName: string;
    setTheme: (name: string) => void;
    appearance: Appearance;
    setAppearance: (appearance: Appearance) => void;
    isDark: boolean;
}