<?php

// This migration runs inside each tenant's schema

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Users
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone')->nullable();
            $table->string('avatar')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->string('fcm_token')->nullable();
            $table->string('preferred_language', 5)->default('en');
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip')->nullable();
            $table->rememberToken();
            $table->softDeletes();
            $table->timestamps();
        });

        // Branches
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->json('working_hours')->nullable();
            $table->boolean('is_main')->default(false);
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });

        // Doctors
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->json('specialization')->nullable();
            $table->json('bio')->nullable();
            $table->string('avatar')->nullable();
            $table->string('license_number')->nullable();
            $table->unsignedInteger('years_experience')->default(0);
            $table->decimal('consultation_fee', 10, 2)->default(0);
            $table->unsignedInteger('consultation_duration')->default(30);
            $table->boolean('is_available')->default(true);
            $table->boolean('accepts_online')->default(false);
            $table->boolean('accepts_walk_in')->default(true);
            $table->decimal('rating', 3, 2)->default(0);
            $table->unsignedInteger('total_reviews')->default(0);
            $table->json('meta')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        // Patients
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('patient_code')->unique();
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable();
            $table->string('blood_type')->nullable();
            $table->json('allergies')->nullable();
            $table->json('chronic_conditions')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('insurance_provider')->nullable();
            $table->string('insurance_number')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->text('notes')->nullable();
            $table->json('meta')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        // Services
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->json('description')->nullable();
            $table->string('icon')->nullable();
            $table->string('image')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->unsignedInteger('duration')->default(30);
            $table->string('category')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_online')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // Doctor-Service pivot
        Schema::create('doctor_service', function (Blueprint $table) {
            $table->foreignId('doctor_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->primary(['doctor_id', 'service_id']);
        });

        // Schedules
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedTinyInteger('day_of_week');
            $table->time('start_time');
            $table->time('end_time');
            $table->unsignedInteger('slot_duration')->default(30);
            $table->time('break_start')->nullable();
            $table->time('break_end')->nullable();
            $table->unsignedInteger('max_patients')->default(1);
            $table->boolean('is_active')->default(true);
            $table->date('valid_from')->nullable();
            $table->date('valid_until')->nullable();
            $table->timestamps();
        });

        // Appointments
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('appointment_number')->unique();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('doctor_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('service_id')->nullable()->constrained()->nullOnDelete();
            $table->dateTime('scheduled_at');
            $table->dateTime('ends_at')->nullable();
            $table->unsignedInteger('duration')->default(30);
            $table->string('type')->default('offline');
            $table->string('status')->default('pending');
            $table->text('notes')->nullable();
            $table->text('doctor_notes')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->unsignedBigInteger('cancelled_by')->nullable();
            $table->string('confirmation_code', 8)->nullable();
            $table->timestamp('reminder_sent_at')->nullable();
            $table->timestamp('checked_in_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->decimal('fee', 10, 2)->default(0);
            $table->boolean('is_paid')->default(false);
            $table->string('video_room_url')->nullable();
            $table->json('meta')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['doctor_id', 'scheduled_at']);
            $table->index(['patient_id', 'scheduled_at']);
            $table->index('status');
        });

        // Invoices
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('appointment_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            $table->string('status')->default('draft');
            $table->string('payment_method')->nullable();
            $table->string('payment_gateway')->nullable();
            $table->string('payment_reference')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->date('due_date')->nullable();
            $table->text('notes')->nullable();
            $table->json('items')->nullable();
            $table->timestamps();
        });

        // Website pages
        Schema::create('website_pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->json('json_content')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('og_image')->nullable();
            $table->boolean('is_published')->default(false);
            $table->boolean('is_homepage')->default(false);
            $table->string('page_type')->default('custom');
            $table->unsignedInteger('order')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        // Reviews
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('appointment_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedTinyInteger('rating');
            $table->text('comment')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        // Medical records
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('doctor_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('appointment_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type');         // diagnosis | prescription | lab | imaging
            $table->string('title');
            $table->text('content');
            $table->json('attachments')->nullable();
            $table->date('record_date');
            $table->softDeletes();
            $table->timestamps();
        });

        // Audit logs
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');
            $table->string('model_type')->nullable();
            $table->unsignedBigInteger('model_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            $table->index(['model_type', 'model_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('medical_records');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('website_pages');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('schedules');
        Schema::dropIfExists('doctor_service');
        Schema::dropIfExists('services');
        Schema::dropIfExists('patients');
        Schema::dropIfExists('doctors');
        Schema::dropIfExists('branches');
        Schema::dropIfExists('users');
    }
};
