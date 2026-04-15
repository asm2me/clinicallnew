<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\AppointmentStatus;
use App\Enums\AppointmentType;

class Appointment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'appointment_number',
        'patient_id',
        'doctor_id',
        'branch_id',
        'service_id',
        'scheduled_at',
        'ends_at',
        'duration',        // minutes
        'type',            // online | offline
        'status',          // pending | confirmed | completed | cancelled | no_show
        'notes',
        'doctor_notes',
        'cancellation_reason',
        'cancelled_by',
        'confirmation_code',
        'reminder_sent_at',
        'checked_in_at',
        'completed_at',
        'fee',
        'is_paid',
        'video_room_url',
        'meta',
    ];

    protected $casts = [
        'scheduled_at'     => 'datetime',
        'ends_at'          => 'datetime',
        'reminder_sent_at' => 'datetime',
        'checked_in_at'    => 'datetime',
        'completed_at'     => 'datetime',
        'is_paid'          => 'boolean',
        'meta'             => 'array',
        'fee'              => 'decimal:2',
        'status'           => AppointmentStatus::class,
        'type'             => AppointmentType::class,
    ];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function (Appointment $appointment) {
            $appointment->appointment_number = 'APT-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
            $appointment->confirmation_code  = strtoupper(substr(md5(uniqid()), 0, 8));
        });
    }

    // Relationships
    public function patient(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function branch(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function service(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function invoice(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', AppointmentStatus::Pending);
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', AppointmentStatus::Confirmed);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('scheduled_at', today());
    }

    public function scopeUpcoming($query)
    {
        return $query->where('scheduled_at', '>', now())
            ->where('status', '!=', AppointmentStatus::Cancelled);
    }

    public function isPending(): bool
    {
        return $this->status === AppointmentStatus::Pending;
    }

    public function isConfirmed(): bool
    {
        return $this->status === AppointmentStatus::Confirmed;
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->status, [AppointmentStatus::Pending, AppointmentStatus::Confirmed])
            && $this->scheduled_at->isFuture();
    }
}
