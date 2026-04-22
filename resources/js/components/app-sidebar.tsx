import { usePage } from '@inertiajs/react';
import { LayoutGrid, Users } from 'lucide-react';
import { AppLogoDropdown } from '@/components/app-logo-dropdown';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { useSidebarStore } from '@/store/use-sidebar-store';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import { index as usersIndex } from '@/routes/admin/users';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'designbycode',
        href: 'https://designbycode.co.za',
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const { activeSection, setActiveSection } = useSidebarStore();

    const isSuperAdmin = auth.user?.roles?.some(
        (role: { name: string }) => role.name === 'super-admin',
    );

    const platformNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: admin.dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Users',
            href: usersIndex.url(),
            icon: Users,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <AppLogoDropdown />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {activeSection === 'platform' && (
                    <SidebarGroup className="px-2 py-0">
                        <NavMain items={platformNavItems} />
                    </SidebarGroup>
                )}
                {activeSection === 'admin' && isSuperAdmin && (
                    <SidebarGroup className="px-2 py-0">
                        <NavMain items={adminNavItems} />
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
