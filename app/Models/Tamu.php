<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tamu extends Model
{
    use SoftDeletes;

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
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reservasi(): HasMany
    {
        return $this->hasMany(Reservasi::class, 'nik', 'nik');
    }
}
