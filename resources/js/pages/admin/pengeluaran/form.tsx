import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PengeluaranData = {
    id: number;
    tgl: string;
    keterangan: string;
    total: number;
};

type Props = {
    pengeluaran?: PengeluaranData;
};

export default function PengeluaranForm({ pengeluaran }: Props) {
    const isEdit = !!pengeluaran;
    const { errors } = usePage().props as { errors: Record<string, string> };

    const [values, setValues] = useState({
        tgl: pengeluaran?.tgl ?? '',
        keterangan: pengeluaran?.keterangan ?? '',
        total: pengeluaran?.total?.toString() ?? '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            router.put(`/admin/pengeluaran/${pengeluaran!.id}`, values);
        } else {
            router.post('/admin/pengeluaran', values);
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => router.get('/admin/pengeluaran')}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <CardTitle>{isEdit ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="tgl">Tanggal</Label>
                                <Input
                                    id="tgl"
                                    name="tgl"
                                    type="date"
                                    value={values.tgl}
                                    onChange={handleChange}
                                />
                                {errors.tgl && <p className="text-sm text-destructive">{errors.tgl}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="keterangan">Keterangan</Label>
                                <Input
                                    id="keterangan"
                                    name="keterangan"
                                    value={values.keterangan}
                                    onChange={handleChange}
                                    placeholder="Keterangan pengeluaran"
                                />
                                {errors.keterangan && <p className="text-sm text-destructive">{errors.keterangan}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="total">Total (Rp)</Label>
                                <Input
                                    id="total"
                                    name="total"
                                    type="number"
                                    value={values.total}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                                {errors.total && <p className="text-sm text-destructive">{errors.total}</p>}
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="submit">
                                    <Save className="h-4 w-4" />
                                    {isEdit ? 'Update' : 'Simpan'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.get('/admin/pengeluaran')}>
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PengeluaranForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengeluaran', href: '/admin/pengeluaran' },
        { title: 'Form', href: '#' },
    ],
};
