import { Head, router } from '@inertiajs/react';
import type {ColumnDef} from '@tanstack/react-table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { DataTable, SortableHeader  } from '@/components/data-table';
import type {PaginationMeta} from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type TamuItem = {
    nik: string;
    nama: string;
    alamat: string;
    nohp: string;
    jk: string;
};

type Props = {
    tamu: {
        data: TamuItem[];
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

export default function TamuIndex({ tamu, filters }: Props) {
    const search = filters.search ?? '';

    const handleSearch = useCallback((value: string) => {
        router.get('/admin/tamu', { ...filters, search: value }, { preserveState: true });
    }, [filters]);

    const handleDelete = useCallback((nik: string) => {
        if (confirm('Yakin ingin menghapus tamu ini?')) {
            router.delete(`/admin/tamu/${nik}`);
        }
    }, []);

    const handlePageChange = useCallback((page: number) => {
        router.get('/admin/tamu', { ...filters, page }, { preserveState: true });
    }, [filters]);

    const handlePageSizeChange = useCallback((perPage: number) => {
        router.get('/admin/tamu', { ...filters, per_page: perPage, page: 1 }, { preserveState: true });
    }, [filters]);

    const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
        router.get('/admin/tamu', { ...filters, sort_by: sortBy, sort_order: sortOrder, page: 1 }, { preserveState: true });
    }, [filters]);

    const columns: ColumnDef<TamuItem>[] = useMemo(() => [
        {
            accessorKey: 'nik',
            header: ({ column }) => <SortableHeader title="NIK" column={column} />,
            cell: ({ row }) => row.original.nik,
        },
        {
            accessorKey: 'nama',
            header: ({ column }) => <SortableHeader title="Nama" column={column} />,
            cell: ({ row }) => <span className="font-medium">{row.original.nama}</span>,
        },
        {
            accessorKey: 'alamat',
            header: ({ column }) => <SortableHeader title="Alamat" column={column} />,
            cell: ({ row }) => row.original.alamat,
        },
        {
            accessorKey: 'nohp',
            header: ({ column }) => <SortableHeader title="No HP" column={column} />,
            cell: ({ row }) => row.original.nohp,
        },
        {
            accessorKey: 'jk',
            header: ({ column }) => <SortableHeader title="Jenis Kelamin" column={column} />,
            cell: ({ row }) => (
                <Badge variant={row.original.jk === 'L' ? 'default' : 'secondary'}>
                    {row.original.jk === 'L' ? 'Laki-laki' : 'Perempuan'}
                </Badge>
            ),
        },
        {
            id: 'aksi',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.get(`/admin/tamu/${row.original.nik}/edit`)}>
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.nik)}>
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
        current_page: tamu.current_page,
        last_page: tamu.last_page,
        per_page: tamu.per_page,
        total: tamu.total,
    };

    return (
        <>
            <Head title="Data Tamu" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Data Tamu</CardTitle>
                            <Button onClick={() => router.get('/admin/tamu/create')}>
                                <Plus className="h-4 w-4" />
                                Tambah Tamu
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <Input
                                placeholder="Cari NIK, nama, atau no HP..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-72"
                            />
                        </div>

                        <DataTable
                            columns={columns}
                            data={tamu.data}
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
                            emptyMessage="Tidak ada data tamu."
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

TamuIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tamu', href: '/admin/tamu' },
    ],
};
