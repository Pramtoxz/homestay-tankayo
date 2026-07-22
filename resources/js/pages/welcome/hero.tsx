import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import heroImg from '@/assets/images/hero.webp';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';
import { bookingHref, bookingLabel } from './types';
import type { AuthUser } from './types';

type Props = {
    user: AuthUser | null;
};

export function Hero({ user }: Props) {
    return (
        <section className="relative isolate overflow-hidden min-h-[480px] sm:min-h-[560px] lg:min-h-[640px]">
            {/* Background image */}
            <img
                src={heroImg}
                alt="Pemandangan Danau Singkarak dari Eco Park Syariah Tankayo"
                className="absolute inset-0 -z-20 h-full w-full object-cover"
            />

            {/* Gradient overlay — heavier at bottom for text readability */}
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background:
                        'linear-gradient(to bottom, rgba(35,59,47,0.35) 0%, rgba(35,59,47,0.55) 40%, rgba(35,59,47,0.85) 100%)',
                }}
            />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28 lg:py-36 text-center">
                <Badge
                    variant="secondary"
                    className="mb-6 bg-white/15 text-white/95 border-white/20 text-xs tracking-wide backdrop-blur-sm"
                >
                    Danau Singkarak &bull; Tanah Datar, Sumatera Barat
                </Badge>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight max-w-3xl mx-auto drop-shadow-md">
                    Ketenteraman Tepian Danau,<br className="hidden sm:block" />
                    <span className="text-accent/90">Kenyamanan Bernuansa Minang</span>
                </h1>

                <p className="mt-5 max-w-xl mx-auto text-sm sm:text-base text-white/80 leading-relaxed drop-shadow-sm">
                    Penginapan syariah menghadap Danau Singkarak, Jl. Padang Laweh Malalo, Tanah Datar.
                    Udara sejuk pegunungan, hamparan air tenang, dan keramahan khas Minangkabau.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                        asChild
                        size="lg"
                        className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 text-sm font-semibold shadow-lg"
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
        </section>
    );
}
