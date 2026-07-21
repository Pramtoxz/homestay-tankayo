import { Head, router } from '@inertiajs/react';
import { Plus, Eye, Search } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type CheckinItem = {
    idcheckin: string;
    idbooking: string;
    sisabayar: number;
    deposit: number;
    reservasi: {
        idbooking: string;
        tamu: { nama: string } | null;
        kamar: { nama: string } | null;
    } | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    checkin: {
        data: CheckinItem[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
    };
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function CheckinIndex({ checkin, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = useCallback(() => {
        router.get('/admin/checkin', { search }, { preserveState: true });
    }, [search]);

    return (
        <>
            <Head title="Data Check-in" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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
                        <div className="mb-4 flex gap-2">
                            <Input
                                placeholder="Cari ID check-in, booking, atau tamu..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="max-w-sm"
                            />
                            <Button variant="outline" onClick={handleSearch}>
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left font-medium">ID Check-in</th>
                                        <th className="px-4 py-3 text-left font-medium">ID Booking</th>
                                        <th className="px-4 py-3 text-left font-medium">Tamu</th>
                                        <th className="px-4 py-3 text-left font-medium">Kamar</th>
                                        <th className="px-4 py-3 text-right font-medium">Sisa Bayar</th>
                                        <th className="px-4 py-3 text-right font-medium">Deposit</th>
                                        <th className="px-4 py-3 text-right font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checkin.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                                Tidak ada data check-in.
                                            </td>
                                        </tr>
                                    ) : (
                                        checkin.data.map((item) => (
                                            <tr key={item.idcheckin} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3 font-mono text-xs">{item.idcheckin}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{item.idbooking}</td>
                                                <td className="px-4 py-3">{item.reservasi?.tamu?.nama ?? '-'}</td>
                                                <td className="px-4 py-3">{item.reservasi?.kamar?.nama ?? '-'}</td>
                                                <td className="px-4 py-3 text-right">{formatRupiah(item.sisabayar)}</td>
                                                <td className="px-4 py-3 text-right">{formatRupiah(item.deposit)}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            router.get(`/admin/checkin/${item.idcheckin}`)
                                                        }
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

                        {checkin.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Halaman {checkin.current_page} dari {checkin.last_page}
                                </p>
                                <div className="flex gap-1">
                                    {checkin.links.map((link, i) => (
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

CheckinIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Check-in', href: '/admin/checkin' },
    ],
};
