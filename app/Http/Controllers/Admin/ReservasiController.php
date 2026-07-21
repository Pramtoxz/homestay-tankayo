<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kamar;
use App\Models\Reservasi;
use App\Models\Tamu;
use App\Services\BookingService;
use App\Services\IdGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReservasiController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Reservasi::with(['tamu', 'kamar']);

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('idbooking', 'like', "%{$search}%")
                    ->orWhereHas('tamu', fn ($t) => $t->where('nama', 'like', "%{$search}%"))
                    ->orWhereHas('kamar', fn ($k) => $k->where('nama', 'like', "%{$search}%"));
            });
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $reservasi = $query->latest()->paginate($request->get('per_page', 10));

        return Inertia::render('admin/reservasi/index', [
            'reservasi' => $reservasi,
            'filters' => $request->only(['search', 'status', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/reservasi/form', [
            'tamu' => Tamu::all(['nik', 'nama']),
            'kamar' => Kamar::where('status_kamar', 'tersedia')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $mode = $request->get('mode', 'existing');

        if ($mode === 'walkin') {
            $validated = $request->validate([
                'tamu.nik' => 'required|string|max:30|unique:tamu,nik',
                'tamu.nama' => 'required|string|max:50',
                'tamu.alamat' => 'required|string',
                'tamu.nohp' => 'required|string|max:30',
                'tamu.jk' => 'required|in:L,P',
                'idkamar' => 'required|exists:kamar,id_kamar',
                'tglcheckin' => 'required|date',
                'tglcheckout' => 'required|date|after:tglcheckin',
                'totalbayar' => 'required|numeric|min:0',
                'tipe' => 'required|in:cash,transfer,dp',
            ]);

            Tamu::create($validated['tamu']);
            $nik = $validated['tamu']['nik'];
        } else {
            $validated = $request->validate([
                'nik' => 'required|exists:tamu,nik',
                'idkamar' => 'required|exists:kamar,id_kamar',
                'tglcheckin' => 'required|date',
                'tglcheckout' => 'required|date|after:tglcheckin',
                'totalbayar' => 'required|numeric|min:0',
                'tipe' => 'required|in:cash,transfer,dp',
            ]);

            $nik = $validated['nik'];
        }

        if (! BookingService::checkAvailability($validated['idkamar'], $validated['tglcheckin'], $validated['tglcheckout'])) {
            return back()->withErrors(['idkamar' => 'Kamar tidak tersedia pada tanggal tersebut.']);
        }

        Reservasi::create([
            'idbooking' => IdGenerator::reservasi(),
            'nik' => $nik,
            'idkamar' => $validated['idkamar'],
            'tglcheckin' => $validated['tglcheckin'],
            'tglcheckout' => $validated['tglcheckout'],
            'totalbayar' => $validated['totalbayar'],
            'tipe' => $validated['tipe'],
            'status' => 'diterima',
            'online' => false,
        ]);

        return redirect()->route('admin.reservasi.index')
            ->with('toast', ['type' => 'success', 'message' => 'Reservasi berhasil dibuat.']);
    }

    public function show(Reservasi $reservasi): Response
    {
        $reservasi->load(['tamu', 'kamar', 'checkin.checkout']);

        return Inertia::render('admin/reservasi/show', [
            'reservasi' => $reservasi,
        ]);
    }

    public function edit(Reservasi $reservasi): Response
    {
        return Inertia::render('admin/reservasi/form', [
            'reservasi' => $reservasi,
            'tamu' => Tamu::all(['nik', 'nama']),
            'kamar' => Kamar::where('status_kamar', 'tersedia')
                ->orWhere('id_kamar', $reservasi->idkamar)
                ->get(),
        ]);
    }

    public function update(Request $request, Reservasi $reservasi): RedirectResponse
    {
        $validated = $request->validate([
            'tglcheckin' => 'required|date',
            'tglcheckout' => 'required|date|after:tglcheckin',
            'totalbayar' => 'required|numeric|min:0',
            'tipe' => 'required|in:cash,transfer,dp',
            'status' => 'sometimes|in:diproses,diterima,ditolak,cancel',
        ]);

        if (! BookingService::checkAvailability($reservasi->idkamar, $validated['tglcheckin'], $validated['tglcheckout'], $reservasi->idbooking)) {
            return back()->withErrors(['idkamar' => 'Kamar tidak tersedia pada tanggal tersebut.']);
        }

        $reservasi->update($validated);

        return redirect()->route('reservasi.index')
            ->with('toast', ['type' => 'success', 'message' => 'Reservasi berhasil diupdate.']);
    }

    public function destroy(Reservasi $reservasi): RedirectResponse
    {
        $reservasi->delete();

        return redirect()->route('reservasi.index')
            ->with('toast', ['type' => 'success', 'message' => 'Reservasi berhasil dihapus.']);
    }
}
