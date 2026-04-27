'use client';

import useDarkMode from '@/registry/new-york/hooks/use-dark-mode';
import type { RegistryProps } from '@/types';

export default function ThemeLinkPallet({
    theme,
    ...props
}: {
    theme: RegistryProps;
}) {
    const isDark = useDarkMode();

    return (
        <div {...props}>
            <div
                key={theme.id}
                className="flex items-center justify-between rounded-lg border p-4"
                style={
                    {
                        backgroundColor:
                            theme.css_vars?.[isDark ? 'dark' : 'light']
                                ?.background,
                        color: theme.css_vars?.[isDark ? 'dark' : 'light']
                            ?.foreground,
                    } as React.CSSProperties
                }
            >
                <strong>{theme.title}</strong>
                <div className="flex items-center gap-2">
                    <div
                        className="size-4 rounded-full bg-muted"
                        style={
                            {
                                background:
                                    theme.css_vars?.[isDark ? 'dark' : 'light']
                                        ?.primary,
                            } as React.CSSProperties
                        }
                    ></div>
                    <div
                        className="size-4 rounded-full bg-muted"
                        style={
                            {
                                background:
                                    theme.css_vars?.[isDark ? 'dark' : 'light']
                                        ?.secondary,
                            } as React.CSSProperties
                        }
                    ></div>
                    <div
                        className="size-4 rounded-full bg-muted"
                        style={
                            {
                                background:
                                    theme.css_vars?.[isDark ? 'dark' : 'light']
                                        ?.accent,
                            } as React.CSSProperties
                        }
                    ></div>
                    <div
                        className="size-4 rounded-full bg-muted"
                        style={
                            {
                                background:
                                    theme.css_vars?.[isDark ? 'dark' : 'light']
                                        ?.muted,
                            } as React.CSSProperties
                        }
                    ></div>
                </div>
            </div>
        </div>
    );
}

ThemeLinkPallet.displayName = 'ThemeLinkPallet';
