<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Location extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'address',
        'address_line1',
        'address_line2',
        'city',
        'county',
        'eircode',
        'country',
        'longitude',
        'latitude',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function developments()
    {
        return $this->hasMany(Development::class);
    }

    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function getFullAddressAttribute()
    {
        return trim($this->address_line1 . ', ' . $this->city . ', ' . $this->county);
    }
}
