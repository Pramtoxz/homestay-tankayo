export type Room = {
    id_kamar: string;
    nama: string;
    tipe_kamar: string;
    harga: number;
    fasilitas: string | null;
    cover: string | null;
    deskripsi: string | null;
};

export type AuthUser = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'pimpinan';
    [key: string]: unknown;
};

export const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export const tipeKamarWarna: Record<string, string> = {
    'Superior Room Balcony': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    'Deluxe Room Balcony': 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
    'Twinbed Room Balcony': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    'Junior Suite Room Balcony': 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
    'Triple Room Balcony': 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
};

export function dashboardHref(user: AuthUser | null): string {
    if (!user) {
        return '/login';
    }

    return user.role === 'user' ? '/portal' : '/dashboard';
}

export function bookingHref(user: AuthUser | null): string {
    if (user) {
        return user.role === 'user' ? '/portal/booking' : '/login';
    }

    return '/register';
}

export function bookingLabel(user: AuthUser | null): string {
    if (user && user.role === 'user') {
        return 'Booking Sekarang';
    }

    return user ? 'Booking' : 'Mulai Booking';
}
