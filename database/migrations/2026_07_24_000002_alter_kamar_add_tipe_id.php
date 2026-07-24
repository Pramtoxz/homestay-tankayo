<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kamar', function (Blueprint $table) {
            $table->foreignId('tipe_id')->after('nama')->constrained('tipe')->cascadeOnDelete();
            $table->dropColumn(['tipe_kamar', 'cover']);
        });
    }

    public function down(): void
    {
        Schema::table('kamar', function (Blueprint $table) {
            $table->dropForeign(['tipe_id']);
            $table->dropColumn('tipe_id');
            $table->string('tipe_kamar', 50)->after('nama');
            $table->string('cover', 255)->nullable();
        });
    }
};
