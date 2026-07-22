const stats = [
    { value: '30+', label: 'Kamar tersedia' },
    { value: '5', label: 'Tipe kamar' },
    { value: '100%', label: 'Syariah compliant' },
    { value: '24/7', label: 'Resepsionis' },
];

export function Stats() {
    return (
        <section className="bg-secondary/50">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
                <div className="grid grid-cols-2 divide-y divide-x-0 sm:divide-y-0 sm:divide-x lg:grid-cols-4 divide-border text-center">
                    {stats.map((s) => (
                        <div key={s.label} className="flex flex-col items-center gap-1 px-4 py-4 sm:py-0">
                            <span className="font-display text-3xl sm:text-4xl font-medium text-primary tabular-nums">
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
