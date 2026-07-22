<?php

namespace Database\Factories;

use App\Models\Checkin;
use App\Models\Reservasi;
use App\Services\IdGenerator;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Checkin>
 */
class CheckinFactory extends Factory
{
    protected $model = Checkin::class;

    public function definition(): array
    {
        return [
            'idcheckin' => IdGenerator::checkin(),
            'idbooking' => Reservasi::factory(),
            'deposit' => fake()->randomElement([50000, 100000, 150000]),
        ];
    }
}
