<?php

namespace App\Services;

use App\Models\Reservasi;
use Illuminate\Support\Carbon;

class BookingService
{
    public static function checkAvailability(string $idkamar, string $tglcheckin, string $tglcheckout, ?string $excludeBooking = null): bool
    {
        $query = Reservasi::where('idkamar', $idkamar)
            ->whereNotIn('status', ['ditolak', 'cancel', 'selesai', 'limit'])
            ->where('tglcheckin', '<', $tglcheckout)
            ->where('tglcheckout', '>', $tglcheckin);

        if ($excludeBooking) {
            $query->where('idbooking', '!=', $excludeBooking);
        }

        return ! $query->exists();
    }

    public static function expireOverdueBookings(): int
    {
        return Reservasi::where('online', true)
            ->where('status', 'diproses')
            ->whereNotNull('batas_waktu')
            ->where('batas_waktu', '<', Carbon::now())
            ->update([
                'status' => 'limit',
            ]);
    }

    public static function hitungTotal(float $harga, string $tglcheckin, string $tglcheckout): float
    {
        $start = Carbon::parse($tglcheckin);
        $end = Carbon::parse($tglcheckout);
        $days = $start->diffInDays($end);

        return max($days, 1) * $harga;
    }
}
