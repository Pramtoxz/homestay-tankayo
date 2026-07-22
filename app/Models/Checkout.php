<?php

namespace App\Models;

use Database\Factories\CheckoutFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Checkout extends Model
{
    /** @use HasFactory<CheckoutFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'checkout';

    protected $primaryKey = 'idcheckout';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'idcheckout',
        'idcheckin',
        'tglcheckout',
        'potongan',
        'keterangan',
        'grandtotal',
    ];

    protected function casts(): array
    {
        return [
            'tglcheckout' => 'date:Y-m-d',
        ];
    }

    /**
     * @return BelongsTo<Checkin, $this>
     */
    public function checkin(): BelongsTo
    {
        return $this->belongsTo(Checkin::class, 'idcheckin', 'idcheckin');
    }
}
