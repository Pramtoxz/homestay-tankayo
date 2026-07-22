import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Upload, Clock, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ReservasiData = {
    idbooking: string;
    tglcheckin: string;
    tglcheckout: string;
    totalbayar: number;
    tipe: string;
    status: string;
    buktibayar: string | null;
    batas_waktu: string | null;
    kamar: { nama: string; harga: number } | null;
};

type Props = {
    reservasi: ReservasiData;
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function PaymentUpload({ reservasi }: Props) {
    const { errors } = usePage().props as { errors: Record<string, string> };
    const fileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!reservasi.batas_waktu || reservasi.status !== 'diproses') {
            return;
        }

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const deadline = new Date(reservasi.batas_waktu!).getTime();
            const diff = deadline - now;

            if (diff <= 0) {
                setTimeLeft('Waktu habis');
                clearInterval(interval);

                return;
            }

            const minutes = Math.floor(diff / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [reservasi.batas_waktu, reservasi.status]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];

        if (!f) {
            return;
        }

        setFile(f);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(f);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            return;
        }

        setSubmitting(true);
        const formData = new FormData();
        formData.append('bukti_bayar', file);
        formData.append('_method', 'POST');

        router.post(`/portal/booking/${reservasi.idbooking}/payment`, formData, {
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <>
            <Head title="Upload Bukti Bayar" />
            <div className="flex h-full flex-1 flex-col items-center gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => router.get(`/portal/booking/${reservasi.idbooking}`)}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <CardTitle>Upload Bukti Bayar</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 space-y-2 rounded-md bg-muted p-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Booking ID</span>
                                <span className="font-mono">{reservasi.idbooking}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Kamar</span>
                                <span>{reservasi.kamar?.nama ?? '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Bayar</span>
                                <span className="font-semibold">{formatRupiah(reservasi.totalbayar)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tipe</span>
                                <Badge variant="outline">{reservasi.tipe}</Badge>
                            </div>
                        </div>

                        {reservasi.batas_waktu && reservasi.status === 'diproses' && (
                            <div className={`mb-4 flex items-center gap-2 rounded-md p-3 text-sm ${
                                timeLeft === 'Waktu habis' ? 'bg-red-50 text-red-800' : 'bg-orange-50 text-orange-800'
                            }`}>
                                {timeLeft === 'Waktu habis' ? (
                                    <AlertTriangle className="h-4 w-4" />
                                ) : (
                                    <Clock className="h-4 w-4" />
                                )}
                                <span className="font-medium">
                                    {timeLeft === 'Waktu habis' ? 'Batas waktu pembayaran habis' : `Sisa waktu: ${timeLeft}`}
                                </span>
                            </div>
                        )}

                        {reservasi.status === 'ditolak' && (
                            <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800">
                                <AlertTriangle className="h-4 w-4" />
                                <span>Pembayaran sebelumnya ditolak. Silakan upload ulang bukti bayar.</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="bukti_bayar">Bukti Pembayaran</Label>
                                <Input
                                    ref={fileRef}
                                    id="bukti_bayar"
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    onChange={handleFileChange}
                                />
                                <p className="text-xs text-muted-foreground">Format: JPG, PNG. Maksimal 2MB.</p>
                                {errors.bukti_bayar && <p className="text-sm text-destructive">{errors.bukti_bayar}</p>}
                            </div>

                            {preview && (
                                <div className="rounded-md border p-2">
                                    <img src={preview} alt="Preview" className="max-h-64 w-full object-contain" />
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1" disabled={!file || submitting}>
                                    {submitting ? 'Mengupload...' : (
                                        <>
                                            <Upload className="h-4 w-4" />
                                            Upload
                                        </>
                                    )}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.get(`/portal/booking/${reservasi.idbooking}`)}>
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

PaymentUpload.layout = {
    breadcrumbs: [
        { title: 'Reservasi', href: '/portal' },
        { title: 'Detail', href: '#' },
        { title: 'Upload Bukti Bayar', href: '#' },
    ],
};
