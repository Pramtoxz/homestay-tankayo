<?php

namespace App\Models;

use Database\Factories\KamarFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
        'tipe_kamar',
        'harga',
        'fasilitas',
        'status_kamar',
        'cover',
        'deskripsi',
    ];

    /**
     * @return HasMany<Reservasi, $this>
     */
    public function reservasi(): HasMany
    {
        return $this->hasMany(Reservasi::class, 'idkamar', 'id_kamar');
    }
}
