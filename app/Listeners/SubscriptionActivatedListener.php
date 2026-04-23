<?php

namespace App\Listeners;

use Laravel\Paddle\Events\SubscriptionCreated;

class SubscriptionActivatedListener
{
    public function handle(SubscriptionCreated $event): void
    {
        $billable = $event->billable;
        $subscription = $event->subscription;
        $payload = $event->payload;
    }
}
