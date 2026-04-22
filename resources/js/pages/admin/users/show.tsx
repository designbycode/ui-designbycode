import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';

export default function Show({
    user,
}: {
    user: {
        id: number;
        name: string;
        email: string;
        email_verified_at: string | null;
        created_at: string;
        roles: Array<{ id: number; name: string }>;
    };
}) {
    return (
        <>
            <Head title={user.name} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={admin.users.index()}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-5" />
                    </Link>
                    <Heading title={user.name} />
                </div>

                <div className="max-w-lg space-y-6">
                    <dl className="space-y-4">
                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-muted-foreground">
                                Email
                            </dt>
                            <dd className="text-sm">{user.email}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-muted-foreground">
                                Verified
                            </dt>
                            <dd className="text-sm">
                                {user.email_verified_at
                                    ? new Date(
                                          user.email_verified_at,
                                      ).toLocaleDateString()
                                    : 'No'}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-muted-foreground">
                                Roles
                            </dt>
                            <dd className="text-sm">
                                {user.roles.map((r) => r.name).join(', ') ||
                                    '—'}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-muted-foreground">
                                Created
                            </dt>
                            <dd className="text-sm">
                                {new Date(user.created_at).toLocaleDateString()}
                            </dd>
                        </div>
                    </dl>

                    <Link
                        href={admin.users.edit({ user: user.id })}
                        className="inline-block"
                    >
                        Edit user
                    </Link>
                </div>
            </div>
        </>
    );
}

Show.layout = [
    AppLayout,
    {
        breadcrumbs: [
            { title: 'Admin', href: admin.dashboard() },
            { title: 'Users', href: admin.users.index() },
            { title: 'View' },
        ],
    },
];
