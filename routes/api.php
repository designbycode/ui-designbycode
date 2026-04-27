<?php

use App\Http\Controllers\Api\Registries\RegistrySearchController;
use App\Http\Controllers\Api\ThemeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/registries/search', [RegistrySearchController::class, 'search']);

Route::get('/themes', [ThemeController::class, 'index']);
Route::get('/themes/{name}', [ThemeController::class, 'show']);
