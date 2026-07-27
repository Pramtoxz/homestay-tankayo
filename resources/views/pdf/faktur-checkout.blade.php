<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Faktur Check-out {{ $checkout->idcheckout }}</title>
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

        /* Header */
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

        /* Info sections */
        .section-table {
            width: 100%;
            margin-bottom: 16px;
        }

        .section-col {
            width: 50%;
            vertical-align: top;
        }

        .section-title {
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b7280;
            margin-bottom: 4px;
        }

        table.kv-table td {
            padding: 1px 0;
            font-size: 11px;
        }

        table.kv-table .kv-label {
            width: 85px;
            color: #374151;
        }

        /* Items table */
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
        }

        table.items-table tbody tr.deduction td {
            color: #b91c1c;
        }

        table.items-table tbody tr.kekurangan td {
            background-color: #fef2f2;
            color: #b91c1c;
            font-weight: bold;
        }

        table.items-table tbody tr.kembalian td {
            background-color: #f0fdf4;
            color: #15803d;
            font-weight: bold;
        }

        table.items-table tfoot td {
            padding: 8px 8px;
            font-size: 12px;
            font-weight: bold;
            border-top: 2px solid #111827;
        }

        /* Keterangan */
        .note-box {
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 8px 10px;
            margin-bottom: 16px;
            font-size: 10px;
        }

        .note-label {
            font-weight: bold;
            text-transform: uppercase;
            font-size: 9px;
            color: #6b7280;
            margin-bottom: 2px;
        }

        /* Signature */
        table.signature-table {
            width: 100%;
            margin-top: 10px;
        }

        table.signature-table .sign-col {
            width: 220px;
            text-align: center;
            font-size: 11px;
        }

        .signature-space {
            height: 55px;
        }

        .sign-name {
            font-weight: bold;
            border-top: 1px solid #111827;
            padding-top: 3px;
            display: inline-block;
            width: 100%;
        }

        /* Footer */
        .footer-note {
            margin-top: 26px;
            font-size: 9px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 6px;
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
                <div class="doc-title">FAKTUR CHECK-OUT</div>
                <div class="doc-meta">No. {{ $checkout->idcheckout }}</div>
                <div class="doc-meta">Tanggal: {{ $tglCheckout }}</div>
            </td>
        </tr>
    </table>
    <div class="divider"></div>

    <table class="section-table">
        <tr>
            <td class="section-col">
                <div class="section-title">Ditagihkan Kepada</div>
                <table class="kv-table">
                    <tr>
                        <td class="kv-label">Nama</td>
                        <td>: {{ $reservasi->tamu->nama ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td class="kv-label">Nomor HP</td>
                        <td>: {{ $reservasi->tamu->nohp ?? '-' }}</td>
                    </tr>
                </table>
            </td>
            <td class="section-col">
                <div class="section-title">Detail Kamar</div>
                <table class="kv-table">
                    <tr>
                        <td class="kv-label">Kode Kamar</td>
                        <td>: {{ $reservasi->kamar->id_kamar ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td class="kv-label">Tipe Kamar</td>
                        <td>: {{ $reservasi->kamar->tipe->nama_tipe ?? '-' }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 70%;">Keterangan Bayar</th>
                <th style="width: 30%; text-align: right;">Jumlah</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Total Reservasi Yang Sudah Dibayar Lunas Di Muka</td>
                <td style="text-align: right;">Rp {{ number_format($reservasi->totalbayar ?? 0, 0, ',', '.') }}</td>
            </tr>
            <tr class="deduction">
                <td>Potongan/Denda</td>
                <td style="text-align: right;">- Rp {{ number_format($checkout->potongan, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">Grand Total</td>
                <td style="text-align: right; font-weight: bold;">Rp {{ number_format($checkout->grandtotal, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>Deposit Yang Sudah Masuk</td>
                <td style="text-align: right;">Rp {{ number_format($checkout->checkin->deposit ?? 0, 0, ',', '.') }}</td>
            </tr>
            @php
                $depositVal = $checkout->checkin->deposit ?? 0;
                $potonganVal = $checkout->potongan;
                $kekuranganVal = $potonganVal > $depositVal ? $potonganVal - $depositVal : 0;
            @endphp
            @if ($kekuranganVal > 0)
                <tr class="kekurangan">
                    <td>Kekurangan Yang Harus Dibayar Tamu</td>
                    <td style="text-align: right;">Rp {{ number_format($kekuranganVal, 0, ',', '.') }}</td>
                </tr>
            @endif
            @if ($depositVal > $potonganVal)
                <tr class="kembalian">
                    <td>Deposit Yang Harus Dikembalikan Ke Tamu</td>
                    <td style="text-align: right;">Rp {{ number_format($depositVal - $potonganVal, 0, ',', '.') }}</td>
                </tr>
            @endif
        </tbody>
        <tfoot>
            <tr>
                <td style="text-align: right;">TOTAL PEMBAYARAN</td>
                <td style="text-align: right;">Rp {{ number_format($checkout->grandtotal, 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>

    @if ($checkout->keterangan)
        <div class="note-box">
            <div class="note-label">Keterangan</div>
            <div>{{ $checkout->keterangan }}</div>
        </div>
    @endif

    <table class="signature-table">
        <tr>
            <td></td>
            <td class="sign-col">
                <div>Homestay Tankayo EcoPark Syariah</div>
                <div class="signature-space"></div>
                <div class="sign-name">Petugas</div>
            </td>
        </tr>
    </table>

    <div class="footer-note">
        Faktur ini dicetak otomatis oleh sistem pada {{ $tglCetak }} dan sah tanpa tanda tangan basah.
    </div>
</body>
</html>
