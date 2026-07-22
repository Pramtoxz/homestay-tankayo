<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Checkin;
use App\Models\Checkout;
use App\Models\Kamar;
use App\Models\Reservasi;
use App\Models\Tamu;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class LaporanController extends Controller
{
    private const STATUS_MAP = [
        'diproses' => 'Menunggu',
        'diterima' => 'Disetujui',
        'checkin' => 'Disetujui',
        'selesai' => 'Disetujui',
        'ditolak' => 'Ditolak',
        'cancel' => 'Dibatalkan',
        'limit' => 'Kedaluwarsa',
    ];

    public function kamar(): Response
    {
        $data = Kamar::select('id_kamar', 'tipe_kamar', 'harga', 'status_kamar')->get();

        return Inertia::render('admin/laporan/kamar', [
            'data' => $data,
        ]);
    }

    public function tamu(): Response
    {
        $data = Tamu::select('nik', 'nama', 'jk', 'nohp', 'alamat')->get();

        return Inertia::render('admin/laporan/tamu', [
            'data' => $data,
        ]);
    }

    public function reservasi(Request $request): Response
    {
        $mode = $request->input('mode') === 'bulan' ? 'bulan' : 'tanggal';
        [$dari, $sampai] = $this->resolveRange($mode, $request);

        $data = [];
        $loaded = false;

        if ($dari !== null && $sampai !== null) {
            $loaded = true;
            $data = $this->getReservasiData($dari, $sampai);
        }

        return Inertia::render('admin/laporan/reservasi', [
            'mode' => $mode,
            'data' => $data,
            'loaded' => $loaded,
            'filters' => [
                'dari' => $request->input('dari', ''),
                'sampai' => $request->input('sampai', ''),
                'dari_bulan' => $request->input('dari_bulan', ''),
                'sampai_bulan' => $request->input('sampai_bulan', ''),
            ],
        ]);
    }

    public function checkin(Request $request): Response
    {
        $mode = $request->input('mode') === 'bulan' ? 'bulan' : 'tanggal';
        [$dari, $sampai] = $this->resolveRange($mode, $request);

        $data = [];
        $loaded = false;

        if ($dari !== null && $sampai !== null) {
            $loaded = true;
            $data = $this->getCheckinData($dari, $sampai);
        }

        return Inertia::render('admin/laporan/checkin', [
            'mode' => $mode,
            'data' => $data,
            'loaded' => $loaded,
            'filters' => [
                'dari' => $request->input('dari', ''),
                'sampai' => $request->input('sampai', ''),
                'dari_bulan' => $request->input('dari_bulan', ''),
                'sampai_bulan' => $request->input('sampai_bulan', ''),
            ],
        ]);
    }

    public function checkout(Request $request): Response
    {
        $mode = $request->input('mode') === 'bulan' ? 'bulan' : 'tanggal';
        [$dari, $sampai] = $this->resolveRange($mode, $request);

        $data = [];
        $loaded = false;

        if ($dari !== null && $sampai !== null) {
            $loaded = true;
            $data = $this->getCheckoutData($dari, $sampai);
        }

        return Inertia::render('admin/laporan/checkout', [
            'mode' => $mode,
            'data' => $data,
            'loaded' => $loaded,
            'filters' => [
                'dari' => $request->input('dari', ''),
                'sampai' => $request->input('sampai', ''),
                'dari_bulan' => $request->input('dari_bulan', ''),
                'sampai_bulan' => $request->input('sampai_bulan', ''),
            ],
        ]);
    }

    public function exportPdf(Request $request, string $type): HttpResponse
    {
        if (! in_array($type, ['kamar', 'tamu', 'reservasi', 'checkin', 'checkout'], true)) {
            abort(404);
        }

        $periode = '';

        if (in_array($type, ['kamar', 'tamu'], true)) {
            $data = match ($type) {
                'kamar' => Kamar::select('id_kamar', 'tipe_kamar', 'harga', 'status_kamar')->get(),
                'tamu' => Tamu::select('nik', 'nama', 'jk', 'nohp', 'alamat')->get(),
            };
        } else {
            $mode = $request->input('mode') === 'bulan' ? 'bulan' : 'tanggal';
            [$dari, $sampai] = $this->resolveRange($mode, $request);

            if ($dari === null || $sampai === null) {
                abort(422, 'Filter belum diisi.');
            }

            Carbon::setLocale('id');

            $periode = $mode === 'bulan'
                ? Carbon::parse($request->input('dari_bulan').'-01')->translatedFormat('F Y').' — '.Carbon::parse($request->input('sampai_bulan').'-01')->translatedFormat('F Y')
                : Carbon::parse($dari)->translatedFormat('d F Y').' — '.Carbon::parse($sampai)->translatedFormat('d F Y');

            $data = match ($type) {
                'reservasi' => $this->getReservasiData($dari, $sampai),
                'checkin' => $this->getCheckinData($dari, $sampai),
                'checkout' => $this->getCheckoutData($dari, $sampai),
            };
        }

        $titles = [
            'kamar' => 'Laporan Data Kamar',
            'tamu' => 'Laporan Data Tamu',
            'reservasi' => 'Laporan Reservasi',
            'checkin' => 'Laporan Check-in',
            'checkout' => 'Laporan Check-out',
        ];

        $pdf = Pdf::loadView('pdf.laporan', [
            'type' => $type,
            'title' => $titles[$type],
            'data' => $data,
            'periode' => $periode,
            'logoPath' => public_path('assets/images/tankayo.png'),
            'tglCetak' => Carbon::now()->translatedFormat('d F Y H:i'),
        ])->setPaper('a4', 'landscape');

        return $pdf->stream("Laporan-{$type}.pdf");
    }

    /**
     * @return array{string|null, string|null}
     */
    private function resolveRange(string $mode, Request $request): array
    {
        if ($mode === 'bulan') {
            if (! $request->filled('dari_bulan') || ! $request->filled('sampai_bulan')) {
                return [null, null];
            }

            return [
                Carbon::parse($request->input('dari_bulan').'-01')->startOfMonth()->toDateString(),
                Carbon::parse($request->input('sampai_bulan').'-01')->endOfMonth()->toDateString(),
            ];
        }

        if (! $request->filled('dari') || ! $request->filled('sampai')) {
            return [null, null];
        }

        return [$request->input('dari'), $request->input('sampai')];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getReservasiData(string $dari, string $sampai): array
    {
        return Reservasi::with(['tamu', 'kamar'])
            ->whereDate('created_at', '>=', $dari)
            ->whereDate('created_at', '<=', $sampai)
            ->latest()
            ->get()
            ->map(fn (Reservasi $r) => [
                'idbooking' => $r->idbooking,
                'tgl_booking' => Carbon::parse($r->created_at)->toDateString(),
                'nama_tamu' => $r->tamu->nama ?? '-',
                'kode_kamar' => $r->kamar->id_kamar ?? '-',
                'tglcheckin' => Carbon::parse($r->tglcheckin)->toDateString(),
                'tglcheckout' => Carbon::parse($r->tglcheckout)->toDateString(),
                'status' => self::STATUS_MAP[$r->status],
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getCheckinData(string $dari, string $sampai): array
    {
        return Checkin::with(['reservasi.tamu', 'reservasi.kamar'])
            ->whereHas('reservasi', function ($query) use ($dari, $sampai): void {
                $query->whereDate('tglcheckin', '>=', $dari)
                    ->whereDate('tglcheckin', '<=', $sampai);
            })
            ->latest()
            ->get()
            ->map(fn (Checkin $c) => [
                'idcheckin' => $c->idcheckin,
                'idbooking' => $c->idbooking,
                'nama_tamu' => $c->reservasi->tamu->nama ?? '-',
                'kode_kamar' => $c->reservasi->kamar->id_kamar ?? '-',
                'tglcheckin' => Carbon::parse($c->reservasi->tglcheckin)->toDateString(),
                'total_bayar' => $c->reservasi->totalbayar,
                'deposit' => $c->deposit,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getCheckoutData(string $dari, string $sampai): array
    {
        return Checkout::with(['checkin.reservasi.tamu', 'checkin.reservasi.kamar'])
            ->whereDate('tglcheckout', '>=', $dari)
            ->whereDate('tglcheckout', '<=', $sampai)
            ->latest()
            ->get()
            ->map(fn (Checkout $co) => [
                'idcheckout' => $co->idcheckout,
                'idcheckin' => $co->idcheckin,
                'nama_tamu' => $co->checkin->reservasi->tamu->nama ?? '-',
                'kode_kamar' => $co->checkin->reservasi->kamar->id_kamar ?? '-',
                'tglcheckin' => Carbon::parse($co->checkin->reservasi->tglcheckin)->toDateString(),
                'tglcheckout' => Carbon::parse($co->tglcheckout)->toDateString(),
                'deposit' => $co->checkin->deposit,
                'potongan' => $co->potongan,
            ])
            ->values()
            ->all();
    }
}
