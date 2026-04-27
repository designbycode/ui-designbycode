import ThemeLinkPallet from '@/components/themes/theme-link-pallet';
import DocsLayout from '@/layouts/docs/layout';
import MainLayout from '@/layouts/main-layout';
import { index as docs } from '@/routes/docs';
import { index as themesIndex } from '@/routes/docs/themes';
import type { RegistryProps } from '@/types';

export default function ThemesIndex({ themes }: { themes: RegistryProps[] }) {
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
                <div className="grid gap-4 md:grid-cols-3">
                    {themes.map((theme: RegistryProps) => (
                        <ThemeLinkPallet key={theme.id} theme={theme} />
                    ))}
                </div>
            </div>
        </DocsLayout>
    );
}

ThemesIndex.displayName = 'ThemesIndex';

ThemesIndex.layout = MainLayout;
