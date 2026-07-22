import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { login, register } from '@/routes';
import { dashboardHref } from './types';
import type { AuthUser } from './types';

type Props = {
    user: AuthUser | null;
};

export function Navbar({ user }: Props) {
    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-primary/95 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-2.5">
                    <img
                        src="/assets/images/tankayo.png"
                        alt="Tankayo"
                        className="h-9 w-9 rounded-md object-cover"
                    />
                    <div className="leading-tight">
                        <span className="block text-sm font-semibold text-primary-foreground">
                           Homestay Tankayo
                        </span>
                        <span className="block text-[11px] text-primary-foreground/60">
                            EcoPark Syariah
                        </span>
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    {user ? (
                        <Button
                            asChild
                            variant="secondary"
                            size="sm"
                            className="bg-white/15 text-white hover:bg-white/25 border-0"
                        >
                            <Link href={dashboardHref(user)}>Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="text-white/80 hover:text-white hover:bg-white/10"
                            >
                                <Link href={login()}>Masuk</Link>
                            </Button>
                            <Button
                                asChild
                                size="sm"
                                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                            >
                                <Link href={register()}>Daftar</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
