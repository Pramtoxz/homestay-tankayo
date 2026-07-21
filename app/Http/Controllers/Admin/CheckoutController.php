<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Checkin;
use App\Models\Checkout;
use App\Models\Kamar;
use App\Services\IdGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Checkout::with(['checkin.reservasi.tamu', 'checkin.reservasi.kamar']);

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('idcheckout', 'like', "%{$search}%")
                    ->orWhere('idcheckin', 'like', "%{$search}%")
                    ->orWhereHas('checkin.reservasi.tamu', fn ($t) => $t->where('nama', 'like', "%{$search}%"));
            });
        }

        $checkout = $query->latest()->paginate($request->get('per_page', 10));

        return Inertia::render('admin/checkout/index', [
            'checkout' => $checkout,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        $checkin = Checkin::with(['reservasi.tamu', 'reservasi.kamar'])
            ->whereDoesntHave('checkout')
            ->whereHas('reservasi', fn ($q) => $q->where('status', 'checkin'))
            ->get();

        return Inertia::render('admin/checkout/form', [
            'checkin' => $checkin,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'idcheckin' => 'required|exists:checkin,idcheckin',
            'potongan' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);

        $checkin = Checkin::with('reservasi')->findOrFail($validated['idcheckin']);
        $grandtotal = $checkin->reservasi->totalbayar - $validated['potongan'];

        $validated['idcheckout'] = IdGenerator::checkout();
        $validated['tglcheckout'] = now()->toDateString();
        $validated['grandtotal'] = max($grandtotal, 0);

        Checkout::create($validated);

        $checkin->reservasi->update(['status' => 'selesai']);
        Kamar::where('id_kamar', $checkin->reservasi->idkamar)
            ->update(['status_kamar' => 'tersedia']);

        return redirect()->route('checkout.index')
            ->with('toast', ['type' => 'success', 'message' => 'Check-out berhasil.']);
    }

    public function show(Checkout $checkout): Response
    {
        $checkout->load(['checkin.reservasi.tamu', 'checkin.reservasi.kamar']);

        return Inertia::render('admin/checkout/show', [
            'checkout' => $checkout,
        ]);
    }
}
