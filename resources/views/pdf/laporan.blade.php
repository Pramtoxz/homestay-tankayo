<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        @page {
            margin: 34px 40px;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 11px;
            color: #1f2937;
        }

        table {
            border-collapse: collapse;
        }

        .doc-header td {
            vertical-align: middle;
        }

        .logo-cell {
            width: 60px;
        }

        .logo-cell img {
            width: 52px;
            height: 52px;
        }

        .brand-cell {
            padding-left: 12px;
        }

        .company-name {
            font-size: 15px;
            font-weight: bold;
            color: #111827;
        }

        .company-tagline {
            font-size: 10px;
            color: #6b7280;
            margin-top: 2px;
        }

        .doc-title-cell {
            text-align: right;
        }

        .doc-title {
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 1px;
            color: #111827;
        }

        .doc-meta {
            font-size: 10px;
            color: #4b5563;
            margin-top: 2px;
        }

        .divider {
            border-top: 2px solid #111827;
            margin: 10px 0 16px;
        }

        table.items-table {
            width: 100%;
            margin-bottom: 12px;
        }

        table.items-table thead th {
            background-color: #111827;
            color: #fff;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            padding: 7px 8px;
            text-align: left;
        }

        table.items-table tbody td {
            padding: 9px 8px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 10px;
        }

        table.items-table tbody tr:nth-child(even) {
            background-color: #f9fafb;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .footer-note {
            margin-top: 26px;
            font-size: 9px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 6px;
        }

        .badge {
            display: inline-block;
            padding: 1px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
        }

        .badge-menunggu {
            background-color: #fef3c7;
            color: #92400e;
        }

        .badge-disetujui {
            background-color: #d1fae5;
            color: #065f46;
        }

        .badge-ditolak {
            background-color: #fee2e2;
            color: #991b1b;
        }

        .badge-lainnya {
            background-color: #e5e7eb;
            color: #374151;
        }
    </style>
</head>

