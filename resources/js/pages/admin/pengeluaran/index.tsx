import { Head, router } from '@inertiajs/react';
import type {ColumnDef} from '@tanstack/react-table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { DataTable, SortableHeader  } from '@/components/data-table';
import type {PaginationMeta} from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatTanggal } from '@/lib/utils';

type PengeluaranItem = {
    id: number;
    tgl: string;
    keterangan: string;
    total: number;
};

type Props = {
    pengeluaran: {
        data: PengeluaranItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        bulan?: string;
        tahun?: string;
        per_page?: string;
        sort_by?: string;
        sort_order?: string;
    };
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const bulanOptions = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
];

export default function PengeluaranIndex({ pengeluaran, filters }: Props) {
    const search = filters.search ?? '';
    const bulan = filters.bulan ?? '';
    const tahun = filters.tahun ?? '';

    const handleSearch = useCallback((value: string) => {
        router.get('/admin/pengeluaran', { ...filters, search: value, page: 1 }, { preserveState: true });
    }, [filters]);

    const handleFilter = useCallback((key: string, value: string) => {
        router.get('/admin/pengeluaran', { ...filters, [key]: value, page: 1 }, { preserveState: true });
    }, [filters]);

    const handleDelete = useCallback((id: number) => {
        if (confirm('Yakin ingin menghapus pengeluaran ini?')) {
            router.delete(`/admin/pengeluaran/${id}`);
        }
    }, []);

    const handlePageChange = useCallback((page: number) => {
        router.get('/admin/pengeluaran', { ...filters, page }, { preserveState: true });
    }, [filters]);

    const handlePageSizeChange = useCallback((perPage: number) => {
        router.get('/admin/pengeluaran', { ...filters, per_page: perPage, page: 1 }, { preserveState: true });
    }, [filters]);

    const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
        router.get('/admin/pengeluaran', { ...filters, sort_by: sortBy, sort_order: sortOrder, page: 1 }, { preserveState: true });
    }, [filters]);

    const columns: ColumnDef<PengeluaranItem>[] = useMemo(() => [
        {
            accessorKey: 'tgl',
            header: ({ column }) => <SortableHeader title="Tanggal" column={column} />,
            cell: ({ row }) => formatTanggal(row.original.tgl),
        },
        {
            accessorKey: 'keterangan',
            header: ({ column }) => <SortableHeader title="Keterangan" column={column} />,
            cell: ({ row }) => row.original.keterangan,
        },
        {
            accessorKey: 'total',
            header: ({ column }) => <SortableHeader title="Total" column={column} className="justify-end" />,
            cell: ({ row }) => <div className="text-right font-medium">{formatRupiah(row.original.total)}</div>,
        },
        {
            id: 'aksi',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.get(`/admin/pengeluaran/${row.original.id}/edit`)}>
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.id)}>
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            ),
        },
    ], [handleDelete]);

    const sorting = useMemo(() => {
        const sortBy = filters.sort_by ?? 'tgl';
        const sortOrder = filters.sort_order ?? 'desc';

        return [{ id: sortBy, desc: sortOrder === 'desc' }];
    }, [filters.sort_by, filters.sort_order]);

    const pagination: PaginationMeta = {
        current_page: pengeluaran.current_page,
        last_page: pengeluaran.last_page,
        per_page: pengeluaran.per_page,
        total: pengeluaran.total,
    };

    return (
        <>
            <Head title="Pengeluaran" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Pengeluaran</CardTitle>
                            <Button onClick={() => router.get('/admin/pengeluaran/create')}>
                                <Plus className="h-4 w-4" />
                                Tambah Pengeluaran
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                            <Input
                                placeholder="Cari keterangan..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-72"
                            />
                            <Select value={bulan || 'all'} onValueChange={(v) => handleFilter('bulan', v === 'all' ? '' : v)}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Bulan</SelectItem>
                                    {bulanOptions.map((b) => (
                                        <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={tahun || 'all'} onValueChange={(v) => handleFilter('tahun', v === 'all' ? '' : v)}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tahun</SelectItem>
                                    {[2024, 2025, 2026, 2027].map((y) => (
                                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <DataTable
                            columns={columns}
                            data={pengeluaran.data}
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
                            emptyMessage="Tidak ada data pengeluaran."
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PengeluaranIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengeluaran', href: '/admin/pengeluaran' },
    ],
};
