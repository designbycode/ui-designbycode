import { usePage } from '@inertiajs/react';
import { CreditCard, LayoutGrid, Users } from 'lucide-react';
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
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import { index as usersIndex } from '@/routes/admin/users';
import billing from '@/routes/billing';
import { useSidebarStore } from '@/store/use-sidebar-store';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'designbycode',
        href: 'https://designbycode.co.za',
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const { activeSection } = useSidebarStore();

    const platformNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Billing',
            href: billing.index.url(),
            icon: CreditCard,
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
                {activeSection === 'admin' && auth.isSuperAdmin && (
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
