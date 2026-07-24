<?php

namespace App\Models;

use Database\Factories\KamarFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kamar extends Model
{
    /** @use HasFactory<KamarFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'kamar';

    protected $primaryKey = 'id_kamar';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id_kamar',
        'nama',
        'tipe_id',
        'harga',
        'fasilitas',
        'status_kamar',
        'deskripsi',
    ];

    /**
     * @return BelongsTo<Tipe, $this>
     */
    public function tipe(): BelongsTo
    {
        return $this->belongsTo(Tipe::class, 'tipe_id');
    }

    /**
     * @return HasMany<Reservasi, $this>
     */
    public function reservasi(): HasMany
    {
        return $this->hasMany(Reservasi::class, 'idkamar', 'id_kamar');
    }
}
