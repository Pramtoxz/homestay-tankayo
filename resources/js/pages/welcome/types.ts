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
    'Superior Room Balcony': 'bg-teal-100 text-teal-900 dark:bg-teal-900/40 dark:text-teal-200',
    'Deluxe Room Balcony': 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
    'Twinbed Room Balcony': 'bg-stone-100 text-stone-800 dark:bg-stone-800/60 dark:text-stone-200',
    'Junior Suite Room Balcony': 'bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200',
    'Triple Room Balcony': 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200',
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
