<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'branch_id',
        'day_of_week',    // 0=Sunday, 6=Saturday
        'start_time',     // HH:MM
        'end_time',       // HH:MM
        'slot_duration',  // minutes
        'break_start',    // HH:MM (optional)
        'break_end',      // HH:MM (optional)
        'max_patients',
        'is_active',
        'valid_from',
        'valid_until',
    ];

    protected $casts = [
        'is_active'   => 'boolean',
        'valid_from'  => 'date',
        'valid_until' => 'date',
    ];

    public function doctor(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function branch(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * Generate time slots for a given date.
     *
     * @return array<int, array{start: string, end: string, available: bool}>
     */
    public function generateSlots(string $date): array
    {
        $slots     = [];
        $current   = Carbon::parse("{$date} {$this->start_time}");
        $end       = Carbon::parse("{$date} {$this->end_time}");
        $breakStart = $this->break_start ? Carbon::parse("{$date} {$this->break_start}") : null;
        $breakEnd   = $this->break_end   ? Carbon::parse("{$date} {$this->break_end}")   : null;

        while ($current->copy()->addMinutes($this->slot_duration)->lte($end)) {
            $slotEnd = $current->copy()->addMinutes($this->slot_duration);

            // Skip break time
            if ($breakStart && $breakEnd) {
                if ($current->gte($breakStart) && $current->lt($breakEnd)) {
                    $current = $breakEnd->copy();
                    continue;
                }
            }

            $bookedCount = Appointment::where('doctor_id', $this->doctor_id)
                ->whereDate('scheduled_at', $date)
                ->where('scheduled_at', $current->toDateTimeString())
                ->whereNotIn('status', ['cancelled'])
                ->count();

            $slots[] = [
                'start'     => $current->format('H:i'),
                'end'       => $slotEnd->format('H:i'),
                'available' => $bookedCount < $this->max_patients,
            ];

            $current->addMinutes($this->slot_duration);
        }

        return $slots;
    }
}
