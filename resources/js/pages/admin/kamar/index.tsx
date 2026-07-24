import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { DataTable, SortableHeader } from '@/components/data-table';
import type { PaginationMeta } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TipeInfo = {
    id: number;
    nama_tipe: string;
};

type KamarItem = {
    id_kamar: string;
    nama: string;
    tipe_id: number;
    tipe: TipeInfo | null;
    harga: number;
    fasilitas: string | null;
    status_kamar: string;
};

type Props = {
    kamar: {
        data: KamarItem[];
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

export default function KamarIndex({ kamar, filters }: Props) {
    const search = filters.search ?? '';

    const handleSearch = useCallback((value: string) => {
        router.get('/admin/kamar', { ...filters, search: value, page: 1 }, { preserveState: true });
    }, [filters]);

    const handleFilter = useCallback((key: string, value: string) => {
        router.get('/admin/kamar', { ...filters, [key]: value, page: 1 }, { preserveState: true });
    }, [filters]);

    const handleDelete = useCallback((id: string) => {
        if (confirm('Yakin ingin menghapus kamar ini?')) {
            router.delete(`/admin/kamar/${id}`);
        }
    }, []);

    const handlePageChange = useCallback((page: number) => {
        router.get('/admin/kamar', { ...filters, page }, { preserveState: true });
    }, [filters]);

    const handlePageSizeChange = useCallback((perPage: number) => {
        router.get('/admin/kamar', { ...filters, per_page: perPage, page: 1 }, { preserveState: true });
    }, [filters]);

    const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
        router.get('/admin/kamar', { ...filters, sort_by: sortBy, sort_order: sortOrder, page: 1 }, { preserveState: true });
    }, [filters]);

    const columns: ColumnDef<KamarItem>[] = useMemo(() => [
        {
            accessorKey: 'id_kamar',
            header: ({ column }) => <SortableHeader title="ID" column={column} />,
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.id_kamar}</span>,
        },
        {
            accessorKey: 'nama',
            header: ({ column }) => <SortableHeader title="Nama" column={column} />,
            cell: ({ row }) => <span className="font-medium">{row.original.nama}</span>,
        },
        {
            accessorKey: 'tipe.nama_tipe',
            header: ({ column }) => <SortableHeader title="Tipe Kamar" column={column} />,
            cell: ({ row }) => <span className="text-muted-foreground">{row.original.tipe?.nama_tipe ?? '-'}</span>,
        },
        {
            accessorKey: 'harga',
            header: ({ column }) => <SortableHeader title="Harga" column={column} className="justify-end" />,
            cell: ({ row }) => <div className="text-right">{formatRupiah(row.original.harga)}</div>,
        },
        {
            accessorKey: 'fasilitas',
            header: () => 'Fasilitas',
            cell: ({ row }) => (
                <span className="line-clamp-1 text-muted-foreground">{row.original.fasilitas ?? '-'}</span>
            ),
        },
        {
            accessorKey: 'status_kamar',
            header: ({ column }) => <SortableHeader title="Status" column={column} />,
            cell: ({ row }) => (
                <Badge variant={row.original.status_kamar === 'tersedia' ? 'default' : 'destructive'}>
                    {row.original.status_kamar}
                </Badge>
            ),
        },
        {
            id: 'aksi',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.get(`/admin/kamar/${row.original.id_kamar}/edit`)}>
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.id_kamar)}>
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            ),
        },
    ], [handleDelete]);

    const sorting = useMemo(() => {
        const sortBy = filters.sort_by ?? 'created_at';
        const sortOrder = filters.sort_order ?? 'desc';

        return [{ id: sortBy, desc: sortOrder === 'desc' }];
    }, [filters.sort_by, filters.sort_order]);

    const pagination: PaginationMeta = {
        current_page: kamar.current_page,
        last_page: kamar.last_page,
        per_page: kamar.per_page,
        total: kamar.total,
    };

    return (
        <>
            <Head title="Data Kamar" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Data Kamar</CardTitle>
                            <Button onClick={() => router.get('/admin/kamar/create')}>
                                <Plus className="h-4 w-4" />
                                Tambah Kamar
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                            <Input
                                placeholder="Cari ID atau nama kamar..."
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
                                    <SelectItem value="tersedia">Tersedia</SelectItem>
                                    <SelectItem value="tidak tersedia">Tidak Tersedia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <DataTable
                            columns={columns}
                            data={kamar.data}
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
                            emptyMessage="Tidak ada data kamar."
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

KamarIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Kamar', href: '/admin/kamar' },
    ],
};
