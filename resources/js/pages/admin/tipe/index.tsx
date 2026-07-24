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

type TipeItem = {
    id: number;
    nama_tipe: string;
    foto: string | null;
    aktif: boolean;
    kamar_count: number;
};

type Props = {
    tipe: {
        data: TipeItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        per_page?: string;
        sort_by?: string;
        sort_order?: string;
    };
};

export default function TipeIndex({ tipe, filters }: Props) {
    const search = filters.search ?? '';

    const handleSearch = useCallback(
        (value: string) => {
            router.get('/admin/tipe', { ...filters, search: value, page: 1 }, { preserveState: true });
        },
        [filters],
    );

    const handleDelete = useCallback((id: number) => {
        if (confirm('Yakin ingin menghapus tipe kamar ini?')) {
            router.delete(`/admin/tipe/${id}`);
        }
    }, []);

    const handlePageChange = useCallback(
        (page: number) => {
            router.get('/admin/tipe', { ...filters, page }, { preserveState: true });
        },
        [filters],
    );

    const handlePageSizeChange = useCallback(
        (perPage: number) => {
            router.get('/admin/tipe', { ...filters, per_page: perPage, page: 1 }, { preserveState: true });
        },
        [filters],
    );

    const handleSortChange = useCallback(
        (sortBy: string, sortOrder: 'asc' | 'desc') => {
            router.get('/admin/tipe', { ...filters, sort_by: sortBy, sort_order: sortOrder, page: 1 }, { preserveState: true });
        },
        [filters],
    );

    const columns: ColumnDef<TipeItem>[] = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: ({ column }) => <SortableHeader title="ID" column={column} />,
                cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
            },
            {
                accessorKey: 'foto',
                header: () => 'Foto',
                cell: ({ row }) =>
                    row.original.foto ? (
                        <img
                            src={`/storage/${row.original.foto}`}
                            alt={row.original.nama_tipe}
                            className="h-12 w-12 rounded-md object-cover"
                        />
                    ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                    ),
            },
            {
                accessorKey: 'nama_tipe',
                header: ({ column }) => <SortableHeader title="Nama Tipe" column={column} />,
                cell: ({ row }) => <span className="font-medium">{row.original.nama_tipe}</span>,
            },
            {
                accessorKey: 'kamar_count',
                header: () => 'Jumlah Kamar',
                cell: ({ row }) => <span>{row.original.kamar_count}</span>,
            },
            {
                accessorKey: 'aktif',
                header: ({ column }) => <SortableHeader title="Status" column={column} />,
                cell: ({ row }) => (
                    <Badge variant={row.original.aktif ? 'default' : 'destructive'}>
                        {row.original.aktif ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                ),
            },
            {
                id: 'aksi',
                header: () => <div className="text-right">Aksi</div>,
                cell: ({ row }) => (
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.get(`/admin/tipe/${row.original.id}/edit`)}>
                            <Pencil className="h-3 w-3" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.id)}>
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                ),
            },
        ],
        [handleDelete],
    );

    const sorting = useMemo(() => {
        const sortBy = filters.sort_by ?? 'created_at';
        const sortOrder = filters.sort_order ?? 'desc';

        return [{ id: sortBy, desc: sortOrder === 'desc' }];
    }, [filters.sort_by, filters.sort_order]);

    const pagination: PaginationMeta = {
        current_page: tipe.current_page,
        last_page: tipe.last_page,
        per_page: tipe.per_page,
        total: tipe.total,
    };

    return (
        <>
            <Head title="Data Tipe Kamar" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Data Tipe Kamar</CardTitle>
                            <Button onClick={() => router.get('/admin/tipe/create')}>
                                <Plus className="h-4 w-4" />
                                Tambah Tipe
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                            <Input
                                placeholder="Cari nama tipe..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-72"
                            />
                        </div>

                        <DataTable
                            columns={columns}
                            data={tipe.data}
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
                            emptyMessage="Tidak ada data tipe kamar."
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

TipeIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tipe Kamar', href: '/admin/tipe' },
    ],
};
