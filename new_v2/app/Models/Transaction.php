<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Transaction extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'property_id',
        'buyer_id',
        'seller_id',
        'agent_id',
        'solicitor_id',
        'status',
        'offer_amount',
        'agreed_price',
        'deposit_amount',
        'mortgage_amount',
        'timeline',
        'documents',
        'payments',
        'notes',
        'target_completion_date',
        'actual_completion_date',
        'offer_made_at',
        'offer_accepted_at',
        'contracts_exchanged_at',
        'completed_at',
    ];

    protected $casts = [
        'timeline' => 'array',
        'documents' => 'array',
        'payments' => 'array',
        'offer_amount' => 'decimal:2',
        'agreed_price' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'mortgage_amount' => 'decimal:2',
        'target_completion_date' => 'date',
        'actual_completion_date' => 'date',
        'offer_made_at' => 'datetime',
        'offer_accepted_at' => 'datetime',
        'contracts_exchanged_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function solicitor()
    {
        return $this->belongsTo(User::class, 'solicitor_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function htbApplications()
    {
        return $this->hasMany(HtbApplication::class);
    }

    public function getStatusBadgeClassAttribute()
    {
        return match($this->status) {
            'ENQUIRY' => 'bg-info',
            'VIEWING_SCHEDULED', 'VIEWED' => 'bg-primary',
            'OFFER_MADE' => 'bg-warning',
            'OFFER_ACCEPTED', 'RESERVED' => 'bg-success',
            'CONTRACTS_EXCHANGED', 'MORTGAGE_APPROVED' => 'bg-info',
            'COMPLETION', 'COMPLETED' => 'bg-success',
            'CANCELLED' => 'bg-danger',
            default => 'bg-secondary'
        };
    }
}
