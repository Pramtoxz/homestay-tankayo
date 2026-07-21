import { Head, router, usePage } from '@inertiajs/react';
import { Save, UserPlus } from 'lucide-react';
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
} | null;

type Props = {
    tamu: TamuData;
};

export default function LengkapiData({ tamu }: Props) {
    const { errors } = usePage().props as { errors: Record<string, string> };

    const [values, setValues] = useState({
        nik: tamu?.nik ?? '',
        nama: tamu?.nama ?? '',
        alamat: tamu?.alamat ?? '',
        nohp: tamu?.nohp ?? '',
        jk: tamu?.jk ?? '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/portal/lengkapi-data', values);
    };

    return (
        <>
            <Head title="Lengkapi Data Diri" />
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <UserPlus className="h-5 w-5" />
                            <CardTitle>Lengkapi Data Diri</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Silakan lengkapi data diri Anda untuk dapat melakukan booking kamar.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nik">NIK</Label>
                                <Input
                                    id="nik"
                                    name="nik"
                                    value={values.nik}
                                    onChange={handleChange}
                                    placeholder="16 digit NIK"
                                    maxLength={16}
                                    disabled={!!tamu}
                                />
                                {errors.nik && <p className="text-sm text-destructive">{errors.nik}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama Lengkap</Label>
                                <Input
                                    id="nama"
                                    name="nama"
                                    value={values.nama}
                                    onChange={handleChange}
                                    placeholder="Nama sesuai KTP"
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
                                <Label htmlFor="nohp">No. HP</Label>
                                <Input
                                    id="nohp"
                                    name="nohp"
                                    value={values.nohp}
                                    onChange={handleChange}
                                    placeholder="08xxxxxxxxxx"
                                />
                                {errors.nohp && <p className="text-sm text-destructive">{errors.nohp}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Jenis Kelamin</Label>
                                <Select value={values.jk} onValueChange={(v) => setValues((p) => ({ ...p, jk: v }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jenis kelamin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="L">Laki-laki</SelectItem>
                                        <SelectItem value="P">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.jk && <p className="text-sm text-destructive">{errors.jk}</p>}
                            </div>

                            <Button type="submit" className="w-full">
                                <Save className="h-4 w-4" />
                                Simpan Data
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

LengkapiData.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/portal' },
        { title: 'Lengkapi Data', href: '/portal/lengkapi-data' },
    ],
};
