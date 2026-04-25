<?php

namespace Database\Factories;

use App\Models\Registry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Registry>
 */
class RegistryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'font-inter',
            'type' => 'registry:font',
            'meta' => [
                'category' => 'fonts',
                'version' => '1.0.0',
            ],
            'font' => [
                'family' => "'Inter Variable', sans-serif",
                'provider' => 'google',
                'import' => 'Inter',
                'variable' => '--font-sans',
                'subsets' => ['latin'],
                'dependency' => '@fontsource-variable/inter',
            ],
            'css_vars' => null,
            'css' => null,
        ];
    }
}
