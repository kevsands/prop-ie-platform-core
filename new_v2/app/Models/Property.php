<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Property extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'unit_id',
        'development_id',
        'location_id',
        'property_type',
        'title',
        'slug',
        'description',
        'short_description',
        'bedrooms',
        'bathrooms',
        'floor_area_sqm',
        'floor_area_sqft',
        'price',
        'price_per_sqm',
        'status',
        'ber_rating',
        'year_built',
        'is_new_build',
        'features',
        'amenities',
        'main_image',
        'images',
        'floor_plans',
        'virtual_tour_url',
        'is_featured',
        'is_published',
        'published_at',
        'view_count',
        'inquiry_count',
    ];

    protected $casts = [
        'features' => 'array',
        'amenities' => 'array',
        'images' => 'array',
        'floor_plans' => 'array',
        'is_new_build' => 'boolean',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'price' => 'decimal:2',
        'price_per_sqm' => 'decimal:2',
        'floor_area_sqm' => 'decimal:2',
        'floor_area_sqft' => 'decimal:2',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function development()
    {
        return $this->belongsTo(Development::class);
    }

    public function getFormattedPriceAttribute()
    {
        return '€' . number_format($this->price, 0);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
