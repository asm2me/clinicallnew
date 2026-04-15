<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        \App\Events\AppointmentBooked::class => [
            // listeners registered here
        ],
        \App\Events\AppointmentCancelled::class => [
            // listeners registered here
        ],
    ];

    public function boot(): void
    {
        //
    }
}
