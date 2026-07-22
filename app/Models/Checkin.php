<?php

namespace App\Models;

use Database\Factories\CheckinFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Checkin extends Model
{
    /** @use HasFactory<CheckinFactory> */
    use HasFactory, SoftDeletes;

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

    /**
     * @return BelongsTo<Reservasi, $this>
     */
    public function reservasi(): BelongsTo
    {
        return $this->belongsTo(Reservasi::class, 'idbooking', 'idbooking');
    }

    /**
     * @return HasOne<Checkout, $this>
     */
    public function checkout(): HasOne
    {
        return $this->hasOne(Checkout::class, 'idcheckin', 'idcheckin');
    }
}