<body>
    <table class="doc-header" style="width: 100%;">
        <tr>
            <td class="logo-cell">
                <img src="{{ $logoPath }}">
            </td>
            <td class="brand-cell">
                <div class="company-name">Homestay Tankayo EcoPark Syariah</div>
                <div class="company-tagline">Penginapan Syariah &bull; Ramah Keluarga</div>
            </td>
            <td class="doc-title-cell">
                <div class="doc-title">{{ $title }}</div>
                @if ($periode)
                    <div class="doc-meta">Periode: {{ $periode }}</div>
                @endif
                <div class="doc-meta">Dicetak: {{ $tglCetak }}</div>
            </td>
        </tr>
    </table>
    <div class="divider"></div>

    <table class="items-table">
        <thead>
            <tr>
                @if ($type === 'kamar')
                    <th style="width: 15%;">ID Kamar</th>
                    <th style="width: 30%;">Tipe Kamar</th>
                    <th style="width: 25%; text-align: right;">Harga</th>
                    <th style="width: 30%;">Status</th>
                @elseif($type === 'tamu')
                    <th style="width: 15%;">NIK</th>
                    <th style="width: 25%;">Nama</th>
                    <th style="width: 15%;">JK</th>
                    <th style="width: 15%;">No HP</th>
                    <th style="width: 30%;">Alamat</th>
                @elseif($type === 'reservasi')
                    <th style="width: 14%;">ID Booking</th>
                    <th style="width: 12%;">Tgl Booking</th>
                    <th style="width: 18%;">Tamu</th>
                    <th style="width: 10%;">Kode Kamar</th>
                    <th style="width: 12%;">Check-in</th>
                    <th style="width: 12%;">Check-out</th>
                    <th style="width: 22%;">Status</th>
                @elseif($type === 'checkin')
                    <th style="width: 14%;">ID Check-in</th>
                    <th style="width: 14%;">ID Booking</th>
                    <th style="width: 20%;">Tamu</th>
                    <th style="width: 12%;">Kode Kamar</th>
                    <th style="width: 14%;">Tgl Check-in</th>
                    <th style="width: 13%; text-align: right;">Total Bayar</th>
                    <th style="width: 13%; text-align: right;">Deposit</th>
                @elseif($type === 'checkout')
                    <th style="width: 13%;">ID Checkout</th>
                    <th style="width: 13%;">ID Check-in</th>
                    <th style="width: 17%;">Tamu</th>
                    <th style="width: 10%;">Kode Kamar</th>
                    <th style="width: 12%;">Tgl Check-in</th>
                    <th style="width: 12%;">Tgl Checkout</th>
                    <th style="width: 11%; text-align: right;">Deposit</th>
                    <th style="width: 12%; text-align: right;">Potongan/Denda</th>
                @elseif($type === 'pendapatan')
                    <th style="width: 50%;">{{ $columnLabel ?? 'Periode' }}</th>
                    <th style="width: 50%; text-align: right;">Jumlah</th>
                @endif
            </tr>
        </thead>
        <tbody>
            @forelse($data as $row)
                <tr>
                    @if ($type === 'kamar')
                        <td>{{ $row['id_kamar'] }}</td>
                        <td>{{ $row->tipe->nama_tipe ?? '-' }}</td>
                        <td class="text-right">Rp {{ number_format($row['harga'], 0, ',', '.') }}</td>
                        <td>{{ $row['status_kamar'] }}</td>
                    @elseif($type === 'tamu')
                        <td>{{ $row['nik'] }}</td>
                        <td>{{ $row['nama'] }}</td>
                        <td>{{ $row['jk'] === 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
                        <td>{{ $row['nohp'] }}</td>
                        <td>{{ $row['alamat'] }}</td>
                    @elseif($type === 'reservasi')
                        <td>{{ $row['idbooking'] }}</td>
                        <td>{{ $row['tgl_booking'] }}</td>
                        <td>{{ $row['nama_tamu'] }}</td>
                        <td>{{ $row['kode_kamar'] }}</td>
                        <td>{{ $row['tglcheckin'] }}</td>
                        <td>{{ $row['tglcheckout'] }}</td>
                        <td>
                            @php
                                $statusClass = match ($row['status']) {
                                    'Menunggu' => 'badge-menunggu',
                                    'Disetujui' => 'badge-disetujui',
                                    'Ditolak' => 'badge-ditolak',
                                    default => 'badge-lainnya',
                                };
                            @endphp
                            <span class="badge {{ $statusClass }}">{{ $row['status'] }}</span>
                        </td>
                    @elseif($type === 'checkin')
                        <td>{{ $row['idcheckin'] }}</td>
                        <td>{{ $row['idbooking'] }}</td>
                        <td>{{ $row['nama_tamu'] }}</td>
                        <td>{{ $row['kode_kamar'] }}</td>
                        <td>{{ $row['tglcheckin'] }}</td>
                        <td class="text-right">Rp {{ number_format($row['total_bayar'], 0, ',', '.') }}</td>
                        <td class="text-right">Rp {{ number_format($row['deposit'], 0, ',', '.') }}</td>
                    @elseif($type === 'checkout')
                        <td>{{ $row['idcheckout'] }}</td>
                        <td>{{ $row['idcheckin'] }}</td>
                        <td>{{ $row['nama_tamu'] }}</td>
                        <td>{{ $row['kode_kamar'] }}</td>
                        <td>{{ $row['tglcheckin'] }}</td>
                        <td>{{ $row['tglcheckout'] }}</td>
                        <td class="text-right">Rp {{ number_format($row['deposit'], 0, ',', '.') }}</td>
                        <td class="text-right">Rp {{ number_format($row['potongan'], 0, ',', '.') }}</td>
                    @elseif($type === 'pendapatan')
                        <td>{{ $row['label'] }}</td>
                        <td class="text-right">Rp {{ number_format($row['jumlah'], 0, ',', '.') }}</td>
                    @endif
                </tr>
            @empty
                <tr>
                    <td colspan="10" class="text-center" style="padding: 20px;">Tidak ada data untuk periode ini.</td>
                </tr>
            @endforelse
        </tbody>
        @if ($type === 'pendapatan' && count($data) > 0)
            <tfoot>
                <tr style="font-weight: bold; border-top: 2px solid #111827;">
                    <td style="padding: 9px 8px; font-size: 10px;">Total</td>
                    <td style="padding: 9px 8px; font-size: 10px; text-align: right;">Rp
                        {{ number_format(collect($data)->sum('jumlah'), 0, ',', '.') }}</td>
                </tr>
            </tfoot>
        @endif
    </table>

    <div class="footer-note">
        Laporan ini dicetak otomatis oleh sistem pada {{ $tglCetak }}.
    </div>
</body>

</html>
