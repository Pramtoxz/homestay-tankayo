import { Head, router } from '@inertiajs/react';
import type {ColumnDef} from '@tanstack/react-table';
import { Plus, Eye, Pencil, Printer, Trash2 } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { DataTable, SortableHeader  } from '@/components/data-table';
import type {PaginationMeta} from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatTanggal } from '@/lib/utils';

type ReservasiItem = {
    idbooking: string;
    tamu: { nik: string; nama: string } | null;
    kamar: { id_kamar: string; nama: string } | null;
    tglcheckin: string;
    tglcheckout: string;
    totalbayar: number;
    status: string;
    online: boolean;
};

type Props = {
    reservasi: {
        data: ReservasiItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
        per_page?: string;
        sort_by?: string;
        sort_order?: string;
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
    const search = filters.search ?? '';

    const handleSearch = useCallback((value: string) => {
        router.get('/admin/reservasi', { ...filters, search: value, page: 1 }, { preserveState: true });
    }, [filters]);

    const handleFilter = useCallback((key: string, value: string) => {
        router.get('/admin/reservasi', { ...filters, [key]: value, page: 1 }, { preserveState: true });
    }, [filters]);

    const handleDelete = useCallback((id: string) => {
        if (confirm('Yakin ingin menghapus reservasi ini?')) {
            router.delete(`/admin/reservasi/${id}`);
        }
    }, []);

    const handleCetakFaktur = useCallback((id: string) => {
        window.open(`/admin/reservasi/${id}/faktur`, '_blank');
    }, []);

    const handlePageChange = useCallback((page: number) => {
        router.get('/admin/reservasi', { ...filters, page }, { preserveState: true });
    }, [filters]);

    const handlePageSizeChange = useCallback((perPage: number) => {
        router.get('/admin/reservasi', { ...filters, per_page: perPage, page: 1 }, { preserveState: true });
    }, [filters]);

    const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
        router.get('/admin/reservasi', { ...filters, sort_by: sortBy, sort_order: sortOrder, page: 1 }, { preserveState: true });
    }, [filters]);

    const columns: ColumnDef<ReservasiItem>[] = useMemo(() => [
        {
            accessorKey: 'idbooking',
            header: ({ column }) => <SortableHeader title="ID Booking" column={column} />,
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.idbooking}</span>,
        },
        {
            id: 'tamu',
            header: () => <span>Tamu</span>,
            cell: ({ row }) => row.original.tamu?.nama ?? '-',
        },
        {
            id: 'kamar',
            header: () => <span>Kamar</span>,
            cell: ({ row }) => row.original.kamar?.nama ?? '-',
        },
        {
            accessorKey: 'tglcheckin',
            header: ({ column }) => <SortableHeader title="Check-in" column={column} />,
            cell: ({ row }) => formatTanggal(row.original.tglcheckin),
        },
        {
            accessorKey: 'tglcheckout',
            header: ({ column }) => <SortableHeader title="Check-out" column={column} />,
            cell: ({ row }) => formatTanggal(row.original.tglcheckout),
        },
        {
            accessorKey: 'totalbayar',
            header: ({ column }) => <SortableHeader title="Total" column={column} className="justify-end" />,
            cell: ({ row }) => <div className="text-right font-medium">{formatRupiah(row.original.totalbayar)}</div>,
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <SortableHeader title="Status" column={column} />,
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    <Badge className={statusColor[row.original.status] ?? ''}>{row.original.status}</Badge>
                    {row.original.online && row.original.status === 'diproses' && (
                        <Badge variant="destructive">Perlu Verifikasi</Badge>
                    )}
                </div>
            ),
        },
        {
            id: 'aksi',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.get(`/admin/reservasi/${row.original.idbooking}`)}>
                        <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => router.get(`/admin/reservasi/${row.original.idbooking}/edit`)}>
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleCetakFaktur(row.original.idbooking)}>
                        <Printer className="h-3 w-3" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.idbooking)}>
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            ),
        },
    ], [handleDelete, handleCetakFaktur]);

    const sorting = useMemo(() => {
        const sortBy = filters.sort_by ?? 'created_at';
        const sortOrder = filters.sort_order ?? 'desc';

        return [{ id: sortBy, desc: sortOrder === 'desc' }];
    }, [filters.sort_by, filters.sort_order]);

    const pagination: PaginationMeta = {
        current_page: reservasi.current_page,
        last_page: reservasi.last_page,
        per_page: reservasi.per_page,
        total: reservasi.total,
    };

    return (
        <>
            <Head title="Data Reservasi" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
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
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                            <Input
                                placeholder="Cari booking, tamu, atau kamar..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-72"
                            />
                            <Select value={filters.status || 'all'} onValueChange={(v) => handleFilter('status', v === 'all' ? '' : v)}>
                                <SelectTrigger className="w-48">
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
                        </div>

                        <DataTable
                            columns={columns}
                            data={reservasi.data}
                            pagination={pagination}
                            sorting={sorting}
                            onSortingChange={(updater) => {
                                const newSorting = typeof updater === 'function' ? updater(sorting) : updater;

                                if (newSorting.length > 0) {
                                    handleSortChange(newSorting[0].id, newSorting[0].desc ? 'desc' : 'asc');
                                }
                            }}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                            emptyMessage="Tidak ada data reservasi."
                        />
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
