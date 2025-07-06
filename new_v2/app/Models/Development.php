<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Development extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'slug',
        'developer_id',
        'location_id',
        'status',
        'total_units',
        'available_units',
        'reserved_units',
        'sold_units',
        'start_date',
        'completion_date',
        'planning_submission_date',
        'planning_decision_date',
        'construction_start_date',
        'construction_end_date',
        'marketing_launch_date',
        'sales_launch_date',
        'main_image',
        'images',
        'videos',
        'site_plan_url',
        'brochure_url',
        'virtual_tour_url',
        'website_url',
        'description',
        'short_description',
        'features',
        'amenities',
        'building_specs',
        'marketing_status',
        'sales_status',
        'construction_status',
        'compliance_status',
        'building_type',
        'tags',
        'awards',
        'is_published',
        'published_date',
    ];

    protected $casts = [
        'images' => 'array',
        'videos' => 'array',
        'features' => 'array',
        'amenities' => 'array',
        'building_specs' => 'array',
        'marketing_status' => 'array',
        'sales_status' => 'array',
        'construction_status' => 'array',
        'compliance_status' => 'array',
        'tags' => 'array',
        'awards' => 'array',
        'is_published' => 'boolean',
        'start_date' => 'date',
        'completion_date' => 'date',
        'planning_submission_date' => 'date',
        'planning_decision_date' => 'date',
        'construction_start_date' => 'date',
        'construction_end_date' => 'date',
        'marketing_launch_date' => 'date',
        'sales_launch_date' => 'date',
        'published_date' => 'datetime',
    ];

    public function developer()
    {
        return $this->belongsTo(User::class, 'developer_id');
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
