import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type KamarData = {
    id_kamar: string;
    nama: string;
    harga: number;
    dp: number;
    deskripsi: string | null;
    cover: string | null;
    status_kamar: string;
};

type Props = {
    kamar?: KamarData;
    nextId?: string;
};

export default function KamarForm({ kamar, nextId }: Props) {
    const isEdit = !!kamar;
    const { errors } = usePage().props as { errors: Record<string, string> };

    const [values, setValues] = useState({
        nama: kamar?.nama ?? '',
        harga: kamar?.harga?.toString() ?? '',
        dp: kamar?.dp?.toString() ?? '',
        deskripsi: kamar?.deskripsi ?? '',
        status_kamar: kamar?.status_kamar ?? 'tersedia',
    });

    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(
        kamar?.cover ? `/storage/${kamar.cover}` : null,
    );

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nama', values.nama);
        formData.append('harga', values.harga);
        formData.append('dp', values.dp);
        formData.append('deskripsi', values.deskripsi);
        formData.append('status_kamar', values.status_kamar);

        if (coverFile) {
            formData.append('cover', coverFile);
        }

        if (isEdit) {
            formData.append('_method', 'PUT');
            router.post(`/admin/kamar/${kamar.id_kamar}`, formData);
        } else {
            router.post('/admin/kamar', formData);
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Kamar' : 'Tambah Kamar'} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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
                        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
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

                            <div className="grid grid-cols-2 gap-4">
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
                                    <Label htmlFor="dp">DP</Label>
                                    <Input
                                        id="dp"
                                        name="dp"
                                        type="number"
                                        value={values.dp}
                                        onChange={handleChange}
                                        placeholder="0"
                                    />
                                    {errors.dp && <p className="text-sm text-destructive">{errors.dp}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <Input
                                    id="deskripsi"
                                    name="deskripsi"
                                    value={values.deskripsi}
                                    onChange={handleChange}
                                    placeholder="Deskripsi kamar"
                                />
                                {errors.deskripsi && <p className="text-sm text-destructive">{errors.deskripsi}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Cover</Label>
                                <div className="flex items-center gap-4">
                                    {coverPreview && (
                                        <img
                                            src={coverPreview}
                                            alt="Preview"
                                            className="h-20 w-20 rounded-md object-cover"
                                        />
                                    )}
                                    <label className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted">
                                        <Upload className="h-4 w-4" />
                                        Pilih File
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png"
                                            className="hidden"
                                            onChange={handleCoverChange}
                                        />
                                    </label>
                                </div>
                                {errors.cover && <p className="text-sm text-destructive">{errors.cover}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Status Kamar</Label>
                                <Select
                                    value={values.status_kamar}
                                    onValueChange={(v) => setValues((p) => ({ ...p, status_kamar: v }))}
                                >
                                    <SelectTrigger>
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
