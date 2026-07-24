<?php

namespace Database\Factories;

use App\Models\Tipe;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Tipe>
 */
class TipeFactory extends Factory
{
    protected $model = Tipe::class;

    public function definition(): array
    {
        return [
            'nama_tipe' => fake()->unique()->word(),
            'aktif' => true,
        ];
    }
}
