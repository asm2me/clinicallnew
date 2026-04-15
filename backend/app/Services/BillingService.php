<?php

namespace App\Services;

use App\Models\Tenant;
use App\Models\Plan;
use App\Models\Subscription;
use Stripe\Stripe;
use Stripe\Customer;
use Stripe\Subscription as StripeSubscription;
use Stripe\Webhook;
use Illuminate\Support\Facades\Log;

class BillingService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Create or retrieve Stripe customer for a tenant.
     */
    public function getOrCreateCustomer(Tenant $tenant): Customer
    {
        if ($tenant->stripe_customer_id) {
            return Customer::retrieve($tenant->stripe_customer_id);
        }

        $customer = Customer::create([
            'name'  => $tenant->name,
            'email' => $tenant->email,
            'metadata' => ['tenant_id' => $tenant->id],
        ]);

        $tenant->update(['stripe_customer_id' => $customer->id]);
        return $customer;
    }

    /**
     * Subscribe a tenant to a plan.
     */
    public function subscribe(Tenant $tenant, Plan $plan, string $interval = 'monthly'): Subscription
    {
        $customer = $this->getOrCreateCustomer($tenant);

        $priceId = $interval === 'yearly'
            ? $plan->stripe_yearly_price_id
            : $plan->stripe_monthly_price_id;

        $stripeSubscription = StripeSubscription::create([
            'customer'       => $customer->id,
            'items'          => [['price' => $priceId]],
            'trial_end'      => $tenant->trial_ends_at?->timestamp,
            'payment_behavior' => 'default_incomplete',
            'payment_settings' => ['save_default_payment_method' => 'on_subscription'],
            'expand'         => ['latest_invoice.payment_intent'],
            'metadata'       => ['tenant_id' => $tenant->id, 'plan_id' => $plan->id],
        ]);

        $subscription = Subscription::updateOrCreate(
            ['tenant_id' => $tenant->id, 'stripe_subscription_id' => $stripeSubscription->id],
            [
                'plan_id'                 => $plan->id,
                'status'                  => $stripeSubscription->status,
                'stripe_subscription_id'  => $stripeSubscription->id,
                'stripe_price_id'         => $priceId,
                'interval'                => $interval,
                'current_period_start'    => now()->timestamp($stripeSubscription->current_period_start),
                'current_period_end'      => now()->timestamp($stripeSubscription->current_period_end),
                'client_secret'           => $stripeSubscription->latest_invoice->payment_intent->client_secret ?? null,
            ]
        );

        return $subscription;
    }

    /**
     * Handle Stripe webhook events.
     */
    public function handleWebhook(string $payload, string $signature): void
    {
        $event = Webhook::constructEvent(
            $payload,
            $signature,
            config('services.stripe.webhook_secret')
        );

        match ($event->type) {
            'invoice.payment_succeeded' => $this->onPaymentSucceeded($event->data->object),
            'invoice.payment_failed'    => $this->onPaymentFailed($event->data->object),
            'customer.subscription.deleted' => $this->onSubscriptionDeleted($event->data->object),
            'customer.subscription.updated' => $this->onSubscriptionUpdated($event->data->object),
            default => Log::info("Unhandled Stripe event: {$event->type}"),
        };
    }

    private function onPaymentSucceeded(object $invoice): void
    {
        $subscription = Subscription::where('stripe_subscription_id', $invoice->subscription)->first();
        if ($subscription) {
            $subscription->update(['status' => 'active', 'last_payment_at' => now()]);
            $subscription->tenant->update(['is_active' => true]);
        }
    }

    private function onPaymentFailed(object $invoice): void
    {
        $subscription = Subscription::where('stripe_subscription_id', $invoice->subscription)->first();
        if ($subscription) {
            $subscription->update(['status' => 'past_due']);
            Log::warning("Payment failed for tenant: {$subscription->tenant_id}");
        }
    }

    private function onSubscriptionDeleted(object $stripeSubscription): void
    {
        $subscription = Subscription::where('stripe_subscription_id', $stripeSubscription->id)->first();
        if ($subscription) {
            $subscription->update(['status' => 'cancelled', 'cancelled_at' => now()]);
            app(TenantService::class)->suspend($subscription->tenant, 'Subscription cancelled');
        }
    }

    private function onSubscriptionUpdated(object $stripeSubscription): void
    {
        Subscription::where('stripe_subscription_id', $stripeSubscription->id)->update([
            'status'               => $stripeSubscription->status,
            'current_period_end'   => now()->timestamp($stripeSubscription->current_period_end),
        ]);
    }
}
