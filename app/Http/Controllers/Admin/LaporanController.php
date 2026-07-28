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
use Illuminate\Support\Facades\DB;
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
        $data = Kamar::with('tipe:id,nama_tipe')->select('id_kamar', 'tipe_id', 'harga', 'status_kamar')->get();

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

    public function pendapatan(Request $request): Response
    {
        $mode = $request->input('mode', 'tanggal');

        if (! in_array($mode, ['tanggal', 'bulan', 'tahun'], true)) {
            $mode = 'tanggal';
        }

        $data = [];
        $loaded = false;

        if ($mode === 'tahun') {
            $tahun = $request->input('tahun', '');

            if ($tahun !== '' && ctype_digit($tahun)) {
                $loaded = true;
                $data = $this->getPendapatanByTahun((int) $tahun);
            }
        } else {
            [$dari, $sampai] = $this->resolveRange($mode, $request);

            if ($dari !== null && $sampai !== null) {
                $loaded = true;
                $data = $this->getPendapatanByRange($dari, $sampai);
            }
        }

        return Inertia::render('admin/laporan/pendapatan', [
            'mode' => $mode,
            'data' => $data,
            'loaded' => $loaded,
            'filters' => [
                'dari' => $request->input('dari', ''),
                'sampai' => $request->input('sampai', ''),
                'dari_bulan' => $request->input('dari_bulan', ''),
                'sampai_bulan' => $request->input('sampai_bulan', ''),
                'tahun' => $request->input('tahun', ''),
            ],
        ]);
    }

    public function exportPdf(Request $request, string $type): HttpResponse
    {
        if (! in_array($type, ['kamar', 'tamu', 'reservasi', 'checkin', 'checkout', 'pendapatan'], true)) {
            abort(404);
        }

        $periode = '';

        if (in_array($type, ['kamar', 'tamu'], true)) {
            $data = match ($type) {
                'kamar' => Kamar::with('tipe:id,nama_tipe')->select('id_kamar', 'tipe_id', 'harga', 'status_kamar')->get(),
                'tamu' => Tamu::select('nik', 'nama', 'jk', 'nohp', 'alamat')->get(),
            };
        } elseif ($type === 'pendapatan') {
            $mode = $request->input('mode', 'tanggal');

            if (! in_array($mode, ['tanggal', 'bulan', 'tahun'], true)) {
                $mode = 'tanggal';
            }

            Carbon::setLocale('id');

            if ($mode === 'tahun') {
                $tahun = $request->input('tahun', '');

                if ($tahun === '' || ! ctype_digit($tahun)) {
                    abort(422, 'Tahun belum diisi.');
                }

                $periode = "Tahun {$tahun}";
                $data = $this->getPendapatanByTahun((int) $tahun);
            } else {
                [$dari, $sampai] = $this->resolveRange($mode, $request);

                if ($dari === null || $sampai === null) {
                    abort(422, 'Filter belum diisi.');
                }

                $periode = $mode === 'bulan'
                    ? Carbon::parse($request->input('dari_bulan').'-01')->translatedFormat('F Y').' — '.Carbon::parse($request->input('sampai_bulan').'-01')->translatedFormat('F Y')
                    : Carbon::parse($dari)->translatedFormat('d F Y').' — '.Carbon::parse($sampai)->translatedFormat('d F Y');

                $data = $this->getPendapatanByRange($dari, $sampai);
            }
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
            'pendapatan' => 'Laporan Pendapatan',
        ];

        $columnLabel = null;

        if ($type === 'pendapatan') {
            $pendapatanMode = $request->input('mode', 'tanggal');
            $columnLabel = $pendapatanMode === 'tahun' ? 'Bulan' : 'Tanggal';
        }

        $pdf = Pdf::loadView('pdf.laporan', [
            'type' => $type,
            'title' => $titles[$type],
            'data' => $data,
            'periode' => $periode,
            'columnLabel' => $columnLabel,
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
            ->oldest()
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
            ->oldest()
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
            ->oldest()
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

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getPendapatanByRange(string $dari, string $sampai): array
    {
        $reservasiRows = DB::table('reservasi')
            ->whereIn('status', ['diterima', 'checkin', 'selesai'])
            ->whereDate('created_at', '>=', $dari)
            ->whereDate('created_at', '<=', $sampai)
            ->select(
                DB::raw('DATE(created_at) as tanggal'),
                DB::raw('SUM(totalbayar) as jumlah'),
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->get()
            ->pluck('jumlah', 'tanggal')
            ->all();

        $potonganRows = DB::table('checkout')
            ->whereDate('tglcheckout', '>=', $dari)
            ->whereDate('tglcheckout', '<=', $sampai)
            ->where('potongan', '>', 0)
            ->select(
                DB::raw('DATE(tglcheckout) as tanggal'),
                DB::raw('SUM(potongan) as jumlah'),
            )
            ->groupBy(DB::raw('DATE(tglcheckout)'))
            ->get()
            ->pluck('jumlah', 'tanggal')
            ->all();

        $reservasiCountRows = DB::table('reservasi')
            ->whereDate('created_at', '>=', $dari)
            ->whereDate('created_at', '<=', $sampai)
            ->select(
                DB::raw('DATE(created_at) as tanggal'),
                DB::raw('COUNT(*) as jumlah'),
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->get()
            ->pluck('jumlah', 'tanggal')
            ->all();

        $checkoutCountRows = DB::table('checkout')
            ->whereDate('tglcheckout', '>=', $dari)
            ->whereDate('tglcheckout', '<=', $sampai)
            ->select(
                DB::raw('DATE(tglcheckout) as tanggal'),
                DB::raw('COUNT(*) as jumlah'),
            )
            ->groupBy(DB::raw('DATE(tglcheckout)'))
            ->get()
            ->pluck('jumlah', 'tanggal')
            ->all();

        $allDates = array_unique(array_merge(array_keys($reservasiRows), array_keys($potonganRows), array_keys($reservasiCountRows), array_keys($checkoutCountRows)));
        sort($allDates);

        return array_map(function (string $tanggal) use ($reservasiRows, $potonganRows, $reservasiCountRows, $checkoutCountRows) {
            return [
                'label' => Carbon::parse($tanggal)->translatedFormat('d F Y'),
                'reservasi' => (int) ($reservasiCountRows[$tanggal] ?? 0),
                'checkout' => (int) ($checkoutCountRows[$tanggal] ?? 0),
                'jumlah' => (float) ($reservasiRows[$tanggal] ?? 0) + (float) ($potonganRows[$tanggal] ?? 0),
            ];
        }, $allDates);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getPendapatanByTahun(int $tahun): array
    {
        $bulanNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        $reservasiRows = DB::table('reservasi')
            ->whereIn('status', ['diterima', 'checkin', 'selesai'])
            ->whereYear('created_at', $tahun)
            ->select(
                DB::raw('MONTH(created_at) as bulan'),
                DB::raw('SUM(totalbayar) as jumlah'),
            )
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->get()
            ->keyBy('bulan');

        $potonganRows = DB::table('checkout')
            ->whereYear('tglcheckout', $tahun)
            ->where('potongan', '>', 0)
            ->select(
                DB::raw('MONTH(tglcheckout) as bulan'),
                DB::raw('SUM(potongan) as jumlah'),
            )
            ->groupBy(DB::raw('MONTH(tglcheckout)'))
            ->get()
            ->keyBy('bulan');

        $reservasiCountRows = DB::table('reservasi')
            ->whereYear('created_at', $tahun)
            ->select(
                DB::raw('MONTH(created_at) as bulan'),
                DB::raw('COUNT(*) as jumlah'),
            )
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->get()
            ->keyBy('bulan');

        $checkoutCountRows = DB::table('checkout')
            ->whereYear('tglcheckout', $tahun)
            ->select(
                DB::raw('MONTH(tglcheckout) as bulan'),
                DB::raw('COUNT(*) as jumlah'),
            )
            ->groupBy(DB::raw('MONTH(tglcheckout)'))
            ->get()
            ->keyBy('bulan');

        $data = [];

        for ($m = 1; $m <= 12; $m++) {
            $reservasi = isset($reservasiRows[$m]) ? (float) $reservasiRows[$m]->jumlah : 0;
            $potongan = isset($potonganRows[$m]) ? (float) $potonganRows[$m]->jumlah : 0;
            $reservasiCount = isset($reservasiCountRows[$m]) ? (int) $reservasiCountRows[$m]->jumlah : 0;
            $checkoutCount = isset($checkoutCountRows[$m]) ? (int) $checkoutCountRows[$m]->jumlah : 0;

            $data[] = [
                'label' => $bulanNames[$m],
                'reservasi' => $reservasiCount,
                'checkout' => $checkoutCount,
                'jumlah' => $reservasi + $potongan,
            ];
        }

        return $data;
    }
}
