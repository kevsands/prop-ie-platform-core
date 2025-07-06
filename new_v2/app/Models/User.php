<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'email',
        'first_name',
        'last_name',
        'phone',
        'password',
        'status',
        'kyc_status',
        'organization',
        'position',
        'avatar',
        'preferences',
        'location_id',
        'metadata',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'preferences' => 'array',
        'metadata' => 'array',
        'last_active' => 'datetime',
        'last_login' => 'datetime',
    ];

    // Relationships
    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function roles()
    {
        return $this->hasMany(UserRole::class);
    }

    public function developments()
    {
        return $this->hasMany(Development::class, 'developer_id');
    }

    // Helper methods
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function hasRole($role)
    {
        return $this->roles()->where('role', $role)->exists();
    }

    public function getRoles()
    {
        return $this->roles()->pluck('role')->toArray();
    }

    public function isDeveloper()
    {
        return $this->hasRole('DEVELOPER');
    }

    public function isBuyer()
    {
        return $this->hasRole('BUYER');
    }

    public function isAdmin()
    {
        return $this->hasRole('ADMIN');
    }
}
