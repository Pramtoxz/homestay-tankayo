<?php

namespace Database\Factories;

use App\Models\Tamu;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Tamu>
 */
class TamuFactory extends Factory
{
    protected $model = Tamu::class;

    public function definition(): array
    {
        return [
            'nik' => fake()->unique()->numerify(str_repeat('#', 16)),
            'nama' => fake('id_ID')->name(),
            'alamat' => fake('id_ID')->address(),
            'nohp' => '08'.fake()->numerify(str_repeat('#', 10)),
            'jk' => fake()->randomElement(['L', 'P']),
        ];
    }
}
