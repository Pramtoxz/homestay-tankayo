<?php

namespace Database\Factories;

use App\Models\Pengeluaran;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pengeluaran>
 */
class PengeluaranFactory extends Factory
{
    protected $model = Pengeluaran::class;

    public function definition(): array
    {
        $keterangan = [
            'Beli perlengkapan kebersihan',
            'Bayar tagihan listrik',
            'Bayar tagihan air (PDAM)',
            'Gaji karyawan',
            'Perbaikan AC kamar',
            'Beli sprei dan handuk baru',
            'Internet & WiFi bulanan',
            'Renovasi kamar mandi',
            'Beli galon air minum',
            'Biaya laundry linen',
            'Beli sabun & shampo tamu',
            'Perbaikan atap bocor',
            'Cat ulang dinding kamar',
            'Beli lampu & alat listrik',
        ];

        return [
            'tgl' => fake()->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'keterangan' => fake()->randomElement($keterangan),
            'total' => fake()->numberBetween(50000, 3000000),
        ];
    }
}
