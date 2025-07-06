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
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->unique();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('phone', 20)->nullable();
            $table->string('password')->nullable(); // Nullable for social auth
            $table->enum('status', ['PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE'])->default('ACTIVE');
            $table->enum('kyc_status', ['NOT_STARTED', 'IN_PROGRESS', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'])->default('NOT_STARTED');
            $table->string('organization')->nullable();
            $table->string('position')->nullable();
            $table->string('avatar', 500)->nullable();
            $table->json('preferences')->nullable();
            $table->uuid('location_id')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('last_active')->useCurrent();
            $table->timestamp('last_login')->nullable();
            $table->rememberToken();
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['email']);
            $table->index(['status']);
            $table->index(['kyc_status']);
            $table->index(['created_at']);
            $table->index(['location_id']);
            
            // Foreign key constraint will be added in a separate migration after locations table is created
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
