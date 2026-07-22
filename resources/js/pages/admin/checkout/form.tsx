import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SearchPickerDialog } from '@/components/search-picker-dialog';
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
        kamar: { id_kamar: string; nama: string; tipe_kamar: string; harga: number } | null;
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
        keterangan: '',
    });

    const [selectedCheckin, setSelectedCheckin] = useState<CheckinOption | null>(null);
    const [checkinDialogOpen, setCheckinDialogOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectCheckin = (c: CheckinOption) => {
        setSelectedCheckin(c);
        setValues((prev) => ({ ...prev, idcheckin: c.idcheckin }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/checkout', values);
    };

    const minTglCheckout = selectedCheckin?.reservasi?.tglcheckin ?? undefined;

    const grandTotal = useMemo(() => {
        const totalbayar = selectedCheckin?.reservasi?.totalbayar ?? 0;

        return values.potongan ? Math.max(totalbayar - Number(values.potongan), 0) : totalbayar;
    }, [selectedCheckin, values.potongan]);

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
                                            value={selectedCheckin?.reservasi?.kamar?.tipe_kamar ?? ''}
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
                                <div className="rounded-md bg-primary/10 p-4 text-sm">
                                    <div className="flex justify-between text-base font-semibold">
                                        <span>Grand Total</span>
                                        <span>{formatRupiah(grandTotal)}</span>
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
