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
        Schema::create('units', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('development_id');
            $table->string('unit_number', 50);
            $table->string('unit_type');
            $table->integer('bedrooms');
            $table->integer('bathrooms');
            $table->decimal('floor_area_sqm', 8, 2);
            $table->decimal('floor_area_sqft', 8, 2)->nullable();
            $table->integer('floor_number')->nullable();
            $table->enum('status', ['AVAILABLE', 'RESERVED', 'SOLD', 'UNDER_CONSTRUCTION', 'COMPLETED']);
            $table->decimal('base_price', 12, 2);
            $table->decimal('current_price', 12, 2);
            $table->decimal('customization_cost', 12, 2)->default(0);
            $table->json('features')->nullable();
            $table->json('customizations')->nullable();
            $table->string('floor_plan_url', 500)->nullable();
            $table->json('images')->nullable();
            $table->json('virtual_tour_urls')->nullable();
            $table->enum('orientation', ['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTHEAST', 'NORTHWEST', 'SOUTHEAST', 'SOUTHWEST'])->nullable();
            $table->boolean('is_corner_unit')->default(false);
            $table->boolean('has_balcony')->default(false);
            $table->boolean('has_garden')->default(false);
            $table->boolean('has_parking')->default(false);
            $table->integer('parking_spaces')->default(0);
            $table->text('description')->nullable();
            $table->timestamps();
            
            $table->index(['development_id']);
            $table->index(['status']);
            $table->index(['unit_type']);
            $table->index(['bedrooms']);
            $table->index(['current_price']);
            
            $table->foreign('development_id')->references('id')->on('developments');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
