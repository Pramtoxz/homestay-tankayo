import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SearchPickerDialog } from '@/components/search-picker-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatTanggal } from '@/lib/utils';

type CheckinOption = {
    idcheckin: string;
    deposit: number;
    reservasi: {
        idbooking: string;
        tglcheckin: string;
        totalbayar: number;
        tamu: { nama: string } | null;
        kamar: { id_kamar: string; nama: string; tipe: { id: number; nama_tipe: string } | null; harga: number } | null;
    } | null;
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function CheckoutForm() {
    const { errors } = usePage().props as { errors: Record<string, string> };

    const [values, setValues] = useState({
        idcheckin: '',
        tglcheckout: '',
        potongan: '',
        totalbayar: '',
        keterangan: '',
    });

    const [selectedCheckin, setSelectedCheckin] = useState<CheckinOption | null>(null);
    const [checkinDialogOpen, setCheckinDialogOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectCheckin = (c: CheckinOption) => {
        setSelectedCheckin(c);
        setValues((prev) => ({
            ...prev,
            idcheckin: c.idcheckin,
            totalbayar: '',
            potongan: '',
        }));
    };

    const minTglCheckout = selectedCheckin?.reservasi?.tglcheckin ?? undefined;

    const totalbayarReservasi = selectedCheckin?.reservasi?.totalbayar ?? 0;
    const deposit = selectedCheckin?.deposit ?? 0;
    const potongan = Number(values.potongan) || 0;

    const grandTotal = useMemo(() => {
        return Math.max(totalbayarReservasi - potongan, 0);
    }, [totalbayarReservasi, potongan]);

    const kekurangan = useMemo(() => {
        if (potongan <= 0 || potongan <= deposit) {
            return 0;
        }

        return potongan - deposit;
    }, [potongan, deposit]);

    const totalbayarCheckout = useMemo(() => {
        if (!selectedCheckin) {
            return 0;
        }

        if (values.totalbayar !== '') {
            return Number(values.totalbayar) || 0;
        }

        return kekurangan;
    }, [selectedCheckin, values.totalbayar, kekurangan]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/checkout', {
            ...values,
            totalbayar: totalbayarCheckout.toString(),
        });
    };

    return (
        <>
            <Head title="Check-out Baru" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => router.get('/admin/checkout')}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <CardTitle>Check-out Baru</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
                            <div className="space-y-2">
                                <Label>Check-in</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="ci_idcheckin">ID Check-in</Label>
                                        <Input
                                            id="ci_idcheckin"
                                            readOnly
                                            placeholder="Belum dipilih"
                                            value={selectedCheckin?.idcheckin ?? ''}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ci_tamu">Nama Tamu</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="ci_tamu"
                                                readOnly
                                                placeholder="Belum dipilih"
                                                value={selectedCheckin?.reservasi?.tamu?.nama ?? ''}
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCheckinDialogOpen(true)}
                                            >
                                                Pilih Check-in
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ci_kode_kamar">Kode Kamar</Label>
                                        <Input
                                            id="ci_kode_kamar"
                                            readOnly
                                            placeholder="Belum dipilih"
                                            value={selectedCheckin?.reservasi?.kamar?.id_kamar ?? ''}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ci_tipe_kamar">Tipe Kamar</Label>
                                        <Input
                                            id="ci_tipe_kamar"
                                            readOnly
                                            placeholder="Belum dipilih"
                                            value={selectedCheckin?.reservasi?.kamar?.tipe?.nama_tipe ?? ''}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ci_harga_kamar">Harga Kamar</Label>
                                        <Input
                                            id="ci_harga_kamar"
                                            readOnly
                                            placeholder="Belum dipilih"
                                            value={
                                                selectedCheckin?.reservasi?.kamar
                                                    ? `${formatRupiah(selectedCheckin.reservasi.kamar.harga)}/malam`
                                                    : ''
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ci_checkin">Tanggal Check-in</Label>
                                        <Input
                                            id="ci_checkin"
                                            readOnly
                                            placeholder="Belum dipilih"
                                            value={
                                                selectedCheckin?.reservasi
                                                    ? formatTanggal(selectedCheckin.reservasi.tglcheckin)
                                                    : ''
                                            }
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="ci_total">Total Bayar Reservasi</Label>
                                        <Input
                                            id="ci_total"
                                            readOnly
                                            placeholder="Belum dipilih"
                                            value={
                                                selectedCheckin?.reservasi
                                                    ? formatRupiah(selectedCheckin.reservasi.totalbayar)
                                                    : ''
                                            }
                                        />
                                    </div>
                                </div>
                                {errors.idcheckin && <p className="text-sm text-destructive">{errors.idcheckin}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tglcheckout">Tanggal Check-out</Label>
                                <Input
                                    id="tglcheckout"
                                    name="tglcheckout"
                                    type="date"
                                    min={minTglCheckout}
                                    value={values.tglcheckout}
                                    onChange={handleChange}
                                />
                                {errors.tglcheckout && <p className="text-sm text-destructive">{errors.tglcheckout}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deposit">Deposit</Label>
                                <Input
                                    id="deposit"
                                    readOnly
                                    placeholder="Belum dipilih"
                                    value={selectedCheckin ? formatRupiah(selectedCheckin.deposit) : ''}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="potongan">Potongan</Label>
                                <Input
                                    id="potongan"
                                    name="potongan"
                                    type="number"
                                    value={values.potongan}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                                {errors.potongan && <p className="text-sm text-destructive">{errors.potongan}</p>}
                            </div>

                            {selectedCheckin && kekurangan > 0 && (
                                <div className="rounded-md bg-orange-50 p-3 text-sm text-orange-800">
                                    <div className="flex justify-between">
                                        <span>Potongan melebihi deposit</span>
                                        <Badge variant="outline" className="text-orange-800">Kekurangan</Badge>
                                    </div>
                                    <div className="mt-1 flex justify-between font-semibold">
                                        <span>Tamu harus membayar kekurangan</span>
                                        <span>{formatRupiah(kekurangan)}</span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="totalbayar">Total Bayar Tambahan</Label>
                                <Input
                                    id="totalbayar"
                                    name="totalbayar"
                                    type="number"
                                    value={values.totalbayar !== '' ? values.totalbayar : (selectedCheckin ? kekurangan.toString() : '')}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                                {errors.totalbayar && <p className="text-sm text-destructive">{errors.totalbayar}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="keterangan">Keterangan</Label>
                                <Textarea
                                    id="keterangan"
                                    name="keterangan"
                                    value={values.keterangan}
                                    onChange={handleChange}
                                    placeholder="Keterangan (opsional)"
                                />
                                {errors.keterangan && <p className="text-sm text-destructive">{errors.keterangan}</p>}
                            </div>

                            {selectedCheckin && (
                                <div className="rounded-md bg-primary/10 p-4 text-sm space-y-1">
                                    <div className="flex justify-between">
                                        <span>Total Reservasi</span>
                                        <span>{formatRupiah(totalbayarReservasi)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Potongan</span>
                                        <span className="text-destructive">- {formatRupiah(potongan)}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-1">
                                        <span>Grand Total</span>
                                        <span>{formatRupiah(grandTotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Deposit</span>
                                        <span>{formatRupiah(deposit)}</span>
                                    </div>
                                    {kekurangan > 0 && (
                                        <div className="flex justify-between text-orange-700 font-semibold">
                                            <span>Kekurangan</span>
                                            <span>{formatRupiah(kekurangan)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-t pt-1 text-base font-semibold">
                                        <span>Total Bayar</span>
                                        <span>{formatRupiah(totalbayarCheckout)}</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2 pt-4">
                                <Button type="submit">
                                    <Save className="h-4 w-4" />
                                    Proses Check-out
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.get('/admin/checkout')}>
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <SearchPickerDialog<CheckinOption>
                open={checkinDialogOpen}
                onOpenChange={setCheckinDialogOpen}
                title="Pilih Check-in"
                searchPlaceholder="Cari ID check-in, booking, tamu, atau kamar..."
                fetchUrl="/admin/checkout-search/checkin"
                columns={['ID Check-in', 'Booking', 'Tamu', 'Kamar']}
                getRowKey={(c) => c.idcheckin}
                renderRow={(c) => [c.idcheckin, c.reservasi?.idbooking ?? '-', c.reservasi?.tamu?.nama ?? '-', c.reservasi?.kamar?.nama ?? '-']}
                onSelect={handleSelectCheckin}
                emptyMessage="Tidak ada tamu yang siap check-out."
            />
        </>
    );
}

CheckoutForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Check-out', href: '/admin/checkout' },
        { title: 'Check-out Baru', href: '#' },
    ],
};
