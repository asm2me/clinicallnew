<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price_monthly',
        'price_yearly',
        'stripe_monthly_price_id',
        'stripe_yearly_price_id',
        'max_doctors',
        'max_patients',
        'max_branches',
        'max_appointments_per_month',
        'has_website_builder',
        'has_custom_domain',
        'has_telemedicine',
        'has_sms',
        'has_whatsapp',
        'has_reports',
        'has_api_access',
        'is_active',
        'features',      // JSON array of feature descriptions
        'sort_order',
    ];

    protected $casts = [
        'price_monthly'             => 'decimal:2',
        'price_yearly'              => 'decimal:2',
        'has_website_builder'       => 'boolean',
        'has_custom_domain'         => 'boolean',
        'has_telemedicine'          => 'boolean',
        'has_sms'                   => 'boolean',
        'has_whatsapp'              => 'boolean',
        'has_reports'               => 'boolean',
        'has_api_access'            => 'boolean',
        'is_active'                 => 'boolean',
        'features'                  => 'array',
    ];

    public function tenants(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Tenant::class);
    }

    public function hasFeature(string $feature): bool
    {
        return (bool) $this->{"has_{$feature}"};
    }
}
