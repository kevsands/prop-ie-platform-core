<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class HtbApplication extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'property_id',
        'transaction_id',
        'status',
        'application_reference',
        'property_purchase_price',
        'htb_relief_amount',
        'annual_income',
        'is_first_time_buyer',
        'is_owner_occupier',
        'applicant_details',
        'employment_details',
        'financial_details',
        'property_details',
        'supporting_documents',
        'revenue_responses',
        'notes',
        'application_date',
        'decision_date',
        'claim_date',
    ];

    protected $casts = [
        'property_purchase_price' => 'decimal:2',
        'htb_relief_amount' => 'decimal:2',
        'annual_income' => 'decimal:2',
        'is_first_time_buyer' => 'boolean',
        'is_owner_occupier' => 'boolean',
        'applicant_details' => 'array',
        'employment_details' => 'array',
        'financial_details' => 'array',
        'property_details' => 'array',
        'supporting_documents' => 'array',
        'revenue_responses' => 'array',
        'application_date' => 'date',
        'decision_date' => 'date',
        'claim_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function getStatusBadgeClassAttribute()
    {
        return match($this->status) {
            'DRAFT' => 'bg-secondary',
            'SUBMITTED' => 'bg-primary',
            'UNDER_REVIEW' => 'bg-info',
            'ADDITIONAL_INFO_REQUIRED' => 'bg-warning',
            'APPROVED' => 'bg-success',
            'REJECTED' => 'bg-danger',
            'WITHDRAWN' => 'bg-secondary',
            'CLAIMED' => 'bg-success',
            default => 'bg-secondary'
        };
    }

    public function getFormattedReliefAttribute()
    {
        return '€' . number_format($this->htb_relief_amount, 0);
    }
}
