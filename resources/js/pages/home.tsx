import { Head, usePage } from '@inertiajs/react';
import { PackageManagerSelect } from '@/components/ui/package-manager-select';
import { PricingTable } from '@/components/ui/pricing-table';
import Wrapper from '@/components/wrapper';
import MainHero from '@/layouts/main/main-hero';

export default function Home() {
    const { name, auth } = usePage().props;

    return (
        <div className="min-h-screen pt-18">
            <Head title="Home">
                <meta name="description" content="Your page description" />
            </Head>
            <Wrapper>
                <MainHero />

                <PackageManagerSelect
                    className="my-4"
                    codes={{
                        npm: `npm shadcn@latest add https://ui.designbycode.co.za/r/somecomponent.json`,
                        yarn: `yarn shadcn@latest add https://ui.designbycode.co.za/r/somecomponent.json`,
                        pnpm: `pnpm shadcn@latest add https://ui.designbycode.co.za/r/somecomponent.json`,
                        bun: `bunx --bun shadcn@latest add https://ui.designbycode.co.za/r/somecomponent.json`,
                    }}
                />

                <div className="my-12 grid grid-cols-4 gap-4">
                    <div
                        className={`relative aspect-square rounded-lg bg-muted`}
                    >
                        <div
                            className={`absolute inset-0 animate-rr rounded-[inherit] p-2 blur`}
                            style={{
                                background: `repeating-conic-gradient(from var(--rr, 0deg),red 0 30deg, yellow 30deg 60deg, blue 60deg 90deg)`,
                                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) border-box',
                                maskComposite: 'exclude' as const,
                                WebkitMask:
                                    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) border-box',
                                WebkitMaskComposite: 'xor' as const,
                            }}
                        ></div>
                        <div
                            className={`absolute -inset-1 animate-rr rounded-[inherit] p-1`}
                            style={{
                                background: `repeating-conic-gradient(from var(--rr, 0deg),red 0 30deg, yellow 30deg 60deg, blue 60deg 90deg)`,
                                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) border-box',
                                maskComposite: 'exclude' as const,
                                WebkitMask:
                                    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) border-box',
                                WebkitMaskComposite: 'xor' as const,
                            }}
                        ></div>
                    </div>
                </div>

                <div className="w-full rounded-lg bg-primary p-4 text-muted-foreground">
                    Subscribed: {auth.user.subscribed ? 'Yes' : 'No'}
                </div>

                <PricingTable className="my-16" />
            </Wrapper>
        </div>
    );
}

Home.displayName = 'Home';
