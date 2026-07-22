<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Faktur Reservasi {{ $reservasi->idbooking }}</title>
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

        table.items-table tfoot td {
            padding: 8px 8px;
            font-size: 12px;
            font-weight: bold;
            border-top: 2px solid #111827;
        }

        /* Payment */
        table.payment-table {
            width: 45%;
            margin-top: 4px;
            margin-bottom: 30px;
        }

        table.payment-table td {
            padding: 2px 0;
            font-size: 11px;
        }

        table.payment-table .kv-label {
            width: 100px;
            color: #374151;
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
                <div class="doc-title">FAKTUR RESERVASI</div>
                <div class="doc-meta">No. {{ $reservasi->idbooking }}</div>
                <div class="doc-meta">Tanggal: {{ $tglBooking }}</div>
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
                <div class="section-title">Detail Menginap</div>
                <table class="kv-table">
                    <tr>
                        <td class="kv-label">Check-in</td>
                        <td>: {{ $tglCheckin }}</td>
                    </tr>
                    <tr>
                        <td class="kv-label">Check-out</td>
                        <td>: {{ $tglCheckout }}</td>
                    </tr>
                    <tr>
                        <td class="kv-label">Lama Inap</td>
                        <td>: {{ $lamaInap }} malam</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 15%;">Kode Kamar</th>
                <th style="width: 30%;">Tipe Kamar</th>
                <th style="width: 20%; text-align: right;">Harga / Malam</th>
                <th style="width: 15%; text-align: center;">Lama Inap</th>
                <th style="width: 20%; text-align: right;">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $reservasi->kamar->id_kamar ?? '-' }}</td>
                <td>{{ $reservasi->kamar->nama ?? '-' }}</td>
                <td style="text-align: right;">Rp {{ number_format($reservasi->kamar->harga ?? 0, 0, ',', '.') }}</td>
                <td style="text-align: center;">{{ $lamaInap }} malam</td>
                <td style="text-align: right;">Rp {{ number_format(($reservasi->kamar->harga ?? 0) * $lamaInap, 0, ',', '.') }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4" style="text-align: right;">TOTAL</td>
                <td style="text-align: right;">Rp {{ number_format($reservasi->totalbayar, 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>

    <table class="payment-table">
        <tr>
            <td class="kv-label">Tipe Pembayaran</td>
            <td>: {{ ucfirst($reservasi->tipe ?? '-') }}</td>
        </tr>
    </table>

    <table class="signature-table">
        <tr>
            <td></td>
            <td class="sign-col">
                <div>Tankayo EcoPark Syariah</div>
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
