'use client';

import { RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { useThemeStore } from '@/store/use-theme-store';

interface ThemeItem {
    name: string;
    title: string;
    type: string;
    category?: string;
    description?: string;
    baseColor?: string;
}

interface ThemeSearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DEFAULT_THEME_OPTION = {
    name: 'theme-default',
    title: 'Default',
    description: 'Reset to default Laravel theme',
};

export default function ThemeSearchDialog({
    open,
    onOpenChange,
}: ThemeSearchDialogProps) {
    const { setSelectedTheme, selectedTheme } = useThemeStore();
    const [themes, setThemes] = useState<ThemeItem[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchThemes = async (query: string = '') => {
        setLoading(true);

        try {
            const response = await fetch(
                `/api/registries/search?q=${encodeURIComponent(
                    query,
                )}&type=registry:theme`,
            );
            const data = await response.json();
            setThemes(data);
        } catch (error) {
            console.error('Failed to fetch themes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && themes.length === 0) {
            void (async () => {
                await fetchThemes('');
            })();
        }
    }, [open, themes.length]);

    const handleSelect = (themeName: string) => {
        setSelectedTheme(themeName);
        onOpenChange(false);
    };

    const getColorStyle = (baseColor?: string) => {
        if (!baseColor) {
            return { background: 'oklch(0.5 0 0)' };
        }

        try {
            return { background: baseColor };
        } catch {
            return { background: 'oklch(0.5 0 0)' };
        }
    };

    return (
        <CommandDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Theme Palette"
            description="Select a theme for your application"
        >
            <Command shouldFilter={false}>
                <CommandInput placeholder="Search themes..." />
                <CommandList>
                    <CommandEmpty>
                        {loading ? 'Loading...' : 'No themes found.'}
                    </CommandEmpty>

                    <CommandGroup heading="Theme Palette">
                        <CommandItem onSelect={() => handleSelect('theme-default')}>
                            <RotateCcw className="size-4" />
                            <span>{DEFAULT_THEME_OPTION.title}</span>
                            <span className="ml-auto text-xs text-muted-foreground">
                                {DEFAULT_THEME_OPTION.description}
                            </span>
                            {selectedTheme === 'theme-default' && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                    ✓
                                </span>
                            )}
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Themes">
                        {themes.map((theme) => (
                            <CommandItem
                                key={theme.name}
                                onSelect={() => handleSelect(theme.name)}
                            >
                                <div
                                    className="size-4 rounded-full border"
                                    style={getColorStyle(theme.baseColor)}
                                />
                                <span>{theme.title || theme.name}</span>
                                <span className="ml-auto text-xs text-muted-foreground">
                                    {theme.name}
                                </span>
                                {selectedTheme === theme.name && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        ✓
                                    </span>
                                )}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </CommandDialog>
    );
}