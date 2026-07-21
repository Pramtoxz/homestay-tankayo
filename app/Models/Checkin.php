<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Checkin extends Model
{
    use SoftDeletes;

    protected $table = 'checkin';
    protected $primaryKey = 'idcheckin';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'idcheckin',
        'idbooking',
        'sisabayar',
        'deposit',
    ];

    public function reservasi(): BelongsTo
    {
        return $this->belongsTo(Reservasi::class, 'idbooking', 'idbooking');
    }

    public function checkout(): HasOne
    {
        return $this->hasOne(Checkout::class, 'idcheckin', 'idcheckin');
    }
}
