<?php

namespace Database\Factories;

use App\Models\Kamar;
use App\Models\Reservasi;
use App\Models\Tamu;
use App\Services\IdGenerator;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reservasi>
 */
class ReservasiFactory extends Factory
{
    protected $model = Reservasi::class;

    public function definition(): array
    {
        $checkin = fake()->dateTimeBetween('-2 months', '+1 month');
        $nights = fake()->numberBetween(1, 5);
        $checkout = (clone $checkin)->modify("+{$nights} days");

        $kamar = Kamar::inRandomOrder()->first();
        $tamu = Tamu::inRandomOrder()->first();
        $harga = $kamar->harga ?? 200000;

        return [
            'idbooking' => IdGenerator::reservasi(),
            'nik' => $tamu->nik,
            'idkamar' => $kamar->id_kamar,
            'user_id' => null,
            'tglcheckin' => $checkin->format('Y-m-d'),
            'tglcheckout' => $checkout->format('Y-m-d'),
            'totalbayar' => $harga * $nights,
            'tipe' => fake()->randomElement(['cash', 'transfer']),
            'online' => fake()->boolean(30),
            'status' => fake()->randomElement(['diproses', 'diterima', 'diterima', 'checkin', 'selesai', 'selesai', 'ditolak', 'cancel']),
            'batas_waktu' => null,
        ];
    }
}
