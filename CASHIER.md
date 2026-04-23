# Cashier Paddle Setup - Section by Section

---

## Completed Setup

| Component                  | File                                              | Status  |
| -------------------------- | ------------------------------------------------- | ------- |
| Billable trait             | `app/Models/User.php`                             | ✅ Done |
| Cashier service provider   | `bootstrap/cache/services.php`                    | ✅ Done |
| Paddle JS                  | Cached Blade view                                 | ✅ Done |
| Cashier migrations         | `database/migrations/`                            | ✅ Done |
| Custom models registration | Removed (using Cashier defaults)                  | ✅ Done |
| Environment variables      | `.env`                                            | ✅ Done |
| Webhook controller         | `app/Http/Controllers/WebhookController.php`      | ✅ Done |
| Webhook route              | `POST /paddle/webhook`                            | ✅ Done |
| Event listener             | `app/Listeners/SubscriptionActivatedListener.php` | ✅ Done |
| Subscribe route            | `GET /subscribe`                                  | ✅ Done |
| Subscribe page             | `resources/js/pages/Subscribe.tsx`                | ✅ Done |

---

## Section 1: Run Cashier Migrations

Run these commands:

```bash
php artisan vendor:publish --tag="cashier-migrations"
php artisan migrate
```

This creates:

- `customers` table
- `subscriptions` table
- `subscription_items` table
- `transactions` table

---

## Section 2: Choose Custom Model Path

Check `app/Providers/AppServiceProvider.php` - it currently registers custom models that don't exist. Choose one path:

**Option A** - Remove custom model registration (simpler)

- Remove these lines from `AppServiceProvider.php`:
    ```php
    Cashier::useSubscriptionModel(Subscription::class);
    Cashier::useTransactionModel(Transaction::class);
    ```

**Option B** - Create the custom models

- Create `app/Models/Subscription.php`
- Create `app/Models/Transaction.php`

---

## Section 3: Add Environment Variables

Add to your `.env` file:

```env
PADDLE_CLIENT_SIDE_TOKEN=your-paddle-client-side-token
PADDLE_API_KEY=your-paddle-api-key
PADDLE_WEBHOOK_SECRET="your-paddle-webhook-secret"
PADDLE_SANDBOX=true
```

Get keys from [Paddle Dashboard](https://dashboard.paddle.com).

---

## Section 4: Set Up Webhook Handling

Create the webhook controller:

```bash
php artisan make:controller WebhookController
```

Update `app/Http/Controllers/WebhookController.php`:

```php
<?php

namespace App\Http\Controllers;

use Laravel\Paddle\Http\Controllers\WebhookController as CashierWebhookController;

class WebhookController extends CashierWebhookController
{
    //
}
```

Add route in `routes/api.php`:

```php
use App\Http\Controllers\WebhookController;

Route::post('/paddle/webhook', [WebhookController::class, 'handleWebhook']);
```

---

## Section 5: Configure Paddle Dashboard

In [Paddle Dashboard](https://dashboard.paddle.com):

1. Go to **Account Settings → Integrations → Webhooks**
2. Add your webhook URL: `https://yourdomain.com/api/paddle/webhook`
3. Enable these events:
    - `subscription.created`
    - `subscription.activated`
    - `subscription.updated`
    - `subscription.canceled`
    - `subscription.paused`
    - `subscription.past_due`
    - `transaction.completed`

---

## Section 6: Register Event Listeners (Optional)

If you want to react to subscription events, create listeners.

**Create listener:**

```bash
php artisan make:listener SubscriptionActivatedListener
```

Update `app/Listeners/SubscriptionActivatedListener.php`:

```php
<?php

namespace App\Listeners;

use Laravel\Paddle\Events\SubscriptionActivated;

class SubscriptionActivatedListener
{
    public function handle(SubscriptionActivated $event): void
    {
        // $event->billable - the user model
        // $event->subscription - the subscription model
    }
}
```

Register in `AppServiceProvider.php`:

```php
use App\Listeners\SubscriptionActivatedListener;
use Illuminate\Support\Facades\Event;
use Laravel\Paddle\Events\SubscriptionActivated;

Event::listen(SubscriptionActivated::class, SubscriptionActivatedListener::class);
```

**Available events:**

- `SubscriptionCreated`
- `SubscriptionActivated`
- `SubscriptionUpdated`
- `SubscriptionCanceled`
- `SubscriptionPaused`
- `SubscriptionPastDue`
- `TransactionCompleted`

---

## Section 7: Create Subscribe Route (Inertia)

Add route in `routes/web.php` - returns Inertia response:

```php
use Illuminate\Http\Request;
use Inertia\Inertia;

Route::get('/subscribe', function (Request $request) {
    $checkout = $request->user()->subscribe('price_your_price_id', 'default')
        ->returnTo(route('dashboard'));

    return Inertia::render('Subscribe', [
        'checkout' => $checkout,
    ]);
})->middleware(['auth'])->name('subscribe');
```

Create the React page in `resources/js/pages/Subscribe.jsx`:

```jsx
import { usePaddle } from '@paddle/paddle-js';

export default function Subscribe({ checkout }) {
    const { Paddle } = usePaddle();

    const handleSubscribe = () => {
        Paddle.Checkout.open({
            ...checkout.options(),
        });
    };

    return (
        <div className="flex items-center justify-center py-12">
            <button
                onClick={handleSubscribe}
                className="rounded-lg bg-blue-600 px-8 py-4 text-white"
            >
                Subscribe Now
            </button>
        </div>
    );
}
```

Or use the PaddleButton component (from Cashier, renders a button automatically):

```jsx
import PaddleButton from '@/components/PaddleButton';

export default function Subscribe({ checkout }) {
    return (
        <div className="flex items-center justify-center py-12">
            <PaddleButton checkout={checkout}>Subscribe Now</PaddleButton>
        </div>
    );
}
```

### Alternative: Using Wayfinder for Type-Safe Routes

If using Laravel Wayfinder, generate the route first:

```bash
php artisan wayfinder:generate
```

Then use in component:

```jsx
import { wayfinder } from '@/routes';

const returnUrl = wayfinder('dashboard').url();
```

---

## Section 8: Check Subscription Status (React)

In your React components, use the `subscribed()` method from the Billable trait:

```jsx
export default function Dashboard({ user }) {
    const isSubscribed = user.subscribed();
    const isSubscribedToProduct = user.subscribedToProduct('pro_basic');
    const isSubscribedToPrice = user.subscribedToPrice('price_basic_monthly');
    const onTrial = user.subscription()?.onTrial();

    return (
        <div>
            {isSubscribed ? (
                <p>You are subscribed!</p>
            ) : (
                <a href={wayfinder('subscribe').url()}>Subscribe</a>
            )}
        </div>
    );
}
```

### Subscription Helper Methods on User:

```php
$user->subscribed()                    // has active subscription
$user->subscribed('default')       // specific subscription name
$user->subscribedToProduct('pro_basic')    // subscribed to product
$user->subscribedToPrice('price_basic_monthly')  // subscribed to price
$user->subscription()->onTrial()   // on trial period
$user->subscription()->recurring() // actively Billing
$user->subscription()->canceled()   // canceled
$user->subscription()->pastDue()   // payment failed
```

---

## Testing

1. Use [Paddle Sandbox](https://sandbox-login.paddle.com/signup)
2. Use test card: `4242 4242 4242 4242` (any future date, any CVC)
3. For local webhook testing, use ngrok or similar tunnel to expose your local server
