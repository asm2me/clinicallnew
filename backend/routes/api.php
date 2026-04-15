<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Appointment\AppointmentController;
use App\Http\Controllers\Api\V1\Website\WebsiteController;
use App\Http\Controllers\Api\V1\Admin\DoctorController;
use App\Http\Controllers\Api\V1\Admin\PatientController;
use App\Http\Controllers\Api\V1\Admin\BranchController;
use App\Http\Controllers\Api\V1\Admin\ServiceController;
use App\Http\Controllers\Api\V1\Admin\ScheduleController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Billing\BillingController;
use App\Http\Controllers\Api\V1\SuperAdmin\TenantController;

/*
|--------------------------------------------------------------------------
| Tenant Routes (require X-Tenant-ID header or subdomain)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->middleware(['tenant'])->group(function () {

    // ── Public (no auth required) ────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login',    [AuthController::class, 'login']);
    });

    // ── Public website routes ─────────────────────────────────────────────
    Route::prefix('public')->group(function () {
        Route::get('pages',             [WebsiteController::class, 'index']);
        Route::get('pages/{slug}',      [WebsiteController::class, 'show']);
        Route::get('sitemap.xml',       [WebsiteController::class, 'sitemap']);
        Route::get('doctors',           [DoctorController::class, 'publicIndex']);
        Route::get('doctors/{slug}',    [DoctorController::class, 'publicShow']);
        Route::get('services',          [ServiceController::class, 'publicIndex']);
        Route::get('appointment-slots', [AppointmentController::class, 'slots']);
    });

    // ── Authenticated routes ──────────────────────────────────────────────
    Route::middleware(['auth:api'])->group(function () {

        // Auth
        Route::prefix('auth')->group(function () {
            Route::get('me',              [AuthController::class, 'me']);
            Route::post('refresh',        [AuthController::class, 'refresh']);
            Route::post('logout',         [AuthController::class, 'logout']);
            Route::put('fcm-token',       [AuthController::class, 'updateFcmToken']);
        });

        // Appointments (all roles)
        Route::prefix('appointments')->group(function () {
            Route::get('/',             [AppointmentController::class, 'index']);
            Route::post('/',            [AppointmentController::class, 'store']);
            Route::get('/today',        [AppointmentController::class, 'today']);
            Route::get('/stats',        [AppointmentController::class, 'stats']);
            Route::post('/lock-slot',   [AppointmentController::class, 'lockSlot']);
            Route::get('/{id}',         [AppointmentController::class, 'show']);
            Route::put('/{id}/confirm', [AppointmentController::class, 'confirm'])->middleware('role:clinic_admin|receptionist|doctor');
            Route::put('/{id}/cancel',  [AppointmentController::class, 'cancel']);
            Route::put('/{id}/complete',[AppointmentController::class, 'complete'])->middleware('role:doctor|clinic_admin');
        });

        // ── Admin & Receptionist routes ──────────────────────────────────
        Route::middleware(['role:clinic_admin|receptionist'])->group(function () {

            Route::get('dashboard',     [DashboardController::class, 'index']);

            Route::apiResource('doctors',  DoctorController::class);
            Route::apiResource('patients', PatientController::class);
            Route::apiResource('branches', BranchController::class);
            Route::apiResource('services', ServiceController::class);
            Route::apiResource('schedules',ScheduleController::class);

            // Website builder
            Route::prefix('website')->middleware('plan:website_builder')->group(function () {
                Route::get('block-types',       [WebsiteController::class, 'blockTypes']);
                Route::get('themes',            [WebsiteController::class, 'themes']);
                Route::get('settings',          [WebsiteController::class, 'settings']);
                Route::put('settings',          [WebsiteController::class, 'updateSettings']);
                Route::post('pages',            [WebsiteController::class, 'store']);
                Route::put('pages/{slug}',      [WebsiteController::class, 'update']);
                Route::delete('pages/{slug}',   [WebsiteController::class, 'destroy']);
                Route::get('widget-script',     [WebsiteController::class, 'widgetScript']);
            });

            // Billing
            Route::prefix('billing')->group(function () {
                Route::get('plans',                     [BillingController::class, 'plans']);
                Route::post('subscribe',                [BillingController::class, 'subscribe']);
                Route::get('subscription',              [BillingController::class, 'subscription']);
                Route::post('cancel-subscription',      [BillingController::class, 'cancelSubscription']);
                Route::post('webhook',                  [BillingController::class, 'webhook']);
            });
        });
    });
});

/*
|--------------------------------------------------------------------------
| Super Admin Routes (central, no tenant context)
|--------------------------------------------------------------------------
*/

Route::prefix('super-admin')->middleware(['auth:api', 'role:super_admin'])->group(function () {
    Route::get('stats',                          [TenantController::class, 'stats']);
    Route::apiResource('tenants',                TenantController::class);
    Route::put('tenants/{id}/suspend',           [TenantController::class, 'suspend']);
    Route::put('tenants/{id}/restore',           [TenantController::class, 'restore']);
    Route::post('tenants/{id}/custom-domain',    [TenantController::class, 'addCustomDomain']);
});
