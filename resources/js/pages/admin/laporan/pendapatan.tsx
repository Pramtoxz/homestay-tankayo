import { Head, router } from '@inertiajs/react';
import { Search, FileDown, Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FilterMode = 'tanggal' | 'bulan' | 'tahun';

type PendapatanRow = {
    label: string;
    reservasi: number;
    checkout: number;
    jumlah: number;
};

type Props = {
    mode: FilterMode;
    data: PendapatanRow[];
    loaded: boolean;
    filters: {
        dari: string;
        sampai: string;
        dari_bulan: string;
        sampai_bulan: string;
        tahun: string;
    };
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function LaporanPendapatan({ mode, data, loaded, filters }: Props) {
    const [filterMode, setFilterMode] = useState<FilterMode>(mode);
    const [dari, setDari] = useState(filters.dari);
    const [sampai, setSampai] = useState(filters.sampai);
    const [dariBulan, setDariBulan] = useState(filters.dari_bulan);
    const [sampaiBulan, setSampaiBulan] = useState(filters.sampai_bulan);
    const [tahun, setTahun] = useState(filters.tahun);

    const handleFilter = () => {
        const params: Record<string, string> = { mode: filterMode };

        if (filterMode === 'tahun') {
            params.tahun = tahun;
        } else if (filterMode === 'bulan') {
            params.dari_bulan = dariBulan;
            params.sampai_bulan = sampaiBulan;
        } else {
            params.dari = dari;
            params.sampai = sampai;
        }

        router.get('/laporan/pendapatan', params, { preserveState: true });
    };

    const handleExportPdf = () => {
        const params = new URLSearchParams({ mode: filterMode });

        if (filterMode === 'tahun') {
            params.set('tahun', tahun);
        } else if (filterMode === 'bulan') {
            params.set('dari_bulan', dariBulan);
            params.set('sampai_bulan', sampaiBulan);
        } else {
            params.set('dari', dari);
            params.set('sampai', sampai);
        }

        window.open(`/laporan/pendapatan/export-pdf?${params.toString()}`, '_blank');
    };

    const total = data.reduce((sum, row) => sum + row.jumlah, 0);
    const totalReservasi = data.reduce((sum, row) => sum + row.reservasi, 0);
    const totalCheckout = data.reduce((sum, row) => sum + row.checkout, 0);

    const columnLabel = filterMode === 'tahun' ? 'Bulan' : 'Tanggal';

    return (
        <>
            <Head title="Laporan Pendapatan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="flex gap-1 rounded-md border p-1">
                                <Button
                                    variant={filterMode === 'tanggal' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setFilterMode('tanggal')}
                                >
                                    <Calendar className="mr-1 h-3.5 w-3.5" />
                                    Per Tanggal
                                </Button>
                                <Button
                                    variant={filterMode === 'bulan' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setFilterMode('bulan')}
                                >
                                    <CalendarDays className="mr-1 h-3.5 w-3.5" />
                                    Per Bulan
                                </Button>
                                <Button
                                    variant={filterMode === 'tahun' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setFilterMode('tahun')}
                                >
                                    <CalendarRange className="mr-1 h-3.5 w-3.5" />
                                    Per Tahun
                                </Button>
                            </div>

                            {filterMode === 'tanggal' && (
                                <>
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
                                </>
                            )}

                            {filterMode === 'bulan' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="dari_bulan">Dari Bulan</Label>
                                        <Input
                                            id="dari_bulan"
                                            type="month"
                                            value={dariBulan}
                                            onChange={(e) => setDariBulan(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sampai_bulan">Sampai Bulan</Label>
                                        <Input
                                            id="sampai_bulan"
                                            type="month"
                                            value={sampaiBulan}
                                            onChange={(e) => setSampaiBulan(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}

                            {filterMode === 'tahun' && (
                                <div className="space-y-2">
                                    <Label htmlFor="tahun">Tahun</Label>
                                    <Input
                                        id="tahun"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="Contoh: 2026"
                                        value={tahun}
                                        onChange={(e) => setTahun(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                                        className="w-32"
                                    />
                                </div>
                            )}

                            <Button onClick={handleFilter}>
                                <Search className="h-4 w-4" />
                                Tampilkan
                            </Button>

                            {loaded && data.length > 0 && (
                                <Button variant="outline" onClick={handleExportPdf}>
                                    <FileDown className="h-4 w-4" />
                                    Export PDF
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            {!loaded || data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <CalendarDays className="mb-3 h-10 w-10 text-muted-foreground/50" />
                                    <p className="text-sm text-muted-foreground">
                                        Silakan pilih filter terlebih dahulu, lalu klik Tampilkan.
                                    </p>
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 py-3 text-left font-medium">{columnLabel}</th>
                                            <th className="px-4 py-3 text-center font-medium">Total Reservasi</th>
                                            <th className="px-4 py-3 text-center font-medium">Total Checkout</th>
                                            <th className="px-4 py-3 text-right font-medium">Jumlah</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((r, i) => (
                                            <tr key={i} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3">{r.label}</td>
                                                <td className="px-4 py-3 text-center">{r.reservasi}</td>
                                                <td className="px-4 py-3 text-center">{r.checkout}</td>
                                                <td className="px-4 py-3 text-right">{formatRupiah(r.jumlah)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 font-semibold">
                                            <td className="px-4 py-3">Total</td>
                                            <td className="px-4 py-3 text-center">{totalReservasi}</td>
                                            <td className="px-4 py-3 text-center">{totalCheckout}</td>
                                            <td className="px-4 py-3 text-right">{formatRupiah(total)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

LaporanPendapatan.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Laporan Pendapatan', href: '/laporan/pendapatan' },
    ],
};
