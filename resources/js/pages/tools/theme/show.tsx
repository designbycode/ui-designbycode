import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ThemeController from '@/actions/App/Http/Controllers/Tools/ThemeController';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, Edit, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function ThemeShow({
    theme,
}: {
    theme: {
        id: number;
        name: string;
        title: string;
        description: string | null;
        css_vars: { light: Record<string, string>; dark: Record<string, string> };
        font: { sans?: string; serif?: string; mono?: string } | null;
        registry_json: Record<string, unknown>;
        css_output: string;
    };
}) {
    const [copied, setCopied] = useState<'css' | 'json' | null>(null);

    const copyToClipboard = async (text: string, type: 'css' | 'json') => {
        await navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const downloadFile = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <Head title={`${theme.title} - Theme`} />

            <div className="container mx-auto py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href={ThemeController.index()}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{theme.title}</h1>
                        <p className="text-muted-foreground">
                            {theme.name} {theme.description && `- ${theme.description}`}
                        </p>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Live Preview */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Preview</h2>
                        <div
                            className="p-6 rounded-lg border"
                            style={{
                                ...Object.entries(theme.css_vars.light).reduce(
                                    (acc, [key, val]) => ({ ...acc, [`--${key}`]: val }),
                                    {}
                                ),
                                ...(theme.font?.sans ? { '--font-sans': theme.font.sans } : {}),
                                ...(theme.font?.serif ? { '--font-serif': theme.font.serif } : {}),
                                ...(theme.font?.mono ? { '--font-mono': theme.font.mono } : {}),
                                background: 'var(--background)',
                                color: 'var(--foreground)',
                            } as React.CSSProperties}
                        >
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md">
                                        Primary
                                    </button>
                                    <button className="px-4 py-2 bg-[var(--secondary)] text-[var(--secondary-foreground)] rounded-md">
                                        Secondary
                                    </button>
                                    <button className="px-4 py-2 bg-[var(--destructive)] text-[var(--destructive-foreground)] rounded-md">
                                        Destructive
                                    </button>
                                </div>
                                <div className="p-4 rounded-lg border" style={{ background: 'var(--card)', color: 'var(--card-foreground)' }}>
                                    <h3 className="font-semibold">Card Preview</h3>
                                    <p className="text-sm opacity-80">This is how cards will look with your theme.</p>
                                </div>
                                <input
                                    className="w-full px-3 py-2 rounded-md border"
                                    style={{
                                        background: 'var(--input)',
                                        borderColor: 'var(--border)',
                                        color: 'var(--foreground)',
                                    }}
                                    placeholder="Input preview"
                                />
                            </div>
                        </div>

                        {/* Dark Mode Preview */}
                        <h3 className="text-lg font-semibold mt-6 mb-4">Dark Mode Preview</h3>
                        <div
                            className="p-6 rounded-lg border dark"
                            style={{
                                ...Object.entries(theme.css_vars.dark).reduce(
                                    (acc, [key, val]) => ({ ...acc, [`--${key}`]: val }),
                                    {}
                                ),
                                ...(theme.font?.sans ? { '--font-sans': theme.font.sans } : {}),
                                background: 'var(--background)',
                                color: 'var(--foreground)',
                            } as React.CSSProperties}
                        >
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md">
                                        Primary
                                    </button>
                                    <button className="px-4 py-2 bg-[var(--secondary)] text-[var(--secondary-foreground)] rounded-md">
                                        Secondary
                                    </button>
                                </div>
                                <div className="p-4 rounded-lg border" style={{ background: 'var(--card)', color: 'var(--card-foreground)' }}>
                                    <h3 className="font-semibold">Card Preview</h3>
                                    <p className="text-sm opacity-80">Dark mode card preview.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Code Output */}
                    <div>
                        <Tabs defaultValue="css">
                            <TabsList className="mb-4">
                                <TabsTrigger value="css">CSS Output</TabsTrigger>
                                <TabsTrigger value="json">Registry JSON</TabsTrigger>
                            </TabsList>
                            <TabsContent value="css">
                                <Card className="p-4">
                                    <div className="flex justify-end mb-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => copyToClipboard(theme.css_output, 'css')}
                                        >
                                            <Copy className="w-4 h-4 mr-2" />
                                            {copied === 'css' ? 'Copied!' : 'Copy'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="ml-2"
                                            onClick={() => downloadFile(theme.css_output, `${theme.name}.css`)}
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                    <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                                        <code>{theme.css_output}</code>
                                    </pre>
                                </Card>
                            </TabsContent>
                            <TabsContent value="json">
                                <Card className="p-4">
                                    <div className="flex justify-end mb-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => copyToClipboard(JSON.stringify(theme.registry_json, null, 2), 'json')}
                                        >
                                            <Copy className="w-4 h-4 mr-2" />
                                            {copied === 'json' ? 'Copied!' : 'Copy'}
                                        </Button>
                                    </div>
                                    <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                                        <code>{JSON.stringify(theme.registry_json, null, 2)}</code>
                                    </pre>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <div className="mt-6 flex gap-2">
                            <Link href={ThemeController.edit.url({ theme: theme.id })}>
                                <Button>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Theme
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ThemeShow.layout = {
    breadcrumbs: [
        { title: 'Themes', href: '/tools/themes' },
        { title: 'View Theme' },
    ],
};
