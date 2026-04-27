<?php

namespace App\Models;

use Database\Factories\RegistryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'name', 'type', 'title', 'description', 'author',
    'dependencies', 'devDependencies', 'registryDependencies',
    'files', 'tailwind', 'envVars', 'docs', 'categories',
    'extends', 'style', 'iconLibrary', 'baseColor', 'theme',
    'meta', 'font', 'css_vars', 'css',
])]
class Registry extends Model
{
    /** @use HasFactory<RegistryFactory> */
    use HasFactory;

    protected $casts = [
        'meta' => 'array',
        'font' => 'array',
        'css_vars' => 'array',
        'css' => 'array',
        'dependencies' => 'array',
        'devDependencies' => 'array',
        'registryDependencies' => 'array',
        'files' => 'array',
        'tailwind' => 'array',
        'envVars' => 'array',
        'categories' => 'array',
    ];

    public function scopeThemes($query)
    {
        return $query->where('type', 'registry:theme');
    }

    public function scopeFonts($query)
    {
        return $query->where('type', 'registry:font');
    }

    public function scopeLib($query)
    {
        return $query->where('type', 'registry:lib');
    }

    public function scopeUi($query)
    {
        return $query->where('type', 'registry:ui');
    }

    public function scopeComponent($query)
    {
        return $query->where('type', 'registry:component');
    }

    protected function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', "%{$search}%");
    }
}
