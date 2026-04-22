<?php

use App\Models\User;
use Database\Seeders\PermissionSeeder;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('admin.dashboard'));

    $response->assertRedirect(route('login'));
});

test('authenticated users without super-admin role are forbidden', function () {
    $this->seed(PermissionSeeder::class);

    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.dashboard'));
    $response->assertForbidden();
});

test('super-admin users can visit the admin dashboard', function () {
    $this->seed(PermissionSeeder::class);

    $user = User::factory()->superAdmin()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.dashboard'));
    $response->assertOk();
});
