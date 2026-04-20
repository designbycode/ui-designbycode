<?php

use App\Models\Social;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

test('redirect to provider redirects to oauth url', function () {
    $response = $this->get(route('auth.provider', ['provider' => 'github']));

    $response->assertRedirect();
});

test('callback creates new user and logs in', function () {
    $socialiteUser = new SocialiteUser;
    $socialiteUser->id = '12345';
    $socialiteUser->nickname = 'testuser';
    $socialiteUser->name = 'Test User';
    $socialiteUser->email = 'test@example.com';
    $socialiteUser->avatar = 'https://example.com/avatar.png';

    Socialite::shouldReceive('driver->user')
        ->andReturn($socialiteUser);

    $response = $this->get(route('auth.callback', ['provider' => 'github']));

    $response->assertRedirect(route('dashboard'));

    $this->assertAuthenticated();
    $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    $this->assertDatabaseHas('socials', [
        'provider' => 'github',
        'provider_id' => '12345',
    ]);
});

test('callback logs in existing user for same provider', function () {
    $user = User::factory()->create();
    Social::factory()->create([
        'user_id' => $user->id,
        'provider' => 'github',
        'provider_id' => '12345',
    ]);

    $socialiteUser = new SocialiteUser;
    $socialiteUser->id = '12345';
    $socialiteUser->nickname = 'testuser';
    $socialiteUser->name = 'Test User';
    $socialiteUser->email = 'test@example.com';
    $socialiteUser->avatar = 'https://example.com/avatar.png';

    Socialite::shouldReceive('driver->user')
        ->andReturn($socialiteUser);

    $response = $this->get(route('auth.callback', ['provider' => 'github']));

    $response->assertRedirect(route('dashboard'));

    $this->assertAuthenticated();
    $this->assertDatabaseCount('users', 1);
    $this->assertDatabaseCount('socials', 1);
});
