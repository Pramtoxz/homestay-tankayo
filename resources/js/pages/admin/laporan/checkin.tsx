import { Head, router } from '@inertiajs/react';
import { Search, FileDown, Calendar, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatTanggal } from '@/lib/utils';

type FilterMode = 'tanggal' | 'bulan';

type CheckinRow = {
    idcheckin: string;
    idbooking: string;
    nama_tamu: string;
    kode_kamar: string;
    tglcheckin: string;
    total_bayar: number;
    deposit: number;
};

type Props = {
    mode: FilterMode;
    data: CheckinRow[];
    loaded: boolean;
    filters: {
        dari: string;
        sampai: string;
        dari_bulan: string;
        sampai_bulan: string;
    };
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function LaporanCheckin({ mode, data, loaded, filters }: Props) {
    const [filterMode, setFilterMode] = useState<FilterMode>(mode);
    const [dari, setDari] = useState(filters.dari);
    const [sampai, setSampai] = useState(filters.sampai);
    const [dariBulan, setDariBulan] = useState(filters.dari_bulan);
    const [sampaiBulan, setSampaiBulan] = useState(filters.sampai_bulan);

    const handleFilter = () => {
        const params: Record<string, string> = { mode: filterMode };

        if (filterMode === 'bulan') {
            params.dari_bulan = dariBulan;
            params.sampai_bulan = sampaiBulan;
        } else {
            params.dari = dari;
            params.sampai = sampai;
        }

        router.get('/laporan/checkin', params, { preserveState: true });
    };

    const handleExportPdf = () => {
        const params = new URLSearchParams({ mode: filterMode });

        if (filterMode === 'bulan') {
            params.set('dari_bulan', dariBulan);
            params.set('sampai_bulan', sampaiBulan);
        } else {
            params.set('dari', dari);
            params.set('sampai', sampai);
        }

        window.open(`/laporan/checkin/export-pdf?${params.toString()}`, '_blank');
    };

    return (
        <>
            <Head title="Laporan Check-in" />
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
                                            <th className="px-4 py-3 text-left font-medium">ID Check-in</th>
                                            <th className="px-4 py-3 text-left font-medium">ID Booking</th>
                                            <th className="px-4 py-3 text-left font-medium">Tamu</th>
                                            <th className="px-4 py-3 text-left font-medium">Kode Kamar</th>
                                            <th className="px-4 py-3 text-left font-medium">Tgl Check-in</th>
                                            <th className="px-4 py-3 text-right font-medium">Total Bayar</th>
                                            <th className="px-4 py-3 text-right font-medium">Deposit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((r) => (
                                            <tr key={r.idcheckin} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3 font-mono text-xs">{r.idcheckin}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{r.idbooking}</td>
                                                <td className="px-4 py-3">{r.nama_tamu}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{r.kode_kamar}</td>
                                                <td className="px-4 py-3">{formatTanggal(r.tglcheckin)}</td>
                                                <td className="px-4 py-3 text-right">{formatRupiah(r.total_bayar)}</td>
                                                <td className="px-4 py-3 text-right">{formatRupiah(r.deposit)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

LaporanCheckin.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Laporan Check-in', href: '/laporan/checkin' },
    ],
};
