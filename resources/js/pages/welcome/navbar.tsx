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
        <nav className="sticky top-0 z-50 border-b border-primary-foreground/10 bg-primary">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-2.5">
                    <img
                        src="/assets/images/tankayo.png"
                        alt="Tankayo"
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-primary-foreground/20"
                    />
                    <div className="leading-tight">
                        <span className="block font-display text-base font-medium text-primary-foreground">
                            Tankayo
                        </span>
                        <span className="block text-[10px] tracking-[0.18em] text-primary-foreground/55 uppercase">
                            EcoPark Syariah
                        </span>
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    {user ? (
                        <Button
                            asChild
                            size="sm"
                            className="bg-accent text-accent-foreground hover:bg-accent/90"
                        >
                            <Link href={dashboardHref(user)}>Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                            >
                                <Link href={login()}>Masuk</Link>
                            </Button>
                            <Button
                                asChild
                                size="sm"
                                className="bg-accent text-accent-foreground hover:bg-accent/90"
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
