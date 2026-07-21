<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kamar extends Model
{
    use SoftDeletes;

    protected $table = 'kamar';
    protected $primaryKey = 'id_kamar';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id_kamar',
        'nama',
        'harga',
        'dp',
        'status_kamar',
        'cover',
        'deskripsi',
    ];

    public function reservasi(): HasMany
    {
        return $this->hasMany(Reservasi::class, 'idkamar', 'id_kamar');
    }
}
