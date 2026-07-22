<?php

namespace App\Models;

use Database\Factories\ReservasiFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservasi extends Model
{
    /** @use HasFactory<ReservasiFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'reservasi';

    protected $primaryKey = 'idbooking';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'idbooking',
        'nik',
        'idkamar',
        'user_id',
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
            'tglcheckin' => 'date:Y-m-d',
            'tglcheckout' => 'date:Y-m-d',
            'batas_waktu' => 'datetime',
            'online' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Tamu, $this>
     */
    public function tamu(): BelongsTo
    {
        return $this->belongsTo(Tamu::class, 'nik', 'nik');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Kamar, $this>
     */
    public function kamar(): BelongsTo
    {
        return $this->belongsTo(Kamar::class, 'idkamar', 'id_kamar');
    }

    /**
     * @return HasOne<Checkin, $this>
     */
    public function checkin(): HasOne
    {
        return $this->hasOne(Checkin::class, 'idbooking', 'idbooking');
    }
}
