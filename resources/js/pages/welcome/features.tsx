import { Landmark, Leaf, Mountain, Wifi } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const items = [
    {
        icon: Landmark,
        title: 'Bernuansa Syariah',
        desc: 'Pengelolaan sesuai kaidah syariah. Ketenteraman dan kenyamanan untuk seluruh tamu.',
    },
    {
        icon: Leaf,
        title: 'Eco-Park',
        desc: 'Taman hijau luas di dataran tinggi Tanah Datar. Udara sejuk dan pepohonan rindang.',
    },
    {
        icon: Mountain,
        title: 'Tepian Danau Singkarak',
        desc: 'Pemandangan Danau Singkarak dan Bukit Barisan. Udara sejuk pegunungan yang masih alami.',
    },
    {
        icon: Wifi,
        title: 'Fasilitas Lengkap',
        desc: 'AC, WiFi, air panas, sarapan, dan semua yang Anda butuhkan untuk menginap nyaman.',
    },
];

export function Features() {
    return (
        <section className="bg-background">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                        Mengapa Harus Homestay Tankayo?
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
                        Lebih dari sekadar penginapan — ini tentang pengalaman yang sesuai nilai dan dekat dengan alam.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((item) => (
                        <Card
                            key={item.title}
                            className="border-border/60 bg-card/80 hover:shadow-md transition-shadow duration-200"
                        >
                            <CardContent className="pt-6">
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/8">
                                    <item.icon className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="text-sm font-semibold text-foreground mb-1.5">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {item.desc}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
