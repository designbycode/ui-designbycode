import { Breadcrumbs } from '@/components/breadcrumbs';
import Wrapper from '@/components/wrapper';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';

export interface DocsLayoutProps {
    className?: string;
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

const links = [
    {
        title: 'Animations',
        href: '/docs/animations',
    },
    {
        title: 'Components',
        href: '/docs/components',
    },
    {
        title: 'Block',
        href: '/docs/block',
    },
];

export default function DocsLayout({
    className,
    children,
    breadcrumbs,
    ...props
}: DocsLayoutProps) {
    return (
        <Wrapper {...props} className={cn('mt-20', className)}>
            {breadcrumbs && (
                <div className={`my-4`}>
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            )}
            <div
                className={
                    'grid grid-cols-1 gap-4 py-4 lg:grid-cols-[220px_minmax(0,1fr)_220px]'
                }
            >
                <aside className={`hidden lg:flex`}>
                    <ul className="space-y-2">
                        {links.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href}>{link.title}</Link>
                            </li>
                        ))}
                    </ul>
                </aside>
                <div>{children}</div>
                <aside className={`relative hidden lg:flex`}>
                    <div className={`relative`}>
                        <Card className="sticky top-18 bg-muted">
                            <CardContent>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit. Est, necessitatibus.
                            </CardContent>
                        </Card>
                    </div>
                </aside>
            </div>
        </Wrapper>
    );
}

DocsLayout.displayName = 'DocsLayout';
