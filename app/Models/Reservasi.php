<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservasi extends Model
{
    use SoftDeletes;

    protected $table = 'reservasi';
    protected $primaryKey = 'idbooking';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'idbooking',
        'nik',
        'idkamar',
        'tglcheckin',
        'tglcheckout',
        'totalbayar',
        'tipe',
        'buktibayar',
        'online',
        'status',
        'batas_waktu',
    ];

    protected function casts(): array
    {
        return [
            'tglcheckin' => 'date',
            'tglcheckout' => 'date',
            'batas_waktu' => 'datetime',
            'online' => 'boolean',
        ];
    }

    public function tamu(): BelongsTo
    {
        return $this->belongsTo(Tamu::class, 'nik', 'nik');
    }

    public function kamar(): BelongsTo
    {
        return $this->belongsTo(Kamar::class, 'idkamar', 'id_kamar');
    }

    public function checkin(): HasOne
    {
        return $this->hasOne(Checkin::class, 'idbooking', 'idbooking');
    }
}
