import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { SearchPickerDialog } from '@/components/search-picker-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatTanggal } from '@/lib/utils';

type ReservasiOption = {
    idbooking: string;
    tglcheckin: string;
    tglcheckout: string;
    totalbayar: number;
    tamu: { nama: string } | null;
    kamar: { id_kamar: string; nama: string } | null;
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function CheckinForm() {
    const { errors } = usePage().props as { errors: Record<string, string> };

    const [values, setValues] = useState({
        idbooking: '',
        deposit: '',
    });

    const [selectedReservasi, setSelectedReservasi] = useState<ReservasiOption | null>(null);
    const [reservasiDialogOpen, setReservasiDialogOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectReservasi = (r: ReservasiOption) => {
        setSelectedReservasi(r);
        setValues((prev) => ({ ...prev, idbooking: r.idbooking }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/checkin', values);
    };

    return (
        <>
            <Head title="Check-in Baru" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => router.get('/admin/checkin')}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <CardTitle>Check-in Baru</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Reservasi</Label>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="res_idbooking">ID Booking</Label>
                                        <Input
                                            id="res_idbooking"
                                            readOnly
                                            placeholder="Belum dipilih"
                                            value={selectedReservasi?.idbooking ?? ''}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="res_tamu">Nama Tamu</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="res_tamu"
                                                readOnly
                                                placeholder="Belum dipilih"
                                                value={selectedReservasi?.tamu?.nama ?? ''}
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setReservasiDialogOpen(true)}
                                            >
                                                Pilih Reservasi
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="res_kode_kamar">Kode Kamar</Label>
                                        <Input
                                            id="res_kode_kamar"
                                            readOnly
                                            placeholder="Belum dipilih"
                                            value={selectedReservasi?.kamar?.id_kamar ?? ''}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="res_nama_kamar">Nama Kamar</Label>
                                        <Input
                                            id="res_nama_kamar"
                                            readOnly
                                            placeholder="Belum dipilih"
                                            value={selectedReservasi?.kamar?.nama ?? ''}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="res_checkin">Tanggal Check-in</Label>
                                        <Input
                                            id="res_checkin"
                                            readOnly
                                            placeholder="Belum dipilih"
                                            value={selectedReservasi ? formatTanggal(selectedReservasi.tglcheckin) : ''}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="res_checkout">Tanggal Check-out</Label>
                                        <Input
                                            id="res_checkout"
                                            readOnly
                                            placeholder="Belum dipilih"
                                            value={selectedReservasi ? formatTanggal(selectedReservasi.tglcheckout) : ''}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="res_total">Total Bayar Reservasi</Label>
                                        <Input
                                            id="res_total"
                                            readOnly
                                            placeholder="Belum dipilih"
                                            value={selectedReservasi ? formatRupiah(selectedReservasi.totalbayar) : ''}
                                        />
                                    </div>
                                </div>
                                {errors.idbooking && <p className="text-sm text-destructive">{errors.idbooking}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deposit">Deposit</Label>
                                <Input
                                    id="deposit"
                                    name="deposit"
                                    type="number"
                                    value={values.deposit}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                                {errors.deposit && <p className="text-sm text-destructive">{errors.deposit}</p>}
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="submit">
                                    <Save className="h-4 w-4" />
                                    Proses Check-in
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.get('/admin/checkin')}>
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <SearchPickerDialog<ReservasiOption>
                open={reservasiDialogOpen}
                onOpenChange={setReservasiDialogOpen}
                title="Pilih Reservasi"
                searchPlaceholder="Cari ID booking, nama tamu, atau kamar..."
                fetchUrl="/admin/checkin-search/reservasi"
                columns={['ID Booking', 'Tamu', 'Kamar', 'Check-in', 'Check-out']}
                getRowKey={(r) => r.idbooking}
                renderRow={(r) => [
                    r.idbooking,
                    r.tamu?.nama ?? '-',
                    r.kamar?.nama ?? '-',
                    formatTanggal(r.tglcheckin),
                    formatTanggal(r.tglcheckout),
                ]}
                onSelect={handleSelectReservasi}
                emptyMessage="Tidak ada reservasi yang siap check-in."
            />
        </>
    );
}

CheckinForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Check-in', href: '/admin/checkin' },
        { title: 'Check-in Baru', href: '#' },
    ],
};
