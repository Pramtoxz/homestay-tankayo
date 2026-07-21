<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('checkout', function (Blueprint $table) {
            $table->char('idcheckout', 30)->primary();
            $table->char('idcheckin', 30);
            $table->date('tglcheckout');
            $table->double('potongan')->default(0);
            $table->text('keterangan')->nullable();
            $table->double('grandtotal')->default(0);
            $table->timestamps();

            $table->foreign('idcheckin')->references('idcheckin')->on('checkin')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('checkout');
    }
};
