<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Checkin;
use App\Models\Checkout;
use App\Models\Kamar;
use App\Models\Pengeluaran;
use App\Models\Reservasi;
use App\Models\Tamu;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    public function index(Request $request): Response
    {
        $type = $request->get('type', 'reservasi');
        $dari = $request->get('dari', now()->startOfMonth()->toDateString());
        $sampai = $request->get('sampai', now()->endOfMonth()->toDateString());

        $data = match ($type) {
            'tamu' => Tamu::whereBetween('created_at', [$dari, $sampai])->latest()->get(),
            'kamar' => Kamar::all(),
            'reservasi' => Reservasi::with(['tamu', 'kamar'])->whereBetween('created_at', [$dari, $sampai])->latest()->get(),
            'checkin' => Checkin::with(['reservasi.tamu', 'reservasi.kamar'])->whereBetween('created_at', [$dari, $sampai])->latest()->get(),
            'checkout' => Checkout::with(['checkin.reservasi.tamu', 'checkin.reservasi.kamar'])->whereBetween('tglcheckout', [$dari, $sampai])->latest()->get(),
            'pendapatan' => Checkout::whereBetween('tglcheckout', [$dari, $sampai])->sum('grandtotal'),
            'pengeluaran' => Pengeluaran::whereBetween('tgl', [$dari, $sampai])->latest('tgl')->get(),
            default => [],
        };

        $totalPendapatan = Checkout::whereBetween('tglcheckout', [$dari, $sampai])->sum('grandtotal');
        $totalPengeluaran = Pengeluaran::whereBetween('tgl', [$dari, $sampai])->sum('total');

        return Inertia::render('admin/laporan/index', [
            'type' => $type,
            'data' => $data,
            'filters' => compact('dari', 'sampai'),
            'summary' => [
                'pendapatan' => $totalPendapatan,
                'pengeluaran' => $totalPengeluaran,
                'bersih' => $totalPendapatan - $totalPengeluaran,
            ],
        ]);
    }
}
