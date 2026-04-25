<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            PermissionSeeder::class,
            RegistrySeeder::class,
        ]);

        $user = User::factory()->create([
            'name' => 'Claude Myburgh',
            'email' => 'claude@designbycode.co.za',
            'password' => Hash::make('password'),
        ]);

        $user->assignRole('super-admin');

        $this->call([
            UserSeeder::class,
        ]);
    }
}
