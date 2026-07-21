import { Head, router } from '@inertiajs/react';
import { Plus, Eye, Search } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    checkout: {
        data: CheckoutItem[];
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

export default function CheckoutIndex({ checkout, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = useCallback(() => {
        router.get('/admin/checkout', { search }, { preserveState: true });
    }, [search]);

    return (
        <>
            <Head title="Data Check-out" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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
                        <div className="mb-4 flex gap-2">
                            <Input
                                placeholder="Cari ID checkout, checkin, atau tamu..."
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
                                        <th className="px-4 py-3 text-left font-medium">ID Checkout</th>
                                        <th className="px-4 py-3 text-left font-medium">ID Check-in</th>
                                        <th className="px-4 py-3 text-left font-medium">Tamu</th>
                                        <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                                        <th className="px-4 py-3 text-right font-medium">Potongan</th>
                                        <th className="px-4 py-3 text-right font-medium">Grand Total</th>
                                        <th className="px-4 py-3 text-right font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checkout.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                                Tidak ada data check-out.
                                            </td>
                                        </tr>
                                    ) : (
                                        checkout.data.map((item) => (
                                            <tr key={item.idcheckout} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3 font-mono text-xs">{item.idcheckout}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{item.idcheckin}</td>
                                                <td className="px-4 py-3">
                                                    {item.checkin?.reservasi?.tamu?.nama ?? '-'}
                                                </td>
                                                <td className="px-4 py-3">{item.tglcheckout}</td>
                                                <td className="px-4 py-3 text-right">{formatRupiah(item.potongan)}</td>
                                                <td className="px-4 py-3 text-right font-medium">
                                                    {formatRupiah(item.grandtotal)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            router.get(`/admin/checkout/${item.idcheckout}`)
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

                        {checkout.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Halaman {checkout.current_page} dari {checkout.last_page}
                                </p>
                                <div className="flex gap-1">
                                    {checkout.links.map((link, i) => (
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

CheckoutIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Check-out', href: '/admin/checkout' },
    ],
};
