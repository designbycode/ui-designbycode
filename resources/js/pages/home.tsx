import { Head } from '@inertiajs/react';
import { PackageManagerSearch } from '@/components/ui/package-manager-search';
import { PricingTable } from '@/components/ui/pricing-table';
import Wrapper from '@/components/wrapper';
import MainHero from '@/layouts/main/main-hero';
import { MarqueeText } from '@/registry/new-york/components/ui/animations/gsap-marquee';

export default function Home() {
    return (
        <div className="min-h-screen pt-18">
            <Head title="Home">
                <meta name="description" content="Your page description" />
            </Head>
            <Wrapper>
                <MainHero />
                <MarqueeText
                    scrollVelocity={true}
                    minVelocity={1}
                    maxVelocity={4}
                    velocityMultiplier={2}
                    className={`my-6 rounded-lg border-sidebar-border bg-sidebar py-4`}
                    text="GSAP POWERED MARQUEE"
                    separator={
                        <span className="mx-12 text-2xl text-primary">★</span>
                    }
                    textClassName="text-3xl md:text-7xl font-black tracking-tight text-"
                    duration={15}
                    gap={0}
                />

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
