<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $subscription = $user->subscription('default');

        $invoices = $user->transactions()
            ->orderBy('billed_at', 'desc')
            ->get()
            ->map(fn ($invoice) => [
                'id' => $invoice->id,
                'number' => $invoice->invoice_number,
                'amount' => $invoice->total,
                'tax' => $invoice->tax,
                'currency' => $invoice->currency,
                'status' => $invoice->status,
                'billed_at' => $invoice->billed_at?->toIso8601String(),
                'url' => route('billing.download-invoice', $invoice),
            ]);

        return Inertia::render('billing/index', [
            'subscription' => $subscription ? [
                'id' => $subscription->paddle_id,
                'status' => $subscription->status,
                'type' => $subscription->type,
                'trial_ends_at' => $subscription->trial_ends_at?->toIso8601String(),
                'paused_at' => $subscription->paused_at?->toIso8601String(),
                'ends_at' => $subscription->ends_at?->toIso8601String(),
                'currentPeriodEndsAt' => $subscription->currentPeriodEndsAt()?->toIso8601String(),
                'price_id' => $subscription->items()->first()?->price_id,
            ] : null,
            'invoices' => $invoices,
            'upcomingInvoice' => null,
            'customer' => [
                'paddle_id' => $user->paddle_id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'plans' => [
                'monthly' => [
                    'price_id' => config('subscription.monthly_price_id'),
                ],
                'yearly' => [
                    'price_id' => config('subscription.yearly_price_id'),
                ],
            ],
        ]);
    }

    public function subscribe(Request $request): Response
    {
        $request->validate([
            'plan' => ['required', 'string', 'in:monthly,yearly'],
        ]);

        $user = $request->user();

        // Ensure user is created as Paddle customer first
        if (! $user->paddle_id) {
            $user->createAsCustomer();
            $user->refresh();
        }

        $plan = $request->input('plan');
        $priceId = $plan === 'yearly'
            ? config('subscription.yearly_price_id')
            : config('subscription.monthly_price_id');

        $checkout = $user->subscribe($priceId, 'default')
            ->returnTo(route('billing.index'));

        $subscription = $user->subscription('default');

        $invoices = $user->transactions()
            ->orderBy('billed_at', 'desc')
            ->get()
            ->map(fn ($invoice) => [
                'id' => $invoice->id,
                'number' => $invoice->invoice_number,
                'amount' => $invoice->total,
                'tax' => $invoice->tax,
                'currency' => $invoice->currency,
                'status' => $invoice->status,
                'billed_at' => $invoice->billed_at?->toIso8601String(),
                'url' => route('billing.download-invoice', $invoice),
            ]);

        return Inertia::render('billing/index', [
            'subscription' => $subscription ? [
                'id' => $subscription->paddle_id,
                'status' => $subscription->status,
                'type' => $subscription->type,
                'trial_ends_at' => $subscription->trial_ends_at?->toIso8601String(),
                'paused_at' => $subscription->paused_at?->toIso8601String(),
                'ends_at' => $subscription->ends_at?->toIso8601String(),
                'currentPeriodEndsAt' => $subscription->currentPeriodEndsAt()?->toIso8601String(),
                'price_id' => $subscription->items()->first()?->price_id,
            ] : null,
            'invoices' => $invoices,
            'upcomingInvoice' => null,
            'customer' => [
                'paddle_id' => $user->paddle_id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'plans' => [
                'monthly' => [
                    'price_id' => config('subscription.monthly_price_id'),
                ],
                'yearly' => [
                    'price_id' => config('subscription.yearly_price_id'),
                ],
            ],
            'checkout' => $checkout->options(),
        ]);
    }

    public function updatePaymentMethod(Request $request): RedirectResponse
    {
        $session = $request->user()->updatePaymentMethod();
        $session->returnTo(url()->current());

        return redirect()->to($session->url());
    }

    public function switchPlan(Request $request): RedirectResponse
    {
        $request->validate([
            'plan' => ['required', 'string', 'in:monthly,yearly'],
        ]);

        $user = $request->user();
        $plan = $request->input('plan');
        $priceId = $plan === 'yearly'
            ? config('subscription.yearly_price_id')
            : config('subscription.monthly_price_id');

        if (! $user->subscription('default')) {
            return redirect()->route('billing.subscribe');
        }

        $user->subscription('default')->swap($priceId);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Plan switched successfully.'),
        ]);

        return redirect()->route('billing.index');
    }

    public function pause(Request $request): RedirectResponse
    {
        $request->user()->subscription('default')->pause();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Subscription paused.'),
        ]);

        return redirect()->route('billing.index');
    }

    public function resume(Request $request): RedirectResponse
    {
        $request->user()->subscription('default')->resume();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Subscription resumed.'),
        ]);

        return redirect()->route('billing.index');
    }

    public function cancel(Request $request): RedirectResponse
    {
        $request->user()->subscription('default')->cancel();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Subscription cancelled.'),
        ]);

        return redirect()->route('billing.index');
    }

    public function downloadInvoice(Request $request, $invoice): RedirectResponse
    {
        if ($invoice->url) {
            return redirect()->to($invoice->url);
        }

        return redirect()->back();
    }
}
