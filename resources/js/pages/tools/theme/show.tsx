import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import ThemeController from '@/actions/App/Http/Controllers/Tools/ThemeController';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Copy, Download, Edit } from 'lucide-react';
import Wrapper from '@/components/wrapper';

export default function ThemeShow({
    theme,
}: {
    theme: {
        id: number;
        name: string;
        title: string;
        description: string | null;
        css_vars: {
            light: Record<string, string>;
            dark: Record<string, string>;
        };
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

            <Wrapper className="py-20">
                <div className="mb-8 flex items-center gap-4">
                    <Link href={ThemeController.index()}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{theme.title}</h1>
                        <p className="text-muted-foreground">
                            {theme.name}{' '}
                            {theme.description && `- ${theme.description}`}
                        </p>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Live Preview */}
                    <div>
                        <h2 className="mb-4 text-xl font-semibold">Preview</h2>
                        <div
                            className="rounded-lg border p-6"
                            style={
                                {
                                    ...Object.entries(
                                        theme.css_vars.light,
                                    ).reduce(
                                        (acc, [key, val]) => ({
                                            ...acc,
                                            [`--${key}`]: val,
                                        }),
                                        {},
                                    ),
                                    ...(theme.font?.sans
                                        ? { '--font-sans': theme.font.sans }
                                        : {}),
                                    ...(theme.font?.serif
                                        ? { '--font-serif': theme.font.serif }
                                        : {}),
                                    ...(theme.font?.mono
                                        ? { '--font-mono': theme.font.mono }
                                        : {}),
                                    background: 'var(--background)',
                                    color: 'var(--foreground)',
                                } as React.CSSProperties
                            }
                        >
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <button className="rounded-md bg-[var(--primary)] px-4 py-2 text-[var(--primary-foreground)]">
                                        Primary
                                    </button>
                                    <button className="rounded-md bg-[var(--secondary)] px-4 py-2 text-[var(--secondary-foreground)]">
                                        Secondary
                                    </button>
                                    <button className="rounded-md bg-[var(--destructive)] px-4 py-2 text-[var(--destructive-foreground)]">
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
                                        This is how cards will look with your
                                        theme.
                                    </p>
                                </div>
                                <input
                                    className="w-full rounded-md border px-3 py-2"
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
                        <h3 className="mt-6 mb-4 text-lg font-semibold">
                            Dark Mode Preview
                        </h3>
                        <div
                            className="dark rounded-lg border p-6"
                            style={
                                {
                                    ...Object.entries(
                                        theme.css_vars.dark,
                                    ).reduce(
                                        (acc, [key, val]) => ({
                                            ...acc,
                                            [`--${key}`]: val,
                                        }),
                                        {},
                                    ),
                                    ...(theme.font?.sans
                                        ? { '--font-sans': theme.font.sans }
                                        : {}),
                                    background: 'var(--background)',
                                    color: 'var(--foreground)',
                                } as React.CSSProperties
                            }
                        >
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <button className="rounded-md bg-[var(--primary)] px-4 py-2 text-[var(--primary-foreground)]">
                                        Primary
                                    </button>
                                    <button className="rounded-md bg-[var(--secondary)] px-4 py-2 text-[var(--secondary-foreground)]">
                                        Secondary
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
                                        Dark mode card preview.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Code Output */}
                    <div>
                        <Tabs defaultValue="css">
                            <TabsList className="mb-4">
                                <TabsTrigger value="css">
                                    CSS Output
                                </TabsTrigger>
                                <TabsTrigger value="json">
                                    Registry JSON
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="css">
                                <Card className="p-4">
                                    <div className="mb-2 flex justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                copyToClipboard(
                                                    theme.css_output,
                                                    'css',
                                                )
                                            }
                                        >
                                            <Copy className="mr-2 h-4 w-4" />
                                            {copied === 'css'
                                                ? 'Copied!'
                                                : 'Copy'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="ml-2"
                                            onClick={() =>
                                                downloadFile(
                                                    theme.css_output,
                                                    `${theme.name}.css`,
                                                )
                                            }
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </Button>
                                    </div>
                                    <pre className="overflow-auto rounded-md bg-muted p-4 text-sm">
                                        <code>{theme.css_output}</code>
                                    </pre>
                                </Card>
                            </TabsContent>
                            <TabsContent value="json">
                                <Card className="p-4">
                                    <div className="mb-2 flex justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                copyToClipboard(
                                                    JSON.stringify(
                                                        theme.registry_json,
                                                        null,
                                                        2,
                                                    ),
                                                    'json',
                                                )
                                            }
                                        >
                                            <Copy className="mr-2 h-4 w-4" />
                                            {copied === 'json'
                                                ? 'Copied!'
                                                : 'Copy'}
                                        </Button>
                                    </div>
                                    <pre className="overflow-auto rounded-md bg-muted p-4 text-sm">
                                        <code>
                                            {JSON.stringify(
                                                theme.registry_json,
                                                null,
                                                2,
                                            )}
                                        </code>
                                    </pre>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <div className="mt-6 flex gap-2">
                            <Link
                                href={ThemeController.edit.url({
                                    theme: theme.id,
                                })}
                            >
                                <Button>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Theme
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Wrapper>
        </>
    );
}

ThemeShow.layout = {
    breadcrumbs: [
        { title: 'Themes', href: '/tools/themes' },
        { title: 'View Theme' },
    ],
};
