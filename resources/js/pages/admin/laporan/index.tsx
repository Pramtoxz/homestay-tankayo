import { Head, router } from '@inertiajs/react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ReportType = 'tamu' | 'kamar' | 'reservasi' | 'checkin' | 'checkout' | 'pendapatan' | 'pengeluaran';

type Props = {
    type: ReportType;
    data: unknown;
    filters: {
        dari: string;
        sampai: string;
    };
    summary: {
        pendapatan: number;
        pengeluaran: number;
        bersih: number;
    };
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const reportTabs: { value: ReportType; label: string }[] = [
    { value: 'reservasi', label: 'Reservasi' },
    { value: 'tamu', label: 'Tamu' },
    { value: 'kamar', label: 'Kamar' },
    { value: 'checkin', label: 'Check-in' },
    { value: 'checkout', label: 'Check-out' },
    { value: 'pendapatan', label: 'Pendapatan' },
    { value: 'pengeluaran', label: 'Pengeluaran' },
];

export default function LaporanIndex({ type, data, filters, summary }: Props) {
    const [dari, setDari] = useState(filters.dari);
    const [sampai, setSampai] = useState(filters.sampai);
    const [selectedType, setSelectedType] = useState<ReportType>(type);

    const handleFilter = () => {
        router.get('/laporan', { type: selectedType, dari, sampai }, { preserveState: true });
    };

    const handleTypeChange = (t: ReportType) => {
        setSelectedType(t);
        router.get('/laporan', { type: t, dari, sampai }, { preserveState: true });
    };

    const renderTable = () => {
        if (!data) {
return <p className="text-sm text-muted-foreground">Tidak ada data.</p>;
}

        switch (type) {
            case 'tamu': {
                const rows = data as { nik: string; nama: string; alamat: string; nohp: string; jk: string; created_at: string }[];

                if (!rows.length) {
return <EmptyRow colSpan={5} />;
}

                return (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-3 text-left font-medium">NIK</th>
                                <th className="px-4 py-3 text-left font-medium">Nama</th>
                                <th className="px-4 py-3 text-left font-medium">Alamat</th>
                                <th className="px-4 py-3 text-left font-medium">No HP</th>
                                <th className="px-4 py-3 text-left font-medium">JK</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.nik} className="border-b hover:bg-muted/50">
                                    <td className="px-4 py-3 font-mono text-xs">{r.nik}</td>
                                    <td className="px-4 py-3 font-medium">{r.nama}</td>
                                    <td className="px-4 py-3">{r.alamat}</td>
                                    <td className="px-4 py-3">{r.nohp}</td>
                                    <td className="px-4 py-3">{r.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            }
            case 'kamar': {
                const rows = data as { id_kamar: string; nama: string; harga: number; dp: number; status_kamar: string }[];

                if (!rows.length) {
return <EmptyRow colSpan={5} />;
}

                return (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-3 text-left font-medium">ID</th>
                                <th className="px-4 py-3 text-left font-medium">Nama</th>
                                <th className="px-4 py-3 text-right font-medium">Harga</th>
                                <th className="px-4 py-3 text-right font-medium">DP</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.id_kamar} className="border-b hover:bg-muted/50">
                                    <td className="px-4 py-3 font-mono text-xs">{r.id_kamar}</td>
                                    <td className="px-4 py-3 font-medium">{r.nama}</td>
                                    <td className="px-4 py-3 text-right">{formatRupiah(r.harga)}</td>
                                    <td className="px-4 py-3 text-right">{formatRupiah(r.dp)}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={r.status_kamar === 'tersedia' ? 'default' : 'destructive'}>
                                            {r.status_kamar}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            }
            case 'reservasi': {
                const rows = data as {
                    idbooking: string;
                    tamu: { nama: string } | null;
                    kamar: { nama: string } | null;
                    tglcheckin: string;
                    tglcheckout: string;
                    totalbayar: number;
                    status: string;
                }[];

                if (!rows.length) {
return <EmptyRow colSpan={7} />;
}

                return (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-3 text-left font-medium">ID Booking</th>
                                <th className="px-4 py-3 text-left font-medium">Tamu</th>
                                <th className="px-4 py-3 text-left font-medium">Kamar</th>
                                <th className="px-4 py-3 text-left font-medium">Check-in</th>
                                <th className="px-4 py-3 text-left font-medium">Check-out</th>
                                <th className="px-4 py-3 text-right font-medium">Total</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.idbooking} className="border-b hover:bg-muted/50">
                                    <td className="px-4 py-3 font-mono text-xs">{r.idbooking}</td>
                                    <td className="px-4 py-3">{r.tamu?.nama ?? '-'}</td>
                                    <td className="px-4 py-3">{r.kamar?.nama ?? '-'}</td>
                                    <td className="px-4 py-3">{r.tglcheckin}</td>
                                    <td className="px-4 py-3">{r.tglcheckout}</td>
                                    <td className="px-4 py-3 text-right">{formatRupiah(r.totalbayar)}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant="outline">{r.status}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            }
            case 'checkin': {
                const rows = data as {
                    idcheckin: string;
                    idbooking: string;
                    sisabayar: number;
                    deposit: number;
                    reservasi: { tamu: { nama: string } | null; kamar: { nama: string } | null } | null;
                }[];

                if (!rows.length) {
return <EmptyRow colSpan={6} />;
}

                return (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-3 text-left font-medium">ID Check-in</th>
                                <th className="px-4 py-3 text-left font-medium">Booking</th>
                                <th className="px-4 py-3 text-left font-medium">Tamu</th>
                                <th className="px-4 py-3 text-left font-medium">Kamar</th>
                                <th className="px-4 py-3 text-right font-medium">Sisa Bayar</th>
                                <th className="px-4 py-3 text-right font-medium">Deposit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.idcheckin} className="border-b hover:bg-muted/50">
                                    <td className="px-4 py-3 font-mono text-xs">{r.idcheckin}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{r.idbooking}</td>
                                    <td className="px-4 py-3">{r.reservasi?.tamu?.nama ?? '-'}</td>
                                    <td className="px-4 py-3">{r.reservasi?.kamar?.nama ?? '-'}</td>
                                    <td className="px-4 py-3 text-right">{formatRupiah(r.sisabayar)}</td>
                                    <td className="px-4 py-3 text-right">{formatRupiah(r.deposit)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            }
            case 'checkout': {
                const rows = data as {
                    idcheckout: string;
                    idcheckin: string;
                    tglcheckout: string;
                    potongan: number;
                    grandtotal: number;
                    checkin: { reservasi: { tamu: { nama: string } | null } | null } | null;
                }[];

                if (!rows.length) {
return <EmptyRow colSpan={6} />;
}

                return (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-3 text-left font-medium">ID Checkout</th>
                                <th className="px-4 py-3 text-left font-medium">Check-in</th>
                                <th className="px-4 py-3 text-left font-medium">Tamu</th>
                                <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                                <th className="px-4 py-3 text-right font-medium">Potongan</th>
                                <th className="px-4 py-3 text-right font-medium">Grand Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.idcheckout} className="border-b hover:bg-muted/50">
                                    <td className="px-4 py-3 font-mono text-xs">{r.idcheckout}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{r.idcheckin}</td>
                                    <td className="px-4 py-3">{r.checkin?.reservasi?.tamu?.nama ?? '-'}</td>
                                    <td className="px-4 py-3">{r.tglcheckout}</td>
                                    <td className="px-4 py-3 text-right">{formatRupiah(r.potongan)}</td>
                                    <td className="px-4 py-3 text-right font-medium">{formatRupiah(r.grandtotal)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            }
            case 'pengeluaran': {
                const rows = data as { id: number; tgl: string; keterangan: string; total: number }[];

                if (!rows.length) {
return <EmptyRow colSpan={3} />;
}

                return (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                                <th className="px-4 py-3 text-left font-medium">Keterangan</th>
                                <th className="px-4 py-3 text-right font-medium">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.id} className="border-b hover:bg-muted/50">
                                    <td className="px-4 py-3">{r.tgl}</td>
                                    <td className="px-4 py-3">{r.keterangan}</td>
                                    <td className="px-4 py-3 text-right font-medium">{formatRupiah(r.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            }
            case 'pendapatan':
                return (
                    <div className="py-8 text-center">
                        <p className="text-3xl font-bold">{formatRupiah(data as number)}</p>
                        <p className="text-muted-foreground">Total Pendapatan</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Head title="Laporan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap gap-2">
                    {reportTabs.map((tab) => (
                        <Button
                            key={tab.value}
                            variant={selectedType === tab.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleTypeChange(tab.value)}
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pendapatan</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatRupiah(summary.pendapatan)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pengeluaran</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {formatRupiah(summary.pengeluaran)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Bersih</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatRupiah(summary.bersih)}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dari">Dari</Label>
                                <Input
                                    id="dari"
                                    type="date"
                                    value={dari}
                                    onChange={(e) => setDari(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sampai">Sampai</Label>
                                <Input
                                    id="sampai"
                                    type="date"
                                    value={sampai}
                                    onChange={(e) => setSampai(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleFilter}>
                                <Search className="h-4 w-4" />
                                Filter
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">{renderTable()}</div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function EmptyRow({ colSpan }: { colSpan: number }) {
    return (
        <table className="w-full text-sm">
            <tbody>
                <tr>
                    <td colSpan={colSpan} className="px-4 py-8 text-center text-muted-foreground">
                        Tidak ada data untuk periode ini.
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

LaporanIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Laporan', href: '/laporan' },
    ],
};
