<?php

namespace Database\Factories;

use App\Models\Checkin;
use App\Models\Checkout;
use App\Services\IdGenerator;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Checkout>
 */
class CheckoutFactory extends Factory
{
    protected $model = Checkout::class;

    public function definition(): array
    {
        $potongan = fake()->randomElement([0, 0, 10000, 25000, 50000]);

        return [
            'idcheckout' => IdGenerator::checkout(),
            'idcheckin' => Checkin::factory(),
            'tglcheckout' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            'potongan' => $potongan,
            'keterangan' => fake()->boolean(30) ? fake('id_ID')->sentence(6) : null,
            'grandtotal' => fake()->numberBetween(150000, 2000000),
        ];
    }
}
