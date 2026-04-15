<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'patient_id',
        'appointment_id',
        'subtotal',
        'discount',
        'tax',
        'total',
        'status',         // draft | sent | paid | overdue | cancelled
        'payment_method', // cash | card | insurance | online
        'payment_gateway',
        'payment_reference',
        'paid_at',
        'due_date',
        'notes',
        'items',          // JSON line items
    ];

    protected $casts = [
        'subtotal'  => 'decimal:2',
        'discount'  => 'decimal:2',
        'tax'       => 'decimal:2',
        'total'     => 'decimal:2',
        'paid_at'   => 'datetime',
        'due_date'  => 'date',
        'items'     => 'array',
    ];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function (Invoice $invoice) {
            $invoice->invoice_number = 'INV-' . date('Y') . '-' . str_pad(
                static::whereYear('created_at', date('Y'))->count() + 1,
                5, '0', STR_PAD_LEFT
            );
        });
    }

    public function patient(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function appointment(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }
}
