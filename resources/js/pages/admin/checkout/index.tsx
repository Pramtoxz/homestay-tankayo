import { Head, router } from '@inertiajs/react';
import type {ColumnDef} from '@tanstack/react-table';
import { Plus, Eye, Printer } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { DataTable, SortableHeader  } from '@/components/data-table';
import type {PaginationMeta} from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatTanggal } from '@/lib/utils';

type CheckoutItem = {
    idcheckout: string;
    idcheckin: string;
    tglcheckout: string;
    potongan: number;
    grandtotal: number;
    keterangan: string | null;
    checkin: {
        idcheckin: string;
        reservasi: {
            tamu: { nama: string } | null;
            kamar: { nama: string } | null;
        } | null;
    } | null;
};

type Props = {
    checkout: {
        data: CheckoutItem[];
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

export default function CheckoutIndex({ checkout, filters }: Props) {
    const search = filters.search ?? '';

    const handleSearch = useCallback((value: string) => {
        router.get('/admin/checkout', { ...filters, search: value, page: 1 }, { preserveState: true });
    }, [filters]);

    const handlePageChange = useCallback((page: number) => {
        router.get('/admin/checkout', { ...filters, page }, { preserveState: true });
    }, [filters]);

    const handlePageSizeChange = useCallback((perPage: number) => {
        router.get('/admin/checkout', { ...filters, per_page: perPage, page: 1 }, { preserveState: true });
    }, [filters]);

    const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
        router.get('/admin/checkout', { ...filters, sort_by: sortBy, sort_order: sortOrder, page: 1 }, { preserveState: true });
    }, [filters]);

    const handleCetakFaktur = useCallback((id: string) => {
        window.open(`/admin/checkout/${id}/faktur`, '_blank');
    }, []);

    const columns: ColumnDef<CheckoutItem>[] = useMemo(() => [
        {
            accessorKey: 'idcheckout',
            header: ({ column }) => <SortableHeader title="ID Checkout" column={column} />,
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.idcheckout}</span>,
        },
        {
            accessorKey: 'idcheckin',
            header: ({ column }) => <SortableHeader title="ID Check-in" column={column} />,
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.idcheckin}</span>,
        },
        {
            id: 'tamu',
            header: () => <span>Tamu</span>,
            cell: ({ row }) => row.original.checkin?.reservasi?.tamu?.nama ?? '-',
        },
        {
            accessorKey: 'tglcheckout',
            header: ({ column }) => <SortableHeader title="Tanggal" column={column} />,
            cell: ({ row }) => formatTanggal(row.original.tglcheckout),
        },
        {
            accessorKey: 'potongan',
            header: ({ column }) => <SortableHeader title="Potongan/Denda" column={column} className="justify-end" />,
            cell: ({ row }) => <div className="text-right">{formatRupiah(row.original.potongan)}</div>,
        },
        {
            accessorKey: 'grandtotal',
            header: ({ column }) => <SortableHeader title="Grand Total" column={column} className="justify-end" />,
            cell: ({ row }) => <div className="text-right font-medium">{formatRupiah(row.original.grandtotal)}</div>,
        },
        {
            id: 'aksi',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.get(`/admin/checkout/${row.original.idcheckout}`)}>
                        <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleCetakFaktur(row.original.idcheckout)}>
                        <Printer className="h-3 w-3" />
                    </Button>
                </div>
            ),
        },
    ], [handleCetakFaktur]);

    const sorting = useMemo(() => {
        const sortBy = filters.sort_by ?? 'created_at';
        const sortOrder = filters.sort_order ?? 'desc';

        return [{ id: sortBy, desc: sortOrder === 'desc' }];
    }, [filters.sort_by, filters.sort_order]);

    const pagination: PaginationMeta = {
        current_page: checkout.current_page,
        last_page: checkout.last_page,
        per_page: checkout.per_page,
        total: checkout.total,
    };

    return (
        <>
            <Head title="Data Check-out" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Data Check-out</CardTitle>
                            <Button onClick={() => router.get('/admin/checkout/create')}>
                                <Plus className="h-4 w-4" />
                                Check-out Baru
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <Input
                                placeholder="Cari ID checkout, checkin, atau tamu..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-72"
                            />
                        </div>

                        <DataTable
                            columns={columns}
                            data={checkout.data}
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
                            emptyMessage="Tidak ada data check-out."
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CheckoutIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Check-out', href: '/admin/checkout' },
    ],
};
