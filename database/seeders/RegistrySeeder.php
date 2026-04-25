<?php

namespace Database\Seeders;

use App\Models\Registry;
use Illuminate\Database\Seeder;

class RegistrySeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = base_path('registry.json');
        $json = json_decode(file_get_contents($jsonPath), true);

        foreach ($json['items'] as $item) {
            Registry::updateOrCreate(
                ['name' => $item['name']],
                [
                    'type' => $item['type'],
                    'title' => $item['title'] ?? null,
                    'description' => $item['description'] ?? null,
                    'author' => $item['author'] ?? null,
                    'dependencies' => $item['dependencies'] ?? null,
                    'devDependencies' => $item['devDependencies'] ?? null,
                    'registryDependencies' => $item['registryDependencies'] ?? null,
                    'files' => $item['files'] ?? null,
                    'tailwind' => $item['tailwind'] ?? null,
                    'envVars' => $item['envVars'] ?? null,
                    'docs' => $item['docs'] ?? null,
                    'categories' => $item['categories'] ?? null,
                    'extends' => $item['extends'] ?? null,
                    'style' => $item['style'] ?? null,
                    'iconLibrary' => $item['iconLibrary'] ?? null,
                    'baseColor' => $item['baseColor'] ?? null,
                    'theme' => $item['theme'] ?? null,
                    'meta' => $item['meta'],
                    'font' => $item['font'] ?? null,
                    'css_vars' => $item['cssVars'] ?? null,
                    'css' => $item['css'] ?? null,
                ]
            );
        }
    }
}
