import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export default function Wrapper({
    children,
    className,
    padding = true,
}: {
    children: ReactNode;
    className?: string;
    padding?: boolean;
}) {
    return (
        <div
            className={cn(
                'container mx-auto w-full',
                padding && 'px-4 md:px-6 lg:px-8',
                className,
            )}
        >
            {children}
        </div>
    );
}
