<?php

return [
    'name'            => env('APP_NAME', 'Clinic SaaS Platform'),
    'env'             => env('APP_ENV', 'production'),
    'debug'           => (bool) env('APP_DEBUG', false),
    'url'             => env('APP_URL', 'http://localhost'),
    'timezone'        => env('APP_TIMEZONE', 'UTC'),
    'locale'          => env('APP_LOCALE', 'en'),
    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),
    'faker_locale'    => env('APP_FAKER_LOCALE', 'en_US'),
    'cipher'          => 'AES-256-CBC',
    'key'             => env('APP_KEY'),
    'central_domain'  => env('CENTRAL_DOMAIN', 'localhost'),

    'maintenance' => [
        'driver' => 'file',
    ],

    'providers' => \Illuminate\Support\ServiceProvider::defaultProviders()->merge([
        App\Providers\AppServiceProvider::class,
        App\Providers\AuthServiceProvider::class,
        App\Providers\EventServiceProvider::class,

        // Tenancy
        Stancl\Tenancy\TenancyServiceProvider::class,

        // Permissions
        Spatie\Permission\PermissionServiceProvider::class,

        // Activity log
        Spatie\Activitylog\ActivitylogServiceProvider::class,
    ])->toArray(),

    'aliases' => \Illuminate\Support\Facades\Facade::defaultAliases()->merge([
        'Tenant' => Stancl\Tenancy\Facades\Tenancy::class,
    ])->toArray(),
];
