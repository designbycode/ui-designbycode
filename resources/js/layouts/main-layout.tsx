import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
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
        <GlowStack className={`relative`}>
            <div className="min-h-screen">
                <PlaceholderPattern className="fixed inset-y-0 left-0 h-full w-2 border-r border-border stroke-border md:w-5" />
                <PlaceholderPattern className="fixed inset-y-0 right-0 h-full w-2 border-l border-border stroke-border md:w-5" />
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
