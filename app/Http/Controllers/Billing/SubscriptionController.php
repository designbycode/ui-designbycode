<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function checkout(Request $request)
    {
        $priceId = $request->query('plan') === 'yearly'
            ? config('subscription.yearly_price_id')
            : config('subscription.monthly_price_id');

        $checkout = $request->user()->subscribe($priceId, 'default')
            ->returnTo(route('dashboard'));

        return Inertia::render('subscribe', [
            'checkout' => $checkout->options(),
        ]);
    }
}
