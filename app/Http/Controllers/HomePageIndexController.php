<?php

namespace App\Http\Controllers;

use App\Models\Registry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomePageIndexController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $fonts = Registry::query()->fonts()->get();


        return Inertia::render('home', [
            'canRegister' => Features::enabled(Features::registration()),
            'fonts' => $fonts,
        ]);
    }
}
