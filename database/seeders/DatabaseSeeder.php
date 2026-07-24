<?php

namespace Database\Seeders;

use App\Models\Checkin;
use App\Models\Checkout;
use App\Models\Kamar;
use App\Models\Rekening;
use App\Models\Reservasi;
use App\Models\Tamu;
use App\Models\Tipe;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->admin()->create([
            'name' => 'Resepsionis',
            'email' => 'resepsionis@gmail.com',
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

        $tipeNames = [
            'Superior Room Balcony',
            'Deluxe Room Balcony',
            'Twinbed Room Balcony',
            'Junior Suite Room Balcony',
            'Triple Room Balcony',
        ];

        foreach ($tipeNames as $name) {
            Tipe::create(['nama_tipe' => $name, 'aktif' => true]);
        }

        Rekening::create(['jenis' => 'bank', 'nama' => 'Bank Nagari', 'nomor' => '7100.14.345644-8', 'aktif' => true]);
        Rekening::create(['jenis' => 'bank', 'nama' => 'BRI', 'nomor' => '034101000523508', 'aktif' => true]);
        Rekening::create(['jenis' => 'qris', 'nama' => 'QRIS Tankayo', 'nomor' => null, 'aktif' => true]);

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
    }
}
