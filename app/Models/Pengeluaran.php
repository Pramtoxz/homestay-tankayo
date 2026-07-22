<?php

namespace App\Models;

use Database\Factories\PengeluaranFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pengeluaran extends Model
{
    /** @use HasFactory<PengeluaranFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'pengeluaran';

    protected $fillable = [
        'tgl',
        'keterangan',
        'total',
    ];

    protected function casts(): array
    {
        return [
            'tgl' => 'date:Y-m-d',
        ];
    }
}
