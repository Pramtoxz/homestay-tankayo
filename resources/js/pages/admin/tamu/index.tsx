import { Head, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useState, useCallback } from 'react';
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
    user_id: number | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    tamu: {
        data: TamuItem[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
    };
};

export default function TamuIndex({ tamu, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = useCallback(() => {
        router.get('/admin/tamu', { search }, { preserveState: true });
    }, [search]);

    const handleDelete = useCallback((nik: string) => {
        if (confirm('Yakin ingin menghapus tamu ini?')) {
            router.delete(`/admin/tamu/${nik}`);
        }
    }, []);

    return (
        <>
            <Head title="Data Tamu" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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
                        <div className="mb-4 flex gap-2">
                            <Input
                                placeholder="CNIK, nama, atau no HP..."
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
                                        <th className="px-4 py-3 text-left font-medium">NIK</th>
                                        <th className="px-4 py-3 text-left font-medium">Nama</th>
                                        <th className="px-4 py-3 text-left font-medium">Alamat</th>
                                        <th className="px-4 py-3 text-left font-medium">No HP</th>
                                        <th className="px-4 py-3 text-left font-medium">JK</th>
                                        <th className="px-4 py-3 text-right font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tamu.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                                Tidak ada data tamu.
                                            </td>
                                        </tr>
                                    ) : (
                                        tamu.data.map((item) => (
                                            <tr key={item.nik} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3">{item.nik}</td>
                                                <td className="px-4 py-3 font-medium">{item.nama}</td>
                                                <td className="px-4 py-3">{item.alamat}</td>
                                                <td className="px-4 py-3">{item.nohp}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={item.jk === 'L' ? 'default' : 'secondary'}>
                                                        {item.jk === 'L' ? 'Laki-laki' : 'Perempuan'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.get(`/admin/tamu/${item.nik}/edit`)}
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(item.nik)}
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

                        {tamu.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Halaman {tamu.current_page} dari {tamu.last_page}
                                </p>
                                <div className="flex gap-1">
                                    {tamu.links.map((link, i) => (
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

TamuIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tamu', href: '/admin/tamu' },
    ],
};
