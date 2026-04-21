import MainFooter from '@/layouts/main/main-footer';
import MainNavigation from '@/layouts/main/main-navigation';
import { GlowStack } from '@/registry/new-york/components/ui/glow/glow-stack';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // const { auth } = usePage().props;

    return (
        <GlowStack>
            <div className="min-h-screen">
                <MainNavigation />
                {/*<header className="flex items-center justify-between px-6 py-4 lg:px-8">*/}
                {/*    <Link href="/" className="text-xl font-medium">*/}
                {/*        UI.DesignByCode*/}
                {/*    </Link>*/}
                {/*    <nav className="flex items-center gap-4">*/}
                {/*        {auth.user ? (*/}
                {/*            <Link*/}
                {/*                href={dashboard()}*/}
                {/*                className="rounded-sm border border-[#19140035] px-5 py-1.5 text-sm text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"*/}
                {/*            >*/}
                {/*                Dashboard*/}
                {/*            </Link>*/}
                {/*        ) : (*/}
                {/*            <>*/}
                {/*                <Link*/}
                {/*                    href={login()}*/}
                {/*                    className="rounded-sm border border-transparent px-5 py-1.5 text-sm text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"*/}
                {/*                >*/}
                {/*                    Log in*/}
                {/*                </Link>*/}
                {/*                <Link*/}
                {/*                    href={register()}*/}
                {/*                    className="rounded-sm border border-[#19140035] px-5 py-1.5 text-sm text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"*/}
                {/*                >*/}
                {/*                    Register*/}
                {/*                </Link>*/}
                {/*            </>*/}
                {/*        )}*/}
                {/*    </nav>*/}
                {/*</header>*/}
                <main>{children}</main>
                <MainFooter />
            </div>
        </GlowStack>
    );
}
