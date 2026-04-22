<?php

use App\Http\Controllers\Admin\DashboardIndexController as AdminDashboardController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\Dashboard\DashboardIndexController;
use App\Http\Controllers\HomePageIndexController;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Middleware\RoleMiddleware;

Route::get('/', HomePageIndexController::class)->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardIndexController::class)->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('admin/dashboard', AdminDashboardController::class)->name('admin.dashboard')->middleware(RoleMiddleware::class.':super-admin');
    Route::resource('admin/users', UsersController::class)
        ->middleware(RoleMiddleware::class.':super-admin')
        ->names([
            'index' => 'admin.users.index',
            'show' => 'admin.users.show',
            'create' => 'admin.users.create',
            'store' => 'admin.users.store',
            'edit' => 'admin.users.edit',
            'update' => 'admin.users.update',
            'destroy' => 'admin.users.destroy',
        ]);
    Route::get('admin/users/{user}/restore', [UsersController::class, 'restore'])
        ->middleware(RoleMiddleware::class.':super-admin')
        ->name('admin.users.restore');
});

Route::middleware(['guest'])->group(function () {
    Route::get('auth/{provider}', [SocialiteController::class, 'redirectToProvider'])->name('auth.provider');
    Route::get('auth/{provider}/callback', [SocialiteController::class, 'handleProviderCallback'])->name('auth.callback');
});

require __DIR__.'/settings.php';
