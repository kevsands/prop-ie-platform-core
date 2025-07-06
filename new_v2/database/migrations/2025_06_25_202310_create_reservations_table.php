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
        Schema::create('reservations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('property_id');
            $table->uuid('buyer_id');
            $table->uuid('transaction_id')->nullable();
            $table->enum('status', ['ACTIVE', 'EXPIRED', 'CONVERTED', 'CANCELLED'])->default('ACTIVE');
            $table->decimal('reservation_fee', 10, 2);
            $table->decimal('deposit_amount', 12, 2)->nullable();
            $table->json('terms_conditions')->nullable();
            $table->text('special_conditions')->nullable();
            $table->date('reservation_date');
            $table->date('expiry_date');
            $table->date('extension_date')->nullable();
            $table->boolean('is_legally_binding')->default(false);
            $table->string('contract_reference', 100)->nullable();
            $table->json('documents')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['property_id']);
            $table->index(['buyer_id']);
            $table->index(['status']);
            $table->index(['reservation_date']);
            $table->index(['expiry_date']);
            
            $table->foreign('property_id')->references('id')->on('properties');
            $table->foreign('buyer_id')->references('id')->on('users');
            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
