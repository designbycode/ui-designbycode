<?php

use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\Dashboard\DashboardIndexController;
use App\Http\Controllers\HomePageIndexController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomePageIndexController::class)->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardIndexController::class)->name('dashboard');
});

Route::middleware(['guest'])->group(function () {
    Route::get('auth/{provider}', [SocialiteController::class, 'redirectToProvider'])->name('auth.provider');
    Route::get('auth/{provider}/callback', [SocialiteController::class, 'handleProviderCallback'])->name('auth.callback');
});

require __DIR__.'/settings.php';
