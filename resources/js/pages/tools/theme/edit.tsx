import React, { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ColorPicker } from '@/components/ui/color-picker';
import { ArrowLeft, Copy } from 'lucide-react';

type ColorVars = Record<string, string>;

interface ThemeData {
    id: number;
    name: string;
    title: string;
    description: string;
    css_vars: {
        light: ColorVars;
        dark: ColorVars;
    };
    font: {
        sans: string;
        serif: string;
        mono: string;
    };
}

export default function ThemeEdit({ theme }: { theme: ThemeData }) {
    const { data, setData, put, processing, errors } = useForm({
        name: theme.name,
        title: theme.title,
        description: theme.description,
        css_vars: {
            light: { ...theme.css_vars.light },
            dark: { ...theme.css_vars.dark },
        },
        font: { ...theme.font },
    });

    const [activeTab, setActiveTab] = useState<'light' | 'dark'>('light');
    const [copied, setCopied] = useState(false);

    const updateColor = (mode: 'light' | 'dark', key: string, value: string) => {
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

    const generateCssOutput = useMemo(() => {
        const lines: string[] = [];
        lines.push('@theme inline {');

        // Light theme variables
        Object.entries(data.css_vars.light).forEach(([key, val]) => {
            lines.push(`  --${key}: ${val};`);
        });
        if (data.font.sans) lines.push(`  --font-sans: ${data.font.sans};`);
        if (data.font.serif) lines.push(`  --font-serif: ${data.font.serif};`);
        if (data.font.mono) lines.push(`  --font-mono: ${data.font.mono};`);

        lines.push('}');
        return lines.join('\n');
    }, [data.css_vars, data.font]);

    const copyCss = async () => {
        await navigator.clipboard.writeText(generateCssOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const colorGroups = [
        { label: 'Base', keys: ['background', 'foreground'] },
        { label: 'Card', keys: ['card', 'card-foreground'] },
        { label: 'Popover', keys: ['popover', 'popover-foreground'] },
        { label: 'Primary', keys: ['primary', 'primary-foreground'] },
        { label: 'Secondary', keys: ['secondary', 'secondary-foreground'] },
        { label: 'Muted', keys: ['muted', 'muted-foreground'] },
        { label: 'Accent', keys: ['accent', 'accent-foreground'] },
        { label: 'Destructive', keys: ['destructive', 'destructive-foreground'] },
        { label: 'Border & Input', keys: ['border', 'input', 'ring', 'radius'] },
        { label: 'Charts', keys: ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'] },
        { label: 'Sidebar', keys: ['sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground', 'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring'] },
    ];

    const currentColors = activeTab === 'light' ? data.css_vars.light : data.css_vars.dark;

    return (
        <>
            <Head title={`Edit ${theme.title}`} />

            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center gap-4">
                    <Link href={`/tools/themes/${theme.id}`}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Theme</h1>
                        <p className="text-muted-foreground">{theme.title}</p>
                    </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); put(`/tools/themes/${theme.id}`); }} className="grid gap-8 lg:grid-cols-2">
                    {/* Left Panel: Controls */}
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <Card className="p-6">
                            <h2 className="mb-4 text-xl font-semibold">
                                Basic Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name">
                                        Theme Name (slug)
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="title">
                                        Display Title
                                    </Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                    />
                                    {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Color Editor */}
                        <Card className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    Colors
                                </h2>
                                <Tabs
                                    value={activeTab}
                                    onValueChange={(v) => setActiveTab(v as 'light' | 'dark')}
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
                                                                     value={currentColors[key] || '0.5rem'}
                                                                     onChange={(e) => updateColor(activeTab, key, e.target.value)}
                                                                     className="font-mono text-xs"
                                                                     placeholder="0.5rem"
                                                                 />
                                                             ) : (
                                                                 <ColorPicker
                                                                     value={currentColors[key] || ''}
                                                                     onChange={(v) => updateColor(activeTab, key, v)}
                                                                 />
                                                             )}
                                                         </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Font Settings */}
                        <Card className="p-6">
                            <h2 className="mb-4 text-xl font-semibold">
                                Typography
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="font-sans">
                                        Sans Font
                                    </Label>
                                    <Input
                                        id="font-sans"
                                        value={data.font.sans || ''}
                                        onChange={(e) => updateFont('sans', e.target.value)}
                                        placeholder="Inter, sans-serif"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="font-serif">
                                        Serif Font
                                    </Label>
                                    <Input
                                        id="font-serif"
                                        value={data.font.serif || ''}
                                        onChange={(e) => updateFont('serif', e.target.value)}
                                        placeholder="Georgia, serif"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="font-mono">
                                        Mono Font
                                    </Label>
                                    <Input
                                        id="font-mono"
                                        value={data.font.mono || ''}
                                        onChange={(e) => updateFont('mono', e.target.value)}
                                        placeholder="monospace"
                                    />
                                </div>
                            </div>
                        </Card>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full"
                        >
                            {processing ? 'Saving...' : 'Update Theme'}
                        </Button>
                    </div>

                    {/* Right Panel: Preview */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    Live Preview
                                </h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyCss}
                                >
                                    <Copy className="mr-2 h-4 w-4" />
                                    {copied ? 'Copied!' : 'Copy CSS'}
                                </Button>
                            </div>
                            <div
                                className="rounded-lg border p-6"
                                style={{
                                    ...Object.entries(data.css_vars.light).reduce(
                                        (acc, [key, val]) => ({
                                            ...acc,
                                            [`--${key}`]: val,
                                        }),
                                        {},
                                    ),
                                    '--font-sans': data.font.sans || undefined,
                                    '--font-serif': data.font.serif || undefined,
                                    '--font-mono': data.font.mono || undefined,
                                    background: 'var(--background)',
                                    color: 'var(--foreground)',
                                } as React.CSSProperties}
                            >
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            className="rounded-md px-4 py-2 text-sm"
                                            style={{
                                                background: 'var(--primary)',
                                                color: 'var(--primary-foreground)',
                                            }}
                                        >
                                            Primary
                                        </button>
                                        <button
                                            className="rounded-md px-4 py-2 text-sm"
                                            style={{
                                                background: 'var(--secondary)',
                                                color: 'var(--secondary-foreground)',
                                            }}
                                        >
                                            Secondary
                                        </button>
                                        <button
                                            className="rounded-md px-4 py-2 text-sm"
                                            style={{
                                                background: 'var(--destructive)',
                                                color: 'var(--destructive-foreground)',
                                            }}
                                        >
                                            Destructive
                                        </button>
                                    </div>
                                    <div
                                        className="rounded-lg border p-4"
                                        style={{
                                            background: 'var(--card)',
                                            color: 'var(--card-foreground)',
                                        }}
                                    >
                                        <h3 className="font-semibold">
                                            Card Preview
                                        </h3>
                                        <p className="text-sm opacity-80">
                                            This is how cards will look.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* CSS Output */}
                        <Card className="p-6">
                            <h2 className="mb-4 text-xl font-semibold">
                                CSS Output
                            </h2>
                            <pre className="max-h-96 overflow-auto rounded-md bg-muted p-4 text-xs">
                                <code>{generateCssOutput}</code>
                            </pre>
                        </Card>
                    </div>
                </form>
            </div>
        </>
    );
}

ThemeEdit.layout = {
    breadcrumbs: [
        { title: 'Themes', href: '/tools/themes' },
        { title: 'Edit Theme' },
    ],
};
