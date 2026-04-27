import { Head } from '@inertiajs/react';
import { PackageManagerSearch } from '@/components/ui/package-manager-search';
import { PricingTable } from '@/components/ui/pricing-table';
import Wrapper from '@/components/wrapper';
import MainHero from '@/layouts/main/main-hero';

const COLORS: Record<string, string> = {
    React: '#61dafb',
    TypeScript: '#3178c6',
    'Next.js': '#000000',
    Tailwind: '#38bdf8',
    GSAP: '#88ce02',
    Git: '#f05032',
    Vite: '#646cff',
    Vercel: '#000000',
    Figma: '#ff6b6b',
    Storybook: '#ffd93d',
    Jest: '#c21325',
    Node: '#47a248',
};

export default function Home() {
    return (
        <div className="min-h-screen pt-18">
            <Head title="Home">
                <meta name="description" content="Your page description" />
            </Head>
            <Wrapper>
                <MainHero />

                <div className="my-4 grid grid-cols-3 gap-4 text-center">
                    <div
                        className={`p-4 font-bebas-neue text-[clamp(2rem,3vh,3rem)] text-nowrap`}
                    >
                        Bebas Neue
                    </div>
                    <div
                        className={`p-4 font-playfair-display text-[clamp(2rem,3vh,3rem)] text-nowrap`}
                    >
                        Playfair Display
                    </div>
                    <div
                        className={`p-4 font-press-start-2p text-[clamp(2rem,2vh,3rem)] text-nowrap`}
                    >
                        Press Start 2P
                    </div>
                    <div
                        className={`p-4 font-ibm-plex-sans text-[clamp(2rem,3vh,3rem)] text-nowrap`}
                    >
                        IBM Plex Sans
                    </div>
                    <div
                        className={`p-4 font-ibm-plex-mono text-[clamp(2rem,3vh,3rem)] text-nowrap`}
                    >
                        IBM Plex Mono
                    </div>
                    <div
                        className={`p-4 font-dm-serif-display text-[clamp(2rem,3vh,3rem)] text-nowrap`}
                    >
                        DM Serif Display
                    </div>
                    <div
                        className={`p-4 font-caveat text-[clamp(2rem,3vh,3rem)] text-nowrap`}
                    >
                        Caveat
                    </div>
                    <div
                        className={`font-orbitron p-4 text-[clamp(2rem,3vh,3rem)] text-nowrap`}
                    >
                        Orbitron
                    </div>
                    <div
                        className={`p-4 font-fira-mono text-[clamp(2rem,3vh,3rem)] text-nowrap`}
                    >
                        Fira Mono
                    </div>
                    <div
                        className={`p-4 font-roboto-slab text-[clamp(2rem,3vh,3rem)] text-nowrap`}
                    >
                        Roboto Slab
                    </div>
                </div>

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
