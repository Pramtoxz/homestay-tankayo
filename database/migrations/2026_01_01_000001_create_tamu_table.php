<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tamu', function (Blueprint $table) {
            $table->char('nik', 30)->primary();
            $table->string('nama', 50);
            $table->text('alamat');
            $table->char('nohp', 30);
            $table->enum('jk', ['L', 'P']);
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreign('current_nik')->references('nik')->on('tamu')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['current_nik']);
        });

        Schema::dropIfExists('tamu');
    }
};
