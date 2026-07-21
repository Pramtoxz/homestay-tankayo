<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Checkin;
use App\Models\Checkout;
use App\Models\Kamar;
use App\Models\Pengeluaran;
use App\Models\Reservasi;
use App\Models\Tamu;
use App\Services\BookingService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        BookingService::expireOverdueBookings();

        $today = now()->toDateString();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_tamu' => Tamu::count(),
                'total_kamar' => Kamar::count(),
                'kamar_tersedia' => Kamar::where('status_kamar', 'tersedia')->count(),
                'kamar_terisi' => Kamar::where('status_kamar', 'tidak tersedia')->count(),
                'reservasi_hari_ini' => Reservasi::whereDate('created_at', $today)->count(),
                'checkin_hari_ini' => Checkin::whereDate('created_at', $today)->count(),
                'checkout_hari_ini' => Checkout::whereDate('tglcheckout', $today)->count(),
                'total_pengeluaran' => Pengeluaran::sum('total'),
                'pendapatan_bulan_ini' => Checkout::whereMonth('tglcheckout', now()->month)
                    ->whereYear('tglcheckout', now()->year)
                    ->sum('grandtotal'),
            ],
            'reservasi_hari_ini' => Reservasi::with(['tamu', 'kamar'])
                ->whereDate('created_at', $today)
                ->latest()
                ->limit(5)
                ->get(),
            'checkin_today' => Reservasi::with(['tamu', 'kamar'])
                ->where('status', 'diterima')
                ->where('tglcheckin', '<=', $today)
                ->limit(5)
                ->get(),
            'checkout_today' => Reservasi::with(['tamu', 'kamar'])
                ->where('status', 'checkin')
                ->where('tglcheckout', '<=', $today)
                ->limit(5)
                ->get(),
        ]);
    }
}
