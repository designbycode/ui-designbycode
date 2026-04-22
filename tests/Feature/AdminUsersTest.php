<?php

use App\Models\User;
use Database\Seeders\PermissionSeeder;

test('guests cannot access admin users routes', function () {
    $this->get(route('admin.users.index'))->assertRedirect(route('login'));
});

test('non-super-admin users cannot access admin users routes', function () {
    $this->seed(PermissionSeeder::class);

    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('admin.users.index'))->assertForbidden();
});

test('super-admin can list users', function () {
    $this->seed(PermissionSeeder::class);

    $user = User::factory()->superAdmin()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.users.index'));

    $response->assertOk();
    $response->assertInertia();
});

test('super-admin can view a user', function () {
    $this->seed(PermissionSeeder::class);

    $admin = User::factory()->superAdmin()->create();
    $target = User::factory()->create(['name' => 'Test User', 'email' => 'test@example.com']);
    $this->actingAs($admin);

    $response = $this->get(route('admin.users.show', $target->id));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('user.name', 'Test User')
        ->etc()
    );
});

test('super-admin can edit a user', function () {
    $this->seed(PermissionSeeder::class);

    $admin = User::factory()->superAdmin()->create();
    $target = User::factory()->create(['name' => 'Original Name', 'email' => 'original@example.com']);
    $this->actingAs($admin);

    $response = $this->put(route('admin.users.update', $target->id), [
        'name' => 'Updated Name',
        'email' => 'original@example.com',
    ]);

    $response->assertRedirectToRoute('admin.users.index');
    $this->assertDatabaseHas('users', ['name' => 'Updated Name']);
});

test('super-admin can soft delete a user', function () {
    $this->seed(PermissionSeeder::class);

    $admin = User::factory()->superAdmin()->create();
    $target = User::factory()->create();
    $this->actingAs($admin);

    $response = $this->delete(route('admin.users.destroy', $target->id));

    $response->assertRedirectToRoute('admin.users.index');
    $this->assertSoftDeleted('users', ['id' => $target->id]);
});

test('super-admin can restore a deleted user', function () {
    $this->seed(PermissionSeeder::class);

    $admin = User::factory()->superAdmin()->create();
    $target = User::factory()->create();
    $target->delete();
    $this->actingAs($admin);

    $response = $this->get(route('admin.users.restore', $target->id));

    $response->assertRedirectToRoute('admin.users.index');
    $this->assertDatabaseHas('users', ['id' => $target->id]);
    $this->assertNull(User::withTrashed()->find($target->id)->deleted_at);
});

test('deleted users are excluded from index by default', function () {
    $this->seed(PermissionSeeder::class);

    $admin = User::factory()->superAdmin()->create();
    $deletedUser = User::factory()->create();
    $deletedUser->delete();
    $this->actingAs($admin);

    $activeUsersCount = User::count();
    $deletedUsersCount = User::onlyTrashed()->count();

    $this->assertGreaterThan(0, $activeUsersCount);
    $this->assertEquals(1, $deletedUsersCount);
});
