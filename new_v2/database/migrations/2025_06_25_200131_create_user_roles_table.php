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
        Schema::create('user_roles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->enum('role', [
                'DEVELOPER', 'BUYER', 'INVESTOR', 'ARCHITECT', 'ENGINEER',
                'QUANTITY_SURVEYOR', 'LEGAL', 'PROJECT_MANAGER', 'AGENT',
                'SOLICITOR', 'CONTRACTOR', 'ADMIN'
            ]);
            $table->timestamp('assigned_at')->useCurrent();
            $table->uuid('assigned_by')->nullable();
            
            // Unique constraint - one role per user
            $table->unique(['user_id', 'role']);
            
            // Indexes
            $table->index(['user_id']);
            $table->index(['role']);
            
            // Foreign keys
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('assigned_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_roles');
    }
};
