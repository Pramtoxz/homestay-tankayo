import { Head } from '@inertiajs/react';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type KetersediaanRow = { nama_tipe: string; total_kamar: number; terisi: number; tersedia: number };

type Props = {
    data: KetersediaanRow[];
};

export default function LaporanKetersediaanKamar({ data }: Props) {
    const handleExportPdf = () => {
        window.open('/laporan/ketersediaan-kamar/export-pdf', '_blank');
    };

    return (
        <>
            <Head title="Laporan Ketersediaan Kamar" />
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
                                            <th className="px-4 py-3 text-left font-medium">No</th>
                                            <th className="px-4 py-3 text-left font-medium">Tipe Kamar</th>
                                            <th className="px-4 py-3 text-center font-medium">Total Kamar</th>
                                            <th className="px-4 py-3 text-center font-medium">Terisi</th>
                                            <th className="px-4 py-3 text-center font-medium">Tersedia</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((r, i) => (
                                            <tr key={r.nama_tipe} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3">{i + 1}</td>
                                                <td className="px-4 py-3">{r.nama_tipe}</td>
                                                <td className="px-4 py-3 text-center">{r.total_kamar}</td>
                                                <td className="px-4 py-3 text-center">{r.terisi}</td>
                                                <td className="px-4 py-3 text-center">{r.tersedia}</td>
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

LaporanKetersediaanKamar.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Laporan Ketersediaan Kamar', href: '/laporan/ketersediaan-kamar' },
    ],
};
