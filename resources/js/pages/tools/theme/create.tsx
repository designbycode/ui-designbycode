import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Palette } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ColorPicker } from '@/components/ui/color-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Wrapper from '@/components/wrapper';
import { FontSelect } from '@/components/ui/font-select';
import type { PresetTheme } from '@/lib/preset-themes';
import { presetThemes } from '@/lib/preset-themes';
import ThemeController from '@/actions/App/Http/Controllers/Tools/ThemeController';

type ColorVars = Record<string, string>;

export default function ThemeCreate({ fonts = [] }: { fonts?: Array<{ name: string; title: string; description?: string }> }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        title: '',
        description: '',
        css_vars: {
            light: {},
            dark: {},
        },
        font: { sans: '', serif: '', mono: '' },
    });

    const [activeTab, setActiveTab] = React.useState<'light' | 'dark'>('light');
    const [showPresets, setShowPresets] = React.useState(false);

    const applyPreset = (preset: PresetTheme) => {
        setData('name', preset.name);
        setData('title', preset.title);
        setData('description', preset.description);
        setData('css_vars', {
            light: { ...preset.css_vars.light },
            dark: { ...preset.css_vars.dark },
        });

        if (preset.font) {
            setData('font', { ...preset.font });
        }

        setShowPresets(false);
    };

    const updateColor = (
        mode: 'light' | 'dark',
        key: string,
        value: string,
    ) => {
        setData('css_vars', {
            ...data.css_vars,
            [mode]: {
                ...data.css_vars[mode],
                [key]: value,
            },
        });
    };

    const updateFont = (key: 'sans' | 'serif' | 'mono', value: string) => {
        const newFont = { ...data.font } as { sans: string; serif: string; mono: string };
        newFont[key] = value;
        setData('font', newFont);
    };

    const colorGroups = [
        { label: 'Base', keys: ['background', 'foreground'] },
        { label: 'Card', keys: ['card', 'card-foreground'] },
        { label: 'Primary', keys: ['primary', 'primary-foreground'] },
        { label: 'Secondary', keys: ['secondary', 'secondary-foreground'] },
        { label: 'Muted', keys: ['muted', 'muted-foreground'] },
        { label: 'Accent', keys: ['accent', 'accent-foreground'] },
        { label: 'Destructive', keys: ['destructive', 'destructive-foreground'] },
        { label: 'Border & Input', keys: ['border', 'input', 'ring', 'radius'] },
        { label: 'Charts', keys: ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'] },
        { label: 'Sidebar', keys: ['sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground', 'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring'] },
    ];

    const currentColors =
        activeTab === 'light' ? data.css_vars.light : data.css_vars.dark;

    const generateCSS = () => {
        const lines = ['@theme inline {'];
        const allVars = { ...data.css_vars.light, ...data.css_vars.dark };
        Object.entries(allVars).forEach(([key, value]) => {
            lines.push(`  --${key}: ${value};`);
        });

        if (data.font.sans) {
            lines.push(`  --font-sans: ${data.font.sans};`);
        }

        if (data.font.serif) {
            lines.push(`  --font-serif: ${data.font.serif};`);
        }

        if (data.font.mono) {
            lines.push(`  --font-mono: ${data.font.mono};`);
        }

        lines.push('}');
        return lines.join('\n');
    };

    const copyCSS = () => {
        navigator.clipboard.writeText(generateCSS());
    };

    return (
        <>
            <Head title="Create Theme" />

            <Wrapper className="py-20">
                <div className="mb-6 flex items-center gap-4">
                    <Link href="/tools/themes">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Theme Editor</h1>
                        <p className="text-muted-foreground">
                            Create a custom shadcn/ui theme
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(ThemeController.store.url());
                    }}
                    className="grid gap-8 lg:grid-cols-2"
                >
                    <div className="space-y-6">
                        <Card className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    Basic Information
                                </h2>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowPresets(!showPresets)}
                                >
                                    <Palette className="mr-2 h-4 w-4" />
                                    {showPresets
                                        ? 'Hide Presets'
                                        : 'Browse Presets'}
                                </Button>
                            </div>

                            {showPresets && (
                                <div className="mb-4 rounded-lg border bg-muted/50 p-4">
                                    <h3 className="mb-3 text-sm font-medium">
                                        Preset Themes
                                    </h3>
                                    <div className="grid gap-2">
                                        {presetThemes.map((preset) => (
                                            <button
                                                key={preset.name}
                                                type="button"
                                                onClick={() =>
                                                    applyPreset(preset)
                                                }
                                                className="rounded-md border p-3 text-left transition-colors hover:bg-accent"
                                            >
                                                <div className="font-medium">
                                                    {preset.title}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {preset.description}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name">
                                        Theme Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="starry-night"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="title">
                                        Display Title
                                    </Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        placeholder="Starry Night"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="A beautiful theme..."
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    Colors
                                </h2>
                                <Tabs
                                    value={activeTab}
                                    onValueChange={(v) =>
                                        setActiveTab(v as 'light' | 'dark')
                                    }
                                >
                                    <TabsList>
                                        <TabsTrigger value="light">
                                            Light
                                        </TabsTrigger>
                                        <TabsTrigger value="dark">
                                            Dark
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            <div className="space-y-6">
                                {colorGroups.map((group) => (
                                    <div key={group.label}>
                                        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                                            {group.label}
                                        </h3>
                                        <div className="grid gap-2">
                                            {group.keys.map((key) => (
                                                <div
                                                    key={key}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Label className="w-48 text-xs">
                                                        {key}
                                                    </Label>
                                                    {key === 'radius' ? (
                                                        <Input
                                                            value={
                                                                currentColors[
                                                                    key
                                                                ] || '0.5rem'
                                                            }
                                                            onChange={(e) =>
                                                                updateColor(
                                                                    activeTab,
                                                                    key,
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="font-mono text-xs"
                                                            placeholder="0.5rem"
                                                        />
                                                    ) : (
                                                        <ColorPicker
                                                            value={
                                                                currentColors[key] || ''
                                                            }
                                                            onChange={(v) =>
                                                                updateColor(
                                                                    activeTab,
                                                                    key,
                                                                    v,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h2 className="mb-4 text-xl font-semibold">
                                Typography
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <Label>Sans Font</Label>
                                    <FontSelect
                                        value={data.font.sans}
                                        onChange={(v) => updateFont('sans', v)}
                                        fonts={fonts}
                                        placeholder="Select sans font..."
                                    />
                                </div>
                                <div>
                                    <Label>Serif Font</Label>
                                    <FontSelect
                                        value={data.font.serif}
                                        onChange={(v) => updateFont('serif', v)}
                                        fonts={fonts}
                                        placeholder="Select serif font..."
                                    />
                                </div>
                                <div>
                                    <Label>Mono Font</Label>
                                    <FontSelect
                                        value={data.font.mono}
                                        onChange={(v) => updateFont('mono', v)}
                                        fonts={fonts}
                                        placeholder="Select mono font..."
                                    />
                                </div>
                            </div>
                        </Card>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full"
                        >
                            {processing ? 'Saving...' : 'Save Theme'}
                        </Button>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    Preview
                                </h2>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={copyCSS}
                                >
                                    Copy CSS
                                </Button>
                            </div>
                            <div
                                className="rounded-lg border p-6"
                                style={
                                    {
                                        '--background':
                                            data.css_vars.light.background ||
                                            '#fff',
                                        '--foreground':
                                            data.css_vars.light.foreground ||
                                            '#000',
                                        background: 'var(--background)',
                                        color: 'var(--foreground)',
                                    } as React.CSSProperties
                                }
                            >
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        className="rounded-md px-4 py-2 text-sm"
                                        style={{
                                            background:
                                                'var(--primary)',
                                            color: 'var(--primary-foreground)',
                                        }}
                                    >
                                        Primary
                                    </button>
                                    <button
                                        className="rounded-md px-4 py-2 text-sm"
                                        style={{
                                            background:
                                                'var(--secondary)',
                                            color: 'var(--secondary-foreground)',
                                        }}
                                    >
                                        Secondary
                                    </button>
                                </div>
                            </div>
                            <pre className="mt-4 overflow-auto rounded-lg bg-muted p-4 text-xs">
                                {generateCSS()}
                            </pre>
                        </Card>
                    </div>
                </form>
            </Wrapper>
        </>
    );
}

ThemeCreate.layout = {
    breadcrumbs: [
        { title: 'Themes', href: '/tools/themes' },
        { title: 'Create Theme' },
    ],
};
