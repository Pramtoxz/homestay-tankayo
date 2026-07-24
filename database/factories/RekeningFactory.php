<?php

namespace Database\Factories;

use App\Models\Rekening;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Rekening>
 */
class RekeningFactory extends Factory
{
    protected $model = Rekening::class;

    public function definition(): array
    {
        return [
            'jenis' => fake()->randomElement(['bank', 'qris', 'e-wallet']),
            'nama' => fake()->company(),
            'nomor' => fake()->numerify('################'),
            'aktif' => true,
        ];
    }
}
