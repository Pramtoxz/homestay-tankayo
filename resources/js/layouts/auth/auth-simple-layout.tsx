import { Link } from '@inertiajs/react';
import tankayoLogo from '@/assets/images/tankayo.png';
import { GonjongMotif } from '@/components/gonjong-motif';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="theme-tamu flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 text-foreground md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={home()} className="flex flex-col items-center gap-3">
                            <img
                                src={tankayoLogo}
                                alt="Tankayo"
                                className="h-14 w-14 rounded-full object-cover ring-1 ring-border"
                            />
                            <span className="font-display text-lg font-medium">
                                Homestay Tankayo
                            </span>
                        </Link>

                        <GonjongMotif spires={3} variant="line" className="h-6 w-16 text-accent" />

                        <div className="space-y-1.5 text-center">
                            <h1 className="font-display text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
