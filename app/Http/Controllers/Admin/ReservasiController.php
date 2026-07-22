<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kamar;
use App\Models\Reservasi;
use App\Models\Tamu;
use App\Services\BookingService;
use App\Services\IdGenerator;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

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

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['idbooking', 'tglcheckin', 'tglcheckout', 'totalbayar', 'status', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $reservasi = $query->paginate($request->get('per_page', 25));

        return Inertia::render('admin/reservasi/index', [
            'reservasi' => $reservasi,
            'filters' => $request->only(['search', 'status', 'per_page', 'sort_by', 'sort_order']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/reservasi/form');
    }

    public function searchTamu(Request $request): JsonResponse
    {
        $query = Tamu::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nik', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%")
                    ->orWhere('nohp', 'like', "%{$search}%");
            });
        }

        return response()->json(
            $query->orderBy('nama')->paginate($request->get('per_page', 10))
        );
    }

    public function searchKamar(Request $request): JsonResponse
    {
        $query = Kamar::where('status_kamar', 'tersedia');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('id_kamar', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%");
            });
        }

        if (($checkin = $request->get('tglcheckin')) && ($checkout = $request->get('tglcheckout'))) {
            $query->whereDoesntHave('reservasi', function ($r) use ($checkin, $checkout) {
                $r->whereNotIn('status', ['ditolak', 'cancel', 'selesai', 'limit'])
                    ->where('tglcheckin', '<', $checkout)
                    ->where('tglcheckout', '>', $checkin);
            });
        }

        if ($tipeKamar = $request->get('tipe_kamar')) {
            $query->where('tipe_kamar', $tipeKamar);
        }

        return response()->json(
            $query->orderBy('nama')->paginate($request->get('per_page', 10))
        );
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nik' => 'required|exists:tamu,nik',
            'idkamar' => 'required|exists:kamar,id_kamar',
            'tglcheckin' => 'required|date|after_or_equal:today',
            'tglcheckout' => 'required|date|after:tglcheckin',
            'totalbayar' => 'required|numeric|min:0',
            'tipe' => 'required|in:cash,transfer',
        ]);

        if (! BookingService::checkAvailability($validated['idkamar'], $validated['tglcheckin'], $validated['tglcheckout'])) {
            return back()->withErrors(['idkamar' => 'Kamar tidak tersedia pada tanggal tersebut.']);
        }

        $idbooking = IdGenerator::reservasi();

        Reservasi::create([
            'idbooking' => $idbooking,
            'nik' => $validated['nik'],
            'idkamar' => $validated['idkamar'],
            'tglcheckin' => $validated['tglcheckin'],
            'tglcheckout' => $validated['tglcheckout'],
            'totalbayar' => $validated['totalbayar'],
            'tipe' => $validated['tipe'],
            'status' => 'diterima',
            'online' => false,
        ]);

        return redirect()->route('admin.reservasi.index')
            ->with('toast', ['type' => 'success', 'message' => 'Reservasi berhasil dibuat.'])
            ->with('faktur_url', route('admin.reservasi.faktur', $idbooking));
    }

    public function show(Reservasi $reservasi): Response
    {
        $reservasi->load(['tamu', 'kamar', 'checkin.checkout']);

        return Inertia::render('admin/reservasi/show', [
            'reservasi' => $reservasi,
        ]);
    }

    public function faktur(Reservasi $reservasi): HttpResponse
    {
        $reservasi->load(['tamu', 'kamar']);

        Carbon::setLocale('id');

        $tglCheckin = Carbon::parse($reservasi->tglcheckin);
        $tglCheckout = Carbon::parse($reservasi->tglcheckout);
        $lamaInap = max($tglCheckin->diffInDays($tglCheckout), 1);

        $pdf = Pdf::loadView('pdf.faktur-reservasi', [
            'reservasi' => $reservasi,
            'lamaInap' => $lamaInap,
            'logoPath' => public_path('assets/images/tankayo.png'),
            'tglBooking' => Carbon::parse($reservasi->created_at)->translatedFormat('d F Y'),
            'tglCheckin' => $tglCheckin->translatedFormat('d F Y'),
            'tglCheckout' => $tglCheckout->translatedFormat('d F Y'),
            'tglCetak' => Carbon::now()->translatedFormat('d F Y H:i'),
        ])->setPaper('a4', 'portrait');

        return $pdf->stream("Faktur-{$reservasi->idbooking}.pdf");
    }

    public function edit(Reservasi $reservasi): Response
    {
        $reservasi->load(['tamu', 'kamar']);

        return Inertia::render('admin/reservasi/form', [
            'reservasi' => $reservasi,
        ]);
    }

    public function update(Request $request, Reservasi $reservasi): RedirectResponse
    {
        $validated = $request->validate([
            'tglcheckin' => 'required|date',
            'tglcheckout' => 'required|date|after:tglcheckin',
            'totalbayar' => 'required|numeric|min:0',
            'tipe' => 'required|in:cash,transfer',
            'status' => 'sometimes|in:diproses,diterima,ditolak,cancel',
        ]);

        if (! BookingService::checkAvailability($reservasi->idkamar, $validated['tglcheckin'], $validated['tglcheckout'], $reservasi->idbooking)) {
            return back()->withErrors(['idkamar' => 'Kamar tidak tersedia pada tanggal tersebut.']);
        }

        $reservasi->update($validated);

        return redirect()->route('admin.reservasi.index')
            ->with('toast', ['type' => 'success', 'message' => 'Reservasi berhasil diupdate.']);
    }

    public function destroy(Reservasi $reservasi): RedirectResponse
    {
        $reservasi->delete();

        return redirect()->route('admin.reservasi.index')
            ->with('toast', ['type' => 'success', 'message' => 'Reservasi berhasil dihapus.']);
    }
}
