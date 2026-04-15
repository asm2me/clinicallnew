<?php

namespace App\Enums;

enum AppointmentStatus: string
{
    case Pending   = 'pending';
    case Confirmed = 'confirmed';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
    case NoShow    = 'no_show';

    public function label(): string
    {
        return match($this) {
            self::Pending   => 'Pending',
            self::Confirmed => 'Confirmed',
            self::Completed => 'Completed',
            self::Cancelled => 'Cancelled',
            self::NoShow    => 'No Show',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::Pending   => 'yellow',
            self::Confirmed => 'blue',
            self::Completed => 'green',
            self::Cancelled => 'red',
            self::NoShow    => 'gray',
        };
    }
}
