import { Head, router, usePage } from '@inertiajs/react';
import { BedDouble, Calendar, CreditCard, Loader2 } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type KamarItem = {
    id_kamar: string;
    nama: string;
    harga: number;
    fasilitas: string | null;
    cover: string | null;
    deskripsi: string | null;
};

type TamuData = {
    nik: string;
    nama: string;
};

type Props = {
    kamar: KamarItem[];
    tamu: TamuData;
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function Booking({ kamar }: Props) {
    const { errors } = usePage().props as { errors: Record<string, string> };

    const [selectedKamar, setSelectedKamar] = useState('');
    const [tglcheckin, setTglcheckin] = useState('');
    const [tglcheckout, setTglcheckout] = useState('');
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState<boolean | null>(null);
    const [total, setTotal] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const selectedRoom = kamar.find((k) => k.id_kamar === selectedKamar);

    const days = useMemo(() => {
        if (!tglcheckin || !tglcheckout) {
            return 0;
        }

        const diff = new Date(tglcheckout).getTime() - new Date(tglcheckin).getTime();

        return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
    }, [tglcheckin, tglcheckout]);

    const handleCheckAvailability = useCallback(async () => {
        if (!selectedKamar || !tglcheckin || !tglcheckout) {
            return;
        }

        setChecking(true);
        setAvailable(null);

        try {
            const response = await fetch('/portal/booking/check-availability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    idkamar: selectedKamar,
                    tglcheckin,
                    tglcheckout,
                }),
            });

            const data = await response.json();
            setAvailable(data.available);
            setTotal(data.total);
        } catch {
            setAvailable(false);
        } finally {
            setChecking(false);
        }
    }, [selectedKamar, tglcheckin, tglcheckout]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        router.post('/portal/booking', {
            idkamar: selectedKamar,
            tglcheckin,
            tglcheckout,
            totalbayar: total,
            tipe: 'transfer',
        }, {
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <>
            <Head title="Booking Kamar" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <BedDouble className="h-6 w-6" />
                    <h1 className="text-2xl font-bold">Booking Kamar</h1>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pilih Kamar</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {kamar.map((k) => (
                                        <div
                                            key={k.id_kamar}
                                            className={`cursor-pointer rounded-md border p-4 transition-all ${
                                                selectedKamar === k.id_kamar
                                                    ? 'border-primary bg-primary/5 ring-2 ring-primary'
                                                    : 'hover:border-muted-foreground/50'
                                            }`}
                                            onClick={() => {
                                                setSelectedKamar(k.id_kamar);
                                                setAvailable(null);
                                            }}
                                        >
                                            {k.cover && (
                                                <img
                                                    src={`/storage/${k.cover}`}
                                                    alt={k.nama}
                                                    className="mb-3 h-32 w-full rounded object-cover"
                                                />
                                            )}
                                            <p className="font-semibold">{k.nama}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatRupiah(k.harga)}/malam
                                            </p>
                                            {k.deskripsi && (
                                                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                                    {k.deskripsi}
                                                </p>
                                            )}
                                            {selectedKamar === k.id_kamar && (
                                                <Badge className="mt-2">Dipilih</Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {errors.idkamar && <p className="mt-2 text-sm text-destructive">{errors.idkamar}</p>}
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Detail Booking
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="tglcheckin">Check-in</Label>
                                        <Input
                                            id="tglcheckin"
                                            type="date"
                                            value={tglcheckin}
                                            onChange={(e) => {
                                                setTglcheckin(e.target.value);
                                                setAvailable(null);
                                            }}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                        {errors.tglcheckin && <p className="text-sm text-destructive">{errors.tglcheckin}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tglcheckout">Check-out</Label>
                                        <Input
                                            id="tglcheckout"
                                            type="date"
                                            value={tglcheckout}
                                            onChange={(e) => {
                                                setTglcheckout(e.target.value);
                                                setAvailable(null);
                                            }}
                                            min={tglcheckin || new Date().toISOString().split('T')[0]}
                                        />
                                        {errors.tglcheckout && <p className="text-sm text-destructive">{errors.tglcheckout}</p>}
                                    </div>

                                    {selectedKamar && tglcheckin && tglcheckout && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            onClick={handleCheckAvailability}
                                            disabled={checking}
                                        >
                                            {checking && <Loader2 className="h-4 w-4 animate-spin" />}
                                            Cek Ketersediaan
                                        </Button>
                                    )}

                                    {available === true && (
                                        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                                            Kamar tersedia! {selectedRoom && (
                                                <span>
                                                    {formatRupiah(selectedRoom.harga)} × {days} malam = {formatRupiah(total)}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {available === false && (
                                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                                            Kamar tidak tersedia pada tanggal tersebut.
                                        </div>
                                    )}

                                    {selectedRoom && days > 0 && (
                                        <div className="rounded-md bg-muted p-3 text-sm space-y-1">
                                            <div className="flex justify-between">
                                                <span>Harga/Malam</span>
                                                <span>{formatRupiah(selectedRoom.harga)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Durasi</span>
                                                <span>{days} malam</span>
                                            </div>
                                            <div className="flex justify-between border-t pt-1 font-semibold">
                                                <span>Total Bayar</span>
                                                <span>{formatRupiah(total)}</span>
                                            </div>
                                        </div>
                                    )}

                                    <input type="hidden" name="totalbayar" value={total} />

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={!available || submitting}
                                    >
                                        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                        <CreditCard className="h-4 w-4" />
                                        Booking Sekarang
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

Booking.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/portal' },
        { title: 'Booking', href: '/portal/booking' },
    ],
};
