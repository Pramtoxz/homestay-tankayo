<?php

namespace App\Models;

use Database\Factories\RekeningFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rekening extends Model
{
    /** @use HasFactory<RekeningFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'rekening';

    protected $fillable = [
        'jenis',
        'nama',
        'nomor',
        'foto',
        'aktif',
    ];

    protected $casts = [
        'aktif' => 'boolean',
    ];
}
