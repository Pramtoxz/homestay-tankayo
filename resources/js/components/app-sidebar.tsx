import { Link, usePage } from '@inertiajs/react';
import {
    BedDouble,
    CalendarCheck,
    CalendarPlus,
    CalendarMinus,
    FileText,
    LayoutGrid,
    Users,
    Wallet,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem, Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

const getNavItems = (role: string): { group: string; items: NavItem[] }[] => {
    const groups: { group: string; items: NavItem[] }[] = [];

    groups.push({
        group: 'Menu',
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
        ],
    });

    if (role === 'admin') {
        groups.push({
            group: 'Master',
            items: [
                { title: 'Tamu', href: '/admin/tamu', icon: Users },
                { title: 'Kamar', href: '/admin/kamar', icon: BedDouble },
                { title: 'Pengeluaran', href: '/admin/pengeluaran', icon: Wallet },
            ],
        });

        groups.push({
            group: 'Transaksi',
            items: [
                { title: 'Reservasi', href: '/admin/reservasi', icon: CalendarPlus },
                { title: 'Check-In', href: '/admin/checkin', icon: CalendarCheck },
                { title: 'Check-Out', href: '/admin/checkout', icon: CalendarMinus },
            ],
        });
    }

    if (role === 'admin' || role === 'pimpinan') {
        groups.push({
            group: 'Laporan',
            items: [
                { title: 'Laporan', href: '/laporan', icon: FileText },
            ],
        });
    }

    return groups;
};

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;
    const role = auth.user?.role ?? 'user';
    const navGroups = getNavItems(role);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {navGroups.map((group) => (
                    <NavMain
                        key={group.group}
                        label={group.group}
                        items={group.items}
                    />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
