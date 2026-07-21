<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Checkin;
use App\Models\Kamar;
use App\Models\Reservasi;
use App\Services\IdGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckinController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Checkin::with(['reservasi.tamu', 'reservasi.kamar']);

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('idcheckin', 'like', "%{$search}%")
                    ->orWhere('idbooking', 'like', "%{$search}%")
                    ->orWhereHas('reservasi.tamu', fn ($t) => $t->where('nama', 'like', "%{$search}%"));
            });
        }

        $checkin = $query->latest()->paginate($request->get('per_page', 10));

        return Inertia::render('admin/checkin/index', [
            'checkin' => $checkin,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        $reservasi = Reservasi::with(['tamu', 'kamar'])
            ->where('status', 'diterima')
            ->get();

        return Inertia::render('admin/checkin/form', [
            'reservasi' => $reservasi,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'idbooking' => 'required|exists:reservasi,idbooking',
            'sisabayar' => 'required|numeric|min:0',
            'deposit' => 'required|numeric|min:0',
        ]);

        $validated['idcheckin'] = IdGenerator::checkin();

        Checkin::create($validated);

        $reservasi = Reservasi::findOrFail($validated['idbooking']);
        $reservasi->update(['status' => 'checkin']);

        Kamar::where('id_kamar', $reservasi->idkamar)
            ->update(['status_kamar' => 'tidak tersedia']);

        return redirect()->route('checkin.index')
            ->with('toast', ['type' => 'success', 'message' => 'Check-in berhasil.']);
    }

    public function show(Checkin $checkin): Response
    {
        $checkin->load(['reservasi.tamu', 'reservasi.kamar', 'checkout']);

        return Inertia::render('admin/checkin/show', [
            'checkin' => $checkin,
        ]);
    }
}
