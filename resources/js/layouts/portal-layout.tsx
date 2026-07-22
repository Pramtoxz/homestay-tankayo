import { Link, usePage } from '@inertiajs/react';
import { CalendarCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { cn } from '@/lib/utils';
import type { Auth, BreadcrumbItem, NavItem } from '@/types';

type PageProps = {
    auth: Auth;
};

// Portal tamu sengaja cuma 1 menu: Reservasi (sudah termasuk riwayat + status
// pembayaran). Booking baru dimulai dari kartu kamar di welcome.tsx / tombol
// "Booking Baru" di halaman Reservasi, bukan item nav terpisah.
const navItems: NavItem[] = [
    { title: 'Reservasi', href: '/portal', icon: CalendarCheck },
];

export default function PortalLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: ReactNode;
}) {
    const { auth } = usePage<PageProps>().props;
    const { url } = usePage();

    return (
        <div className="theme-tamu flex min-h-svh flex-col bg-background text-foreground">
            <header className="sticky top-0 z-40 border-b bg-background">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                    <Link href="/portal" className="flex shrink-0 items-center gap-2">
                        <img
                            src="/assets/images/tankayo.png"
                            alt="Tankayo"
                            className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="hidden font-display text-base font-medium sm:inline">Portal Tamu</span>
                    </Link>

                    <nav className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const href = String(item.href);
                            const active = href === '/portal' ? url === '/portal' : url.startsWith(href);
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                        active
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                    )}
                                >
                                    {Icon && <Icon className="h-4 w-4" />}
                                    <span className="hidden md:inline">{item.title}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {auth.user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1.5 hover:bg-muted">
                                <UserInfo user={auth.user} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="min-w-56 rounded-lg" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </header>

            {breadcrumbs.length > 0 && (
                <div className="border-b bg-muted/30 px-4 py-3 sm:px-6">
                    <div className="mx-auto max-w-6xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}

            <main className="mx-auto w-full max-w-6xl flex-1">{children}</main>
        </div>
    );
}
