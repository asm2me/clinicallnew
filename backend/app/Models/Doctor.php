<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\Translatable\HasTranslations;

class Doctor extends Model
{
    use HasFactory, SoftDeletes, HasSlug, HasTranslations;

    public array $translatable = ['bio', 'specialization'];

    protected $fillable = [
        'user_id',
        'branch_id',
        'name',
        'slug',
        'specialization',
        'bio',
        'avatar',
        'license_number',
        'years_experience',
        'consultation_fee',
        'consultation_duration', // minutes
        'is_available',
        'accepts_online',
        'accepts_walk_in',
        'rating',
        'total_reviews',
        'meta',
    ];

    protected $casts = [
        'is_available'   => 'boolean',
        'accepts_online' => 'boolean',
        'accepts_walk_in'=> 'boolean',
        'meta'           => 'array',
        'consultation_fee' => 'decimal:2',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function branch(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function schedules(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function appointments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function services(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'doctor_service');
    }

    public function reviews(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function availableSlots(string $date): array
    {
        return $this->schedules()
            ->where('day_of_week', now()->parse($date)->dayOfWeek)
            ->get()
            ->flatMap(fn($schedule) => $schedule->generateSlots($date))
            ->toArray();
    }
}
