import { Head } from '@inertiajs/react';
import { PackageManagerSearch } from '@/components/ui/package-manager-search';
import { PricingTable } from '@/components/ui/pricing-table';
import Wrapper from '@/components/wrapper';
import MainHero from '@/layouts/main/main-hero';

export default function Home() {
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
                <PricingTable className="my-16" />
            </Wrapper>
        </div>
    );
}

Home.displayName = 'Home';
