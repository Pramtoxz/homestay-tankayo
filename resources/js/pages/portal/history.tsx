import { Head, router } from '@inertiajs/react';
import { Eye, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ReservasiItem = {
    idbooking: string;
    kamar: { nama: string } | null;
    tglcheckin: string;
    tglcheckout: string;
    totalbayar: number;
    status: string;
    tipe: string;
    online: boolean;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    reservasi: {
        data: ReservasiItem[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
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

export default function BookingHistory({ reservasi }: Props) {
    return (
        <>
            <Head title="Riwayat Booking" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5" />
                                Riwayat Booking
                            </CardTitle>
                            <Button onClick={() => router.get('/portal/booking')}>
                                Booking Baru
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left font-medium">ID Booking</th>
                                        <th className="px-4 py-3 text-left font-medium">Kamar</th>
                                        <th className="px-4 py-3 text-left font-medium">Check-in</th>
                                        <th className="px-4 py-3 text-left font-medium">Check-out</th>
                                        <th className="px-4 py-3 text-right font-medium">Total</th>
                                        <th className="px-4 py-3 text-left font-medium">Tipe</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-right font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservasi.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                                                Belum ada riwayat booking.
                                            </td>
                                        </tr>
                                    ) : (
                                        reservasi.data.map((item) => (
                                            <tr key={item.idbooking} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3 font-mono text-xs">{item.idbooking}</td>
                                                <td className="px-4 py-3">{item.kamar?.nama ?? '-'}</td>
                                                <td className="px-4 py-3">{item.tglcheckin}</td>
                                                <td className="px-4 py-3">{item.tglcheckout}</td>
                                                <td className="px-4 py-3 text-right">{formatRupiah(item.totalbayar)}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline">{item.tipe}</Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge className={statusColor[item.status] ?? ''}>
                                                        {item.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.get(`/portal/booking/${item.idbooking}`)}
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {reservasi.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Halaman {reservasi.current_page} dari {reservasi.last_page}
                                </p>
                                <div className="flex gap-1">
                                    {reservasi.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

BookingHistory.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/portal' },
        { title: 'Riwayat Booking', href: '/portal/booking/history' },
    ],
};
