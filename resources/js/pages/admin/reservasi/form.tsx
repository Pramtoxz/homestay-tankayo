import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, UserPlus, Users } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TamuOption = { nik: string; nama: string };
type KamarOption = { id_kamar: string; nama: string; harga: number; dp: number };
type ReservasiData = {
    idbooking: string;
    nik: string;
    idkamar: string;
    tglcheckin: string;
    tglcheckout: string;
    totalbayar: number;
    tipe: string;
    status: string;
};

type Props = {
    reservasi?: ReservasiData;
    tamu: TamuOption[];
    kamar: KamarOption[];
};

export default function ReservasiForm({ reservasi, tamu, kamar }: Props) {
    const isEdit = !!reservasi;
    const { errors } = usePage().props as { errors: Record<string, string> };

    const [mode, setMode] = useState<'existing' | 'walkin'>(isEdit ? 'existing' : 'existing');

    const [values, setValues] = useState({
        nik: reservasi?.nik ?? '',
        idkamar: reservasi?.idkamar ?? '',
        tglcheckin: reservasi?.tglcheckin ?? '',
        tglcheckout: reservasi?.tglcheckout ?? '',
        totalbayar: reservasi?.totalbayar?.toString() ?? '',
        tipe: reservasi?.tipe ?? 'cash',
        status: reservasi?.status ?? '',
    });

    const [tamuBaru, setTamuBaru] = useState({
        nik: '',
        nama: '',
        alamat: '',
        nohp: '',
        jk: 'L',
    });

    const selectedKamar = kamar.find((k) => k.id_kamar === values.idkamar);

    const calculatedDays = useMemo(() => {
        if (!values.tglcheckin || !values.tglcheckout) {
            return 0;
        }

        const diff = new Date(values.tglcheckout).getTime() - new Date(values.tglcheckin).getTime();

        return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
    }, [values.tglcheckin, values.tglcheckout]);

    const autoTotal = useMemo(() => {
        if (selectedKamar && calculatedDays > 0 && !isEdit) {
            return selectedKamar.harga * calculatedDays;
        }

        return null;
    }, [selectedKamar, calculatedDays, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleTamuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTamuBaru((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            router.put(`/admin/reservasi/${reservasi.idbooking}`, {
                tglcheckin: values.tglcheckin,
                tglcheckout: values.tglcheckout,
                totalbayar: values.totalbayar,
                tipe: values.tipe,
                status: values.status,
            });
        } else if (mode === 'walkin') {
            router.post('/admin/reservasi', {
                ...values,
                mode: 'walkin',
                tamu: tamuBaru,
            });
        } else {
            router.post('/admin/reservasi', values);
        }
    };

    const formatRupiah = (n: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

    return (
        <>
            <Head title={isEdit ? 'Edit Reservasi' : 'Buat Reservasi'} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => router.get('/admin/reservasi')}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <CardTitle>{isEdit ? 'Edit Reservasi' : 'Buat Reservasi'}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
                            {!isEdit && (
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant={mode === 'existing' ? 'default' : 'outline'}
                                        onClick={() => setMode('existing')}
                                        className="flex-1"
                                    >
                                        <Users className="mr-2 h-4 w-4" />
                                        Pilih Tamu
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={mode === 'walkin' ? 'default' : 'outline'}
                                        onClick={() => setMode('walkin')}
                                        className="flex-1"
                                    >
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Walk-in (Tamu Baru)
                                    </Button>
                                </div>
                            )}

                            {!isEdit && mode === 'existing' && (
                                <div className="space-y-2">
                                    <Label>Tamu</Label>
                                    <Select value={values.nik} onValueChange={(v) => setValues((p) => ({ ...p, nik: v }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih tamu..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tamu.map((t) => (
                                                <SelectItem key={t.nik} value={t.nik}>
                                                    {t.nama} ({t.nik})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.nik && <p className="text-sm text-destructive">{errors.nik}</p>}
                                </div>
                            )}

                            {!isEdit && mode === 'walkin' && (
                                <Card className="border-dashed">
                                    <CardHeader>
                                        <CardTitle className="text-sm">Data Tamu Baru</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="tamu_nik">NIK</Label>
                                            <Input
                                                id="tamu_nik"
                                                name="nik"
                                                value={tamuBaru.nik}
                                                onChange={handleTamuChange}
                                                placeholder="Nomor Induk Kependudukan"
                                                maxLength={30}
                                            />
                                            {errors['tamu.nik'] && <p className="text-sm text-destructive">{errors['tamu.nik']}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tamu_nama">Nama Lengkap</Label>
                                            <Input
                                                id="tamu_nama"
                                                name="nama"
                                                value={tamuBaru.nama}
                                                onChange={handleTamuChange}
                                                placeholder="Nama sesuai KTP"
                                            />
                                            {errors['tamu.nama'] && <p className="text-sm text-destructive">{errors['tamu.nama']}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tamu_alamat">Alamat</Label>
                                            <Input
                                                id="tamu_alamat"
                                                name="alamat"
                                                value={tamuBaru.alamat}
                                                onChange={handleTamuChange}
                                                placeholder="Alamat lengkap"
                                            />
                                            {errors['tamu.alamat'] && <p className="text-sm text-destructive">{errors['tamu.alamat']}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="tamu_nohp">No. HP</Label>
                                                <Input
                                                    id="tamu_nohp"
                                                    name="nohp"
                                                    value={tamuBaru.nohp}
                                                    onChange={handleTamuChange}
                                                    placeholder="08xxx"
                                                />
                                                {errors['tamu.nohp'] && <p className="text-sm text-destructive">{errors['tamu.nohp']}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Jenis Kelamin</Label>
                                                <Select value={tamuBaru.jk} onValueChange={(v) => setTamuBaru((p) => ({ ...p, jk: v }))}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="L">Laki-laki</SelectItem>
                                                        <SelectItem value="P">Perempuan</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {!isEdit && (
                                <div className="space-y-2">
                                    <Label>Kamar</Label>
                                    <Select value={values.idkamar} onValueChange={(v) => setValues((p) => ({ ...p, idkamar: v }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kamar..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kamar.map((k) => (
                                                <SelectItem key={k.id_kamar} value={k.id_kamar}>
                                                    {k.nama} - {formatRupiah(k.harga)}/malam
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.idkamar && <p className="text-sm text-destructive">{errors.idkamar}</p>}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tglcheckin">Tanggal Check-in</Label>
                                    <Input
                                        id="tglcheckin"
                                        name="tglcheckin"
                                        type="date"
                                        value={values.tglcheckin}
                                        onChange={handleChange}
                                    />
                                    {errors.tglcheckin && <p className="text-sm text-destructive">{errors.tglcheckin}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tglcheckout">Tanggal Check-out</Label>
                                    <Input
                                        id="tglcheckout"
                                        name="tglcheckout"
                                        type="date"
                                        value={values.tglcheckout}
                                        onChange={handleChange}
                                    />
                                    {errors.tglcheckout && <p className="text-sm text-destructive">{errors.tglcheckout}</p>}
                                </div>
                            </div>

                            {selectedKamar && values.tglcheckin && values.tglcheckout && (
                                <div className="rounded-md bg-muted p-3 text-sm">
                                    <p>Harga: {formatRupiah(selectedKamar.harga)} x {calculatedDays} malam</p>
                                    <p className="font-semibold">Total: {formatRupiah(selectedKamar.harga * calculatedDays)}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="totalbayar">Total Bayar</Label>
                                <Input
                                    id="totalbayar"
                                    name="totalbayar"
                                    type="number"
                                    value={autoTotal !== null ? autoTotal.toString() : values.totalbayar}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                                {errors.totalbayar && <p className="text-sm text-destructive">{errors.totalbayar}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Tipe Pembayaran</Label>
                                <Select value={values.tipe} onValueChange={(v) => setValues((p) => ({ ...p, tipe: v }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="transfer">Transfer</SelectItem>
                                        <SelectItem value="dp">DP</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.tipe && <p className="text-sm text-destructive">{errors.tipe}</p>}
                            </div>

                            {isEdit && (
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={values.status} onValueChange={(v) => setValues((p) => ({ ...p, status: v }))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="diproses">Diproses</SelectItem>
                                            <SelectItem value="diterima">Diterima</SelectItem>
                                            <SelectItem value="ditolak">Ditolak</SelectItem>
                                            <SelectItem value="cancel">Cancel</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                                </div>
                            )}

                            <div className="flex gap-2 pt-4">
                                <Button type="submit">
                                    <Save className="h-4 w-4" />
                                    {isEdit ? 'Update' : 'Simpan'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.get('/admin/reservasi')}>
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

ReservasiForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Reservasi', href: '/admin/reservasi' },
        { title: 'Form', href: '#' },
    ],
};
