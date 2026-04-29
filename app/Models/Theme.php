<?php

namespace App\Models;

use Database\Factories\ThemeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'name', 'title', 'description', 'user_id',
    'css_vars', 'font', 'css', 'meta',
])]
class Theme extends Model
{
    /** @use HasFactory<ThemeFactory> */
    use HasFactory;

    protected $casts = [
        'css_vars' => 'array',
        'font' => 'array',
        'css' => 'array',
        'meta' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function toRegistryJson(): array
    {
        $cssVars = $this->css_vars ?? [];

        return [
            '$schema' => 'https://ui.shadcn.com/schema/registry-item.json',
            'name' => $this->name,
            'type' => 'registry:style',
            'css' => $this->css ?? new \stdClass,
            'cssVars' => [
                'theme' => $this->buildThemeVars(),
                'light' => $cssVars['light'] ?? [],
                'dark' => $cssVars['dark'] ?? [],
            ],
        ];
    }

    protected function buildThemeVars(): array
    {
        $vars = [];
        $light = $this->css_vars['light'] ?? [];
        $dark = $this->css_vars['dark'] ?? [];

        $keys = array_unique([...array_keys($light), ...array_keys($dark)]);

        foreach ($keys as $key) {
            if (str_starts_with($key, 'shadow-') || in_array($key, ['tracking-normal', 'spacing', 'letter-spacing'])) {
                $vars[$key] = $light[$key] ?? ($dark[$key] ?? '');
            }
        }

        return $vars;
    }

    public function toCssString(): string
    {
        $cssVars = $this->css_vars ?? [];
        $light = $cssVars['light'] ?? [];
        $dark = $cssVars['dark'] ?? [];
        $font = $this->font ?? [];

        $lines = [];

        $lines[] = '@import "tailwindcss";';
        $lines[] = '';
        $lines[] = '@custom-variant dark (&:is(.dark *));';
        $lines[] = '';

        // :root
        $lines[] = ':root {';
        foreach ($light as $key => $value) {
            $lines[] = "  --{$key}: {$value};";
        }
        if (! empty($font['sans'])) {
            $lines[] = "  --font-sans: {$font['sans']};";
        }
        if (! empty($font['serif'])) {
            $lines[] = "  --font-serif: {$font['serif']};";
        }
        if (! empty($font['mono'])) {
            $lines[] = "  --font-mono: {$font['mono']};";
        }
        $lines[] = '}';
        $lines[] = '';

        // .dark
        $lines[] = '.dark {';
        foreach ($dark as $key => $value) {
            $lines[] = "  --{$key}: {$value};";
        }
        if (! empty($font['sans'])) {
            $lines[] = "  --font-sans: {$font['sans']};";
        }
        if (! empty($font['serif'])) {
            $lines[] = "  --font-serif: {$font['serif']};";
        }
        if (! empty($font['mono'])) {
            $lines[] = "  --font-mono: {$font['mono']};";
        }
        $lines[] = '};';
        $lines[] = '';

        // @theme inline
        $lines[] = '@theme inline {';

        $colorMappings = [
            'background' => 'background',
            'foreground' => 'foreground',
            'card' => 'card',
            'card-foreground' => 'card-foreground',
            'popover' => 'popover',
            'popover-foreground' => 'popover-foreground',
            'primary' => 'primary',
            'primary-foreground' => 'primary-foreground',
            'secondary' => 'secondary',
            'secondary-foreground' => 'secondary-foreground',
            'muted' => 'muted',
            'muted-foreground' => 'muted-foreground',
            'accent' => 'accent',
            'accent-foreground' => 'accent-foreground',
            'destructive' => 'destructive',
            'destructive-foreground' => 'destructive-foreground',
            'border' => 'border',
            'input' => 'input',
            'ring' => 'ring',
            'chart-1' => 'chart-1',
            'chart-2' => 'chart-2',
            'chart-3' => 'chart-3',
            'chart-4' => 'chart-4',
            'chart-5' => 'chart-5',
            'sidebar' => 'sidebar',
            'sidebar-foreground' => 'sidebar-foreground',
            'sidebar-primary' => 'sidebar-primary',
            'sidebar-primary-foreground' => 'sidebar-primary-foreground',
            'sidebar-accent' => 'sidebar-accent',
            'sidebar-accent-foreground' => 'sidebar-accent-foreground',
            'sidebar-border' => 'sidebar-border',
            'sidebar-ring' => 'sidebar-ring',
        ];

        foreach ($colorMappings as $var => $name) {
            if (isset($light[$var])) {
                $lines[] = "  --color-{$name}: var(--{$var});";
            }
        }

        if (! empty($font['sans'])) {
            $lines[] = '  --font-sans: var(--font-sans);';
        }
        if (! empty($font['serif'])) {
            $lines[] = '  --font-serif: var(--font-serif);';
        }
        if (! empty($font['mono'])) {
            $lines[] = '  --font-mono: var(--font-mono);';
        }

        $radius = $light['radius'] ?? '0.5rem';
        $lines[] = '  --radius-sm: calc(var(--radius) - 4px);';
        $lines[] = '  --radius-md: calc(var(--radius) - 2px);';
        $lines[] = '  --radius-lg: var(--radius);';
        $lines[] = '  --radius-xl: calc(var(--radius) + 4px);';

        $shadowVars = ['shadow-2xs', 'shadow-xs', 'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl'];
        foreach ($shadowVars as $shadow) {
            if (isset($light[$shadow])) {
                $lines[] = "  --{$shadow}: var(--{$shadow});";
            }
        }

        $lines[] = '}';
        $lines[] = '';

        // @layer base
        if (! empty($this->css) && ! empty($this->css['@layer base'])) {
            $lines[] = '@layer base {';
            foreach ($this->css['@layer base'] as $selector => $props) {
                $lines[] = "  {$selector} {";
                if (is_array($props)) {
                    foreach ($props as $prop => $value) {
                        $lines[] = "    {$prop}: {$value};";
                    }
                }
                $lines[] = '  }';
            }
            $lines[] = '}';
        }

        return implode("\n", $lines);
    }
}
