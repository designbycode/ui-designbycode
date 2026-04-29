<?php

use App\Models\Theme;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('can list themes', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Theme::create([
        'name' => 'test-theme',
        'title' => 'Test Theme',
        'css_vars' => ['light' => ['background' => 'white'], 'dark' => ['background' => 'black']],
        'user_id' => $user->id,
    ]);

    $this->get(route('tools.themes.index'))
        ->assertOk();
});

test('can create theme', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('tools.themes.store'), [
        'name' => 'starry-night',
        'title' => 'Starry Night',
        'description' => 'A beautiful dark theme',
        'css_vars' => [
            'light' => ['background' => 'oklch(0.9755 0.0045 258.3245)'],
            'dark' => ['background' => 'oklch(0.2204 0.0198 275.8439)'],
        ],
        'font' => ['sans' => 'Inter', 'serif' => 'Georgia', 'mono' => 'monospace'],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('themes', [
        'name' => 'starry-night',
        'title' => 'Starry Night',
    ]);
});

test('can show theme', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $theme = Theme::create([
        'name' => 'test-theme',
        'title' => 'Test Theme',
        'css_vars' => ['light' => [], 'dark' => []],
        'user_id' => $user->id,
    ]);

    $this->get(route('tools.themes.show', $theme))
        ->assertOk();
});

test('can update theme', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $theme = Theme::create([
        'name' => 'test-theme',
        'title' => 'Test Theme',
        'css_vars' => ['light' => [], 'dark' => []],
        'user_id' => $user->id,
    ]);

    $this->put(route('tools.themes.update', $theme), [
        'name' => 'updated-theme',
        'title' => 'Updated Theme',
        'css_vars' => [
            'light' => ['background' => 'white'],
            'dark' => ['background' => 'black'],
        ],
    ]);

    $this->assertDatabaseHas('themes', [
        'name' => 'updated-theme',
        'title' => 'Updated Theme',
    ]);
});

test('can delete theme', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $theme = Theme::create([
        'name' => 'test-theme',
        'title' => 'Test Theme',
        'css_vars' => ['light' => [], 'dark' => []],
        'user_id' => $user->id,
    ]);

    $this->delete(route('tools.themes.destroy', $theme))
        ->assertRedirect();

    $this->assertDatabaseMissing('themes', ['id' => $theme->id]);
});

test('generates css output correctly', function () {
    $theme = new Theme([
        'name' => 'test',
        'title' => 'Test',
        'css_vars' => [
            'light' => [
                'background' => 'oklch(1 0 0)',
                'foreground' => 'oklch(0 0 0)',
                'primary' => 'oklch(0.5 0.1 200)',
                'radius' => '0.5rem',
            ],
            'dark' => [
                'background' => 'oklch(0 0 0)',
                'foreground' => 'oklch(1 0 0)',
                'primary' => 'oklch(0.5 0.1 200)',
                'radius' => '0.5rem',
            ],
        ],
    ]);

    $css = $theme->toCssString();

    expect($css)->toContain(':root');
    expect($css)->toContain('.dark');
    expect($css)->toContain('@theme inline');
    expect($css)->toContain('--background: oklch(1 0 0)');
});
