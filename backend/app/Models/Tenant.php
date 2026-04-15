<?php

namespace App\Models;

use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains, HasFactory;

    protected $fillable = [
        'id',
        'name',
        'slug',
        'email',
        'phone',
        'logo',
        'address',
        'city',
        'country',
        'timezone',
        'currency',
        'plan_id',
        'is_active',
        'trial_ends_at',
        'subscription_ends_at',
        'settings',
        'theme',
        'custom_css',
    ];

    protected $casts = [
        'settings'             => 'array',
        'is_active'            => 'boolean',
        'trial_ends_at'        => 'datetime',
        'subscription_ends_at' => 'datetime',
    ];

    public static function getCustomColumns(): array
    {
        return [
            'id',
            'name',
            'slug',
            'email',
            'phone',
            'logo',
            'address',
            'city',
            'country',
            'timezone',
            'currency',
            'plan_id',
            'is_active',
            'trial_ends_at',
            'subscription_ends_at',
            'settings',
            'theme',
            'custom_css',
            'created_at',
            'updated_at',
        ];
    }

    public function plan(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function subscriptions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function activeSubscription(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Subscription::class)->where('status', 'active')->latest();
    }

    public function isOnTrial(): bool
    {
        return $this->trial_ends_at !== null && $this->trial_ends_at->isFuture();
    }

    public function hasActiveSubscription(): bool
    {
        return $this->activeSubscription()->exists();
    }

    public function getSettingAttribute(string $key, mixed $default = null): mixed
    {
        return data_get($this->settings, $key, $default);
    }
}
