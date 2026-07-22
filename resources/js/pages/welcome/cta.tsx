import { Link } from '@inertiajs/react';
import { ArrowRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bookingHref } from './types';
import type { AuthUser } from './types';

type Props = {
    user: AuthUser | null;
};

export function Cta({ user }: Props) {
    return (
        <section className="bg-primary">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 text-center">
                <div className="flex items-center justify-center gap-3 py-2">
                    <span className="h-px w-16 bg-primary-foreground/20" />
                    <Leaf className="h-4 w-4 text-primary-foreground/40" />
                    <span className="h-px w-16 bg-primary-foreground/20" />
                </div>
                <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-primary-foreground tracking-tight">
                    Siap Merasakan Ketenteraman?
                </h2>
                <p className="mt-3 text-sm text-primary-foreground/65 max-w-md mx-auto">
                    Pesan kamar Anda sekarang dan nikmati pengalaman menginap yang berbeda dari yang lain.
                </p>
                <Button
                    asChild
                    size="lg"
                    className="mt-7 bg-accent hover:bg-accent/90 text-accent-foreground px-10 text-sm font-semibold"
                >
                    <Link href={bookingHref(user)}>
                        {user && user.role === 'user' ? 'Booking Sekarang' : 'Daftar & Booking'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </section>
    );
}
