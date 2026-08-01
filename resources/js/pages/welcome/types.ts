export type Room = {
    id_kamar: string;
    nama: string;
    tipe_id: number;
    harga: number;
    fasilitas: string | null;
};

export type TipeWithRooms = {
    id: number;
    nama_tipe: string;
    foto: string | null;
    kamar: Room[];
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
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(n);

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
