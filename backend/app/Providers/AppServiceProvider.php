<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind services as singletons
        $this->app->singleton(\App\Services\TenantService::class);
        $this->app->singleton(\App\Services\AppointmentService::class);
        $this->app->singleton(\App\Services\NotificationService::class);
        $this->app->singleton(\App\Services\WebsiteBuilderService::class);
        $this->app->singleton(\App\Services\BillingService::class);
    }

    public function boot(): void
    {
        //
    }
}
