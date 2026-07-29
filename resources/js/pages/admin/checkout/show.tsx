import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatTanggal } from '@/lib/utils';

type CheckoutDetail = {
    idcheckout: string;
    idcheckin: string;
    tglcheckout: string;
    potongan: number;
    grandtotal: number;
    keterangan: string | null;
    checkin: {
        idcheckin: string;
        deposit: number;
        reservasi: {
            idbooking: string;
            tglcheckin: string;
            tglcheckout: string;
            totalbayar: number;
            tipe: string;
            tamu: { nik: string; nama: string; alamat: string; nohp: string } | null;
            kamar: { id_kamar: string; nama: string; harga: number } | null;
        } | null;
    } | null;
};

type Props = {
    checkout: CheckoutDetail;
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function CheckoutShow({ checkout }: Props) {
    const r = checkout.checkin?.reservasi;

    return (
        <>
            <Head title={`Check-out ${checkout.idcheckout}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => router.get('/admin/checkout')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-bold">Invoice Check-out</h1>
                    </div>
                    <Button variant="outline" onClick={() => window.open(`/admin/checkout/${checkout.idcheckout}/faktur`, '_blank')}>
                        <Printer className="h-4 w-4" />
                        Cetak Faktur
                    </Button>
                </div>

                <Card className="print:shadow-none">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-xl">HOTEL TANKAYO</CardTitle>
                                <p className="text-sm text-muted-foreground">Invoice Check-out</p>
                            </div>
                            <div className="text-right text-sm">
                                <p className="font-mono font-semibold">{checkout.idcheckout}</p>
                                <p className="text-muted-foreground">{formatTanggal(checkout.tglcheckout)}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    Tamu
                                </h3>
                                <p className="font-medium">{r?.tamu?.nama ?? '-'}</p>
                                <p className="text-sm">{r?.tamu?.alamat ?? '-'}</p>
                                <p className="text-sm">{r?.tamu?.nohp ?? '-'}</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    Kamar
                                </h3>
                                <p className="font-medium">{r?.kamar?.nama ?? '-'}</p>
                                <p className="text-sm">{r ? formatRupiah(r.kamar?.harga ?? 0) + '/malam' : '-'}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid gap-4 md:grid-cols-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Booking</p>
                                <p className="font-mono font-medium">{r?.idbooking ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Check-in</p>
                                <p className="font-medium">{formatTanggal(r?.tglcheckin)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Check-out</p>
                                <p className="font-medium">{formatTanggal(r?.tglcheckout)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Tipe Bayar</p>
                                <Badge variant="outline">{r?.tipe ?? '-'}</Badge>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            {(() => {
                                const deposit = checkout.checkin?.deposit ?? 0;
                                const potongan = checkout.potongan;
                                const grandtotal = (r?.totalbayar ?? 0) + potongan;
                                const kekurangan = potongan > deposit ? potongan - deposit : 0;
                                const isKekurangan = kekurangan > 0;
                                const isKembalian = deposit > potongan && potongan > 0;

                                return (
                                    <div className={`rounded-md p-4 space-y-2 ${isKekurangan ? 'border-2 border-red-300 bg-red-50' : isKembalian ? 'border-2 border-green-300 bg-green-50' : 'border bg-card'}`}>
                                        {potongan > 0 ? (
                                            <>
                                                <div className="flex justify-between text-sm">
                                                    <span>Total Reservasi Yang Sudah Dibayar Lunas Di Muka</span>
                                                    <span>{formatRupiah(r?.totalbayar ?? 0)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm border-t pt-2">
                                                    <span>Potongan/Denda</span>
                                                    <span>{formatRupiah(potongan)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm border-t pt-2 font-semibold">
                                                    <span>Grand Total</span>
                                                    <span>{formatRupiah(grandtotal)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm border-t pt-2">
                                                    <span>Deposit Yang Sudah Masuk</span>
                                                    <span>{formatRupiah(deposit)}</span>
                                                </div>
                                                {isKekurangan && (
                                                    <div className="flex justify-between border-t pt-2 text-base font-bold text-red-700">
                                                        <span>Kekurangan Yang Harus Dibayar Tamu</span>
                                                        <span>{formatRupiah(kekurangan)}</span>
                                                    </div>
                                                )}
                                                {isKembalian && (
                                                    <div className="flex justify-between border-t pt-2 text-base font-bold text-green-700">
                                                        <span>Deposit Yang Harus Dikembalikan Ke Tamu</span>
                                                        <span>{formatRupiah(deposit - potongan)}</span>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="flex justify-between text-sm">
                                                <span>Total Reservasi</span>
                                                <span className="font-semibold">{formatRupiah(r?.totalbayar ?? 0)}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>

                        {checkout.keterangan && (
                            <div className="rounded-md bg-muted p-3 text-sm">
                                <p className="text-muted-foreground">Keterangan:</p>
                                <p>{checkout.keterangan}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CheckoutShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Check-out', href: '/admin/checkout' },
        { title: 'Detail', href: '#' },
    ],
};
