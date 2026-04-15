<?php

namespace App\Http\Controllers\Api\V1\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Repositories\AppointmentRepository;
use App\Services\AppointmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function __construct(
        private readonly AppointmentService    $appointmentService,
        private readonly AppointmentRepository $appointmentRepository
    ) {}

    /**
     * GET /v1/appointments?date=2025-01-15&doctor_id=1&status=pending
     */
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        $query = Appointment::with(['doctor.user', 'patient.user', 'service', 'branch'])
            ->orderByDesc('scheduled_at');

        if ($user->isDoctor()) {
            $query->where('doctor_id', $user->doctor->id);
        } elseif ($user->isPatient()) {
            $query->where('patient_id', $user->patient->id);
        }

        if ($request->date) {
            $query->whereDate('scheduled_at', $request->date);
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->doctor_id) {
            $query->where('doctor_id', $request->doctor_id);
        }

        return response()->json($query->paginate(15));
    }

    /**
     * GET /v1/appointments/slots?doctor_id=1&date=2025-01-15
     */
    public function slots(Request $request): JsonResponse
    {
        $request->validate([
            'doctor_id' => 'required|integer|exists:doctors,id',
            'date'      => 'required|date|after_or_equal:today',
        ]);

        $slots = $this->appointmentService->getAvailableSlots(
            $request->doctor_id,
            $request->date
        );

        return response()->json(['slots' => $slots, 'date' => $request->date]);
    }

    /**
     * POST /v1/appointments/lock-slot
     */
    public function lockSlot(Request $request): JsonResponse
    {
        $request->validate([
            'doctor_id' => 'required|integer|exists:doctors,id',
            'date'      => 'required|date|after_or_equal:today',
            'time'      => 'required|date_format:H:i',
        ]);

        $locked = $this->appointmentService->lockSlot(
            $request->doctor_id,
            $request->date,
            $request->time,
            session()->getId()
        );

        if (! $locked) {
            return response()->json(['message' => 'Slot is already locked by another user.'], 409);
        }

        return response()->json([
            'message'      => 'Slot locked for 2 minutes.',
            'lock_expires' => now()->addSeconds(120)->toIso8601String(),
        ]);
    }

    /**
     * POST /v1/appointments
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'doctor_id'  => 'required|integer|exists:doctors,id',
            'date'       => 'required|date|after_or_equal:today',
            'time'       => 'required|date_format:H:i',
            'type'       => 'required|in:online,offline',
            'service_id' => 'nullable|integer|exists:services,id',
            'notes'      => 'nullable|string|max:1000',
        ]);

        $patient = auth()->user()->patient;
        if (! $patient) {
            return response()->json(['message' => 'Patient profile not found.'], 404);
        }

        try {
            $appointment = $this->appointmentService->book(array_merge(
                $request->only(['doctor_id', 'date', 'time', 'type', 'service_id', 'notes']),
                ['patient_id' => $patient->id]
            ));
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 422);
        }

        return response()->json(['appointment' => $appointment], 201);
    }

    /**
     * GET /v1/appointments/{id}
     */
    public function show(int $id): JsonResponse
    {
        $appointment = Appointment::with(['doctor.user', 'patient.user', 'service', 'branch', 'invoice'])
            ->findOrFail($id);

        $this->authorizeAppointmentAccess($appointment);

        return response()->json(['appointment' => $appointment]);
    }

    /**
     * PUT /v1/appointments/{id}/confirm
     */
    public function confirm(int $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        $this->appointmentService->confirm($appointment);
        return response()->json(['message' => 'Appointment confirmed.', 'appointment' => $appointment->fresh()]);
    }

    /**
     * PUT /v1/appointments/{id}/cancel
     */
    public function cancel(Request $request, int $id): JsonResponse
    {
        $request->validate(['reason' => 'required|string|max:500']);

        $appointment = Appointment::findOrFail($id);
        $this->authorizeAppointmentAccess($appointment);

        try {
            $this->appointmentService->cancel($appointment, $request->reason, auth()->id());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['message' => 'Appointment cancelled.']);
    }

    /**
     * PUT /v1/appointments/{id}/complete
     */
    public function complete(Request $request, int $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        $this->appointmentService->complete($appointment, $request->only('notes'));
        return response()->json(['message' => 'Appointment completed.', 'appointment' => $appointment->fresh()]);
    }

    /**
     * GET /v1/appointments/today
     */
    public function today(): JsonResponse
    {
        return response()->json($this->appointmentRepository->getTodayAppointments());
    }

    /**
     * GET /v1/appointments/stats?start=2025-01-01&end=2025-01-31
     */
    public function stats(Request $request): JsonResponse
    {
        $request->validate([
            'start' => 'required|date',
            'end'   => 'required|date|after_or_equal:start',
        ]);

        $stats = $this->appointmentRepository->getDashboardStats($request->start, $request->end);
        return response()->json(['stats' => $stats]);
    }

    private function authorizeAppointmentAccess(Appointment $appointment): void
    {
        $user = auth()->user();
        if ($user->isPatient() && $appointment->patient_id !== $user->patient?->id) {
            abort(403, 'Unauthorized');
        }
        if ($user->isDoctor() && $appointment->doctor_id !== $user->doctor?->id) {
            abort(403, 'Unauthorized');
        }
    }
}
