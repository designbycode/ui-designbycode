import { Head } from '@inertiajs/react';
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
            </Wrapper>
        </div>
    );
}

Home.displayName = 'Home';
