import { Head } from '@inertiajs/react';
import { BedDouble, Users, CalendarCheck, CalendarMinus, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';

type Stats = {
    total_tamu: number;
    total_kamar: number;
    kamar_tersedia: number;
    kamar_terisi: number;
    reservasi_hari_ini: number;
    checkin_hari_ini: number;
    checkout_hari_ini: number;
    pendapatan_bulan_ini: number;
};

type ReservasiItem = {
    idbooking: string;
    tamu: { nama: string } | null;
    kamar: { nama: string } | null;
    status: string;
    tglcheckin: string;
    tglcheckout: string;
};

type Props = {
    stats: Stats;
    reservasi_hari_ini: ReservasiItem[];
    checkin_today: ReservasiItem[];
    checkout_today: ReservasiItem[];
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

export default function Dashboard({ stats, reservasi_hari_ini, checkin_today, checkout_today }: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Tamu</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_tamu}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Kamar Tersedia</CardTitle>
                            <BedDouble className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.kamar_tersedia}</div>
                            <p className="text-xs text-muted-foreground">dari {stats.total_kamar} kamar</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pendapatan Bulan Ini</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatRupiah(stats.pendapatan_bulan_ini)}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <CalendarCheck className="h-4 w-4" /> Reservasi Hari Ini ({stats.reservasi_hari_ini})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {reservasi_hari_ini.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Tidak ada reservasi hari ini</p>
                            ) : (
                                <ul className="space-y-2">
                                    {reservasi_hari_ini.map((r) => (
                                        <li key={r.idbooking} className="flex items-center justify-between text-sm">
                                            <span>{r.tamu?.nama ?? '-'}</span>
                                            <Badge className={statusColor[r.status] ?? ''}>{r.status}</Badge>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <CalendarCheck className="h-4 w-4" /> Check-In Hari Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {checkin_today.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Tidak ada check-in hari ini</p>
                            ) : (
                                <ul className="space-y-2">
                                    {checkin_today.map((r) => (
                                        <li key={r.idbooking} className="flex items-center justify-between text-sm">
                                            <span>{r.tamu?.nama ?? '-'}</span>
                                            <span className="text-muted-foreground">{r.kamar?.nama ?? '-'}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <CalendarMinus className="h-4 w-4" /> Check-Out Hari Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {checkout_today.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Tidak ada check-out hari ini</p>
                            ) : (
                                <ul className="space-y-2">
                                    {checkout_today.map((r) => (
                                        <li key={r.idbooking} className="flex items-center justify-between text-sm">
                                            <span>{r.tamu?.nama ?? '-'}</span>
                                            <span className="text-muted-foreground">{r.kamar?.nama ?? '-'}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
