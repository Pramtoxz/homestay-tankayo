import { Head, router } from '@inertiajs/react';
import { Plus, Eye, Pencil, Trash2, Search } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ReservasiItem = {
    idbooking: string;
    tamu: { nik: string; nama: string } | null;
    kamar: { id_kamar: string; nama: string } | null;
    tglcheckin: string;
    tglcheckout: string;
    totalbayar: number;
    status: string;
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
    filters: {
        search?: string;
        status?: string;
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
};

export default function ReservasiIndex({ reservasi, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const handleSearch = useCallback(() => {
        router.get('/admin/reservasi', { search, status }, { preserveState: true });
    }, [search, status]);

    const handleStatusFilter = useCallback(
        (val: string) => {
            const s = val === 'all' ? '' : val;
            setStatus(s);
            router.get('/admin/reservasi', { search, status: s }, { preserveState: true });
        },
        [search],
    );

    const handleDelete = useCallback((id: string) => {
        if (confirm('Yakin ingin menghapus reservasi ini?')) {
            router.delete(`/admin/reservasi/${id}`);
        }
    }, []);

    return (
        <>
            <Head title="Data Reservasi" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Data Reservasi</CardTitle>
                            <Button onClick={() => router.get('/admin/reservasi/create')}>
                                <Plus className="h-4 w-4" />
                                Buat Reservasi
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex gap-2">
                            <Input
                                placeholder="Cari booking, tamu, atau kamar..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="max-w-sm"
                            />
                            <Select value={status || 'all'} onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="diproses">Diproses</SelectItem>
                                    <SelectItem value="diterima">Diterima</SelectItem>
                                    <SelectItem value="ditolak">Ditolak</SelectItem>
                                    <SelectItem value="checkin">Check-in</SelectItem>
                                    <SelectItem value="selesai">Selesai</SelectItem>
                                    <SelectItem value="cancel">Cancel</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={handleSearch}>
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left font-medium">ID Booking</th>
                                        <th className="px-4 py-3 text-left font-medium">Tamu</th>
                                        <th className="px-4 py-3 text-left font-medium">Kamar</th>
                                        <th className="px-4 py-3 text-left font-medium">Check-in</th>
                                        <th className="px-4 py-3 text-left font-medium">Check-out</th>
                                        <th className="px-4 py-3 text-right font-medium">Total</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-right font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservasi.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                                                Tidak ada data reservasi.
                                            </td>
                                        </tr>
                                    ) : (
                                        reservasi.data.map((item) => (
                                            <tr key={item.idbooking} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3 font-mono text-xs">{item.idbooking}</td>
                                                <td className="px-4 py-3">{item.tamu?.nama ?? '-'}</td>
                                                <td className="px-4 py-3">{item.kamar?.nama ?? '-'}</td>
                                                <td className="px-4 py-3">{item.tglcheckin}</td>
                                                <td className="px-4 py-3">{item.tglcheckout}</td>
                                                <td className="px-4 py-3 text-right">{formatRupiah(item.totalbayar)}</td>
                                                <td className="px-4 py-3">
                                                    <Badge className={statusColor[item.status] ?? ''}>
                                                        {item.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                router.get(`/admin/reservasi/${item.idbooking}`)
                                                            }
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                router.get(
                                                                    `/admin/reservasi/${item.idbooking}/edit`,
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(item.idbooking)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
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

ReservasiIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Reservasi', href: '/admin/reservasi' },
    ],
};
