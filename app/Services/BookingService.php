<?php

namespace App\Services;

use App\Models\Kamar;
use App\Models\Reservasi;
use App\Models\Tipe;
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

    /**
     * @return array<int, array{tipe_id: int, nama_tipe: string, foto: string|null, total: int<0, max>, tersedia: int<0, max>, harga_mulai: float|null}>
     */
    public static function tipeSummary(string $tglcheckin, string $tglcheckout): array
    {
        $tipes = Tipe::where('aktif', true)->orderBy('nama_tipe')->get();

        /**
         * @return array{tipe_id: int, nama_tipe: string, foto: string|null, total: int<0, max>, tersedia: int<0, max>, harga_mulai: float|null}
         */
        $mapper = function (Tipe $tipe) use ($tglcheckin, $tglcheckout): array {
            $query = Kamar::where('tipe_id', $tipe->id)->where('status_kamar', 'tersedia');

            $total = (clone $query)->count();

            $tersedia = (clone $query)->whereDoesntHave('reservasi', function ($r) use ($tglcheckin, $tglcheckout) {
                $r->whereNotIn('status', ['ditolak', 'cancel', 'selesai', 'limit'])
                    ->where('tglcheckin', '<', $tglcheckout)
                    ->where('tglcheckout', '>', $tglcheckin);
            })->count();

            $hargaMulai = (clone $query)->orderBy('harga')->value('harga');

            return [
                'tipe_id' => $tipe->id,
                'nama_tipe' => $tipe->nama_tipe,
                'foto' => $tipe->foto,
                'total' => $total,
                'tersedia' => $tersedia,
                'harga_mulai' => $hargaMulai !== null ? (float) $hargaMulai : null,
            ];
        };

        return $tipes->map($mapper)->values()->all();
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
}
