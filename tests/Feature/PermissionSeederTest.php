<?php

use Database\Seeders\PermissionSeeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

test('seeder creates all required permissions', function () {
    $this->seed(PermissionSeeder::class);

    $permissions = Permission::where('guard_name', 'web')
        ->whereIn('name', ['super-admin', 'admin.view', 'user.view', 'user.create', 'user.edit', 'user.delete'])
        ->pluck('name')
        ->toArray();

    expect($permissions)
        ->toContain('super-admin')
        ->toContain('admin.view')
        ->toContain('user.view')
        ->toContain('user.create')
        ->toContain('user.edit')
        ->toContain('user.delete');
});

test('super-admin role has all permissions', function () {
    $this->seed(PermissionSeeder::class);

    $superAdminRole = Role::findByName('super-admin');
    $permissions = $superAdminRole->permissions->pluck('name')->toArray();

    expect($permissions)
        ->toContain('super-admin')
        ->toContain('admin.view');
});

test('user role has only user.view permission', function () {
    $this->seed(PermissionSeeder::class);

    $userRole = Role::findByName('user');
    $permissions = $userRole->permissions->pluck('name')->toArray();

    expect($permissions)->toContain('user.view');
    expect($permissions)->not->toContain('super-admin');
    expect($permissions)->not->toContain('admin.view');
});
