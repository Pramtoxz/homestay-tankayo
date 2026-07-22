import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import danauImg from '@/assets/images/danau.jpg';
import { GonjongMotif } from '@/components/gonjong-motif';
import { Button } from '@/components/ui/button';
import { bookingHref } from './types';
import type { AuthUser } from './types';

type Props = {
    user: AuthUser | null;
};

export function Cta({ user }: Props) {
    return (
        <section className="relative isolate overflow-hidden bg-primary">
            <img
                src={danauImg}
                alt="Senja di Danau Singkarak"
                className="absolute inset-0 -z-20 h-full w-full object-cover"
            />
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background:
                        'linear-gradient(to bottom, rgba(19,35,33,0.75) 0%, rgba(19,35,33,0.88) 100%)',
                }}
            />

            <GonjongMotif
                spires={6}
                variant="line"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-primary-foreground/15"
            />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28 text-center">
                <span className="text-xs tracking-[0.2em] text-primary-foreground/50 uppercase">
                    Homestay Tankayo
                </span>
                <h2 className="mt-4 font-display text-3xl sm:text-4xl font-medium italic text-primary-foreground tracking-tight text-balance">
                    Siap merasakan ketenteraman?
                </h2>
                <p className="mt-3 text-sm text-primary-foreground/65 max-w-md mx-auto">
                    Pesan kamar Anda sekarang dan nikmati pengalaman menginap yang berbeda dari yang lain.
                </p>
                <Button
                    asChild
                    size="lg"
                    className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground px-10 text-sm font-semibold"
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
