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
        Schema::create('developments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique()->nullable();
            $table->uuid('developer_id');
            $table->uuid('location_id');
            $table->enum('status', [
                'PLANNING', 'APPROVED', 'PRE_CONSTRUCTION', 'CONSTRUCTION',
                'UNDER_CONSTRUCTION', 'READY', 'LAUNCHED', 'MARKETING',
                'SALES', 'SELLING', 'HANDOVER', 'SOLD_OUT', 'COMPLETED'
            ]);
            
            // Unit counts
            $table->integer('total_units')->default(0);
            $table->integer('available_units')->default(0);
            $table->integer('reserved_units')->default(0);
            $table->integer('sold_units')->default(0);
            
            // Timeline dates
            $table->date('start_date')->nullable();
            $table->date('completion_date')->nullable();
            $table->date('planning_submission_date')->nullable();
            $table->date('planning_decision_date')->nullable();
            $table->date('construction_start_date')->nullable();
            $table->date('construction_end_date')->nullable();
            $table->date('marketing_launch_date')->nullable();
            $table->date('sales_launch_date')->nullable();
            
            // Media URLs
            $table->string('main_image', 500)->nullable();
            $table->json('images')->nullable();
            $table->json('videos')->nullable();
            $table->string('site_plan_url', 500)->nullable();
            $table->string('brochure_url', 500)->nullable();
            $table->string('virtual_tour_url', 500)->nullable();
            $table->string('website_url', 500)->nullable();
            
            // Content
            $table->text('description');
            $table->string('short_description', 500)->nullable();
            $table->json('features')->nullable();
            $table->json('amenities')->nullable();
            $table->json('building_specs')->nullable();
            
            // Status tracking (JSON columns for flexibility)
            $table->json('marketing_status')->nullable();
            $table->json('sales_status')->nullable();
            $table->json('construction_status')->nullable();
            $table->json('compliance_status')->nullable();
            
            // Metadata
            $table->string('building_type', 100)->nullable();
            $table->json('tags')->nullable();
            $table->json('awards')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_date')->nullable();
            
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['developer_id']);
            $table->index(['location_id']);
            $table->index(['status']);
            $table->index(['slug']);
            $table->index(['is_published']);
            $table->index(['completion_date']);
            
            // Foreign keys
            $table->foreign('developer_id')->references('id')->on('users');
            $table->foreign('location_id')->references('id')->on('locations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('developments');
    }
};
