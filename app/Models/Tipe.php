<?php

namespace App\Models;

use Database\Factories\TipeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tipe extends Model
{
    /** @use HasFactory<TipeFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'tipe';

    protected $fillable = [
        'nama_tipe',
        'foto',
        'aktif',
    ];

    protected $casts = [
        'aktif' => 'boolean',
    ];

    /**
     * @return HasMany<Kamar, $this>
     */
    public function kamar(): HasMany
    {
        return $this->hasMany(Kamar::class, 'tipe_id');
    }
}
