import { Head, router } from '@inertiajs/react';
import type {ColumnDef} from '@tanstack/react-table';
import { Plus, Eye } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { DataTable, SortableHeader  } from '@/components/data-table';
import type {PaginationMeta} from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type CheckinItem = {
    idcheckin: string;
    idbooking: string;
    deposit: number;
    reservasi: {
        idbooking: string;
        tamu: { nama: string } | null;
        kamar: { nama: string } | null;
    } | null;
};

type Props = {
    checkin: {
        data: CheckinItem[];
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

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function CheckinIndex({ checkin, filters }: Props) {
    const search = filters.search ?? '';

    const handleSearch = useCallback((value: string) => {
        router.get('/admin/checkin', { ...filters, search: value, page: 1 }, { preserveState: true });
    }, [filters]);

    const handlePageChange = useCallback((page: number) => {
        router.get('/admin/checkin', { ...filters, page }, { preserveState: true });
    }, [filters]);

    const handlePageSizeChange = useCallback((perPage: number) => {
        router.get('/admin/checkin', { ...filters, per_page: perPage, page: 1 }, { preserveState: true });
    }, [filters]);

    const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
        router.get('/admin/checkin', { ...filters, sort_by: sortBy, sort_order: sortOrder, page: 1 }, { preserveState: true });
    }, [filters]);

    const columns: ColumnDef<CheckinItem>[] = useMemo(() => [
        {
            accessorKey: 'idcheckin',
            header: ({ column }) => <SortableHeader title="ID Check-in" column={column} />,
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.idcheckin}</span>,
        },
        {
            accessorKey: 'idbooking',
            header: ({ column }) => <SortableHeader title="ID Booking" column={column} />,
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.idbooking}</span>,
        },
        {
            id: 'tamu',
            header: () => <span>Tamu</span>,
            cell: ({ row }) => row.original.reservasi?.tamu?.nama ?? '-',
        },
        {
            id: 'kamar',
            header: () => <span>Kamar</span>,
            cell: ({ row }) => row.original.reservasi?.kamar?.nama ?? '-',
        },
        {
            accessorKey: 'deposit',
            header: ({ column }) => <SortableHeader title="Deposit" column={column} className="justify-end" />,
            cell: ({ row }) => <div className="text-right">{formatRupiah(row.original.deposit)}</div>,
        },
        {
            id: 'aksi',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => router.get(`/admin/checkin/${row.original.idcheckin}`)}>
                        <Eye className="h-3 w-3" />
                    </Button>
                </div>
            ),
        },
    ], []);

    const sorting = useMemo(() => {
        const sortBy = filters.sort_by ?? 'created_at';
        const sortOrder = filters.sort_order ?? 'desc';

        return [{ id: sortBy, desc: sortOrder === 'desc' }];
    }, [filters.sort_by, filters.sort_order]);

    const pagination: PaginationMeta = {
        current_page: checkin.current_page,
        last_page: checkin.last_page,
        per_page: checkin.per_page,
        total: checkin.total,
    };

    return (
        <>
            <Head title="Data Check-in" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Data Check-in</CardTitle>
                            <Button onClick={() => router.get('/admin/checkin/create')}>
                                <Plus className="h-4 w-4" />
                                Check-in Baru
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <Input
                                placeholder="Cari ID check-in, booking, atau tamu..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-72"
                            />
                        </div>

                        <DataTable
                            columns={columns}
                            data={checkin.data}
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
                            emptyMessage="Tidak ada data check-in."
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CheckinIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Check-in', href: '/admin/checkin' },
    ],
};
