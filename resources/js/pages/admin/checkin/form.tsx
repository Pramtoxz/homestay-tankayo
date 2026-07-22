import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatTanggal } from '@/lib/utils';

type ReservasiOption = {
    idbooking: string;
    tamu: { nama: string } | null;
    kamar: { nama: string; harga: number } | null;
    tglcheckin: string;
    tglcheckout: string;
    totalbayar: number;
};

type Props = {
    reservasi: ReservasiOption[];
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function CheckinForm({ reservasi }: Props) {
    const { errors } = usePage().props as { errors: Record<string, string> };

    const [values, setValues] = useState({
        idbooking: '',
        sisabayar: '',
        deposit: '',
    });

    const selectedReservasi = reservasi.find((r) => r.idbooking === values.idbooking);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
                        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                            <div className="space-y-2">
                                <Label>Reservasi</Label>
                                <Select
                                    value={values.idbooking}
                                    onValueChange={(v) => setValues((p) => ({ ...p, idbooking: v }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih reservasi..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {reservasi.map((r) => (
                                            <SelectItem key={r.idbooking} value={r.idbooking}>
                                                {r.idbooking} - {r.tamu?.nama ?? '-'} ({r.kamar?.nama ?? '-'})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.idbooking && <p className="text-sm text-destructive">{errors.idbooking}</p>}
                            </div>

                            {selectedReservasi && (
                                <div className="rounded-md bg-muted p-4 text-sm space-y-1">
                                    <p><span className="text-muted-foreground">Tamu:</span> {selectedReservasi.tamu?.nama ?? '-'}</p>
                                    <p><span className="text-muted-foreground">Kamar:</span> {selectedReservasi.kamar?.nama ?? '-'}</p>
                                    <p><span className="text-muted-foreground">Check-in:</span> {formatTanggal(selectedReservasi.tglcheckin)}</p>
                                    <p><span className="text-muted-foreground">Check-out:</span> {formatTanggal(selectedReservasi.tglcheckout)}</p>
                                    <p><span className="text-muted-foreground">Total:</span> {formatRupiah(selectedReservasi.totalbayar)}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="sisabayar">Sisa Bayar</Label>
                                <Input
                                    id="sisabayar"
                                    name="sisabayar"
                                    type="number"
                                    value={values.sisabayar}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                                {errors.sisabayar && <p className="text-sm text-destructive">{errors.sisabayar}</p>}
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
