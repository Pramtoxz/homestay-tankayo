import { Head, router } from '@inertiajs/react';
import { CalendarCheck, CalendarPlus, History, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Stats = {
    total_booking: number;
    active: number;
    completed: number;
};

type BookingItem = {
    idbooking: string;
    kamar: { nama: string } | null;
    tglcheckin: string;
    tglcheckout: string;
    totalbayar: number;
    status: string;
};

type RoomItem = {
    id_kamar: string;
    nama: string;
    harga: number;
    dp: number;
    cover: string | null;
    deskripsi: string | null;
};

type Props = {
    stats: Stats;
    recentBookings: BookingItem[];
    availableRooms: RoomItem[];
    hasTamu: boolean;
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

export default function PortalDashboard({ stats, recentBookings, availableRooms, hasTamu }: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {!hasTamu && (
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardContent className="flex items-center justify-between py-4">
                            <div>
                                <p className="font-medium">Lengkapi Data Diri Anda</p>
                                <p className="text-sm text-muted-foreground">
                                    Silakan lengkapi data diri untuk dapat melakukan booking.
                                </p>
                            </div>
                            <Button onClick={() => router.get('/portal/lengkapi-data')}>
                                Lengkapi Data
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
                            <CalendarPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_booking}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Booking Aktif</CardTitle>
                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Selesai</CardTitle>
                            <History className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Booking Terbaru</CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => router.get('/portal/booking/history')}>
                                    Lihat Semua
                                    <ArrowRight className="h-3 w-3" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recentBookings.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Belum ada booking.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {recentBookings.map((b) => (
                                        <li
                                            key={b.idbooking}
                                            className="flex items-center justify-between rounded-md border p-3 text-sm cursor-pointer hover:bg-muted/50"
                                            onClick={() => router.get(`/portal/booking/${b.idbooking}`)}
                                        >
                                            <div>
                                                <p className="font-medium">{b.kamar?.nama ?? '-'}</p>
                                                <p className="text-muted-foreground">
                                                    {b.tglcheckin} — {b.tglcheckout}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <Badge className={statusColor[b.status] ?? ''}>{b.status}</Badge>
                                                <p className="mt-1 text-xs">{formatRupiah(b.totalbayar)}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Kamar Tersedia</CardTitle>
                                {hasTamu && (
                                    <Button variant="ghost" size="sm" onClick={() => router.get('/portal/booking')}>
                                        Booking Sekarang
                                        <ArrowRight className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {availableRooms.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Tidak ada kamar tersedia.</p>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {availableRooms.map((r) => (
                                        <div key={r.id_kamar} className="rounded-md border p-3">
                                            {r.cover && (
                                                <img
                                                    src={`/storage/${r.cover}`}
                                                    alt={r.nama}
                                                    className="mb-2 h-24 w-full rounded object-cover"
                                                />
                                            )}
                                            <p className="font-medium">{r.nama}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatRupiah(r.harga)}/malam
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

PortalDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/portal' }],
};
