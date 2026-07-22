<?php

namespace App\Http\Controllers;

use App\Models\Kamar;
use App\Models\Reservasi;
use App\Models\Tamu;
use App\Services\BookingService;
use App\Services\IdGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class OnlineController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $user = $request->user();
        $tamu = $user->currentTamu;

        $stats = [
            'total_booking' => 0,
            'active' => 0,
            'completed' => 0,
        ];
        $recentBookings = collect();

        $query = Reservasi::where('user_id', $user->id);
        $stats['total_booking'] = (clone $query)->count();
        $stats['active'] = (clone $query)->whereNotIn('status', ['selesai', 'cancel', 'limit'])->count();
        $stats['completed'] = (clone $query)->where('status', 'selesai')->count();
        $recentBookings = Reservasi::where('user_id', $user->id)
            ->with('kamar')
            ->latest()
            ->limit(5)
            ->get();

        $availableRooms = Kamar::where('status_kamar', 'tersedia')
            ->limit(6)
            ->get();

        return Inertia::render('portal/dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
            'availableRooms' => $availableRooms,
            'hasTamu' => $tamu !== null,
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

        $kamar = Kamar::where('status_kamar', 'tersedia')->get();

        return Inertia::render('portal/booking', [
            'kamar' => $kamar,
            'tamu' => $tamu,
        ]);
    }

    public function checkAvailability(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'idkamar' => 'required|exists:kamar,id_kamar',
            'tglcheckin' => 'required|date',
            'tglcheckout' => 'required|date|after:tglcheckin',
        ]);

        $available = BookingService::checkAvailability(
            $validated['idkamar'],
            $validated['tglcheckin'],
            $validated['tglcheckout']
        );

        $kamar = Kamar::find((string) $validated['idkamar']);
        $total = 0;
        $harga = 0;

        if ($kamar) {
            $harga = $kamar->harga;

            if ($available) {
                $total = BookingService::hitungTotal(
                    $kamar->harga,
                    $validated['tglcheckin'],
                    $validated['tglcheckout']
                );
            }
        }

        return response()->json([
            'available' => $available,
            'total' => $total,
            'harga' => $harga,
        ]);
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
            'tipe' => 'required|in:transfer,dp',
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

    public function bookingHistory(Request $request): Response
    {
        $reservasi = Reservasi::where('user_id', $request->user()->id)
            ->with('kamar')
            ->latest()
            ->paginate(10);

        return Inertia::render('portal/history', [
            'reservasi' => $reservasi,
        ]);
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

    public function paymentUpload(Request $request, Reservasi $reservasi): Response|RedirectResponse
    {
        if ($reservasi->user_id !== $request->user()->id) {
            abort(403);
        }

        if (! in_array($reservasi->status, ['diproses', 'ditolak'])) {
            return redirect()->route('portal.booking.detail', $reservasi->idbooking);
        }

        $reservasi->load('kamar');

        return Inertia::render('portal/payment', [
            'reservasi' => $reservasi,
        ]);
    }

    public function savePayment(Request $request, Reservasi $reservasi): RedirectResponse
    {
        if ($reservasi->user_id !== $request->user()->id) {
            abort(403);
        }

        if (! in_array($reservasi->status, ['diproses', 'ditolak'])) {
            return redirect()->route('portal.booking.detail', $reservasi->idbooking);
        }

        $request->validate([
            'bukti_bayar' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $file = $request->file('bukti_bayar');
        $filename = $reservasi->idbooking.'.'.$file->getClientOriginalExtension();
        $file->storeAs('public/bukti-bayar', $filename);

        $reservasi->update([
            'buktibayar' => 'bukti-bayar/'.$filename,
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

        if ($reservasi->status !== 'diproses') {
            return back()->withErrors(['status' => 'Booking tidak dapat dibatalkan.']);
        }

        $reservasi->update(['status' => 'cancel']);

        return redirect()->route('portal.booking.detail', $reservasi->idbooking)
            ->with('toast', ['type' => 'success', 'message' => 'Booking berhasil dibatalkan.']);
    }
}
