<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('checkin', function (Blueprint $table) {
            $table->char('idcheckin', 30)->primary();
            $table->string('idbooking', 30);
            $table->double('deposit')->default(0);
            $table->timestamps();

            $table->foreign('idbooking')->references('idbooking')->on('reservasi')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('checkin');
    }
};
