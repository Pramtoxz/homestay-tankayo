type Props = {
    spires?: number;
    variant?: 'fill' | 'line';
    className?: string;
};

const UNIT = 100;
const HEIGHT = 90;
const BASE = 80;
const PEAK = 8;
const SHOULDER = 15;

/**
 * Siluet garis atap gonjong (rumah gadang) — signature motif halaman tamu.
 * Digenerate dari path bezier berulang, bukan aset gambar.
 */
export function GonjongMotif({ spires = 5, variant = 'line', className }: Props) {
    const width = spires * UNIT;

    let d = `M 0,${BASE}`;

    for (let i = 0; i < spires; i++) {
        const x0 = i * UNIT;
        const xMid = x0 + UNIT / 2;
        const x1 = x0 + UNIT;

        d += ` Q ${x0 + UNIT * 0.25},${SHOULDER} ${xMid},${PEAK}`;
        d += ` Q ${x0 + UNIT * 0.75},${SHOULDER} ${x1},${BASE}`;
    }

    if (variant === 'fill') {
        d += ` L ${width},${HEIGHT} L 0,${HEIGHT} Z`;
    }

    return (
        <svg
            viewBox={`0 0 ${width} ${HEIGHT}`}
            preserveAspectRatio="none"
            className={className}
            aria-hidden="true"
        >
            <path
                d={d}
                fill={variant === 'fill' ? 'currentColor' : 'none'}
                stroke={variant === 'line' ? 'currentColor' : 'none'}
                strokeWidth={variant === 'line' ? 3 : 0}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
