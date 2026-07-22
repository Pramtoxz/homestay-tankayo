<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Checkin;
use App\Models\Kamar;
use App\Models\Reservasi;
use App\Services\IdGenerator;
use Illuminate\Http\JsonResponse;
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

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['idcheckin', 'idbooking', 'deposit', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $checkin = $query->paginate($request->get('per_page', 25));

        return Inertia::render('admin/checkin/index', [
            'checkin' => $checkin,
            'filters' => $request->only(['search', 'per_page', 'sort_by', 'sort_order']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/checkin/form');
    }

    public function searchReservasi(Request $request): JsonResponse
    {
        $query = Reservasi::with(['tamu', 'kamar'])->where('status', 'diterima');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('idbooking', 'like', "%{$search}%")
                    ->orWhereHas('tamu', fn ($t) => $t->where('nama', 'like', "%{$search}%"))
                    ->orWhereHas('kamar', fn ($k) => $k->where('nama', 'like', "%{$search}%"));
            });
        }

        return response()->json(
            $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 10))
        );
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'idbooking' => 'required|exists:reservasi,idbooking',
            'deposit' => 'required|numeric|min:0',
        ]);

        $validated['idcheckin'] = IdGenerator::checkin();

        Checkin::create($validated);

        $reservasi = Reservasi::findOrFail((string) $validated['idbooking']);
        $reservasi->update(['status' => 'checkin']);

        Kamar::where('id_kamar', $reservasi->idkamar)
            ->update(['status_kamar' => 'tidak tersedia']);

        return redirect()->route('admin.checkin.index')
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
