import { Head } from '@inertiajs/react';
import { PackageManagerSearch } from '@/components/ui/package-manager-search';
import { PricingTable } from '@/components/ui/pricing-table';
import Wrapper from '@/components/wrapper';
import MainHero from '@/layouts/main/main-hero';
import FontCard from '@/components/themes/font-card';
import type { RegistryProps } from '@/types';

export default function Home({ fonts }: RegistryProps[]) {
    return (
        <div className="min-h-screen pt-18">
            <Head title="Home">
                <meta name="description" content="Your page description" />
            </Head>
            <Wrapper>
                <MainHero />
                <PackageManagerSearch
                    className="my-4"
                    defaultRegistry="glow-conic"
                />

                <div className="my-6 grid gap-4 text-center md:grid-cols-3">
                    {fonts.map((font) => (
                        <FontCard key={font.id} font={font} />
                    ))}
                </div>

                <PricingTable className="my-16" />
            </Wrapper>
        </div>
    );
}

Home.displayName = 'Home';
