<?php

namespace App\Http\Controllers\Api\V1\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\Plan;
use App\Services\TenantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class TenantController extends Controller
{
    public function __construct(private readonly TenantService $tenantService) {}

    /** GET /super-admin/tenants */
    public function index(Request $request): JsonResponse
    {
        $tenants = QueryBuilder::for(Tenant::class)
            ->with(['plan', 'domains'])
            ->allowedFilters([
                AllowedFilter::exact('is_active'),
                AllowedFilter::exact('plan_id'),
                AllowedFilter::partial('name'),
                AllowedFilter::partial('email'),
            ])
            ->allowedSorts(['name', 'created_at', 'is_active'])
            ->paginate($request->integer('per_page', 15));

        return response()->json($tenants);
    }

    /** POST /super-admin/tenants */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:tenants,email',
            'phone'        => 'nullable|string|max:20',
            'plan'         => 'required|string|exists:plans,slug',
            'admin_name'   => 'required|string|max:255',
            'password'     => 'required|string|min:8',
            'timezone'     => 'nullable|timezone',
            'currency'     => 'nullable|string|size:3',
        ]);

        try {
            $tenant = $this->tenantService->provision($request->all());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json(['tenant' => $tenant], 201);
    }

    /** GET /super-admin/tenants/{id} */
    public function show(string $id): JsonResponse
    {
        $tenant = Tenant::with(['plan', 'domains', 'activeSubscription'])->findOrFail($id);
        return response()->json(['tenant' => $tenant]);
    }

    /** PUT /super-admin/tenants/{id}/suspend */
    public function suspend(Request $request, string $id): JsonResponse
    {
        $request->validate(['reason' => 'required|string|max:500']);
        $tenant = Tenant::findOrFail($id);
        $this->tenantService->suspend($tenant, $request->reason);
        return response()->json(['message' => 'Tenant suspended.']);
    }

    /** PUT /super-admin/tenants/{id}/restore */
    public function restore(string $id): JsonResponse
    {
        $tenant = Tenant::findOrFail($id);
        $this->tenantService->restore($tenant);
        return response()->json(['message' => 'Tenant restored.']);
    }

    /** GET /super-admin/tenants/{id}/custom-domain */
    public function addCustomDomain(Request $request, string $id): JsonResponse
    {
        $request->validate(['domain' => 'required|string']);
        $tenant = Tenant::findOrFail($id);

        try {
            $this->tenantService->addCustomDomain($tenant, $request->domain);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 422);
        }

        return response()->json(['message' => 'Custom domain added.']);
    }

    /** GET /super-admin/stats */
    public function stats(): JsonResponse
    {
        return response()->json([
            'total_tenants'  => Tenant::count(),
            'active_tenants' => Tenant::where('is_active', true)->count(),
            'trial_tenants'  => Tenant::whereDate('trial_ends_at', '>=', now())->count(),
            'total_plans'    => Plan::count(),
            'plans'          => Plan::withCount('tenants')->get(),
            'recent_tenants' => Tenant::latest()->limit(5)->get(),
        ]);
    }
}
