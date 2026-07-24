<?php

namespace App\Http\Controllers;

use App\Models\Kamar;
use App\Models\Rekening;
use App\Models\Reservasi;
use App\Models\Tamu;
use App\Models\Tipe;
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

class OnlineController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $user = $request->user();
        $tamu = $user->currentTamu;

        if (! $tamu) {
            return Inertia::render('portal/lengkapi-data', [
                'tamu' => null,
            ]);
        }

        $reservasi = Reservasi::where('user_id', $user->id)
            ->with('kamar')
            ->latest()
            ->paginate(10);

        return Inertia::render('portal/history', [
            'reservasi' => $reservasi,
        ]);
    }

    public function lengkapiData(Request $request): Response
    {
        $tamu = $request->user()->currentTamu;

        return Inertia::render('portal/lengkapi-data', [
            'tamu' => $tamu,
        ]);
    }

    public function simpanDataTamu(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'nik' => 'required|string|size:16',
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string|max:500',
            'nohp' => 'required|string|max:20',
            'jk' => 'required|in:L,P',
        ]);

        Tamu::updateOrCreate(['nik' => $validated['nik']], $validated);
        $user->update(['current_nik' => $validated['nik']]);

        return redirect()->route('portal.dashboard')
            ->with('toast', ['type' => 'success', 'message' => 'Data tamu berhasil disimpan.']);
    }

    public function booking(Request $request): Response
    {
        $tamu = $request->user()->currentTamu;

        if (! $tamu) {
            return Inertia::render('portal/lengkapi-data', [
                'tamu' => null,
            ]);
        }

        return Inertia::render('portal/booking', [
            'tamu' => $tamu,
        ]);
    }

    public function tipeSummary(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tglcheckin' => 'required|date',
            'tglcheckout' => 'required|date|after:tglcheckin',
        ]);

        $tipes = Tipe::where('aktif', true)->orderBy('nama_tipe')->get();

        $summary = $tipes->map(function (Tipe $tipe) use ($validated) {
            $query = Kamar::where('tipe_id', $tipe->id)->where('status_kamar', 'tersedia');

            $total = (clone $query)->count();

            $tersedia = (clone $query)->whereDoesntHave('reservasi', function ($r) use ($validated) {
                $r->whereNotIn('status', ['ditolak', 'cancel', 'selesai', 'limit'])
                    ->where('tglcheckin', '<', $validated['tglcheckout'])
                    ->where('tglcheckout', '>', $validated['tglcheckin']);
            })->count();

            return [
                'tipe_id' => $tipe->id,
                'nama_tipe' => $tipe->nama_tipe,
                'foto' => $tipe->foto,
                'total' => $total,
                'tersedia' => $tersedia,
                'harga_mulai' => (clone $query)->orderBy('harga')->value('harga'),
            ];
        });

        return response()->json($summary->values());
    }

    public function kamarByTipe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tglcheckin' => 'required|date',
            'tglcheckout' => 'required|date|after:tglcheckin',
            'tipe_id' => 'required|exists:tipe,id',
        ]);

        $kamar = Kamar::where('tipe_id', $validated['tipe_id'])
            ->where('status_kamar', 'tersedia')
            ->whereDoesntHave('reservasi', function ($r) use ($validated) {
                $r->whereNotIn('status', ['ditolak', 'cancel', 'selesai', 'limit'])
                    ->where('tglcheckin', '<', $validated['tglcheckout'])
                    ->where('tglcheckout', '>', $validated['tglcheckin']);
            })
            ->orderBy('nama')
            ->get();

        return response()->json($kamar);
    }

    public function saveBooking(Request $request): RedirectResponse
    {
        $user = $request->user();
        $tamu = $user->currentTamu;

        if (! $tamu) {
            return redirect()->route('portal.lengkapi-data');
        }

        $validated = $request->validate([
            'idkamar' => 'required|exists:kamar,id_kamar',
            'tglcheckin' => 'required|date|after_or_equal:today',
            'tglcheckout' => 'required|date|after:tglcheckin',
            'totalbayar' => 'required|numeric|min:1',
            'tipe' => 'required|in:transfer',
        ]);

        if (! BookingService::checkAvailability($validated['idkamar'], $validated['tglcheckin'], $validated['tglcheckout'])) {
            return back()->withErrors(['idkamar' => 'Kamar tidak tersedia pada tanggal tersebut.']);
        }

        $validated['idbooking'] = IdGenerator::reservasi();
        $validated['nik'] = $tamu->nik;
        $validated['user_id'] = $user->id;
        $validated['status'] = 'diproses';
        $validated['online'] = true;
        $validated['batas_waktu'] = Carbon::now()->addMinutes(15);

        Reservasi::create($validated);

        return redirect()->route('portal.booking.detail', $validated['idbooking'])
            ->with('toast', ['type' => 'success', 'message' => 'Booking berhasil dibuat. Silakan upload bukti bayar dalam 15 menit.']);
    }

    public function bookingDetail(Request $request, Reservasi $reservasi): Response
    {
        if ($reservasi->user_id !== $request->user()->id) {
            abort(403);
        }

        $reservasi->load(['tamu', 'kamar']);

        return Inertia::render('portal/detail', [
            'reservasi' => $reservasi,
        ]);
    }

    public function faktur(Request $request, Reservasi $reservasi): HttpResponse
    {
        if ($reservasi->user_id !== $request->user()->id) {
            abort(403);
        }

        if (! in_array($reservasi->status, ['diterima', 'checkin', 'selesai'])) {
            abort(403);
        }

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

    private function canUploadPayment(Reservasi $reservasi): bool
    {
        return $reservasi->status === 'ditolak'
            || ($reservasi->status === 'diproses' && ! $reservasi->buktibayar);
    }

    public function paymentUpload(Request $request, Reservasi $reservasi): Response|RedirectResponse
    {
        if ($reservasi->user_id !== $request->user()->id) {
            abort(403);
        }

        if (! $this->canUploadPayment($reservasi)) {
            return redirect()->route('portal.booking.detail', $reservasi->idbooking);
        }

        $reservasi->load('kamar');

        $rekening = Rekening::where('aktif', true)->orderBy('jenis')->orderBy('nama')->get();

        return Inertia::render('portal/payment', [
            'reservasi' => $reservasi,
            'rekening' => $rekening,
        ]);
    }

    public function savePayment(Request $request, Reservasi $reservasi): RedirectResponse
    {
        if ($reservasi->user_id !== $request->user()->id) {
            abort(403);
        }

        if (! $this->canUploadPayment($reservasi)) {
            return redirect()->route('portal.booking.detail', $reservasi->idbooking);
        }

        $request->validate([
            'bukti_bayar' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'rekening_id' => 'required|exists:rekening,id',
        ]);

        $file = $request->file('bukti_bayar');
        $filename = $reservasi->idbooking.'.'.$file->getClientOriginalExtension();
        $file->storeAs('bukti-bayar', $filename, 'public');

        $reservasi->update([
            'buktibayar' => 'bukti-bayar/'.$filename,
            'rekening_id' => $request->input('rekening_id'),
            'status' => 'diproses',
        ]);

        return redirect()->route('portal.booking.detail', $reservasi->idbooking)
            ->with('toast', ['type' => 'success', 'message' => 'Bukti bayar berhasil diupload.']);
    }

    public function cancelBooking(Request $request, Reservasi $reservasi): RedirectResponse
    {
        if ($reservasi->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($reservasi->status !== 'diproses' || $reservasi->buktibayar) {
            return back()->withErrors(['status' => 'Booking tidak dapat dibatalkan.']);
        }

        $reservasi->update(['status' => 'cancel']);

        return redirect()->route('portal.booking.detail', $reservasi->idbooking)
            ->with('toast', ['type' => 'success', 'message' => 'Booking berhasil dibatalkan.']);
    }
}
