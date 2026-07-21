<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservasi', function (Blueprint $table) {
            $table->string('idbooking', 30)->primary();
            $table->char('nik', 30);
            $table->char('idkamar', 30);
            $table->date('tglcheckin');
            $table->date('tglcheckout');
            $table->double('totalbayar')->default(0);
            $table->string('tipe', 50)->nullable();
            $table->string('buktibayar', 255)->nullable();
            $table->boolean('online')->default(false);
            $table->enum('status', ['diproses', 'diterima', 'ditolak', 'checkin', 'selesai', 'cancel', 'limit'])->default('diproses');
            $table->datetime('batas_waktu')->nullable();
            $table->timestamps();

            $table->foreign('nik')->references('nik')->on('tamu')->cascadeOnDelete();
            $table->foreign('idkamar')->references('id_kamar')->on('kamar')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservasi');
    }
};
