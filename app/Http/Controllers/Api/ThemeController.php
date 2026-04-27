<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Registry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ThemeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $themes = Registry::query()
            ->themes()
            ->get()
            ->map(fn ($theme) => $this->formatTheme($theme));

        return response()->json($themes);
    }

    public function show(string $name): JsonResponse
    {
        $theme = Registry::query()
            ->themes()
            ->where('name', $name)
            ->first();

        if (! $theme) {
            return response()->json(['error' => 'Theme not found'], 404);
        }

        return response()->json($this->formatTheme($theme));
    }

    private function formatTheme(Registry $theme): array
    {
        return [
            'name' => $theme->name,
            'title' => $theme->title,
            'description' => $theme->meta['description'] ?? null,
            'author' => $theme->author,
            'baseColor' => $theme->baseColor,
            'style' => $theme->style,
            'font' => $theme->font,
            'cssVars' => $theme->css_vars,
            'css' => $theme->css,
            'registryDependencies' => $theme->registryDependencies ?? [],
            'meta' => $theme->meta,
        ];
    }
}
