<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kamar', function (Blueprint $table) {
            $table->char('id_kamar', 30)->primary();
            $table->string('nama', 50);
            $table->double('harga');
            $table->double('dp')->default(0);
            $table->string('status_kamar', 30)->default('tersedia');
            $table->string('cover', 255)->nullable();
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kamar');
    }
};
