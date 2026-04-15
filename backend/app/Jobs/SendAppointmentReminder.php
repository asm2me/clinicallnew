<?php

namespace App\Jobs;

use App\Models\Appointment;
use App\Services\NotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendAppointmentReminder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(public readonly Appointment $appointment) {}

    public function handle(NotificationService $notificationService): void
    {
        // Don't send if appointment was cancelled
        if ($this->appointment->fresh()->status->value === 'cancelled') {
            Log::info("Skipped reminder for cancelled appointment: {$this->appointment->id}");
            return;
        }

        $notificationService->sendAppointmentReminder($this->appointment);
        $this->appointment->update(['reminder_sent_at' => now()]);
    }
}
