<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Branch extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'address',
        'city',
        'country',
        'phone',
        'email',
        'latitude',
        'longitude',
        'working_hours',
        'is_main',
        'is_active',
    ];

    protected $casts = [
        'working_hours' => 'array',
        'is_main'       => 'boolean',
        'is_active'     => 'boolean',
        'latitude'      => 'decimal:8',
        'longitude'     => 'decimal:8',
    ];

    public function doctors(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Doctor::class);
    }

    public function appointments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}
