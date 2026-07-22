import { MapPin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <img
                            src="/assets/images/tankayo.png"
                            alt="Tankayo"
                            className="h-6 w-6 rounded object-cover"
                        />
                        <span>&copy; {new Date().getFullYear()} Eco Park Syariah Tankayo</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>Jl. Padang Laweh Malalo, Danau, Tanah Datar, Sumatera Barat</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
