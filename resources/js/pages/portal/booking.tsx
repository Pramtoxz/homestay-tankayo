import { Head, router, usePage } from '@inertiajs/react';
import { BedDouble, Calendar, CheckCircle2, CreditCard, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type TipeSummary = {
    tipe_kamar: string;
    total: number;
    tersedia: number;
    harga_mulai: number | null;
};

type KamarItem = {
    id_kamar: string;
    nama: string;
    tipe_kamar: string;
    harga: number;
    fasilitas: string | null;
    cover: string | null;
    deskripsi: string | null;
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const todayStr = () => {
    const d = new Date();

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function Booking() {
    const { errors } = usePage().props as { errors: Record<string, string> };

    const [tglcheckin, setTglcheckin] = useState('');
    const [tglcheckout, setTglcheckout] = useState('');

    const [tipeSummary, setTipeSummary] = useState<TipeSummary[] | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);

    const [selectedTipe, setSelectedTipe] = useState<string | null>(null);
    const [kamarList, setKamarList] = useState<KamarItem[] | null>(null);
    const [loadingKamar, setLoadingKamar] = useState(false);

    const [selectedKamar, setSelectedKamar] = useState<KamarItem | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const min = useMemo(() => todayStr(), []);

    const minCheckout = useMemo(() => {
        if (!tglcheckin) {
            return min;
        }

        const [y, m, d] = tglcheckin.split('-').map(Number);
        const next = new Date(y, m - 1, d + 1);

        return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
    }, [tglcheckin, min]);

    const days = useMemo(() => {
        if (!tglcheckin || !tglcheckout) {
            return 0;
        }

        const diff = new Date(tglcheckout).getTime() - new Date(tglcheckin).getTime();

        return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
    }, [tglcheckin, tglcheckout]);

    const tanggalValid = tglcheckin !== '' && tglcheckout !== '' && days > 0;

    // Reset pilihan tipe/kamar tiap tanggal berubah (adjust state during render, bukan di useEffect).
    const [prevCheckin, setPrevCheckin] = useState(tglcheckin);
    const [prevCheckout, setPrevCheckout] = useState(tglcheckout);

    if (prevCheckin !== tglcheckin || prevCheckout !== tglcheckout) {
        setPrevCheckin(tglcheckin);
        setPrevCheckout(tglcheckout);
        setSelectedTipe(null);
        setKamarList(null);
        setSelectedKamar(null);
        setTipeSummary(null);
    }

    useEffect(() => {
        if (!tanggalValid) {
            return;
        }

        const timeout = setTimeout(async () => {
            setLoadingSummary(true);

            try {
                const params = new URLSearchParams({ tglcheckin, tglcheckout });
                const response = await fetch(`/portal/booking-search/tipe-summary?${params.toString()}`, {
                    headers: { Accept: 'application/json' },
                });

                const data: TipeSummary[] = response.ok ? await response.json() : [];
                setTipeSummary(data);
            } catch {
                setTipeSummary([]);
            } finally {
                setLoadingSummary(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [tanggalValid, tglcheckin, tglcheckout]);

    useEffect(() => {
        if (!selectedTipe || !tanggalValid) {
            return;
        }

        const timeout = setTimeout(async () => {
            setLoadingKamar(true);

            try {
                const params = new URLSearchParams({ tglcheckin, tglcheckout, tipe_kamar: selectedTipe });
                const response = await fetch(`/portal/booking-search/kamar?${params.toString()}`, {
                    headers: { Accept: 'application/json' },
                });

                const data: KamarItem[] = response.ok ? await response.json() : [];
                setKamarList(data);
            } catch {
                setKamarList([]);
            } finally {
                setLoadingKamar(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [selectedTipe, tanggalValid, tglcheckin, tglcheckout]);

    const total = selectedKamar ? selectedKamar.harga * days : 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedKamar) {
            return;
        }

        setSubmitting(true);

        router.post(
            '/portal/booking',
            {
                idkamar: selectedKamar.id_kamar,
                tglcheckin,
                tglcheckout,
                totalbayar: total,
                tipe: 'transfer',
            },
            { onFinish: () => setSubmitting(false) },
        );
    };

    return (
        <>
            <Head title="Booking Kamar" />
            <div className="mx-auto flex h-full max-w-3xl flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <BedDouble className="h-6 w-6" />
                    <h1 className="text-2xl font-bold">Booking Kamar</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Calendar className="h-4 w-4" />
                            1. Pilih Tanggal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="tglcheckin">Check-in</Label>
                                <Input
                                    id="tglcheckin"
                                    type="date"
                                    value={tglcheckin}
                                    min={min}
                                    onChange={(e) => setTglcheckin(e.target.value)}
                                />
                                {errors.tglcheckin && <p className="text-sm text-destructive">{errors.tglcheckin}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tglcheckout">Check-out</Label>
                                <Input
                                    id="tglcheckout"
                                    type="date"
                                    value={tglcheckout}
                                    min={minCheckout}
                                    onChange={(e) => setTglcheckout(e.target.value)}
                                />
                                {errors.tglcheckout && <p className="text-sm text-destructive">{errors.tglcheckout}</p>}
                            </div>
                        </div>
                        {!tanggalValid && (
                            <p className="mt-2 text-sm text-muted-foreground">
                                Pilih tanggal check-in &amp; check-out untuk melihat kamar yang tersedia.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {tanggalValid && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">2. Pilih Tipe Kamar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingSummary ? (
                                <div className="flex justify-center py-6">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {tipeSummary?.map((s) => {
                                        const penuh = s.tersedia <= 0;
                                        const active = selectedTipe === s.tipe_kamar;

                                        return (
                                            <button
                                                key={s.tipe_kamar}
                                                type="button"
                                                disabled={penuh}
                                                onClick={() => {
                                                    setSelectedTipe(s.tipe_kamar);
                                                    setSelectedKamar(null);
                                                }}
                                                className={`rounded-md border p-4 text-left transition-all ${
                                                    penuh
                                                        ? 'cursor-not-allowed opacity-50'
                                                        : active
                                                          ? 'border-primary bg-primary/5 ring-2 ring-primary'
                                                          : 'hover:border-muted-foreground/50'
                                                }`}
                                            >
                                                <p className="font-semibold">{s.tipe_kamar}</p>
                                                {s.harga_mulai !== null && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Mulai {formatRupiah(s.harga_mulai)}/malam
                                                    </p>
                                                )}
                                                <Badge variant={penuh ? 'destructive' : 'outline'} className="mt-2">
                                                    {penuh ? 'Penuh' : `${s.tersedia} dari ${s.total} tersedia`}
                                                </Badge>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {selectedTipe && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">3. Pilih Kamar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingKamar ? (
                                <div className="flex justify-center py-6">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            ) : kamarList && kamarList.length > 0 ? (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {kamarList.map((k) => (
                                        <div
                                            key={k.id_kamar}
                                            className={`cursor-pointer rounded-md border p-4 transition-all ${
                                                selectedKamar?.id_kamar === k.id_kamar
                                                    ? 'border-primary bg-primary/5 ring-2 ring-primary'
                                                    : 'hover:border-muted-foreground/50'
                                            }`}
                                            onClick={() => setSelectedKamar(k)}
                                        >
                                            {k.cover && (
                                                <img
                                                    src={`/storage/${k.cover}`}
                                                    alt={k.nama}
                                                    className="mb-3 h-32 w-full rounded object-cover"
                                                />
                                            )}
                                            <p className="font-semibold">{k.nama}</p>
                                            <p className="text-sm text-muted-foreground">{formatRupiah(k.harga)}/malam</p>
                                            {k.fasilitas && <p className="mt-1 text-xs text-muted-foreground">{k.fasilitas}</p>}
                                            {selectedKamar?.id_kamar === k.id_kamar && (
                                                <Badge className="mt-2">
                                                    <CheckCircle2 className="h-3 w-3" /> Dipilih
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Tidak ada kamar tipe ini yang tersedia untuk tanggal tersebut.
                                </p>
                            )}
                            {errors.idkamar && <p className="mt-2 text-sm text-destructive">{errors.idkamar}</p>}
                        </CardContent>
                    </Card>
                )}

                {selectedKamar && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">4. Konfirmasi Booking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="rounded-md bg-muted p-3 text-sm space-y-1">
                                    <div className="flex justify-between">
                                        <span>Kamar</span>
                                        <span className="font-medium">{selectedKamar.nama}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Harga/Malam</span>
                                        <span>{formatRupiah(selectedKamar.harga)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Durasi</span>
                                        <span>{days} malam</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-1 font-semibold">
                                        <span>Total Bayar</span>
                                        <span>{formatRupiah(total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tipe Pembayaran</span>
                                        <Badge variant="outline">Transfer</Badge>
                                    </div>
                                </div>
                                {errors.totalbayar && <p className="text-sm text-destructive">{errors.totalbayar}</p>}

                                <Button type="submit" className="w-full" disabled={submitting}>
                                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                    <CreditCard className="h-4 w-4" />
                                    Booking Sekarang
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

Booking.layout = {
    breadcrumbs: [
        { title: 'Reservasi', href: '/portal' },
        { title: 'Booking', href: '/portal/booking' },
    ],
};
