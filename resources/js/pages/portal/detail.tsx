import { Head, router } from '@inertiajs/react';
import { ArrowLeft, BedDouble, Calendar, CreditCard, Upload, XCircle, Clock, CheckCircle, XOctagon, FileText } from 'lucide-react';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { formatTanggal } from '@/lib/utils';

type ReservasiDetail = {
    idbooking: string;
    nik: string;
    idkamar: string;
    tglcheckin: string;
    tglcheckout: string;
    totalbayar: number;
    tipe: string;
    status: string;
    buktibayar: string | null;
    online: boolean;
    batas_waktu: string | null;
    tamu: { nik: string; nama: string; alamat: string; nohp: string } | null;
    kamar: { id_kamar: string; nama: string; harga: number; fasilitas: string | null } | null;
};

type Props = {
    reservasi: ReservasiDetail;
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const statusColor: Record<string, string> = {
    diproses: 'bg-yellow-100 text-yellow-800',
    diterima: 'bg-green-100 text-green-800',
    ditolak: 'bg-red-100 text-red-800',
    checkin: 'bg-blue-100 text-blue-800',
    selesai: 'bg-gray-100 text-gray-800',
    cancel: 'bg-red-100 text-red-800',
    limit: 'bg-orange-100 text-orange-800',
};

const statusSteps = [
    { key: 'diproses', label: 'Diproses', icon: Clock },
    { key: 'diterima', label: 'Diterima', icon: CheckCircle },
    { key: 'checkin', label: 'Check-in', icon: Calendar },
    { key: 'selesai', label: 'Selesai', icon: CheckCircle },
];

const getStepIndex = (status: string) => {
    if (status === 'ditolak' || status === 'cancel' || status === 'limit') {
        return -1;
    }

    return statusSteps.findIndex((s) => s.key === status);
};

export default function BookingDetail({ reservasi }: Props) {
    const days =
        Math.max(
            Math.ceil(
                (new Date(reservasi.tglcheckout).getTime() - new Date(reservasi.tglcheckin).getTime()) /
                    (1000 * 60 * 60 * 24),
            ),
            0,
        );

    const stepIndex = getStepIndex(reservasi.status);
    const isFailed = ['ditolak', 'cancel', 'limit'].includes(reservasi.status);
    const canUpload = reservasi.status === 'ditolak' || (reservasi.status === 'diproses' && !reservasi.buktibayar);
    const awaitingVerification = reservasi.status === 'diproses' && !!reservasi.buktibayar;
    const canCancel = reservasi.status === 'diproses' && !reservasi.buktibayar;
    const justApproved = reservasi.status === 'diterima';
    const canDownloadFaktur = ['diterima', 'checkin', 'selesai'].includes(reservasi.status);
    const fakturUrl = `/portal/booking/${reservasi.idbooking}/faktur`;

    useEffect(() => {
        if (justApproved) {
            window.open(fakturUrl, '_blank');
        }
    }, [justApproved, fakturUrl]);

    return (
        <>
            <Head title={`Booking ${reservasi.idbooking}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.get('/portal')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">Detail Booking</h1>
                    <Badge className={statusColor[reservasi.status] ?? ''}>{reservasi.status}</Badge>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Status Booking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isFailed ? (
                            <div className="flex items-center gap-2 rounded-md bg-red-50 p-4 text-red-800">
                                <XOctagon className="h-5 w-5" />
                                <span className="font-medium">
                                    Booking {reservasi.status === 'cancel' ? 'dibatalkan' : reservasi.status === 'ditolak' ? 'ditolak' : 'kedaluwarsa'}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                {statusSteps.map((step, i) => {
                                    const Icon = step.icon;
                                    const isActive = i <= stepIndex;

                                    return (
                                        <div key={step.key} className="flex flex-1 items-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                        isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <span className={`text-xs ${isActive ? 'font-medium' : 'text-muted-foreground'}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                            {i < statusSteps.length - 1 && (
                                                <div className={`mx-2 h-0.5 flex-1 ${i < stepIndex ? 'bg-primary' : 'bg-muted'}`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {awaitingVerification && (
                            <div className="mt-4 flex items-center gap-2 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
                                <Clock className="h-4 w-4" />
                                <span className="font-medium">Bukti bayar sudah diupload. Menunggu verifikasi admin.</span>
                            </div>
                        )}

                        {justApproved && (
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="font-medium">Booking disetujui! Faktur sudah bisa diunduh.</span>
                                </div>
                                <Button size="sm" onClick={() => window.open(fakturUrl, '_blank')}>
                                    <FileText className="h-4 w-4" />
                                    Cetak Faktur
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <BedDouble className="h-4 w-4" /> Informasi Kamar
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">ID Kamar</span>
                                <span className="font-mono">{reservasi.kamar?.id_kamar ?? '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Nama</span>
                                <span className="font-medium">{reservasi.kamar?.nama ?? '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Harga/Malam</span>
                                <span>{reservasi.kamar ? formatRupiah(reservasi.kamar.harga) : '-'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Calendar className="h-4 w-4" /> Informasi Booking
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">ID Booking</span>
                                <span className="font-mono">{reservasi.idbooking}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Check-in</span>
                                <span>{formatTanggal(reservasi.tglcheckin)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Check-out</span>
                                <span>{formatTanggal(reservasi.tglcheckout)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Durasi</span>
                                <span>{days} malam</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CreditCard className="h-4 w-4" /> Pembayaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Bayar</span>
                                <span className="font-semibold">{formatRupiah(reservasi.totalbayar)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tipe</span>
                                <Badge variant="outline">{reservasi.tipe}</Badge>
                            </div>
                            {reservasi.batas_waktu && reservasi.status === 'diproses' && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Batas Waktu</span>
                                    <span className="text-orange-600 font-medium">
                                        {new Date(reservasi.batas_waktu).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Bukti Bayar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {reservasi.buktibayar ? (
                                <img
                                    src={`/storage/${reservasi.buktibayar}`}
                                    alt="Bukti Bayar"
                                    className="max-h-48 rounded border object-contain"
                                />
                            ) : (
                                <p className="text-sm text-muted-foreground">Belum upload bukti bayar.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Separator />

                <div className="flex gap-2">
                    {canUpload && (
                        <Button onClick={() => router.get(`/portal/booking/${reservasi.idbooking}/payment`)}>
                            <Upload className="h-4 w-4" />
                            Upload Bukti Bayar
                        </Button>
                    )}
                    {canDownloadFaktur && !justApproved && (
                        <Button variant="outline" onClick={() => window.open(fakturUrl, '_blank')}>
                            <FileText className="h-4 w-4" />
                            Cetak Faktur
                        </Button>
                    )}
                    {canCancel && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="destructive">
                                    <XCircle className="h-4 w-4" />
                                    Batalkan Booking
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Batalkan Booking?</DialogTitle>
                                    <DialogDescription>
                                        Booking {reservasi.idbooking} akan dibatalkan. Tindakan ini tidak dapat diurungkan.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => {}}>
                                        Tidak
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => router.post(`/portal/booking/${reservasi.idbooking}/cancel`)}
                                    >
                                        Ya, Batalkan
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                    <Button variant="outline" onClick={() => router.get('/portal')}>
                        Kembali
                    </Button>
                </div>
            </div>
        </>
    );
}

BookingDetail.layout = {
    breadcrumbs: [
        { title: 'Reservasi', href: '/portal' },
        { title: 'Detail', href: '#' },
    ],
};
