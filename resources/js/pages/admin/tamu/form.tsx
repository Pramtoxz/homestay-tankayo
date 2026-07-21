import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TamuData = {
    nik: string;
    nama: string;
    alamat: string;
    nohp: string;
    jk: string;
    user_id: number | null;
};

type UserData = {
    id: number;
    name: string;
    email: string;
};

type Props = {
    tamu?: TamuData;
    users: UserData[];
};

export default function TamuForm({ tamu, users }: Props) {
    const isEdit = !!tamu;
    const { errors } = usePage().props as { errors: Record<string, string> };

    const [values, setValues] = useState({
        nik: tamu?.nik ?? '',
        nama: tamu?.nama ?? '',
        alamat: tamu?.alamat ?? '',
        nohp: tamu?.nohp ?? '',
        jk: tamu?.jk ?? 'L',
        user_id: tamu?.user_id?.toString() ?? '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: Record<string, string> = { ...values };

        if (!payload.user_id) {
delete payload.user_id;
}

        if (isEdit) {
            router.put(`/admin/tamu/${tamu!.nik}`, payload);
        } else {
            router.post('/admin/tamu', payload);
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Tamu' : 'Tambah Tamu'} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => router.get('/admin/tamu')}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <CardTitle>{isEdit ? 'Edit Tamu' : 'Tambah Tamu'}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nik">NIK</Label>
                                <Input
                                    id="nik"
                                    name="nik"
                                    value={values.nik}
                                    onChange={handleChange}
                                    readOnly={isEdit}
                                    disabled={isEdit}
                                    placeholder="Nomor Induk Kependudukan"
                                />
                                {errors.nik && <p className="text-sm text-destructive">{errors.nik}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama</Label>
                                <Input
                                    id="nama"
                                    name="nama"
                                    value={values.nama}
                                    onChange={handleChange}
                                    placeholder="Nama lengkap"
                                />
                                {errors.nama && <p className="text-sm text-destructive">{errors.nama}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="alamat">Alamat</Label>
                                <Input
                                    id="alamat"
                                    name="alamat"
                                    value={values.alamat}
                                    onChange={handleChange}
                                    placeholder="Alamat lengkap"
                                />
                                {errors.alamat && <p className="text-sm text-destructive">{errors.alamat}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nohp">No HP</Label>
                                <Input
                                    id="nohp"
                                    name="nohp"
                                    value={values.nohp}
                                    onChange={handleChange}
                                    placeholder="Nomor handphone"
                                />
                                {errors.nohp && <p className="text-sm text-destructive">{errors.nohp}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Jenis Kelamin</Label>
                                <Select value={values.jk} onValueChange={(v) => setValues((p) => ({ ...p, jk: v }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="L">Laki-laki</SelectItem>
                                        <SelectItem value="P">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.jk && <p className="text-sm text-destructive">{errors.jk}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Akun User (Opsional)</Label>
                                <Select
                                    value={values.user_id}
                                    onValueChange={(v) => setValues((p) => ({ ...p, user_id: v }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih user..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((u) => (
                                            <SelectItem key={u.id} value={u.id.toString()}>
                                                {u.name} ({u.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.user_id && <p className="text-sm text-destructive">{errors.user_id}</p>}
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="submit">
                                    <Save className="h-4 w-4" />
                                    {isEdit ? 'Update' : 'Simpan'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.get('/admin/tamu')}>
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

TamuForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tamu', href: '/admin/tamu' },
        { title: 'Form', href: '#' },
    ],
};
