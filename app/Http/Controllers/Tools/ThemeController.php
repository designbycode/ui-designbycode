<?php

namespace App\Http\Controllers\Tools;

use App\Http\Controllers\Controller;
use App\Http\Requests\ThemeStoreRequest;
use App\Models\Theme;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ThemeController extends Controller
{
    public function index(): Response
    {
        $themes = Theme::query()
            ->when(auth()->check(), fn ($q) => $q->where('user_id', auth()->id()))
            ->latest()
            ->get();

        return Inertia::render('tools/theme/index', [
            'themes' => $themes,
        ]);
    }

    public function create(): Response
    {
        $fonts = \App\Models\Registry::fonts()->get(['name', 'title', 'description']);

        return Inertia::render('tools/theme/create', [
            'fonts' => $fonts,
        ]);
    }

    public function store(ThemeStoreRequest $request): RedirectResponse
    {
        $theme = Theme::create([
            'name' => $request->validated()['name'],
            'title' => $request->validated()['title'],
            'description' => $request->validated()['description'] ?? null,
            'user_id' => auth()->id(),
            'css_vars' => $request->validated()['css_vars'],
            'font' => $request->validated()['font'] ?? null,
            'css' => $request->validated()['css'] ?? null,
            'meta' => $request->validated()['meta'] ?? null,
        ]);

        return to_route('tools.themes.show', $theme)
            ->with('toast', ['type' => 'success', 'message' => 'Theme created successfully.']);
    }

    public function show(Theme $theme): Response
    {
        return Inertia::render('tools/theme/show', [
            'theme' => [
                'id' => $theme->id,
                'name' => $theme->name,
                'title' => $theme->title,
                'description' => $theme->description,
                'css_vars' => $theme->css_vars,
                'font' => $theme->font,
                'css' => $theme->css,
                'meta' => $theme->meta,
                'registry_json' => $theme->toRegistryJson(),
                'css_output' => $theme->toCssString(),
            ],
        ]);
    }

    public function edit(Theme $theme): Response
    {
        $fonts = \App\Models\Registry::fonts()->get(['name', 'title', 'description']);

        return Inertia::render('tools/theme/edit', [
            'theme' => [
                'id' => $theme->id,
                'name' => $theme->name,
                'title' => $theme->title,
                'description' => $theme->description,
                'css_vars' => $theme->css_vars,
                'font' => $theme->font,
                'css' => $theme->css,
                'meta' => $theme->meta,
            ],
            'fonts' => $fonts,
        ]);
    }

    public function update(ThemeStoreRequest $request, Theme $theme): RedirectResponse
    {
        $theme->update([
            'name' => $request->validated()['name'],
            'title' => $request->validated()['title'],
            'description' => $request->validated()['description'] ?? null,
            'css_vars' => $request->validated()['css_vars'],
            'font' => $request->validated()['font'] ?? null,
            'css' => $request->validated()['css'] ?? null,
            'meta' => $request->validated()['meta'] ?? null,
        ]);

        return to_route('tools.themes.show', $theme)
            ->with('toast', ['type' => 'success', 'message' => 'Theme updated successfully.']);
    }

    public function destroy(Theme $theme): RedirectResponse
    {
        $theme->delete();

        return to_route('tools.themes.index')
            ->with('toast', ['type' => 'success', 'message' => 'Theme deleted successfully.']);
    }

    public function cssPreview(Theme $theme)
    {
        return response($theme->toCssString(), 200, [
            'Content-Type' => 'text/css',
        ]);
    }
}
