import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type RekeningData = {
    id: number;
    jenis: string;
    nama: string;
    nomor: string | null;
    foto: string | null;
    aktif: boolean;
};

type Props = {
    rekening?: RekeningData;
};

export default function RekeningForm({ rekening }: Props) {
    const isEdit = !!rekening;
    const { errors } = usePage().props as { errors: Record<string, string> };

    const [values, setValues] = useState({
        jenis: rekening?.jenis ?? 'bank',
        nama: rekening?.nama ?? '',
        nomor: rekening?.nomor ?? '',
        aktif: rekening?.aktif?.toString() ?? '1',
    });

    const [fotoFile, setFotoFile] = useState<File | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(rekening?.foto ? `/storage/${rekening.foto}` : null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setFotoFile(file);
            setFotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('jenis', values.jenis);
        formData.append('nama', values.nama);
        formData.append('nomor', values.nomor);
        formData.append('aktif', values.aktif);

        if (fotoFile) {
            formData.append('foto', fotoFile);
        }

        if (isEdit) {
            formData.append('_method', 'PUT');
            router.post(`/admin/rekening/${rekening.id}`, formData);
        } else {
            router.post('/admin/rekening', formData);
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Rekening' : 'Tambah Rekening'} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => router.get('/admin/rekening')}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <CardTitle>{isEdit ? 'Edit Rekening' : 'Tambah Rekening'}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                            <div className="space-y-2">
                                <Label>Jenis</Label>
                                <Select
                                    value={values.jenis}
                                    onValueChange={(v) => setValues((p) => ({ ...p, jenis: v }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bank">Bank</SelectItem>
                                        <SelectItem value="qris">QRIS</SelectItem>
                                        <SelectItem value="e-wallet">E-Wallet</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.jenis && <p className="text-sm text-destructive">{errors.jenis}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama</Label>
                                <Input
                                    id="nama"
                                    name="nama"
                                    value={values.nama}
                                    onChange={handleChange}
                                    placeholder="Nama bank/e-wallet"
                                />
                                {errors.nama && <p className="text-sm text-destructive">{errors.nama}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nomor">Nomor Rekening</Label>
                                <Input
                                    id="nomor"
                                    name="nomor"
                                    value={values.nomor}
                                    onChange={handleChange}
                                    placeholder="Nomor rekening/e-wallet (kosongkan untuk QRIS)"
                                />
                                {errors.nomor && <p className="text-sm text-destructive">{errors.nomor}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Foto {values.jenis === 'qris' ? '(Wajib untuk QRIS)' : '(Opsional)'}</Label>
                                <div className="flex items-center gap-4">
                                    {fotoPreview && (
                                        <img src={fotoPreview} alt="Preview" className="h-24 w-24 rounded-md object-cover" />
                                    )}
                                    <label className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted">
                                        <Upload className="h-4 w-4" />
                                        Pilih File
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png"
                                            className="hidden"
                                            onChange={handleFotoChange}
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-muted-foreground">Format: JPG, PNG. Maksimal 2MB.</p>
                                {errors.foto && <p className="text-sm text-destructive">{errors.foto}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={values.aktif}
                                    onValueChange={(v) => setValues((p) => ({ ...p, aktif: v }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Aktif</SelectItem>
                                        <SelectItem value="0">Nonaktif</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.aktif && <p className="text-sm text-destructive">{errors.aktif}</p>}
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="submit">
                                    <Save className="h-4 w-4" />
                                    {isEdit ? 'Update' : 'Simpan'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.get('/admin/rekening')}>
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

RekeningForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Rekening', href: '/admin/rekening' },
        { title: 'Form', href: '#' },
    ],
};
