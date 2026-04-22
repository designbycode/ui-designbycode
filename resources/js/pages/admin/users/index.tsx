import { Head, Link } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/admin';
import { index as usersIndex } from '@/routes/admin/users';

export default function Index({
    users,
}: {
    users: {
        data: Array<{
            id: number;
            name: string;
            email: string;
            roles: Array<{ name: string }>;
            created_at: string;
            deleted_at: string | null;
        }>;
        links: Array<{ url: string; label: string; active: boolean }>;
    };
}) {
    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title="Users" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Users"
                        description="Manage your organization's users"
                    />
                    <Button asChild size="sm" className="gap-2">
                        <Link href={`#`}>
                            <UserPlus className="size-4" />
                            <span>Add user</span>
                        </Link>
                    </Button>
                </div>

                <div className="w-full rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-15">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Created</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data?.map((user) => {
                                return (
                                    <TableRow key={user.id}>
                                        <TableCell className="w-15">
                                            {user.id}
                                        </TableCell>
                                        <TableCell>{user.name}</TableCell>

                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge>User</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">
                                                {user.created_at}
                                                {/*{formatDistanceToNow(*/}
                                                {/*    new Date(user.created_at),*/}
                                                {/*    {*/}
                                                {/*        addSuffix: true,*/}
                                                {/*    },*/}
                                                {/*)}*/}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

Index.layout = [
    AppLayout,
    {
        breadcrumbs: [
            { title: 'Admin', href: dashboard() },
            { title: 'Users', href: usersIndex() },
        ],
    },
];
