<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tipe', function (Blueprint $table) {
            $table->text('deskripsi')->nullable()->after('foto');
        });

        Schema::table('kamar', function (Blueprint $table) {
            $table->dropColumn('deskripsi');
        });
    }

    public function down(): void
    {
        Schema::table('kamar', function (Blueprint $table) {
            $table->text('deskripsi')->nullable();
        });

        Schema::table('tipe', function (Blueprint $table) {
            $table->dropColumn('deskripsi');
        });
    }
};
