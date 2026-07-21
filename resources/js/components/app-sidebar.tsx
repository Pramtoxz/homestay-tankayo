import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    BedDouble,
    CalendarCheck,
    CalendarPlus,
    CalendarMinus,
    FileText,
    FolderGit2,
    LayoutGrid,
    Users,
    UserCheck,
    Wallet,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
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

    if (role === 'user') {
        groups.push({
            group: 'Portal',
            items: [
                { title: 'Dashboard', href: '/portal', icon: LayoutGrid },
                { title: 'Booking Baru', href: '/portal/booking', icon: CalendarPlus },
                { title: 'Riwayat Booking', href: '/portal/booking/history', icon: CalendarCheck },
                { title: 'Lengkapi Data', href: '/portal/lengkapi-data', icon: UserCheck },
            ],
        });
    }

    return groups;
};

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
