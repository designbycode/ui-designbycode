import { Link } from '@inertiajs/react';
import { Crown } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import ThemeToggle from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import Wrapper from '@/components/wrapper';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { GlowRadial } from '@/registry/new-york/components/ui/glow/glow-radial';
import type { UseHeadroomOptions } from '@/registry/new-york/hooks/use-headroom';
import useHeadroom from '@/registry/new-york/hooks/use-headroom';
import { home } from '@/routes';
import { provider } from '@/routes/auth';

const links = [
    {
        title: 'Home',
        href: home(),
    },

    {
        title: 'Animations',
        href: '#',
    },
];

const MainNavigation = ({ className }: { className?: string }) => {
    const isMobile = useIsMobile();

    const { ref, pinned } = useHeadroom({
        enabled: !isMobile,
        offset: 16,
        tolerance: {
            down: 5,
            up: 5,
        },
    } as UseHeadroomOptions);

    return (
        <div
            ref={ref}
            className={cn(
                `fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-border bg-background/75 backdrop-blur-sm transition-transform duration-700`,
                pinned ? 'translate-y-0' : '-translate-y-16',
                className,
            )}
        >
            <Wrapper className="flex items-center justify-between">
                <Link prefetch href={home()}>
                    <AppLogo />
                </Link>

                <div className="hidden items-center space-x-2 md:flex">
                    <NavigationMenu>
                        <NavigationMenuList className={`space-x-4 text-sm`}>
                            {links.map((link) => (
                                <NavigationMenuItem asChild key={link.title}>
                                    <Link
                                        className="text-muted-foreground hover:text-foreground"
                                        prefetch
                                        href={link.href}
                                    >
                                        {link.title}
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="flex items-center space-x-2">
                    <NavigationMenu>
                        <NavigationMenuList
                            className={`flex items-center space-x-4 text-sm`}
                        >
                            <NavigationMenuItem>
                                <ThemeToggle className="grid size-5 place-content-center text-muted-foreground hover:text-foreground" />
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Button asChild className={`relative`}>
                                    <a
                                        href={
                                            provider({
                                                provider: 'github',
                                            }).url
                                        }
                                    >
                                        <GlowRadial
                                            size={150}
                                            colors={[
                                                `oklch(66.6% 0.179 58.318), transparent`,
                                            ]}
                                            borderWidth={3}
                                            className={`absolute -inset-1 blur-xs`}
                                        />
                                        <GlowRadial
                                            size={150}
                                            colors={[
                                                `oklch(66.6% 0.179 58.318), transparent`,
                                            ]}
                                            borderWidth={2}
                                            className={`absolute -inset-0.5`}
                                        />
                                        <GlowRadial
                                            size={150}
                                            colors={[
                                                `oklch(66.6% 0.179 58.318), transparent`,
                                            ]}
                                            borderWidth={2}
                                            className={`absolute -inset-1.5 mix-blend-color-dodge blur-xs`}
                                        />
                                        <Crown className="size-4" />
                                        <span>Premium</span>
                                    </a>
                                </Button>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </Wrapper>
        </div>
    );
};

export default MainNavigation;
