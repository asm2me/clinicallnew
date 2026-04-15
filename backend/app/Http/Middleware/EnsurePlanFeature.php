<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Gate middleware: blocks access if current tenant's plan lacks a feature.
 * Usage in routes: ->middleware('plan:website_builder')
 */
class EnsurePlanFeature
{
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        $tenant = tenant();

        if (! $tenant || ! $tenant->plan) {
            return response()->json(['message' => 'No active plan.', 'code' => 'NO_PLAN'], 403);
        }

        if (! $tenant->plan->hasFeature($feature)) {
            return response()->json([
                'message' => "Your plan does not include '{$feature}'. Please upgrade.",
                'code'    => 'PLAN_UPGRADE_REQUIRED',
                'feature' => $feature,
                'upgrade_url' => url('/billing/upgrade'),
            ], 403);
        }

        return $next($request);
    }
}
