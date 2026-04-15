<?php

namespace App\Repositories;

use App\Models\Appointment;
use Illuminate\Pagination\LengthAwarePaginator;
use Carbon\Carbon;

class AppointmentRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Appointment());
    }

    public function getForDoctor(int $doctorId, ?string $date = null): LengthAwarePaginator
    {
        $query = $this->query()
            ->where('doctor_id', $doctorId)
            ->with(['patient.user', 'service', 'branch'])
            ->orderBy('scheduled_at');

        if ($date) {
            $query->whereDate('scheduled_at', $date);
        }

        return $query->paginate(20);
    }

    public function getForPatient(int $patientId): LengthAwarePaginator
    {
        return $this->query()
            ->where('patient_id', $patientId)
            ->with(['doctor.user', 'service', 'branch'])
            ->orderByDesc('scheduled_at')
            ->paginate(15);
    }

    public function getDashboardStats(string $startDate, string $endDate): array
    {
        $base = $this->query()
            ->whereBetween('scheduled_at', [$startDate, $endDate]);

        return [
            'total'     => (clone $base)->count(),
            'pending'   => (clone $base)->where('status', 'pending')->count(),
            'confirmed' => (clone $base)->where('status', 'confirmed')->count(),
            'completed' => (clone $base)->where('status', 'completed')->count(),
            'cancelled' => (clone $base)->where('status', 'cancelled')->count(),
            'revenue'   => (clone $base)->where('is_paid', true)->sum('fee'),
        ];
    }

    public function getTodayAppointments(): LengthAwarePaginator
    {
        return $this->query()
            ->today()
            ->with(['doctor.user', 'patient.user', 'service'])
            ->orderBy('scheduled_at')
            ->paginate(50);
    }

    public function getUpcomingForDoctor(int $doctorId, int $limit = 5): \Illuminate\Database\Eloquent\Collection
    {
        return $this->query()
            ->where('doctor_id', $doctorId)
            ->upcoming()
            ->with(['patient.user', 'service'])
            ->limit($limit)
            ->get();
    }
}
