import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatTanggal, formatWaktu } from '@/lib/utils';

type CheckinDetail = {
    idcheckin: string;
    idbooking: string;
    deposit: number;
    created_at: string;
    reservasi: {
        idbooking: string;
        nik: string;
        idkamar: string;
        tglcheckin: string;
        tglcheckout: string;
        totalbayar: number;
        tipe: string;
        status: string;
        tamu: { nik: string; nama: string; alamat: string; nohp: string } | null;
        kamar: { id_kamar: string; nama: string; harga: number } | null;
    } | null;
    checkout: {
        idcheckout: string;
        tglcheckout: string;
        potongan: number;
        grandtotal: number;
        keterangan: string | null;
    } | null;
};

type Props = {
    checkin: CheckinDetail;
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function CheckinShow({ checkin }: Props) {
    const r = checkin.reservasi;
    const days = r
        ? Math.max(
              Math.ceil(
                  (new Date(r.tglcheckout).getTime() - new Date(r.tglcheckin).getTime()) / (1000 * 60 * 60 * 24),
              ),
              0,
          )
        : 0;

    return (
        <>
            <Head title={`Check-in ${checkin.idcheckin}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => router.get('/admin/checkin')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-bold">Invoice Check-in</h1>
                    </div>
                    <Button variant="outline" onClick={() => window.print()}>
                        <Printer className="h-4 w-4" />
                        Cetak
                    </Button>
                </div>

                <Card className="print:shadow-none">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-xl">HOTEL TANKAYO</CardTitle>
                                <p className="text-sm text-muted-foreground">Invoice Check-in</p>
                            </div>
                            <div className="text-right text-sm">
                                <p className="font-mono">{checkin.idcheckin}</p>
                                <p className="text-muted-foreground">{formatWaktu(checkin.created_at)}</p>
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
                                <p className="text-sm">{days} malam</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid gap-4 md:grid-cols-4 text-sm">
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
                            <div>
                                <p className="text-muted-foreground">Status</p>
                                <Badge className="bg-blue-100 text-blue-800">{r?.status ?? '-'}</Badge>
                            </div>
                        </div>

                        <Separator />

                        <div className="ml-auto max-w-sm space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Bayar</span>
                                <span>{formatRupiah(r?.totalbayar ?? 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Deposit</span>
                                <span>{formatRupiah(checkin.deposit)}</span>
                            </div>
                        </div>

                        {checkin.checkout && (
                            <>
                                <Separator />
                                <div className="rounded-md bg-muted p-4">
                                    <h4 className="mb-2 font-semibold">Informasi Check-out</h4>
                                    <div className="grid gap-4 md:grid-cols-3 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">ID Checkout</p>
                                            <p className="font-mono font-medium">{checkin.checkout.idcheckout}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Tanggal</p>
                                            <p className="font-medium">{formatTanggal(checkin.checkout.tglcheckout)}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Potongan</p>
                                            <p className="font-medium">{formatRupiah(checkin.checkout.potongan)}</p>
                                        </div>
                                    </div>
                                    <Separator className="my-3" />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Grand Total</span>
                                        <span>{formatRupiah(checkin.checkout.grandtotal)}</span>
                                    </div>
                                    {checkin.checkout.keterangan && (
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Keterangan: {checkin.checkout.keterangan}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CheckinShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Check-in', href: '/admin/checkin' },
        { title: 'Detail', href: '#' },
    ],
};
