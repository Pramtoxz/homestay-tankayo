import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SearchPickerDialog } from '@/components/search-picker-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TamuOption = { nik: string; nama: string; alamat: string; nohp: string };
type KamarOption = {
    id_kamar: string;
    nama: string;
    tipe_kamar: string;
    harga: number;
    fasilitas: string | null;
    status_kamar: string;
};
type ReservasiData = {
    idbooking: string;
    nik: string;
    idkamar: string;
    tglcheckin: string;
    tglcheckout: string;
    totalbayar: number;
    tipe: string;
    status: string;
    tamu: { nik: string; nama: string } | null;
    kamar: { id_kamar: string; nama: string; tipe_kamar: string; harga: number } | null;
};

type Props = {
    reservasi?: ReservasiData;
};

const TIPE_KAMAR_OPTIONS = [
    'Superior Room Balcony',
    'Deluxe Room Balcony',
    'Twinbed Room Balcony',
    'Junior Suite Room Balcony',
    'Triple Room Balcony',
];

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function ReservasiForm({ reservasi }: Props) {
    const isEdit = !!reservasi;
    const { errors } = usePage().props as { errors: Record<string, string> };

    const [values, setValues] = useState({
        nik: reservasi?.nik ?? '',
        idkamar: reservasi?.idkamar ?? '',
        tglcheckin: reservasi?.tglcheckin ?? '',
        tglcheckout: reservasi?.tglcheckout ?? '',
        totalbayar: reservasi?.totalbayar?.toString() ?? '',
        tipe: reservasi?.tipe ?? 'cash',
        status: reservasi?.status ?? '',
    });

    const [selectedTamu, setSelectedTamu] = useState<TamuOption | null>(
        reservasi?.tamu ? { nik: reservasi.tamu.nik, nama: reservasi.tamu.nama, alamat: '', nohp: '' } : null,
    );
    const [selectedKamar, setSelectedKamar] = useState<KamarOption | null>(
        reservasi?.kamar
            ? {
                  id_kamar: reservasi.kamar.id_kamar,
                  nama: reservasi.kamar.nama,
                  tipe_kamar: reservasi.kamar.tipe_kamar,
                  harga: reservasi.kamar.harga,
                  fasilitas: null,
                  status_kamar: '',
              }
            : null,
    );
    const [tamuDialogOpen, setTamuDialogOpen] = useState(false);
    const [kamarDialogOpen, setKamarDialogOpen] = useState(false);

    const todayStr = useMemo(() => {
        const d = new Date();

        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }, []);

    const minCheckout = useMemo(() => {
        if (!values.tglcheckin) {
            return todayStr;
        }

        const [y, m, d] = values.tglcheckin.split('-').map(Number);
        const next = new Date(y, m - 1, d + 1);

        return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
    }, [values.tglcheckin, todayStr]);

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

    const tanggalBelumDipilih = !values.tglcheckin || !values.tglcheckout;

    const kamarSearchParams = useMemo(
        () => ({ tglcheckin: values.tglcheckin, tglcheckout: values.tglcheckout }),
        [values.tglcheckin, values.tglcheckout],
    );

    const kamarFilters = useMemo(
        () => [
            {
                key: 'tipe_kamar',
                label: 'Tipe Kamar',
                options: TIPE_KAMAR_OPTIONS.map((tipe) => ({ value: tipe, label: tipe })),
            },
        ],
        [],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        } else {
            router.post('/admin/reservasi', {
                ...values,
                totalbayar: autoTotal !== null ? autoTotal.toString() : values.totalbayar,
                nik: selectedTamu?.nik ?? '',
                idkamar: selectedKamar?.id_kamar ?? '',
            });
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Reservasi' : 'Buat Reservasi'} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => router.get('/admin/reservasi')}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <CardTitle>{isEdit ? 'Edit Reservasi' : 'Buat Reservasi'}</CardTitle>
                                {isEdit && <CardDescription className="font-mono">{reservasi.idbooking}</CardDescription>}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
                            {!isEdit && (
                                <div className="space-y-2">
                                    <Label>Tamu</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="tamu_nik">NIK</Label>
                                            <Input id="tamu_nik" readOnly placeholder="Belum dipilih" value={selectedTamu?.nik ?? ''} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tamu_nama">Nama Tamu</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    id="tamu_nama"
                                                    readOnly
                                                    placeholder="Belum dipilih"
                                                    value={selectedTamu?.nama ?? ''}
                                                    className="flex-1"
                                                />
                                                <Button type="button" variant="outline" size="sm" onClick={() => setTamuDialogOpen(true)}>
                                                    Pilih Tamu
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    {errors.nik && <p className="text-sm text-destructive">{errors.nik}</p>}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tglcheckin">Tanggal Check-in</Label>
                                    <Input
                                        id="tglcheckin"
                                        name="tglcheckin"
                                        type="date"
                                        min={isEdit ? undefined : todayStr}
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
                                        min={minCheckout}
                                        value={values.tglcheckout}
                                        onChange={handleChange}
                                    />
                                    {errors.tglcheckout && <p className="text-sm text-destructive">{errors.tglcheckout}</p>}
                                </div>
                            </div>

                            {!isEdit && (
                                <div className="space-y-2">
                                    <Label>Kamar</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="kamar_id">ID Kamar</Label>
                                            <Input id="kamar_id" readOnly placeholder="Belum dipilih" value={selectedKamar?.id_kamar ?? ''} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="kamar_nama">Nama Kamar</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    id="kamar_nama"
                                                    readOnly
                                                    placeholder="Belum dipilih"
                                                    value={selectedKamar?.nama ?? ''}
                                                    className="flex-1"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={tanggalBelumDipilih}
                                                    onClick={() => setKamarDialogOpen(true)}
                                                >
                                                    Pilih Kamar
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="kamar_tipe">Tipe Kamar</Label>
                                            <Input id="kamar_tipe" readOnly placeholder="Belum dipilih" value={selectedKamar?.tipe_kamar ?? ''} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="kamar_fasilitas">Fasilitas</Label>
                                            <Input
                                                id="kamar_fasilitas"
                                                readOnly
                                                placeholder="Belum dipilih"
                                                value={selectedKamar?.fasilitas ?? ''}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="kamar_harga">Harga Kamar</Label>
                                            <Input
                                                id="kamar_harga"
                                                readOnly
                                                placeholder="Belum dipilih"
                                                value={selectedKamar ? `${formatRupiah(selectedKamar.harga)}/malam` : ''}
                                            />
                                        </div>
                                    </div>
                                    {tanggalBelumDipilih && (
                                        <p className="text-sm text-muted-foreground">
                                            Pilih tanggal check-in &amp; check-out terlebih dahulu sebelum memilih kamar.
                                        </p>
                                    )}
                                    {errors.idkamar && <p className="text-sm text-destructive">{errors.idkamar}</p>}
                                </div>
                            )}

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
                                    readOnly
                                    value={autoTotal !== null ? autoTotal.toString() : values.totalbayar}
                                    placeholder="0"
                                />
                                {errors.totalbayar && <p className="text-sm text-destructive">{errors.totalbayar}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Tipe Pembayaran</Label>
                                <Select value={values.tipe} onValueChange={(v) => setValues((p) => ({ ...p, tipe: v }))}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="transfer">Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.tipe && <p className="text-sm text-destructive">{errors.tipe}</p>}
                            </div>

                            {isEdit && (
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={values.status} onValueChange={(v) => setValues((p) => ({ ...p, status: v }))}>
                                        <SelectTrigger className="w-full">
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

            <SearchPickerDialog<TamuOption>
                open={tamuDialogOpen}
                onOpenChange={setTamuDialogOpen}
                title="Pilih Tamu"
                searchPlaceholder="Cari NIK, nama, atau no HP..."
                fetchUrl="/admin/reservasi-search/tamu"
                columns={['NIK', 'Nama', 'No HP']}
                getRowKey={(t) => t.nik}
                renderRow={(t) => [t.nik, t.nama, t.nohp]}
                onSelect={setSelectedTamu}
                emptyMessage="Tidak ada data tamu."
            />

            <SearchPickerDialog<KamarOption>
                open={kamarDialogOpen}
                onOpenChange={setKamarDialogOpen}
                title="Pilih Kamar"
                searchPlaceholder="Cari ID atau nama kamar..."
                fetchUrl="/admin/reservasi-search/kamar"
                extraParams={kamarSearchParams}
                filters={kamarFilters}
                columns={['ID', 'Nama', 'Tipe Kamar', 'Harga/Malam']}
                getRowKey={(k) => k.id_kamar}
                renderRow={(k) => [k.id_kamar, k.nama, k.tipe_kamar, formatRupiah(k.harga)]}
                onSelect={setSelectedKamar}
                emptyMessage="Tidak ada kamar tersedia."
            />
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
