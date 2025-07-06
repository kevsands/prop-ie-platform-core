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
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('property_id');
            $table->uuid('buyer_id');
            $table->uuid('seller_id')->nullable();
            $table->uuid('agent_id')->nullable();
            $table->uuid('solicitor_id')->nullable();
            $table->enum('status', [
                'ENQUIRY', 'VIEWING_SCHEDULED', 'VIEWED', 'OFFER_MADE', 
                'OFFER_ACCEPTED', 'RESERVED', 'CONTRACTS_EXCHANGED', 
                'MORTGAGE_APPROVED', 'COMPLETION', 'COMPLETED', 'CANCELLED'
            ])->default('ENQUIRY');
            $table->decimal('offer_amount', 12, 2)->nullable();
            $table->decimal('agreed_price', 12, 2)->nullable();
            $table->decimal('deposit_amount', 12, 2)->nullable();
            $table->decimal('mortgage_amount', 12, 2)->nullable();
            $table->json('timeline')->nullable();
            $table->json('documents')->nullable();
            $table->json('payments')->nullable();
            $table->text('notes')->nullable();
            $table->date('target_completion_date')->nullable();
            $table->date('actual_completion_date')->nullable();
            $table->timestamp('offer_made_at')->nullable();
            $table->timestamp('offer_accepted_at')->nullable();
            $table->timestamp('contracts_exchanged_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            
            $table->index(['property_id']);
            $table->index(['buyer_id']);
            $table->index(['status']);
            $table->index(['created_at']);
            
            $table->foreign('property_id')->references('id')->on('properties');
            $table->foreign('buyer_id')->references('id')->on('users');
            $table->foreign('seller_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('agent_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('solicitor_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
