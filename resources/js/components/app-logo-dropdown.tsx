import { Link, usePage } from '@inertiajs/react';
import { ChevronsUpDown, LayoutGrid, Settings } from 'lucide-react';
import { useState } from 'react';
import AppLogo from '@/components/app-logo';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import { useSidebarStore } from '@/store/use-sidebar-store';

export function AppLogoDropdown() {
    const { auth } = usePage().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const { setActiveSection } = useSidebarStore();
    const [open, setOpen] = useState(false);

    if (!auth.isSuperAdmin) {
        return (
            <SidebarMenuButton size="lg" asChild>
                <Link href={dashboard()} prefetch>
                    <AppLogo />
                </Link>
            </SidebarMenuButton>
        );
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
                        >
                            <AppLogo />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'right'
                                  : 'bottom'
                        }
                    >
                        <div className="flex flex-col gap-1 p-1">
                            <Link
                                href={admin.dashboard()}
                                onClick={() => {
                                    setActiveSection('admin');
                                    setOpen(false);
                                }}
                                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            >
                                <Settings className="size-4" />
                                <span>Admin Dashboard</span>
                            </Link>
                            <Link
                                href={dashboard()}
                                onClick={() => {
                                    setActiveSection('platform');
                                    setOpen(false);
                                }}
                                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            >
                                <LayoutGrid className="size-4" />
                                <span>Dashboard</span>
                            </Link>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
