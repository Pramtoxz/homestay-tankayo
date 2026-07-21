<?php

namespace App\Services;

use App\Models\Checkin;
use App\Models\Checkout;
use App\Models\Kamar;
use App\Models\Pengeluaran;
use App\Models\Reservasi;
use Illuminate\Support\Carbon;

class IdGenerator
{
    public static function reservasi(): string
    {
        $prefix = 'RS-'.Carbon::now()->format('Ymd').'-';
        $last = Reservasi::where('idbooking', 'like', $prefix.'%')
            ->orderBy('idbooking', 'desc')
            ->value('idbooking');

        $seq = $last ? (int) substr($last, -4) + 1 : 1;

        return $prefix.str_pad($seq, 4, '0', STR_PAD_LEFT);
    }

    public static function checkin(): string
    {
        $prefix = 'CK-'.Carbon::now()->format('Ymd').'-';
        $last = Checkin::where('idcheckin', 'like', $prefix.'%')
            ->orderBy('idcheckin', 'desc')
            ->value('idcheckin');

        $seq = $last ? (int) substr($last, -4) + 1 : 1;

        return $prefix.str_pad($seq, 4, '0', STR_PAD_LEFT);
    }

    public static function checkout(): string
    {
        $prefix = 'CO-'.Carbon::now()->format('Ymd').'-';
        $last = Checkout::where('idcheckout', 'like', $prefix.'%')
            ->orderBy('idcheckout', 'desc')
            ->value('idcheckout');

        $seq = $last ? (int) substr($last, -4) + 1 : 1;

        return $prefix.str_pad($seq, 4, '0', STR_PAD_LEFT);
    }

    public static function kamar(): string
    {
        $last = Kamar::where('id_kamar', 'like', 'KM%')
            ->orderBy('id_kamar', 'desc')
            ->value('id_kamar');

        $seq = $last ? (int) substr($last, 2) + 1 : 1;

        return 'KM'.str_pad($seq, 4, '0', STR_PAD_LEFT);
    }

    public static function pengeluaran(): string
    {
        $last = Pengeluaran::orderBy('id', 'desc')->value('id');

        $seq = $last ? $last + 1 : 1;

        return 'PG'.str_pad($seq, 4, '0', STR_PAD_LEFT);
    }
}
