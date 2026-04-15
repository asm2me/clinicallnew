<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Service extends Model
{
    use HasFactory, HasTranslations;

    public array $translatable = ['name', 'description'];

    protected $fillable = [
        'name',
        'description',
        'icon',
        'image',
        'price',
        'duration',    // minutes
        'category',
        'is_active',
        'is_online',
        'sort_order',
    ];

    protected $casts = [
        'price'     => 'decimal:2',
        'is_active' => 'boolean',
        'is_online' => 'boolean',
    ];

    public function doctors(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Doctor::class, 'doctor_service');
    }

    public function appointments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}
