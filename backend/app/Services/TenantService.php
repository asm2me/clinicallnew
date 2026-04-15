<?php

namespace App\Services;

use App\Models\Tenant;
use App\Models\Plan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class TenantService
{
    /**
     * Provision a new clinic tenant (creates DB schema, seeds defaults).
     */
    public function provision(array $data): Tenant
    {
        return DB::transaction(function () use ($data) {
            $plan = Plan::where('slug', $data['plan'] ?? 'basic')->firstOrFail();

            $tenant = Tenant::create([
                'id'           => Str::slug($data['name']) . '-' . Str::random(6),
                'name'         => $data['name'],
                'slug'         => Str::slug($data['name']),
                'email'        => $data['email'],
                'phone'        => $data['phone'] ?? null,
                'plan_id'      => $plan->id,
                'is_active'    => true,
                'trial_ends_at'=> now()->addDays(14),
                'settings'     => [
                    'timezone'    => $data['timezone']    ?? 'UTC',
                    'currency'    => $data['currency']    ?? 'USD',
                    'language'    => $data['language']    ?? 'en',
                    'date_format' => $data['date_format'] ?? 'Y-m-d',
                ],
            ]);

            // Create default subdomain
            $tenant->domains()->create([
                'domain' => $tenant->id . '.' . config('app.central_domain', 'localhost'),
            ]);

            // Run tenant migrations
            tenancy()->initialize($tenant);
            \Artisan::call('tenants:migrate', ['--tenants' => [$tenant->id]]);

            // Seed default data (roles, plans, settings)
            $this->seedDefaults($tenant, $data);

            tenancy()->end();

            Log::info('Tenant provisioned', ['tenant_id' => $tenant->id]);

            return $tenant->fresh('domains');
        });
    }

    /**
     * Add a custom domain to a tenant.
     */
    public function addCustomDomain(Tenant $tenant, string $domain): void
    {
        if (! $tenant->plan->hasFeature('custom_domain')) {
            throw new \Exception('Custom domain requires a Pro plan or higher.', 403);
        }

        // Verify domain ownership via DNS TXT record
        $this->verifyDomainOwnership($domain, $tenant->id);

        $tenant->domains()->create(['domain' => $domain]);
    }

    /**
     * Suspend a tenant (e.g. unpaid subscription).
     */
    public function suspend(Tenant $tenant, string $reason): void
    {
        $tenant->update(['is_active' => false]);
        Log::warning("Tenant suspended: {$tenant->id}", ['reason' => $reason]);
    }

    /**
     * Restore a suspended tenant.
     */
    public function restore(Tenant $tenant): void
    {
        $tenant->update(['is_active' => true]);
        Log::info("Tenant restored: {$tenant->id}");
    }

    private function seedDefaults(Tenant $tenant, array $data): void
    {
        // Create default admin user
        $admin = \App\Models\User::create([
            'name'     => $data['admin_name']  ?? $data['name'] . ' Admin',
            'email'    => $data['email'],
            'password' => bcrypt($data['password'] ?? Str::random(16)),
        ]);
        $admin->assignRole('clinic_admin');

        // Create main branch
        \App\Models\Branch::create([
            'name'    => $data['name'],
            'address' => $data['address'] ?? '',
            'is_main' => true,
            'is_active' => true,
        ]);

        // Create default homepage
        \App\Models\WebsitePage::create([
            'title'        => 'Home',
            'slug'         => 'home',
            'is_published' => true,
            'is_homepage'  => true,
            'json_content' => $this->getDefaultHomepageBlocks($data['name']),
        ]);
    }

    private function getDefaultHomepageBlocks(string $clinicName): array
    {
        return [
            ['type' => 'hero',    'data' => ['title' => "Welcome to {$clinicName}", 'subtitle' => 'Quality healthcare at your fingertips', 'cta' => 'Book Appointment']],
            ['type' => 'about',   'data' => ['text' => 'We provide comprehensive medical services...']],
            ['type' => 'services','data' => ['show_all' => true]],
            ['type' => 'doctors', 'data' => ['show_all' => true]],
            ['type' => 'booking', 'data' => ['title' => 'Book Your Appointment']],
            ['type' => 'contact', 'data' => ['show_form' => true, 'show_map' => true]],
        ];
    }

    private function verifyDomainOwnership(string $domain, string $tenantId): void
    {
        $records = @dns_get_record("_clinic-verify.{$domain}", DNS_TXT) ?: [];
        $verified = collect($records)->contains(fn($r) =>
            isset($r['txt']) && str_contains($r['txt'], "clinic-verify={$tenantId}")
        );

        if (! $verified) {
            throw new \Exception(
                "Domain ownership not verified. Add TXT record: _clinic-verify.{$domain} → clinic-verify={$tenantId}",
                422
            );
        }
    }
}
