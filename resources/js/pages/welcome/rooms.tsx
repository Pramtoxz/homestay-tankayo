import { Link } from '@inertiajs/react';
import { BedDouble } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { bookingHref, formatRupiah, tipeKamarWarna } from './types';
import type { AuthUser, Room } from './types';

type Props = {
    rooms: Room[];
    user: AuthUser | null;
};

export function Rooms({ rooms, user }: Props) {
    if (rooms.length === 0) {
        return null;
    }

    return (
        <section className="bg-muted/40">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                        Pilihan Kamar
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
                        Berbagai tipe kamar dengan balkon pribadi, langsung menghadap keindahan alam pegunungan.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {rooms.map((room) => (
                        <Card
                            key={room.id_kamar}
                            className="group border-border/60 bg-card overflow-hidden hover:shadow-lg transition-all duration-200"
                        >
                            <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary/8 to-accent/8">
                                {room.cover ? (
                                    <img
                                        src={`/storage/${room.cover}`}
                                        alt={room.nama}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <BedDouble className="h-12 w-12 text-primary/20" />
                                    </div>
                                )}
                                <Badge
                                    className={`absolute top-3 left-3 text-[11px] ${tipeKamarWarna[room.tipe_kamar] ?? 'bg-secondary text-secondary-foreground'}`}
                                >
                                    {room.tipe_kamar.replace(' Room Balcony', '')}
                                </Badge>
                            </div>

                            <CardContent className="p-5">
                                <h3 className="text-base font-semibold text-foreground mb-1 line-clamp-1">
                                    {room.nama}
                                </h3>
                                {room.deskripsi && (
                                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                                        {room.deskripsi}
                                    </p>
                                )}
                                {room.fasilitas && (
                                    <div className="mb-4 flex flex-wrap gap-1.5">
                                        {room.fasilitas.split(', ').slice(0, 4).map((f) => (
                                            <span
                                                key={f}
                                                className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground"
                                            >
                                                {f}
                                            </span>
                                        ))}
                                        {room.fasilitas.split(', ').length > 4 && (
                                            <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
                                                +{room.fasilitas.split(', ').length - 4}
                                            </span>
                                        )}
                                    </div>
                                )}
                                <div className="flex items-end justify-between border-t border-border/60 pt-3">
                                    <div>
                                        <p className="text-[11px] text-muted-foreground leading-none">
                                            Mulai dari
                                        </p>
                                        <p className="text-lg font-bold text-primary tabular-nums">
                                            {formatRupiah(room.harga)}
                                            <span className="text-xs font-normal text-muted-foreground">
                                                /malam
                                            </span>
                                        </p>
                                    </div>
                                    <Button
                                        asChild
                                        size="sm"
                                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                                    >
                                        <Link href={bookingHref(user)}>Booking</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
