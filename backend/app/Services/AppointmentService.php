<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Schedule;
use App\Enums\AppointmentStatus;
use App\Events\AppointmentBooked;
use App\Events\AppointmentCancelled;
use App\Jobs\SendAppointmentReminder;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AppointmentService
{
    private const SLOT_LOCK_TTL = 120; // 2 minutes in seconds

    public function __construct(
        private readonly NotificationService $notificationService
    ) {}

    /**
     * Get available slots for a doctor on a specific date.
     *
     * @return array<int, array{start: string, end: string, available: bool, locked: bool}>
     */
    public function getAvailableSlots(int $doctorId, string $date): array
    {
        $doctor    = Doctor::with('schedules')->findOrFail($doctorId);
        $dayOfWeek = Carbon::parse($date)->dayOfWeek;

        $schedules = $doctor->schedules()
            ->where('day_of_week', $dayOfWeek)
            ->where('is_active', true)
            ->where(function ($q) use ($date) {
                $q->whereNull('valid_from')->orWhere('valid_from', '<=', $date);
            })
            ->where(function ($q) use ($date) {
                $q->whereNull('valid_until')->orWhere('valid_until', '>=', $date);
            })
            ->get();

        $allSlots = [];
        foreach ($schedules as $schedule) {
            $slots = $schedule->generateSlots($date);
            foreach ($slots as &$slot) {
                $lockKey        = $this->slotLockKey($doctorId, $date, $slot['start']);
                $slot['locked'] = (bool) Redis::exists($lockKey);
                $slot['available'] = $slot['available'] && ! $slot['locked'];
            }
            $allSlots = array_merge($allSlots, $slots);
        }

        return $allSlots;
    }

    /**
     * Lock a slot for 2 minutes during booking flow.
     */
    public function lockSlot(int $doctorId, string $date, string $time, string $sessionId): bool
    {
        $lockKey = $this->slotLockKey($doctorId, $date, $time);
        return (bool) Redis::set($lockKey, $sessionId, 'EX', self::SLOT_LOCK_TTL, 'NX');
    }

    public function releaseSlot(int $doctorId, string $date, string $time): void
    {
        Redis::del($this->slotLockKey($doctorId, $date, $time));
    }

    /**
     * Book an appointment within a database transaction.
     *
     * @param array $data
     * @return Appointment
     * @throws \Exception
     */
    public function book(array $data): Appointment
    {
        return DB::transaction(function () use ($data) {
            $scheduledAt = Carbon::parse("{$data['date']} {$data['time']}");

            // Double-check slot availability (race condition guard)
            $exists = Appointment::where('doctor_id', $data['doctor_id'])
                ->where('scheduled_at', $scheduledAt)
                ->whereNotIn('status', [AppointmentStatus::Cancelled->value])
                ->lockForUpdate()
                ->exists();

            if ($exists) {
                throw new \Exception('This slot is no longer available.', 409);
            }

            $doctor      = Doctor::findOrFail($data['doctor_id']);
            $duration    = $data['duration'] ?? $doctor->consultation_duration ?? 30;
            $fee         = $data['fee']      ?? $doctor->consultation_fee ?? 0;

            $appointment = Appointment::create([
                'patient_id'  => $data['patient_id'],
                'doctor_id'   => $data['doctor_id'],
                'branch_id'   => $data['branch_id']  ?? $doctor->branch_id,
                'service_id'  => $data['service_id'] ?? null,
                'scheduled_at'=> $scheduledAt,
                'ends_at'     => $scheduledAt->copy()->addMinutes($duration),
                'duration'    => $duration,
                'type'        => $data['type'] ?? 'offline',
                'status'      => AppointmentStatus::Pending,
                'notes'       => $data['notes'] ?? null,
                'fee'         => $fee,
            ]);

            // Release slot lock
            $this->releaseSlot($data['doctor_id'], $data['date'], $data['time']);

            // Dispatch notifications
            event(new AppointmentBooked($appointment));

            // Schedule reminder 24h before
            SendAppointmentReminder::dispatch($appointment)
                ->delay($scheduledAt->copy()->subHours(24));

            Log::info('Appointment booked', ['id' => $appointment->id, 'number' => $appointment->appointment_number]);

            return $appointment->load(['doctor.user', 'patient.user', 'branch', 'service']);
        });
    }

    /**
     * Cancel an appointment.
     */
    public function cancel(Appointment $appointment, string $reason, int $cancelledBy): void
    {
        if (! $appointment->canBeCancelled()) {
            throw new \Exception('This appointment cannot be cancelled.', 422);
        }

        DB::transaction(function () use ($appointment, $reason, $cancelledBy) {
            $appointment->update([
                'status'              => AppointmentStatus::Cancelled,
                'cancellation_reason' => $reason,
                'cancelled_by'        => $cancelledBy,
            ]);

            event(new AppointmentCancelled($appointment));
        });
    }

    /**
     * Confirm a pending appointment (doctor/receptionist action).
     */
    public function confirm(Appointment $appointment): void
    {
        if (! $appointment->isPending()) {
            throw new \Exception('Only pending appointments can be confirmed.', 422);
        }

        $appointment->update(['status' => AppointmentStatus::Confirmed]);
        $this->notificationService->sendAppointmentConfirmation($appointment);
    }

    /**
     * Complete an appointment.
     */
    public function complete(Appointment $appointment, array $data = []): void
    {
        $appointment->update([
            'status'       => AppointmentStatus::Completed,
            'completed_at' => now(),
            'doctor_notes' => $data['notes'] ?? null,
        ]);
    }

    private function slotLockKey(int $doctorId, string $date, string $time): string
    {
        return "slot_lock:{$doctorId}:{$date}:{$time}";
    }
}
