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
        Schema::create('htb_applications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('property_id')->nullable();
            $table->uuid('transaction_id')->nullable();
            $table->enum('status', [
                'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_INFO_REQUIRED',
                'APPROVED', 'REJECTED', 'WITHDRAWN', 'CLAIMED'
            ])->default('DRAFT');
            $table->string('application_reference', 50)->unique()->nullable();
            $table->decimal('property_purchase_price', 12, 2)->nullable();
            $table->decimal('htb_relief_amount', 10, 2)->nullable();
            $table->decimal('annual_income', 10, 2);
            $table->boolean('is_first_time_buyer')->default(true);
            $table->boolean('is_owner_occupier')->default(true);
            $table->json('applicant_details');
            $table->json('employment_details');
            $table->json('financial_details');
            $table->json('property_details')->nullable();
            $table->json('supporting_documents')->nullable();
            $table->json('revenue_responses')->nullable();
            $table->text('notes')->nullable();
            $table->date('application_date');
            $table->date('decision_date')->nullable();
            $table->date('claim_date')->nullable();
            $table->timestamps();
            
            $table->index(['user_id']);
            $table->index(['property_id']);
            $table->index(['status']);
            $table->index(['application_date']);
            $table->index(['application_reference']);
            
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('property_id')->references('id')->on('properties')->onDelete('set null');
            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('htb_applications');
    }
};
