import { Link } from '@inertiajs/react';
import { BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { bookingHref, formatRupiah } from './types';
import type { AuthUser, TipeWithRooms } from './types';

type Props = {
    tipes: TipeWithRooms[];
    user: AuthUser | null;
};

export function Rooms({ tipes, user }: Props) {
    const tipesWithRooms = tipes.filter((t) => t.kamar.length > 0);

    if (tipesWithRooms.length === 0) {
        return null;
    }

    return (
        <section className="bg-muted/50">
            <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
                <div className="mb-14 text-center">
                    <span className="text-xs tracking-[0.2em] text-accent uppercase">
                        Akomodasi
                    </span>
                    <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                        Tipe Kamar
                    </h2>
                    <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
                        Berbagai tipe kamar dengan balkon pribadi, langsung
                        menghadap keindahan alam pegunungan.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {tipesWithRooms.map((tipe) => {
                        const hargaMin = Math.min(
                            ...tipe.kamar.map((k) => k.harga),
                        );
                        const hargaMax = Math.max(
                            ...tipe.kamar.map((k) => k.harga),
                        );
                        const semuaFasilitas = [
                            ...new Set(
                                tipe.kamar.flatMap(
                                    (k) => k.fasilitas?.split(', ') ?? [],
                                ),
                            ),
                        ];

                        return (
                            <Card
                                key={tipe.id}
                                className="group overflow-hidden border-border/60 bg-card transition-all duration-200 hover:shadow-lg"
                            >
                                <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary/8 to-accent/8">
                                    {tipe.foto ? (
                                        <img
                                            src={`/storage/${tipe.foto}`}
                                            alt={tipe.nama_tipe}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <BedDouble className="h-12 w-12 text-primary/20" />
                                        </div>
                                    )}
                                    <span className="absolute top-3 right-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                                        {tipe.kamar.length} kamar
                                    </span>
                                </div>

                                <CardContent className="p-5">
                                    <h3 className="mb-1 text-base font-semibold text-foreground">
                                        {tipe.nama_tipe}
                                    </h3>

                                    {semuaFasilitas.length > 0 && (
                                        <div className="mb-4 flex flex-wrap gap-1.5">
                                            {semuaFasilitas
                                                .slice(0, 4)
                                                .map((f) => (
                                                    <span
                                                        key={f}
                                                        className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground"
                                                    >
                                                        {f}
                                                    </span>
                                                ))}
                                            {semuaFasilitas.length > 4 && (
                                                <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
                                                    +{semuaFasilitas.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-end justify-between border-t border-border/60 pt-3">
                                        <div>
                                            <p className="text-[11px] leading-none text-muted-foreground">
                                                Mulai dari
                                            </p>
                                            <p className="text-lg font-bold text-primary tabular-nums">
                                                {hargaMin === hargaMax
                                                    ? formatRupiah(hargaMin)
                                                    : `${formatRupiah(hargaMin)} – ${formatRupiah(hargaMax)}`}
                                                <span className="text-xs font-normal text-muted-foreground">
                                                    /malam
                                                </span>
                                            </p>
                                        </div>
                                        <Button
                                            asChild
                                            size="sm"
                                            className="bg-accent text-accent-foreground hover:bg-accent/90"
                                        >
                                            <Link href={bookingHref(user)}>
                                                Booking
                                            </Link>
                                        </Button>
                                    </div>
                                    {tipe.deskripsi && (
                                    <div className="flex items-end justify-between border-t border-border/60 pt-3">
                                        <div>
                                            <p className="text-[11px] leading-none text-muted-foreground">
                                                Deskripsi
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {tipe.deskripsi}
                                            </p>
                                        </div>
                                    </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
