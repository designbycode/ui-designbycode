<?php

namespace App\Http\Controllers\Docs\Themes;

use App\Http\Controllers\Controller;
use App\Models\Registry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThemeIndexController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {

        $themes = Registry::query()->themes()->get();
//        return $themes;

        return Inertia::render('docs/themes/index', [
            'themes' => $themes
        ]);
    }
}
