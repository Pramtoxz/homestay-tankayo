import { Head, router } from '@inertiajs/react';
import { ArrowLeft, User, BedDouble, Calendar, CreditCard, Check, X, ImageOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
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
    online: boolean;
    buktibayar: string | null;
    tamu: { nik: string; nama: string; alamat: string; nohp: string; jk: string } | null;
    kamar: { id_kamar: string; nama: string; harga: number; fasilitas: string | null } | null;
    checkin: {
        idcheckin: string;
        deposit: number;
        checkout: {
            idcheckout: string;
            tglcheckout: string;
            potongan: number;
            grandtotal: number;
            keterangan: string | null;
        } | null;
    } | null;
};

type RekeningItem = {
    id: number;
    jenis: string;
    nama: string;
    nomor: string | null;
    foto: string | null;
};

type Props = {
    reservasi: ReservasiDetail;
    rekening: RekeningItem[];
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
};

export default function ReservasiShow({ reservasi, rekening }: Props) {
    const canReview = reservasi.online && reservasi.status === 'diproses';

    const handleApprove = () => {
        router.post(`/admin/reservasi/${reservasi.idbooking}/approve`);
    };

    const handleReject = () => {
        router.post(`/admin/reservasi/${reservasi.idbooking}/reject`);
    };

    const days =
        Math.max(
            Math.ceil(
                (new Date(reservasi.tglcheckout).getTime() - new Date(reservasi.tglcheckin).getTime()) /
                    (1000 * 60 * 60 * 24),
            ),
            0,
        );

    return (
        <>
            <Head title={`Reservasi ${reservasi.idbooking}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.get('/admin/reservasi')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">Detail Reservasi</h1>
                    <Badge className={statusColor[reservasi.status] ?? ''}>{reservasi.status}</Badge>

                    {canReview && (
                        <div className="ml-auto flex gap-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        disabled={!reservasi.buktibayar}
                                        title={!reservasi.buktibayar ? 'Tamu belum upload bukti bayar' : undefined}
                                    >
                                        <Check className="h-4 w-4" />
                                        Setujui
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Setujui Reservasi?</DialogTitle>
                                        <DialogDescription>
                                            Reservasi {reservasi.idbooking} akan disetujui. Tamu akan bisa mengunduh faktur.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Batal</Button>
                                        </DialogClose>
                                        <Button onClick={handleApprove}>Ya, Setujui</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                        <X className="h-4 w-4" />
                                        Tolak
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Tolak Reservasi?</DialogTitle>
                                        <DialogDescription>
                                            Reservasi {reservasi.idbooking} akan ditolak. Tamu bisa upload ulang bukti bayar.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Batal</Button>
                                        </DialogClose>
                                        <Button variant="destructive" onClick={handleReject}>
                                            Ya, Tolak
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="h-4 w-4" /> Informasi Tamu
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">NIK</span>
                                <span className="font-mono">{reservasi.tamu?.nik ?? '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Nama</span>
                                <span className="font-medium">{reservasi.tamu?.nama ?? '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Alamat</span>
                                <span>{reservasi.tamu?.alamat ?? '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">No HP</span>
                                <span>{reservasi.tamu?.nohp ?? '-'}</span>
                            </div>
                        </CardContent>
                    </Card>

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
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Fasilitas</span>
                                <span>{reservasi.kamar?.fasilitas ?? '-'}</span>
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
                            {reservasi.online && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Sumber</span>
                                    <Badge variant="outline">Booking Online</Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {reservasi.online && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Bukti Bayar</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {reservasi.buktibayar ? (
                                    <a
                                        href={`/storage/${reservasi.buktibayar}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={`/storage/${reservasi.buktibayar}`}
                                            alt="Bukti bayar"
                                            className="max-h-64 w-full rounded-md border object-contain"
                                        />
                                    </a>
                                ) : (
                                    <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground">
                                        <ImageOff className="h-6 w-6" />
                                        Tamu belum upload bukti bayar
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {rekening.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Info Rekening (Tampilan Tamu)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    {rekening.map((r) => (
                                        <div key={r.id} className="flex items-center justify-between rounded-md border p-2">
                                            <div className="flex items-center gap-2">
                                                {r.foto && (
                                                    <img src={`/storage/${r.foto}`} alt={r.nama} className="h-8 w-8 rounded object-cover" />
                                                )}
                                                <Badge variant="outline">{r.nama}</Badge>
                                                <span className="text-xs text-muted-foreground capitalize">{r.jenis}</span>
                                            </div>
                                            {r.nomor && <span className="font-mono text-sm">{r.nomor}</span>}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {reservasi.checkin && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Informasi Check-in</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 text-sm">
                                <div>
                                    <p className="text-muted-foreground">ID Check-in</p>
                                    <p className="font-mono font-medium">{reservasi.checkin.idcheckin}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Deposit</p>
                                    <p className="font-medium">{formatRupiah(reservasi.checkin.deposit)}</p>
                                </div>
                            </div>

                            {reservasi.checkin.checkout && (
                                <>
                                    <Separator className="my-4" />
                                    <h4 className="mb-2 font-medium">Check-out</h4>
                                    <div className="grid gap-4 md:grid-cols-3 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">ID Checkout</p>
                                            <p className="font-mono font-medium">
                                                {reservasi.checkin.checkout.idcheckout}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Tanggal</p>
                                            <p className="font-medium">{formatTanggal(reservasi.checkin.checkout.tglcheckout)}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Potongan/Denda</p>
                                            <p className="font-medium">
                                                {formatRupiah(reservasi.checkin.checkout.potongan)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Grand Total</p>
                                            <p className="text-lg font-bold">
                                                {formatRupiah(reservasi.checkin.checkout.grandtotal)}
                                            </p>
                                        </div>
                                        {reservasi.checkin.checkout.keterangan && (
                                            <div className="md:col-span-2">
                                                <p className="text-muted-foreground">Keterangan</p>
                                                <p>{reservasi.checkin.checkout.keterangan}</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

ReservasiShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Reservasi', href: '/admin/reservasi' },
        { title: 'Detail', href: '#' },
    ],
};
