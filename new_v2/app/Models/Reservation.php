<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Reservation extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'property_id',
        'buyer_id',
        'transaction_id',
        'status',
        'reservation_fee',
        'deposit_amount',
        'terms_conditions',
        'special_conditions',
        'reservation_date',
        'expiry_date',
        'extension_date',
        'is_legally_binding',
        'contract_reference',
        'documents',
        'notes',
    ];

    protected $casts = [
        'terms_conditions' => 'array',
        'documents' => 'array',
        'reservation_fee' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'reservation_date' => 'date',
        'expiry_date' => 'date',
        'extension_date' => 'date',
        'is_legally_binding' => 'boolean',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function isExpired()
    {
        return $this->expiry_date < now()->toDateString();
    }

    public function getDaysRemainingAttribute()
    {
        if ($this->isExpired()) {
            return 0;
        }
        return now()->diffInDays($this->expiry_date);
    }
}
