import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';

export default function Edit({
    user,
}: {
    user: {
        id: number;
        name: string;
        email: string;
        roles: Array<{ id: number; name: string }>;
    };
}) {
    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title={`Edit ${user.name}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={admin.users.index()}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-5" />
                    </Link>
                    <Heading
                        title={user.name}
                        description="Update user information"
                    />
                </div>

                <Form
                    action={admin.users.update({ user: user.id })}
                    method="post"
                    className="max-w-lg space-y-6"
                >
                    <input type="hidden" name="_method" value="put" />

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            aria-label="name"
                            id="name"
                            name="name"
                            defaultValue={user.name}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            aria-label="email"
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={user.email}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">
                            Password (leave blank to keep current)
                        </Label>
                        <Input
                            aria-label="password"
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button type="submit">Save changes</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

Edit.layout = [
    AppLayout,
    {
        breadcrumbs: [
            { title: 'Admin', href: admin.dashboard() },
            { title: 'Users', href: admin.users.index() },
            { title: 'Edit' },
        ],
    },
];
