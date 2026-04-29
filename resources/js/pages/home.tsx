import { Head } from '@inertiajs/react';
import { PackageManagerSearch } from '@/components/ui/package-manager-search';
import { PricingTable } from '@/components/ui/pricing-table';
import Wrapper from '@/components/wrapper';
import MainHero from '@/layouts/main/main-hero';
import FontCard from '@/components/themes/font-card';
import { ArrowRight } from 'lucide-react';
import type { RegistryProps } from '@/types';
import Marquee, {
    MarqueeText,
} from '@/registry/new-york/components/ui/animations/marquee';

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

                <Marquee
                    scrollBoostFactor={5}
                    scrollTimeout={2000}
                    className="my-4 mask-x-from-94% mask-x-to-100%"
                >
                    <div className="nowrap flex gap-4">
                        {fonts.map((font: RegistryProps) => (
                            <FontCard key={font.id} font={font} />
                        ))}
                    </div>
                </Marquee>

                <Marquee className="my-4 mask-x-from-94% mask-x-to-100%">
                    <div className="nowrap flex gap-4">
                        {fonts.map((font: RegistryProps) => (
                            <FontCard key={font.id} font={font} />
                        ))}
                    </div>
                </Marquee>

                <Marquee className="my-4 mask-x-from-94% mask-x-to-100%">
                    <div className="nowrap flex gap-4">
                        {fonts.map((font: RegistryProps) => (
                            <FontCard key={font.id} font={font} />
                        ))}
                    </div>
                </Marquee>

                <MarqueeText
                    direction={`right`}
                    scrollEnabled={false}
                    className={`my-12 mask-x-from-94% mask-x-to-100%`}
                    items={[
                        { label: 'Available for work' },
                        {
                            label: 'Hire me →',
                            itemStyle: {
                                color: 'var(--color-primary-foreground)',
                                backgroundColor: 'var(--color-primary)',
                                padding: '0.5rem 2rem',
                                borderRadius: 'var(--radius-lg)',
                                fontWeight: 600,
                            },
                        },
                        { label: 'Full-stack engineer' },
                        { label: 'Based in Cape Town' },
                    ]}
                    separator={<ArrowRight className="size-4 text-white" />}
                    fontSize="1rem"
                />
                <MarqueeText
                    scrollEnabled={false}
                    direction={`left`}
                    className={`my-12 mask-x-from-94% mask-x-to-100%`}
                    items={[
                        { label: 'Available for work' },
                        {
                            label: 'Hire me →',

                            itemStyle: {
                                className: 'text-accent',
                                color: 'var(--color-primary-foreground)',
                                backgroundColor: 'var(--color-primary)',
                                padding: '0.5rem 2rem',
                                borderRadius: 'var(--radius-lg)',
                                fontWeight: 600,
                            },
                        },
                        { label: 'Full-stack engineer' },
                        { label: 'Based in Cape Town' },
                    ]}
                    separator={
                        <ArrowRight className="size-4 text-foreground" />
                    }
                    fontSize="1rem"
                />
                <MarqueeText
                    direction={`right`}
                    scrollEnabled={false}
                    className={`my-12 mask-x-from-94% mask-x-to-100%`}
                    items={[
                        { label: 'Available for work' },
                        {
                            label: 'Hire me →',
                            itemStyle: {
                                color: 'var(--color-primary-foreground)',
                                backgroundColor: 'var(--color-primary)',
                                padding: '0.5rem 2rem',
                                borderRadius: 'var(--radius-lg)',
                                fontWeight: 600,
                            },
                        },
                        { label: 'Full-stack engineer' },
                        { label: 'Based in Cape Town' },
                    ]}
                    separator={<ArrowRight className="size-4 text-white" />}
                    fontSize="1rem"
                />

                <PricingTable className="my-16" />
            </Wrapper>
        </div>
    );
}

Home.displayName = 'Home';
