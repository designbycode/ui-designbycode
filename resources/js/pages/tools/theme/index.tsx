import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import React from 'react';
import ThemeController from '@/actions/App/Http/Controllers/Tools/ThemeController';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Wrapper from '@/components/wrapper';

export default function ThemeIndex({
    themes,
}: {
    themes: Array<{
        id: number;
        name: string;
        title: string;
        description: string | null;
        created_at: string;
    }>;
}) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this theme?')) {
            router.delete(ThemeController.destroy.url({ theme: id }));
        }
    };

    return (
        <>
            <Head title="Theme Manager" />

            <Wrapper className="py-20">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Theme Manager</h1>
                        <p className="mt-2 text-muted-foreground">
                            Create and manage your shadcn/ui themes
                        </p>
                    </div>
                    <Link href={ThemeController.create()}>
                        <Button>Create New Theme</Button>
                    </Link>
                </div>

                {themes.length === 0 ? (
                    <Card className="p-12 text-center">
                        <p className="mb-4 text-muted-foreground">
                            No themes yet. Create your first theme to get
                            started.
                        </p>
                        <Link href={ThemeController.create()}>
                            <Button>Create Theme</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {themes.map((theme) => (
                            <Card key={theme.id} className="p-6">
                                <div className="mb-4 flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {theme.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {theme.name}
                                        </p>
                                    </div>
                                </div>
                                {theme.description && (
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        {theme.description}
                                    </p>
                                )}
                                <div className="flex gap-2">
                                    <Link
                                        href={ThemeController.show.url({
                                            theme: theme.id,
                                        })}
                                    >
                                        <Button variant="outline" size="sm">
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                        </Button>
                                    </Link>
                                    <Link
                                        href={ThemeController.edit.url({
                                            theme: theme.id,
                                        })}
                                    >
                                        <Button variant="outline" size="sm">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(theme.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Wrapper>
        </>
    );
}

ThemeIndex.layout = {
    breadcrumbs: [{ title: 'Themes', href: '/tools/themes' }],
};
