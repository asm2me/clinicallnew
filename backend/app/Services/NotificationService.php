<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Twilio\Rest\Client as TwilioClient;

class NotificationService
{
    public function sendAppointmentConfirmation(Appointment $appointment): void
    {
        $patient = $appointment->patient->user;
        $doctor  = $appointment->doctor->user;

        $this->sendEmail($patient, 'emails.appointments.confirmed', [
            'appointment' => $appointment,
            'patient'     => $patient,
            'doctor'      => $doctor,
        ]);

        $this->sendSms($patient->phone, $this->buildConfirmationSms($appointment));
        $this->sendWhatsApp($patient->phone, $this->buildConfirmationWhatsApp($appointment));
    }

    public function sendAppointmentReminder(Appointment $appointment): void
    {
        $patient = $appointment->patient->user;

        $message = sprintf(
            "Reminder: You have an appointment with Dr. %s tomorrow at %s. Confirmation code: %s",
            $appointment->doctor->user->name,
            $appointment->scheduled_at->format('h:i A'),
            $appointment->confirmation_code
        );

        $this->sendEmail($patient, 'emails.appointments.reminder', ['appointment' => $appointment]);
        $this->sendSms($patient->phone, $message);
        $this->sendPushNotification($patient, 'Appointment Reminder', $message);
    }

    public function sendAppointmentCancellation(Appointment $appointment): void
    {
        $patient = $appointment->patient->user;
        $doctor  = $appointment->doctor->user;

        $message = "Your appointment with Dr. {$doctor->name} on {$appointment->scheduled_at->format('D, M d Y h:i A')} has been cancelled. Reason: {$appointment->cancellation_reason}";

        $this->sendEmail($patient, 'emails.appointments.cancelled', ['appointment' => $appointment]);
        $this->sendSms($patient->phone, $message);
        $this->sendPushNotification($patient, 'Appointment Cancelled', $message);
    }

    public function sendWelcome(User $user, string $password): void
    {
        $this->sendEmail($user, 'emails.auth.welcome', [
            'user'     => $user,
            'password' => $password,
        ]);
    }

    private function sendEmail(User $user, string $view, array $data): void
    {
        try {
            Mail::send($view, $data, function ($mail) use ($user) {
                $mail->to($user->email, $user->name)->subject(
                    config('mail.from.name') . ' - Notification'
                );
            });
        } catch (\Exception $e) {
            Log::error('Email notification failed', ['user_id' => $user->id, 'error' => $e->getMessage()]);
        }
    }

    private function sendSms(?string $phone, string $message): void
    {
        if (! $phone || ! config('services.twilio.sid')) {
            return;
        }

        try {
            $client = new TwilioClient(config('services.twilio.sid'), config('services.twilio.token'));
            $client->messages->create($phone, [
                'from' => config('services.twilio.from'),
                'body' => $message,
            ]);
        } catch (\Exception $e) {
            Log::error('SMS notification failed', ['phone' => $phone, 'error' => $e->getMessage()]);
        }
    }

    private function sendWhatsApp(?string $phone, array $components): void
    {
        if (! $phone || ! config('services.whatsapp.token')) {
            return;
        }

        try {
            $client = new \GuzzleHttp\Client();
            $client->post(
                "https://graph.facebook.com/v18.0/" . config('services.whatsapp.phone_id') . "/messages",
                [
                    'headers' => [
                        'Authorization' => 'Bearer ' . config('services.whatsapp.token'),
                        'Content-Type'  => 'application/json',
                    ],
                    'json' => [
                        'messaging_product' => 'whatsapp',
                        'to'                => ltrim($phone, '+'),
                        'type'              => 'template',
                        'template'          => $components,
                    ],
                ]
            );
        } catch (\Exception $e) {
            Log::error('WhatsApp notification failed', ['phone' => $phone, 'error' => $e->getMessage()]);
        }
    }

    private function sendPushNotification(User $user, string $title, string $body): void
    {
        if (! $user->fcm_token) {
            return;
        }

        try {
            $client = new \GuzzleHttp\Client();
            $client->post('https://fcm.googleapis.com/fcm/send', [
                'headers' => [
                    'Authorization' => 'key=' . config('services.firebase.server_key'),
                    'Content-Type'  => 'application/json',
                ],
                'json' => [
                    'to'           => $user->fcm_token,
                    'notification' => ['title' => $title, 'body' => $body],
                    'data'         => ['type' => 'appointment'],
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Push notification failed', ['user_id' => $user->id, 'error' => $e->getMessage()]);
        }
    }

    private function buildConfirmationSms(Appointment $appointment): string
    {
        return sprintf(
            "Appointment confirmed! Dr. %s on %s at %s. Code: %s. Reply CANCEL to cancel.",
            $appointment->doctor->user->name,
            $appointment->scheduled_at->format('D, M d'),
            $appointment->scheduled_at->format('h:i A'),
            $appointment->confirmation_code
        );
    }

    private function buildConfirmationWhatsApp(Appointment $appointment): array
    {
        return [
            'name'       => 'appointment_confirmation',
            'language'   => ['code' => 'en'],
            'components' => [
                [
                    'type'       => 'body',
                    'parameters' => [
                        ['type' => 'text', 'text' => $appointment->patient->user->name],
                        ['type' => 'text', 'text' => $appointment->doctor->user->name],
                        ['type' => 'text', 'text' => $appointment->scheduled_at->format('D, M d Y h:i A')],
                        ['type' => 'text', 'text' => $appointment->confirmation_code],
                    ],
                ],
            ],
        ];
    }
}
