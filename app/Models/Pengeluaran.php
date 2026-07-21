<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pengeluaran extends Model
{
    use SoftDeletes;

    protected $table = 'pengeluaran';

    protected $fillable = [
        'tgl',
        'keterangan',
        'total',
    ];

    protected function casts(): array
    {
        return [
            'tgl' => 'date',
        ];
    }
}
