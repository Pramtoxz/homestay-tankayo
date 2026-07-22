<?php

namespace Database\Seeders;

use App\Models\Checkin;
use App\Models\Checkout;
use App\Models\Kamar;
use App\Models\Pengeluaran;
use App\Models\Reservasi;
use App\Models\Tamu;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->admin()->create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
        ]);

        User::factory()->pimpinan()->create([
            'name' => 'Pimpinan',
            'email' => 'pimpinan@gmail.com',
            'password' => Hash::make('password'),
        ]);

        User::factory()->create([
            'name' => 'User',
            'email' => 'user@gmail.com',
            'password' => Hash::make('password'),
        ]);

        // Dibuat satu per satu (bukan factory(30)->create()) karena IdGenerator
        // baca "ID terakhir" dari DB — factory batch evaluasi semua definition()
        // sebelum insert satupun, jadi ID yang dihasilkan akan duplikat kalau di-batch.
        for ($i = 0; $i < 30; $i++) {
            Kamar::factory()->create();
        }

        Tamu::factory(30)->create();

        $reservasi = collect();
        for ($i = 0; $i < 30; $i++) {
            $reservasi->push(Reservasi::factory()->create());
        }

        foreach ($reservasi->whereIn('status', ['checkin', 'selesai']) as $r) {
            $checkin = Checkin::factory()->create([
                'idbooking' => $r->idbooking,
            ]);

            if ($r->status === 'selesai') {
                $potongan = fake()->randomElement([0, 0, 10000, 25000]);

                Checkout::factory()->create([
                    'idcheckin' => $checkin->idcheckin,
                    'tglcheckout' => $r->tglcheckout,
                    'potongan' => $potongan,
                    'grandtotal' => max($r->totalbayar - $potongan, 0),
                ]);
            }
        }

        Pengeluaran::factory(30)->create();
    }
}
