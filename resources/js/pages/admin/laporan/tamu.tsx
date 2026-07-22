import { Head } from '@inertiajs/react';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type TamuRow = { nik: string; nama: string; jk: string; nohp: string; alamat: string };

type Props = {
    data: TamuRow[];
};

export default function LaporanTamu({ data }: Props) {
    const handleExportPdf = () => {
        window.open('/laporan/tamu/export-pdf', '_blank');
    };

    return (
        <>
            <Head title="Laporan Tamu" />
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
                                            <th className="px-4 py-3 text-left font-medium">NIK</th>
                                            <th className="px-4 py-3 text-left font-medium">Nama</th>
                                            <th className="px-4 py-3 text-left font-medium">JK</th>
                                            <th className="px-4 py-3 text-left font-medium">No HP</th>
                                            <th className="px-4 py-3 text-left font-medium">Alamat</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((r) => (
                                            <tr key={r.nik} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3 font-mono text-xs">{r.nik}</td>
                                                <td className="px-4 py-3 font-medium">{r.nama}</td>
                                                <td className="px-4 py-3">{r.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                                <td className="px-4 py-3">{r.nohp}</td>
                                                <td className="px-4 py-3">{r.alamat}</td>
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

LaporanTamu.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Laporan Tamu', href: '/laporan/tamu' },
    ],
};
