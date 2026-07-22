import gonjongImg from '@/assets/images/gonjong.png';
import { GonjongMotif } from '@/components/gonjong-motif';

const items = [
    {
        title: 'Bernuansa Syariah',
        desc: 'Pengelolaan sesuai kaidah syariah — ketenteraman dan kenyamanan untuk seluruh tamu.',
    },
    {
        title: 'Eco-Park',
        desc: 'Taman hijau luas di dataran tinggi Tanah Datar, dengan udara sejuk dan pepohonan rindang.',
    },
    {
        title: 'Tepian Danau Singkarak',
        desc: 'Pemandangan danau dan Bukit Barisan langsung dari halaman, udara pegunungan yang masih alami.',
    },
    {
        title: 'Fasilitas Lengkap',
        desc: 'AC, WiFi, air panas, dan sarapan — semua yang dibutuhkan untuk menginap dengan tenang.',
    },
];

export function Features() {
    return (
        <section className="bg-background">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28">
                <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
                    <div className="lg:col-span-2">
                        <span className="text-xs tracking-[0.2em] text-accent uppercase">
                            Mengapa Tankayo
                        </span>

                        <div className="mt-4 overflow-hidden rounded-lg">
                            <img
                                src={gonjongImg}
                                alt="Atap gonjong rumah gadang, arsitektur khas Minangkabau"
                                className="aspect-4/5 w-full object-cover"
                            />
                        </div>

                        <p className="mt-5 font-display text-xl sm:text-2xl italic text-foreground leading-snug text-balance">
                            Lebih dari sekadar penginapan — ini pengalaman yang sesuai nilai
                            dan dekat dengan alam.
                        </p>
                    </div>

                    <div className="lg:col-span-3">
                        <ul className="divide-y divide-border">
                            {items.map((item) => (
                                <li key={item.title} className="flex gap-5 py-6 first:pt-0">
                                    <GonjongMotif
                                        spires={1}
                                        variant="line"
                                        className="h-8 w-9 shrink-0 text-accent"
                                    />
                                    <div>
                                        <h3 className="text-sm font-semibold text-foreground">
                                            {item.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
