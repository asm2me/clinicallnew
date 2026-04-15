<?php

namespace App\Events;

use App\Models\Appointment;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppointmentCancelled implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public readonly Appointment $appointment) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('clinic.appointments'),
            new PrivateChannel("patient.{$this->appointment->patient_id}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'appointment.cancelled';
    }
}
