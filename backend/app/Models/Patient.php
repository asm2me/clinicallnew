<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'patient_code',
        'date_of_birth',
        'gender',
        'blood_type',
        'allergies',
        'chronic_conditions',
        'emergency_contact_name',
        'emergency_contact_phone',
        'insurance_provider',
        'insurance_number',
        'address',
        'city',
        'country',
        'notes',
        'meta',
    ];

    protected $casts = [
        'date_of_birth'       => 'date',
        'allergies'           => 'array',
        'chronic_conditions'  => 'array',
        'meta'                => 'array',
    ];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function (Patient $patient) {
            $patient->patient_code = 'PAT-' . strtoupper(uniqid());
        });
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function appointments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function medicalRecords(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(MedicalRecord::class);
    }

    public function invoices(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function getAgeAttribute(): int
    {
        return $this->date_of_birth->age;
    }
}
