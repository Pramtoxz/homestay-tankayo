<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Checkout extends Model
{
    use SoftDeletes;

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
            'tglcheckout' => 'date',
        ];
    }

    public function checkin(): BelongsTo
    {
        return $this->belongsTo(Checkin::class, 'idcheckin', 'idcheckin');
    }
}
