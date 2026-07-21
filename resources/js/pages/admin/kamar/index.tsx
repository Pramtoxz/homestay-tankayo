import { Head, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type KamarItem = {
    id_kamar: string;
    nama: string;
    harga: number;
    dp: number;
    status_kamar: string;
    cover: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    kamar: {
        data: KamarItem[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function KamarIndex({ kamar, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const handleSearch = useCallback(() => {
        router.get('/admin/kamar', { search, status }, { preserveState: true });
    }, [search, status]);

    const handleStatusFilter = useCallback((val: string) => {
        const s = val === 'all' ? '' : val;
        setStatus(s);
        router.get('/admin/kamar', { search, status: s }, { preserveState: true });
    }, [search]);

    const handleDelete = useCallback((id: string) => {
        if (confirm('Yakin ingin menghapus kamar ini?')) {
            router.delete(`/admin/kamar/${id}`);
        }
    }, []);

    return (
        <>
            <Head title="Data Kamar" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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
                        <div className="mb-4 flex gap-2">
                            <Input
                                placeholder="Cari ID atau nama kamar..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="max-w-sm"
                            />
                            <Select value={status || 'all'} onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="tersedia">Tersedia</SelectItem>
                                    <SelectItem value="tidak tersedia">Tidak Tersedia</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={handleSearch}>
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left font-medium">ID</th>
                                        <th className="px-4 py-3 text-left font-medium">Nama</th>
                                        <th className="px-4 py-3 text-right font-medium">Harga</th>
                                        <th className="px-4 py-3 text-right font-medium">DP</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-right font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kamar.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                                Tidak ada data kamar.
                                            </td>
                                        </tr>
                                    ) : (
                                        kamar.data.map((item) => (
                                            <tr key={item.id_kamar} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3 font-mono text-xs">{item.id_kamar}</td>
                                                <td className="px-4 py-3 font-medium">{item.nama}</td>
                                                <td className="px-4 py-3 text-right">{formatRupiah(item.harga)}</td>
                                                <td className="px-4 py-3 text-right">{formatRupiah(item.dp)}</td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        variant={
                                                            item.status_kamar === 'tersedia' ? 'default' : 'destructive'
                                                        }
                                                    >
                                                        {item.status_kamar}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                router.get(`/admin/kamar/${item.id_kamar}/edit`)
                                                            }
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(item.id_kamar)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {kamar.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Halaman {kamar.current_page} dari {kamar.last_page}
                                </p>
                                <div className="flex gap-1">
                                    {kamar.links.map((link, i) => (
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

KamarIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Kamar', href: '/admin/kamar' },
    ],
};
