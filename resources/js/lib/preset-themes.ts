export interface PresetTheme {
    name: string;
    title: string;
    description: string;
    css_vars: {
        light: Record<string, string>;
        dark: Record<string, string>;
    };
    font?: {
        sans?: string;
        serif?: string;
        mono?: string;
    };
}

export const presetThemes: PresetTheme[] = [
    {
        name: 'midnight',
        title: 'Midnight',
        description: 'A dark, moody theme with deep blues',
        css_vars: {
            light: {
                background: 'oklch(0.9755 0.0045 258.3245)',
                foreground: 'oklch(0.2558 0.0433 268.0662)',
                card: 'oklch(0.9341 0.0132 251.5628)',
                'card-foreground': 'oklch(0.2558 0.0433 268.0662)',
                popover: 'oklch(0.9856 0.0278 98.0540)',
                'popover-foreground': 'oklch(0.2558 0.0433 268.0662)',
                primary: 'oklch(0.4815 0.1178 263.3758)',
                'primary-foreground': 'oklch(0.9856 0.0278 98.0540)',
                secondary: 'oklch(0.8567 0.1164 81.0092)',
                'secondary-foreground': 'oklch(0.2558 0.0433 268.0662)',
                muted: 'oklch(0.9202 0.0080 106.5563)',
                'muted-foreground': 'oklch(0.4815 0.1178 263.3758)',
                accent: 'oklch(0.6896 0.0714 234.0387)',
                'accent-foreground': 'oklch(0.9856 0.0278 98.0540)',
                destructive: 'oklch(0.2611 0.0376 322.5267)',
                'destructive-foreground': 'oklch(0.9856 0.0278 98.0540)',
                border: 'oklch(0.7791 0.0156 251.1926)',
                input: 'oklch(0.6896 0.0714 234.0387)',
                ring: 'oklch(0.8567 0.1164 81.0092)',
                radius: '0.5rem',
            },
            dark: {
                background: 'oklch(0.2204 0.0198 275.8439)',
                foreground: 'oklch(0.9366 0.0129 266.6974)',
                card: 'oklch(0.2703 0.0407 281.3036)',
                'card-foreground': 'oklch(0.9366 0.0129 266.6974)',
                popover: 'oklch(0.2703 0.0407 281.3036)',
                'popover-foreground': 'oklch(0.9097 0.1440 95.1120)',
                primary: 'oklch(0.4815 0.1178 263.3758)',
                'primary-foreground': 'oklch(0.9097 0.1440 95.1120)',
                secondary: 'oklch(0.9097 0.1440 95.1120)',
                'secondary-foreground': 'oklch(0.2703 0.0407 281.3036)',
                muted: 'oklch(0.2424 0.0324 281.0890)',
                'muted-foreground': 'oklch(0.6243 0.0412 262.0375)',
                accent: 'oklch(0.8469 0.0524 264.7751)',
                'accent-foreground': 'oklch(0.2204 0.0198 275.8439)',
                destructive: 'oklch(0.5280 0.1200 357.1130)',
                'destructive-foreground': 'oklch(0.9097 0.1440 95.1120)',
                border: 'oklch(0.3072 0.0287 281.7681)',
                input: 'oklch(0.4815 0.1178 263.3758)',
                ring: 'oklch(0.9097 0.1440 95.1120)',
                radius: '0.5rem',
            },
        },
        font: {
            sans: 'Inter, sans-serif',
            serif: 'Georgia, serif',
            mono: 'monospace',
        },
    },
    {
        name: 'sunset',
        title: 'Sunset',
        description: 'Warm oranges and pinks like a sunset',
        css_vars: {
            light: {
                background: 'oklch(0.985 0.005 80)',
                foreground: 'oklch(0.25 0.05 60)',
                primary: 'oklch(0.55 0.18 45)',
                'primary-foreground': 'oklch(0.99 0.01 80)',
                radius: '0.75rem',
            },
            dark: {
                background: 'oklch(0.20 0.02 80)',
                foreground: 'oklch(0.95 0.01 80)',
                primary: 'oklch(0.55 0.18 45)',
                'primary-foreground': 'oklch(0.99 0.01 80)',
                radius: '0.75rem',
            },
        } as Record<string, string>,
    },
    {
        name: 'ocean',
        title: 'Ocean',
        description: 'Cool blues and teals inspired by the sea',
        css_vars: {
            light: {
                background: 'oklch(0.98 0.01 220)',
                foreground: 'oklch(0.25 0.04 240)',
                primary: 'oklch(0.50 0.15 230)',
                'primary-foreground': 'oklch(0.98 0.01 220)',
                radius: '0.5rem',
            },
            dark: {
                background: 'oklch(0.18 0.02 240)',
                foreground: 'oklch(0.95 0.01 220)',
                primary: 'oklch(0.50 0.15 230)',
                'primary-foreground': 'oklch(0.98 0.01 220)',
                radius: '0.5rem',
            },
        } as Record<string, string>,
    },
];

export function getPresetByName(name: string): PresetTheme | undefined {
    return presetThemes.find((p) => p.name === name);
}
