import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type PengeluaranItem = {
    id: number;
    tgl: string;
    keterangan: string;
    total: number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    pengeluaran: {
        data: PengeluaranItem[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        bulan?: string;
        tahun?: string;
    };
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const bulanOptions = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
];

export default function PengeluaranIndex({ pengeluaran, filters }: Props) {
    const { errors } = usePage().props as { errors: Record<string, string> };

    const [search, setSearch] = useState(filters.search ?? '');
    const [bulan, setBulan] = useState(filters.bulan ?? '');
    const [tahun, setTahun] = useState(filters.tahun ?? '');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editItem, setEditItem] = useState<PengeluaranItem | null>(null);
    const [formValues, setFormValues] = useState({ tgl: '', keterangan: '', total: '' });

    const handleSearch = useCallback(() => {
        router.get('/admin/pengeluaran', { search, bulan, tahun }, { preserveState: true });
    }, [search, bulan, tahun]);

    const handleFilter = useCallback(() => {
        router.get('/admin/pengeluaran', { search, bulan, tahun }, { preserveState: true });
    }, [search, bulan, tahun]);

    const openCreate = () => {
        setEditItem(null);
        setFormValues({ tgl: '', keterangan: '', total: '' });
        setDialogOpen(true);
    };

    const openEdit = (item: PengeluaranItem) => {
        setEditItem(item);
        setFormValues({ tgl: item.tgl, keterangan: item.keterangan, total: item.total.toString() });
        setDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editItem) {
            router.put(`/admin/pengeluaran/${editItem.id}`, formValues, {
                onSuccess: () => setDialogOpen(false),
            });
        } else {
            router.post('/admin/pengeluaran', formValues, {
                onSuccess: () => setDialogOpen(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus pengeluaran ini?')) {
            router.delete(`/admin/pengeluaran/${id}`);
        }
    };

    return (
        <>
            <Head title="Pengeluaran" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Pengeluaran</CardTitle>
                            <Button onClick={openCreate}>
                                <Plus className="h-4 w-4" />
                                Tambah Pengeluaran
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-wrap gap-2">
                            <Input
                                placeholder="Cari keterangan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="max-w-xs"
                            />
                            <Select value={bulan || 'all'} onValueChange={(v) => setBulan(v === 'all' ? '' : v)}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Bulan</SelectItem>
                                    {bulanOptions.map((b) => (
                                        <SelectItem key={b.value} value={b.value}>
                                            {b.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={tahun || 'all'} onValueChange={(v) => setTahun(v === 'all' ? '' : v)}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    {[2024, 2025, 2026, 2027].map((y) => (
                                        <SelectItem key={y} value={y.toString()}>
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={handleFilter}>
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                                        <th className="px-4 py-3 text-left font-medium">Keterangan</th>
                                        <th className="px-4 py-3 text-right font-medium">Total</th>
                                        <th className="px-4 py-3 text-right font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pengeluaran.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                                Tidak ada data pengeluaran.
                                            </td>
                                        </tr>
                                    ) : (
                                        pengeluaran.data.map((item) => (
                                            <tr key={item.id} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3">{item.tgl}</td>
                                                <td className="px-4 py-3">{item.keterangan}</td>
                                                <td className="px-4 py-3 text-right font-medium">
                                                    {formatRupiah(item.total)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openEdit(item)}
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(item.id)}
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

                        {pengeluaran.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Halaman {pengeluaran.current_page} dari {pengeluaran.last_page}
                                </p>
                                <div className="flex gap-1">
                                    {pengeluaran.links.map((link, i) => (
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

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editItem ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="tgl">Tanggal</Label>
                            <Input
                                id="tgl"
                                type="date"
                                value={formValues.tgl}
                                onChange={(e) => setFormValues((p) => ({ ...p, tgl: e.target.value }))}
                            />
                            {errors.tgl && <p className="text-sm text-destructive">{errors.tgl}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="keterangan">Keterangan</Label>
                            <Input
                                id="keterangan"
                                value={formValues.keterangan}
                                onChange={(e) => setFormValues((p) => ({ ...p, keterangan: e.target.value }))}
                                placeholder="Keterangan pengeluaran"
                            />
                            {errors.keterangan && <p className="text-sm text-destructive">{errors.keterangan}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="total">Total</Label>
                            <Input
                                id="total"
                                type="number"
                                value={formValues.total}
                                onChange={(e) => setFormValues((p) => ({ ...p, total: e.target.value }))}
                                placeholder="0"
                            />
                            {errors.total && <p className="text-sm text-destructive">{errors.total}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit">{editItem ? 'Update' : 'Simpan'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

PengeluaranIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengeluaran', href: '/admin/pengeluaran' },
    ],
};
