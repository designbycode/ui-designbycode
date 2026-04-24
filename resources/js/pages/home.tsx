import { Head, usePage } from '@inertiajs/react';
import { PackageManagerSelect } from '@/components/ui/package-manager-select';
import { PricingTable } from '@/components/ui/pricing-table';
import Wrapper from '@/components/wrapper';
import MainHero from '@/layouts/main/main-hero';

export default function Home() {
    const { auth } = usePage().props;

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

                <div className="w-full rounded-lg bg-primary p-4 text-muted-foreground">
                    Subscribed: {auth.user.subscribed ? 'Yes' : 'No'}
                </div>

                <PricingTable className="my-16" />
            </Wrapper>
        </div>
    );
}

Home.displayName = 'Home';
