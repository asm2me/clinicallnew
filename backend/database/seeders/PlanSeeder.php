<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name'                       => 'Basic',
                'slug'                       => 'basic',
                'description'                => 'Perfect for solo practitioners',
                'price_monthly'              => 29.00,
                'price_yearly'               => 290.00,
                'max_doctors'                => 2,
                'max_patients'               => 200,
                'max_branches'               => 1,
                'max_appointments_per_month' => 200,
                'has_website_builder'        => false,
                'has_custom_domain'          => false,
                'has_telemedicine'           => false,
                'has_sms'                    => false,
                'has_whatsapp'               => false,
                'has_reports'                => false,
                'has_api_access'             => false,
                'sort_order'                 => 1,
                'features'                   => ['2 doctors', '200 patients/mo', 'Online booking', 'Email notifications'],
            ],
            [
                'name'                       => 'Pro',
                'slug'                       => 'pro',
                'description'                => 'For growing clinics',
                'price_monthly'              => 79.00,
                'price_yearly'               => 790.00,
                'max_doctors'                => 10,
                'max_patients'               => 1000,
                'max_branches'               => 3,
                'max_appointments_per_month' => 1000,
                'has_website_builder'        => true,
                'has_custom_domain'          => true,
                'has_telemedicine'           => true,
                'has_sms'                    => true,
                'has_whatsapp'               => false,
                'has_reports'                => true,
                'has_api_access'             => false,
                'sort_order'                 => 2,
                'features'                   => ['10 doctors', '1000 patients/mo', 'Website builder', 'Custom domain', 'Telemedicine', 'SMS', 'Reports'],
            ],
            [
                'name'                       => 'Enterprise',
                'slug'                       => 'enterprise',
                'description'                => 'For hospitals and large clinics',
                'price_monthly'              => 199.00,
                'price_yearly'               => 1990.00,
                'max_doctors'                => 999,
                'max_patients'               => 999999,
                'max_branches'               => 999,
                'max_appointments_per_month' => 999999,
                'has_website_builder'        => true,
                'has_custom_domain'          => true,
                'has_telemedicine'           => true,
                'has_sms'                    => true,
                'has_whatsapp'               => true,
                'has_reports'                => true,
                'has_api_access'             => true,
                'sort_order'                 => 3,
                'features'                   => ['Unlimited doctors', 'Unlimited patients', 'Website builder', 'Custom domain', 'Telemedicine', 'SMS + WhatsApp', 'Advanced reports', 'API access', 'Priority support'],
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}
