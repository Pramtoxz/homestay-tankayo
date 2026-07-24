<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Checkin;
use App\Models\Checkout;
use App\Models\Kamar;
use App\Services\IdGenerator;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class CheckoutController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Checkout::with(['checkin.reservasi.tamu', 'checkin.reservasi.kamar.tipe']);

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('idcheckout', 'like', "%{$search}%")
                    ->orWhere('idcheckin', 'like', "%{$search}%")
                    ->orWhereHas('checkin.reservasi.tamu', fn ($t) => $t->where('nama', 'like', "%{$search}%"));
            });
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['idcheckout', 'idcheckin', 'tglcheckout', 'potongan', 'grandtotal', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $checkout = $query->paginate($request->get('per_page', 25));

        return Inertia::render('admin/checkout/index', [
            'checkout' => $checkout,
            'filters' => $request->only(['search', 'per_page', 'sort_by', 'sort_order']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/checkout/form');
    }

    public function searchCheckin(Request $request): JsonResponse
    {
        $query = Checkin::with(['reservasi.tamu', 'reservasi.kamar.tipe'])
            ->whereDoesntHave('checkout')
            ->whereHas('reservasi', fn ($q) => $q->where('status', 'checkin'));

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('idcheckin', 'like', "%{$search}%")
                    ->orWhere('idbooking', 'like', "%{$search}%")
                    ->orWhereHas('reservasi.tamu', fn ($t) => $t->where('nama', 'like', "%{$search}%"))
                    ->orWhereHas('reservasi.kamar', fn ($k) => $k->where('nama', 'like', "%{$search}%"));
            });
        }

        return response()->json(
            $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 10))
        );
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'idcheckin' => 'required|exists:checkin,idcheckin',
            'tglcheckout' => 'required|date',
            'potongan' => 'required|numeric|min:0',
            'totalbayar' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);

        $checkin = Checkin::with('reservasi')->findOrFail((string) $validated['idcheckin']);

        if ($validated['tglcheckout'] < Carbon::parse($checkin->reservasi->tglcheckin)->format('Y-m-d')) {
            return back()->withErrors(['tglcheckout' => 'Tanggal check-out tidak boleh sebelum tanggal check-in.']);
        }

        $grandtotal = max($checkin->reservasi->totalbayar - $validated['potongan'], 0);
        $deposit = $checkin->deposit;
        $kekurangan = ($validated['potongan'] > $deposit) ? ($validated['potongan'] - $deposit) : 0;

        if ($validated['totalbayar'] < $kekurangan) {
            return back()->withErrors(['totalbayar' => 'Total bayar tidak boleh kurang dari kekurangan ('.number_format($kekurangan, 0, ',', '.').').']);
        }

        $idcheckout = IdGenerator::checkout();
        $validated['idcheckout'] = $idcheckout;
        $validated['grandtotal'] = $grandtotal;

        Checkout::create($validated);

        $checkin->reservasi->update(['status' => 'selesai']);
        Kamar::where('id_kamar', $checkin->reservasi->idkamar)
            ->update(['status_kamar' => 'tersedia']);

        return redirect()->route('admin.checkout.index')
            ->with('toast', ['type' => 'success', 'message' => 'Check-out berhasil.'])
            ->with('faktur_url', route('admin.checkout.faktur', $idcheckout));
    }

    public function show(Checkout $checkout): Response
    {
        $checkout->load(['checkin.reservasi.tamu', 'checkin.reservasi.kamar.tipe']);

        return Inertia::render('admin/checkout/show', [
            'checkout' => $checkout,
        ]);
    }

    public function faktur(Checkout $checkout): HttpResponse
    {
        $checkout->load(['checkin.reservasi.tamu', 'checkin.reservasi.kamar.tipe']);

        Carbon::setLocale('id');

        $pdf = Pdf::loadView('pdf.faktur-checkout', [
            'checkout' => $checkout,
            'reservasi' => $checkout->checkin->reservasi,
            'logoPath' => public_path('assets/images/tankayo.png'),
            'tglCheckout' => Carbon::parse($checkout->tglcheckout)->translatedFormat('d F Y'),
            'tglCetak' => Carbon::now()->translatedFormat('d F Y H:i'),
        ])->setPaper('a4', 'portrait');

        return $pdf->stream("Faktur-Checkout-{$checkout->idcheckout}.pdf");
    }
}
