import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TipeOption = {
    id: number;
    nama_tipe: string;
};

type KamarData = {
    id_kamar: string;
    nama: string;
    tipe_id: number;
    harga: number;
    fasilitas: string | null;
    status_kamar: string;
};

type Props = {
    kamar?: KamarData;
    nextId?: string;
    tipeOptions: TipeOption[];
};

export default function KamarForm({ kamar, nextId, tipeOptions }: Props) {
    const isEdit = !!kamar;
    const { errors } = usePage().props as { errors: Record<string, string> };

    const [values, setValues] = useState({
        nama: kamar?.nama ?? '',
        tipe_id: kamar?.tipe_id?.toString() ?? (tipeOptions.length > 0 ? tipeOptions[0].id.toString() : ''),
        harga: kamar?.harga?.toString() ?? '',
        fasilitas: kamar?.fasilitas ?? '',
        status_kamar: kamar?.status_kamar ?? 'tersedia',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: Record<string, string> = {
            nama: values.nama,
            tipe_id: values.tipe_id,
            harga: values.harga,
            fasilitas: values.fasilitas,
            status_kamar: values.status_kamar,
        };

        if (isEdit) {
            data._method = 'PUT';
            router.post(`/admin/kamar/${kamar.id_kamar}`, data);
        } else {
            router.post('/admin/kamar', data);
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Kamar' : 'Tambah Kamar'} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => router.get('/admin/kamar')}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <CardTitle>{isEdit ? 'Edit Kamar' : 'Tambah Kamar'}</CardTitle>
                        </div>
                        {nextId && (
                            <p className="text-sm text-muted-foreground">ID Kamar: {nextId}</p>
                        )}
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama Kamar</Label>
                                <Input
                                    id="nama"
                                    name="nama"
                                    value={values.nama}
                                    onChange={handleChange}
                                    placeholder="Nama kamar"
                                />
                                {errors.nama && <p className="text-sm text-destructive">{errors.nama}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Tipe Kamar</Label>
                                <Select
                                    value={values.tipe_id}
                                    onValueChange={(v) => setValues((p) => ({ ...p, tipe_id: v }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih tipe kamar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tipeOptions.map((tipe) => (
                                            <SelectItem key={tipe.id} value={tipe.id.toString()}>
                                                {tipe.nama_tipe}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.tipe_id && <p className="text-sm text-destructive">{errors.tipe_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="harga">Harga per Malam</Label>
                                <Input
                                    id="harga"
                                    name="harga"
                                    type="number"
                                    value={values.harga}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                                {errors.harga && <p className="text-sm text-destructive">{errors.harga}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fasilitas">Fasilitas</Label>
                                <Input
                                    id="fasilitas"
                                    name="fasilitas"
                                    value={values.fasilitas}
                                    onChange={handleChange}
                                    placeholder="AC, TV, WiFi, kamar mandi dalam, dll"
                                />
                                {errors.fasilitas && <p className="text-sm text-destructive">{errors.fasilitas}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Status Kamar</Label>
                                <Select
                                    value={values.status_kamar}
                                    onValueChange={(v) => setValues((p) => ({ ...p, status_kamar: v }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tersedia">Tersedia</SelectItem>
                                        <SelectItem value="tidak tersedia">Tidak Tersedia</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status_kamar && (
                                    <p className="text-sm text-destructive">{errors.status_kamar}</p>
                                )}
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="submit">
                                    <Save className="h-4 w-4" />
                                    {isEdit ? 'Update' : 'Simpan'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.get('/admin/kamar')}>
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

KamarForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Kamar', href: '/admin/kamar' },
        { title: 'Form', href: '#' },
    ],
};
