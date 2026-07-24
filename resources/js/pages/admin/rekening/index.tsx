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

type RekeningItem = {
    id: number;
    jenis: 'bank' | 'qris' | 'e-wallet';
    nama: string;
    nomor: string | null;
    foto: string | null;
    aktif: boolean;
};

type Props = {
    rekening: {
        data: RekeningItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        jenis?: string;
        per_page?: string;
        sort_by?: string;
        sort_order?: string;
    };
};

const jenisLabel: Record<string, string> = {
    bank: 'Bank',
    qris: 'QRIS',
    'e-wallet': 'E-Wallet',
};

const jenisVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
    bank: 'default',
    qris: 'secondary',
    'e-wallet': 'outline',
};

export default function RekeningIndex({ rekening, filters }: Props) {
    const search = filters.search ?? '';

    const handleSearch = useCallback(
        (value: string) => {
            router.get('/admin/rekening', { ...filters, search: value, page: 1 }, { preserveState: true });
        },
        [filters],
    );

    const handleFilter = useCallback(
        (key: string, value: string) => {
            router.get('/admin/rekening', { ...filters, [key]: value, page: 1 }, { preserveState: true });
        },
        [filters],
    );

    const handleDelete = useCallback((id: number) => {
        if (confirm('Yakin ingin menghapus rekening ini?')) {
            router.delete(`/admin/rekening/${id}`);
        }
    }, []);

    const handlePageChange = useCallback(
        (page: number) => {
            router.get('/admin/rekening', { ...filters, page }, { preserveState: true });
        },
        [filters],
    );

    const handlePageSizeChange = useCallback(
        (perPage: number) => {
            router.get('/admin/rekening', { ...filters, per_page: perPage, page: 1 }, { preserveState: true });
        },
        [filters],
    );

    const handleSortChange = useCallback(
        (sortBy: string, sortOrder: 'asc' | 'desc') => {
            router.get('/admin/rekening', { ...filters, sort_by: sortBy, sort_order: sortOrder, page: 1 }, { preserveState: true });
        },
        [filters],
    );

    const columns: ColumnDef<RekeningItem>[] = useMemo(
        () => [
            // {
            //     accessorKey: 'id',
            //     header: ({ column }) => <SortableHeader title="ID" column={column} />,
            //     cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
            // },
            {
                accessorKey: 'foto',
                header: () => 'Foto',
                cell: ({ row }) =>
                    row.original.foto ? (
                        <img
                            src={`/storage/${row.original.foto}`}
                            alt={row.original.nama}
                            className="h-10 w-10 rounded-md object-cover"
                        />
                    ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                    ),
            },
            {
                accessorKey: 'jenis',
                header: ({ column }) => <SortableHeader title="Jenis" column={column} />,
                cell: ({ row }) => (
                    <Badge variant={jenisVariant[row.original.jenis] ?? 'outline'}>
                        {jenisLabel[row.original.jenis] ?? row.original.jenis}
                    </Badge>
                ),
            },
            {
                accessorKey: 'nama',
                header: ({ column }) => <SortableHeader title="Nama" column={column} />,
                cell: ({ row }) => <span className="font-medium">{row.original.nama}</span>,
            },
            {
                accessorKey: 'nomor',
                header: () => 'Nomor Rekening',
                cell: ({ row }) => <span className="font-mono text-sm">{row.original.nomor ?? '-'}</span>,
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
                        <Button variant="outline" size="sm" onClick={() => router.get(`/admin/rekening/${row.original.id}/edit`)}>
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
        current_page: rekening.current_page,
        last_page: rekening.last_page,
        per_page: rekening.per_page,
        total: rekening.total,
    };

    return (
        <>
            <Head title="Data Rekening" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Data Rekening</CardTitle>
                            <Button onClick={() => router.get('/admin/rekening/create')}>
                                <Plus className="h-4 w-4" />
                                Tambah Rekening
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                            <Input
                                placeholder="Cari nama atau nomor..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-72"
                            />
                            <Select value={filters.jenis || 'all'} onValueChange={(v) => handleFilter('jenis', v === 'all' ? '' : v)}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Semua Jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Jenis</SelectItem>
                                    <SelectItem value="bank">Bank</SelectItem>
                                    <SelectItem value="qris">QRIS</SelectItem>
                                    <SelectItem value="e-wallet">E-Wallet</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <DataTable
                            columns={columns}
                            data={rekening.data}
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
                            emptyMessage="Tidak ada data rekening."
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

RekeningIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Rekening', href: '/admin/rekening' },
    ],
};
