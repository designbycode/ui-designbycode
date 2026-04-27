import DocsLayout from '@/layouts/docs/layout';
import MainLayout from '@/layouts/main-layout';
import { index as docs } from '@/routes/docs';
import { index as themesIndex } from '@/routes/docs/themes';
import type { RegistryProps } from '@/types';
import useDarkMode from '@/registry/new-york/hooks/use-dark-mode';

export default function ThemesIndex({ themes }: { themes: RegistryProps[] }) {
    const isDark = useDarkMode();
    return (
        <DocsLayout
            breadcrumbs={[
                {
                    title: 'Docs',
                    href: docs.url(),
                },

                {
                    title: 'Themes',
                    href: themesIndex.url(),
                },
            ]}
        >
            <div className="space-y-8">
                <h1 className={`text-2xl font-bold`}>Themes {themes.length}</h1>
                <div className="grid grid-cols-3 gap-4">
                    {themes.map((theme: RegistryProps) => (
                        <div
                            key={theme.id}
                            className="flex items-center justify-between rounded-lg border p-4"
                            style={
                                {
                                    backgroundColor:
                                        theme.css_vars?.[
                                            isDark ? 'dark' : 'light'
                                        ]?.background,
                                    color: theme.css_vars?.[
                                        isDark ? 'dark' : 'light'
                                    ]?.foreground,
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
                                                theme.css_vars?.[
                                                    isDark ? 'dark' : 'light'
                                                ]?.primary,
                                        } as React.CSSProperties
                                    }
                                ></div>
                                <div
                                    className="size-4 rounded-full bg-muted"
                                    style={
                                        {
                                            background:
                                                theme.css_vars?.[
                                                    isDark ? 'dark' : 'light'
                                                ]?.secondary,
                                        } as React.CSSProperties
                                    }
                                ></div>
                                <div
                                    className="size-4 rounded-full bg-muted"
                                    style={
                                        {
                                            background:
                                                theme.css_vars?.[
                                                    isDark ? 'dark' : 'light'
                                                ]?.accent,
                                        } as React.CSSProperties
                                    }
                                ></div>
                                <div
                                    className="size-4 rounded-full bg-muted"
                                    style={
                                        {
                                            background:
                                                theme.css_vars?.[
                                                    isDark ? 'dark' : 'light'
                                                ]?.muted,
                                        } as React.CSSProperties
                                    }
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DocsLayout>
    );
}

ThemesIndex.displayName = 'ThemesIndex';

ThemesIndex.layout = MainLayout;
