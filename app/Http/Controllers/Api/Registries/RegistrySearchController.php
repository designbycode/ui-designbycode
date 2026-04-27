<?php

namespace App\Http\Controllers\Api\Registries;

use App\Http\Controllers\Controller;
use App\Models\Registry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegistrySearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $query = $request->query('q', '');
        $type = $request->query('type');

        $results = Registry::query()
            ->when($query, fn ($q) => $q->where('name', 'like', "%{$query}%"))
            ->when($type, fn ($q) => $q->where('type', $type))
            ->limit(20)
            ->get()
            ->map(fn ($item) => [
                'name' => $item->name,
                'title' => $item->title,
                'type' => $item->type,
                'category' => $item->meta['category'] ?? null,
                'description' => $item->meta['description'] ?? null,
                'baseColor' => $item->baseColor ?? null,
            ]);

        return response()->json($results);
    }
}
