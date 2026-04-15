<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Tenant;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class TenantMiddleware
{
    /**
     * Resolve tenant from subdomain, custom domain, or X-Tenant-ID header.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenantId = $this->resolveTenantId($request);

        if (! $tenantId) {
            return response()->json([
                'message' => 'Tenant not found.',
                'code'    => 'TENANT_NOT_FOUND',
            ], 404);
        }

        $tenant = Cache::remember("tenant:{$tenantId}", 300, fn() =>
            Tenant::with('plan')->where('id', $tenantId)->first()
        );

        if (! $tenant) {
            return response()->json([
                'message' => 'Tenant does not exist.',
                'code'    => 'TENANT_NOT_FOUND',
            ], 404);
        }

        if (! $tenant->is_active) {
            return response()->json([
                'message' => 'This clinic account is suspended.',
                'code'    => 'TENANT_SUSPENDED',
            ], 403);
        }

        // Initialize tenant context
        tenancy()->initialize($tenant);

        return $next($request);
    }

    private function resolveTenantId(Request $request): ?string
    {
        // 1. Check X-Tenant-ID header (API clients, mobile apps)
        if ($tenantId = $request->header('X-Tenant-ID')) {
            return $tenantId;
        }

        // 2. Check subdomain (clinic1.platform.com)
        $host           = $request->getHost();
        $centralDomain  = config('tenancy.central_domains')[0] ?? 'localhost';

        if (str_ends_with($host, ".{$centralDomain}")) {
            $subdomain = str_replace(".{$centralDomain}", '', $host);
            return Cache::remember("tenant:subdomain:{$subdomain}", 300, fn() =>
                Tenant::where('id', $subdomain)->value('id')
            );
        }

        // 3. Check custom domain mapping
        return Cache::remember("tenant:domain:{$host}", 300, fn() =>
            \Stancl\Tenancy\Database\Models\Domain::where('domain', $host)->value('tenant_id')
        );
    }
}
