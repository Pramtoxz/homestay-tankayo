<?php

namespace App\Models;

use Database\Factories\TamuFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tamu extends Model
{
    /** @use HasFactory<TamuFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'tamu';

    protected $primaryKey = 'nik';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'nik',
        'nama',
        'alamat',
        'nohp',
        'jk',
    ];

    /**
     * @return HasMany<Reservasi, $this>
     */
    public function reservasi(): HasMany
    {
        return $this->hasMany(Reservasi::class, 'nik', 'nik');
    }
}
