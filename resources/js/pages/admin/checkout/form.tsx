import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CheckinOption = {
    idcheckin: string;
    sisabayar: number;
    deposit: number;
    reservasi: {
        idbooking: string;
        totalbayar: number;
        tamu: { nama: string } | null;
        kamar: { nama: string } | null;
    } | null;
};

type Props = {
    checkin: CheckinOption[];
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function CheckoutForm({ checkin }: Props) {
    const { errors } = usePage().props as { errors: Record<string, string> };

    const [values, setValues] = useState({
        idcheckin: '',
        potongan: '',
        keterangan: '',
    });

    const selectedCheckin = checkin.find((c) => c.idcheckin === values.idcheckin);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/checkout', values);
    };

    const grandTotal =
        selectedCheckin && values.potongan
            ? Math.max((selectedCheckin.reservasi?.totalbayar ?? 0) - Number(values.potongan), 0)
            : selectedCheckin?.reservasi?.totalbayar ?? 0;

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
                        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                            <div className="space-y-2">
                                <Label>Check-in</Label>
                                <Select
                                    value={values.idcheckin}
                                    onValueChange={(v) => setValues((p) => ({ ...p, idcheckin: v }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih check-in..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {checkin.map((c) => (
                                            <SelectItem key={c.idcheckin} value={c.idcheckin}>
                                                {c.idcheckin} - {c.reservasi?.tamu?.nama ?? '-'} (
                                                {c.reservasi?.kamar?.nama ?? '-'})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.idcheckin && <p className="text-sm text-destructive">{errors.idcheckin}</p>}
                            </div>

                            {selectedCheckin && (
                                <div className="rounded-md bg-muted p-4 text-sm space-y-1">
                                    <p>
                                        <span className="text-muted-foreground">Tamu:</span>{' '}
                                        {selectedCheckin.reservasi?.tamu?.nama ?? '-'}
                                    </p>
                                    <p>
                                        <span className="text-muted-foreground">Kamar:</span>{' '}
                                        {selectedCheckin.reservasi?.kamar?.nama ?? '-'}
                                    </p>
                                    <p>
                                        <span className="text-muted-foreground">Total Bayar:</span>{' '}
                                        {formatRupiah(selectedCheckin.reservasi?.totalbayar ?? 0)}
                                    </p>
                                    <p>
                                        <span className="text-muted-foreground">Deposit:</span>{' '}
                                        {formatRupiah(selectedCheckin.deposit)}
                                    </p>
                                </div>
                            )}

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
                                <Input
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
                                    <div className="flex justify-between font-semibold text-base">
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
