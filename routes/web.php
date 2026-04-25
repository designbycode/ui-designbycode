<?php

use App\Http\Controllers\Admin\DashboardIndexController as AdminDashboardController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\Billing\BillingController;
use App\Http\Controllers\Billing\SubscriptionController;
use App\Http\Controllers\Dashboard\DashboardIndexController;
use App\Http\Controllers\Docs\Animations\AnimationsIndexController;
use App\Http\Controllers\Docs\DocumentationIndexController;
use App\Http\Controllers\HomePageIndexController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Middleware\RoleMiddleware;

Route::get('/', HomePageIndexController::class)->name('home');
Route::get('/docs', DocumentationIndexController::class)->name('docs.index');
Route::get('/docs/animations', AnimationsIndexController::class)->name('docs.animations.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardIndexController::class)->name('dashboard');
    Route::get('subscribe', [SubscriptionController::class, 'checkout'])->name('subscribe');

    Route::get('billing', [BillingController::class, 'index'])->name('billing.index');
    Route::get('billing/subscribe', [BillingController::class, 'subscribe'])->name('billing.subscribe');
    Route::post('billing/update-payment-method', [BillingController::class, 'updatePaymentMethod'])->name('billing.update-payment-method');
    Route::post('billing/switch-plan', [BillingController::class, 'switchPlan'])->name('billing.switch-plan');
    Route::post('billing/pause', [BillingController::class, 'pause'])->name('billing.pause');
    Route::post('billing/resume', [BillingController::class, 'resume'])->name('billing.resume');
    Route::post('billing/cancel', [BillingController::class, 'cancel'])->name('billing.cancel');
    Route::get('billing/invoices/{invoice}', [BillingController::class, 'downloadInvoice'])->name('billing.download-invoice');
});

Route::middleware(['auth', 'verified', RoleMiddleware::class.':super-admin'])->as('admin.')->group(function () {
    Route::get('admin/dashboard', AdminDashboardController::class)->name('dashboard');

    Route::resource('admin/users', UsersController::class);
    Route::get('admin/users/{user}/restore', [UsersController::class, 'restore'])->name('users.restore');
});

Route::middleware(['guest'])->group(function () {
    Route::get('auth/{provider}', [SocialiteController::class, 'redirectToProvider'])->name('auth.provider');
    Route::get('auth/{provider}/callback', [SocialiteController::class, 'handleProviderCallback'])->name('auth.callback');
});

require __DIR__.'/settings.php';

Route::post('/paddle/webhook', [WebhookController::class, '__invoke']);
