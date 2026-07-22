import { BedDouble, Mountain, ShieldCheck, Users } from 'lucide-react';

const stats = [
    { value: '30+', label: 'Kamar Tersedia', icon: BedDouble },
    { value: '5', label: 'Tipe Kamar', icon: Mountain },
    { value: '100%', label: 'Syariah Compliant', icon: ShieldCheck },
    { value: '24/7', label: 'Resepsionis', icon: Users },
];

export function Stats() {
    return (
        <section className="bg-background">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    {stats.map((s) => (
                        <div key={s.label} className="flex flex-col items-center gap-2">
                            <s.icon className="h-5 w-5 text-accent mb-1" />
                            <span className="text-2xl sm:text-3xl font-bold text-primary tabular-nums">
                                {s.value}
                            </span>
                            <span className="text-xs text-muted-foreground">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
