<?php

namespace App\Events;

use App\Models\Appointment;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppointmentBooked implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public readonly Appointment $appointment) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('clinic.appointments'),
            new PrivateChannel("doctor.{$this->appointment->doctor_id}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'appointment.booked';
    }

    public function broadcastWith(): array
    {
        return [
            'id'              => $this->appointment->id,
            'number'          => $this->appointment->appointment_number,
            'patient'         => $this->appointment->patient->user->name,
            'doctor'          => $this->appointment->doctor->user->name,
            'scheduled_at'    => $this->appointment->scheduled_at->toIso8601String(),
            'status'          => $this->appointment->status,
        ];
    }
}
