<?php

use App\Http\Controllers\Admin\DashboardIndexController as AdminDashboardController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\Dashboard\DashboardIndexController;
use App\Http\Controllers\Docs\Animations\AnimationsIndexController;
use App\Http\Controllers\Docs\DocumentationIndexController;
use App\Http\Controllers\HomePageIndexController;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Middleware\RoleMiddleware;

Route::get('/', HomePageIndexController::class)->name('home');
Route::get('/docs', DocumentationIndexController::class)->name('docs.index');
Route::get('/docs/animations', AnimationsIndexController::class)->name('docs.animations.index');
Route::inertia('/doc/animations', 'docs/animations/index')->name('docs.animations');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardIndexController::class)->name('dashboard');
});

Route::middleware(['auth', 'verified', RoleMiddleware::class . ':super-admin'])->as('admin.')->group(function () {
    Route::get('admin/dashboard', AdminDashboardController::class)->name('dashboard');

    Route::resource('admin/users', UsersController::class);
    Route::get('admin/users/{user}/restore', [UsersController::class, 'restore'])->name('users.restore');
});

Route::middleware(['guest'])->group(function () {
    Route::get('auth/{provider}', [SocialiteController::class, 'redirectToProvider'])->name('auth.provider');
    Route::get('auth/{provider}/callback', [SocialiteController::class, 'handleProviderCallback'])->name('auth.callback');
});

require __DIR__ . '/settings.php';
