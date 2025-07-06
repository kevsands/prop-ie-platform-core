<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('unit_id')->nullable();
            $table->uuid('development_id')->nullable();
            $table->uuid('location_id');
            $table->string('property_type');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('short_description', 500)->nullable();
            $table->integer('bedrooms');
            $table->integer('bathrooms');
            $table->decimal('floor_area_sqm', 8, 2);
            $table->decimal('floor_area_sqft', 8, 2)->nullable();
            $table->decimal('price', 12, 2);
            $table->decimal('price_per_sqm', 8, 2)->nullable();
            $table->enum('status', ['AVAILABLE', 'RESERVED', 'SOLD', 'UNDER_OFFER', 'WITHDRAWN']);
            $table->string('ber_rating', 10)->nullable();
            $table->integer('year_built')->nullable();
            $table->boolean('is_new_build')->default(false);
            $table->json('features')->nullable();
            $table->json('amenities')->nullable();
            $table->string('main_image', 500)->nullable();
            $table->json('images')->nullable();
            $table->json('floor_plans')->nullable();
            $table->string('virtual_tour_url', 500)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->integer('view_count')->default(0);
            $table->integer('inquiry_count')->default(0);
            $table->timestamps();
            
            $table->index(['location_id']);
            $table->index(['property_type']);
            $table->index(['status']);
            $table->index(['price']);
            $table->index(['bedrooms']);
            $table->index(['is_published']);
            $table->index(['is_featured']);
            $table->index(['development_id']);
            
            $table->foreign('unit_id')->references('id')->on('units')->onDelete('set null');
            $table->foreign('development_id')->references('id')->on('developments')->onDelete('set null');
            $table->foreign('location_id')->references('id')->on('locations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
