import { Head, router } from '@inertiajs/react';
import { BedDouble, Users, CalendarCheck, CalendarMinus, Search, DoorOpen, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

type TipeAvailability = {
    tipe_id: number;
    nama_tipe: string;
    total: number;
    tersedia: number;
};

type Props = {
    stats: Stats;
    reservasi_hari_ini: ReservasiItem[];
    checkin_today: ReservasiItem[];
    checkout_today: ReservasiItem[];
    tipe_availability: TipeAvailability[];
    availability_loaded: boolean;
    availability_filters: {
        tglcheckin: string;
    };
};

const statusColor: Record<string, string> = {
    diproses: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-400',
    diterima: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400',
    ditolak: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400',
    checkin: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400',
    selesai: 'bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-400',
    cancel: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400',
    limit: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-400',
};

export default function Dashboard({
    stats,
    reservasi_hari_ini,
    checkin_today,
    checkout_today,
    tipe_availability,
    availability_loaded,
    availability_filters,
}: Props) {
    const [tglcheckin, setTglcheckin] = useState(availability_filters.tglcheckin);

    const handleTampilkan = () => {
        router.get(
            '/dashboard',
            { tglcheckin },
            { preserveState: true, preserveScroll: true, only: ['tipe_availability', 'availability_loaded', 'availability_filters'] },
        );
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardContent className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Tamu</p>
                                <p className="text-2xl font-bold">{stats.total_tamu}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <BedDouble className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Kamar Tersedia</p>
                                <p className="text-2xl font-bold">
                                    {stats.kamar_tersedia}
                                    <span className="text-sm font-normal text-muted-foreground"> / {stats.total_kamar}</span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-foreground">
                                <CalendarCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Reservasi Hari Ini</p>
                                <p className="text-2xl font-bold">{stats.reservasi_hari_ini}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <LogIn className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Check-In Hari Ini</p>
                                <p className="text-2xl font-bold">{stats.checkin_hari_ini}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <LogOut className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Check-Out Hari Ini</p>
                                <p className="text-2xl font-bold">{stats.checkout_hari_ini}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-medium">Ketersediaan Kamar Hari Ini</CardTitle>
                            <CardDescription>
                                {stats.kamar_tersedia} dari {stats.total_kamar} kamar tersedia
                            </CardDescription>
                        </div>
                        <BedDouble className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Tingkat ketersediaan</span>
                                    <span className="font-semibold">
                                        {stats.total_kamar > 0
                                            ? Math.round((stats.kamar_tersedia / stats.total_kamar) * 100)
                                            : 0}
                                        %
                                    </span>
                                </div>
                                <div className="bg-secondary h-3 w-full overflow-hidden rounded-full">
                                    <div
                                        className="bg-primary h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${stats.total_kamar > 0 ? (stats.kamar_tersedia / stats.total_kamar) * 100 : 0}%`,
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">Tersedia</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.kamar_tersedia}</p>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">Terisi</p>
                                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.kamar_terisi}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="availability_tglcheckin">Silahkan Pilih Tanggal</Label>
                                <Input
                                    id="availability_tglcheckin"
                                    type="date"
                                    value={tglcheckin}
                                    onChange={(e) => setTglcheckin(e.target.value)}
                                />
                            </div>
                            <Button disabled={!tglcheckin} onClick={handleTampilkan}>
                                <Search className="h-4 w-4" />
                                Tampilkan
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {!availability_loaded ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <DoorOpen className="mb-3 h-10 w-10 text-muted-foreground/50" />
                                <p className="text-sm text-muted-foreground">
                                    Silakan pilih tanggal check-in terlebih dahulu, lalu klik Tampilkan.
                                </p>
                            </div>
                        ) : tipe_availability.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Tidak ada tipe kamar aktif.</p>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {tipe_availability.map((t) => (
                                    <div key={t.tipe_id} className="rounded-md border p-3">
                                        <p className="text-sm font-medium">{t.nama_tipe}</p>
                                        <p className="text-2xl font-bold">
                                            {t.tersedia}
                                            <span className="text-sm font-normal text-muted-foreground"> / {t.total} tersedia</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

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
                                            <span>
                                                {r.tamu?.nama ?? '-'}
                                                <span className="text-muted-foreground"> · {r.kamar?.nama ?? '-'}</span>
                                            </span>
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
                                <CalendarCheck className="h-4 w-4" /> Check-In Hari Ini ({stats.checkin_hari_ini})
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
                                <CalendarMinus className="h-4 w-4" /> Check-Out Hari Ini ({stats.checkout_hari_ini})
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
