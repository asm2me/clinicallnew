<?php

return [
    'stripe' => [
        'key'            => env('STRIPE_KEY'),
        'secret'         => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],

    'twilio' => [
        'sid'   => env('TWILIO_SID'),
        'token' => env('TWILIO_TOKEN'),
        'from'  => env('TWILIO_FROM'),
    ],

    'whatsapp' => [
        'token'    => env('WHATSAPP_API_TOKEN'),
        'phone_id' => env('WHATSAPP_PHONE_ID'),
    ],

    'firebase' => [
        'server_key' => env('FIREBASE_SERVER_KEY'),
    ],
];
