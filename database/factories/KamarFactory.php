<?php

namespace Database\Factories;

use App\Models\Kamar;
use App\Models\Tipe;
use App\Services\IdGenerator;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Kamar>
 */
class KamarFactory extends Factory
{
    protected $model = Kamar::class;

    public function definition(): array
    {
        $fasilitasPool = ['AC', 'TV', 'WiFi', 'Kamar Mandi Dalam', 'Air Panas', 'Sarapan', 'Lemari Pakaian', 'Meja Kerja', 'Kulkas Mini'];

        return [
            'id_kamar' => IdGenerator::kamar(),
            'nama' => 'Kamar '.fake()->unique()->numberBetween(101, 999),
            'tipe_id' => Tipe::inRandomOrder()->first()->id ?? Tipe::factory(),
            'harga' => fake()->randomElement([150000, 200000, 250000, 300000, 400000, 500000, 650000]),
            'fasilitas' => implode(', ', fake()->randomElements($fasilitasPool, fake()->numberBetween(3, 6))),
            'status_kamar' => fake()->randomElement(['tersedia', 'tersedia', 'tersedia', 'tidak tersedia']),
        ];
    }
}
