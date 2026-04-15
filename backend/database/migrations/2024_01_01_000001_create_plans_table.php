<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price_monthly', 10, 2)->default(0);
            $table->decimal('price_yearly', 10, 2)->default(0);
            $table->string('stripe_monthly_price_id')->nullable();
            $table->string('stripe_yearly_price_id')->nullable();
            $table->unsignedInteger('max_doctors')->default(2);
            $table->unsignedInteger('max_patients')->default(100);
            $table->unsignedInteger('max_branches')->default(1);
            $table->unsignedInteger('max_appointments_per_month')->default(100);
            $table->boolean('has_website_builder')->default(false);
            $table->boolean('has_custom_domain')->default(false);
            $table->boolean('has_telemedicine')->default(false);
            $table->boolean('has_sms')->default(false);
            $table->boolean('has_whatsapp')->default(false);
            $table->boolean('has_reports')->default(false);
            $table->boolean('has_api_access')->default(false);
            $table->boolean('is_active')->default(true);
            $table->json('features')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
