import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import heroImg from '@/assets/images/hero.webp';
import { GonjongMotif } from '@/components/gonjong-motif';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';
import { bookingHref, bookingLabel } from './types';
import type { AuthUser } from './types';

type Props = {
    user: AuthUser | null;
};

export function Hero({ user }: Props) {
    return (
        <section className="relative isolate overflow-hidden min-h-[520px] sm:min-h-[600px] lg:min-h-[680px]">
            {/* Background image */}
            <img
                src={heroImg}
                alt="Pemandangan Danau Singkarak dari Eco Park Syariah Tankayo"
                className="absolute inset-0 -z-20 h-full w-full object-cover"
            />

            {/* Gradient overlay — teal danau menuju ink, bukan hijau admin */}
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background:
                        'linear-gradient(to bottom, rgba(31,92,99,0.30) 0%, rgba(31,92,99,0.55) 45%, rgba(19,35,33,0.92) 100%)',
                }}
            />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-24 sm:pt-32 lg:pt-40 pb-28 sm:pb-32 text-center">
                <div className="mb-6 flex items-center justify-center gap-3 text-[11px] tracking-[0.2em] text-white/70 uppercase">
                    <span className="h-px w-8 bg-white/30" />
                    Danau Singkarak &middot; Tanah Datar
                    <span className="h-px w-8 bg-white/30" />
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-[1.1] max-w-3xl mx-auto text-balance">
                    Ketenteraman tepian danau,
                    <br className="hidden sm:block" />
                    <span className="italic text-accent">bernuansa Minangkabau</span>
                </h1>

                <p className="mt-6 max-w-xl mx-auto text-sm sm:text-base text-white/75 leading-relaxed">
                    Penginapan syariah menghadap Danau Singkarak, Jl. Padang Laweh Malalo, Tanah Datar.
                    Udara sejuk pegunungan, hamparan air tenang, dan keramahan khas Minang.
                </p>

                <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                        asChild
                        size="lg"
                        className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 text-sm font-semibold shadow-lg shadow-black/20"
                    >
                        <Link href={bookingHref(user)}>
                            {bookingLabel(user)}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    {!user && (
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="border-white/30 text-white hover:bg-white/15 hover:text-white px-8 text-sm backdrop-blur-sm"
                        >
                            <Link href={login()}>Masuk</Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Siluet gonjong — jahitan menuju section berikutnya */}
            <GonjongMotif
                spires={7}
                variant="fill"
                className="absolute inset-x-0 bottom-0 h-14 sm:h-20 w-full text-background"
            />
        </section>
    );
}
