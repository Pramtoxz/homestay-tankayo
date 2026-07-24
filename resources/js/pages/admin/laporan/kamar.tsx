import { Head } from '@inertiajs/react';
import { FileDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type KamarRow = { id_kamar: string; tipe: { id: number; nama_tipe: string } | null; harga: number; status_kamar: string };

type Props = {
    data: KamarRow[];
};

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function LaporanKamar({ data }: Props) {
    const handleExportPdf = () => {
        window.open('/laporan/kamar/export-pdf', '_blank');
    };

    return (
        <>
            <Head title="Laporan Kamar" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap items-end gap-4">
                            <Button variant="outline" onClick={handleExportPdf}>
                                <FileDown className="h-4 w-4" />
                                Export PDF
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            {data.length === 0 ? (
                                <p className="py-8 text-center text-sm text-muted-foreground">Tidak ada data.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 py-3 text-left font-medium">ID Kamar</th>
                                            <th className="px-4 py-3 text-left font-medium">Tipe Kamar</th>
                                            <th className="px-4 py-3 text-right font-medium">Harga</th>
                                            <th className="px-4 py-3 text-left font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((r) => (
                                            <tr key={r.id_kamar} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3 font-mono text-xs">{r.id_kamar}</td>
                                                <td className="px-4 py-3">{r.tipe?.nama_tipe ?? '-'}</td>
                                                <td className="px-4 py-3 text-right">{formatRupiah(r.harga)}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={r.status_kamar === 'tersedia' ? 'default' : 'destructive'}>
                                                        {r.status_kamar}
                                                    </Badge>
                                                </td>
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

LaporanKamar.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Laporan Kamar', href: '/laporan/kamar' },
    ],
};
