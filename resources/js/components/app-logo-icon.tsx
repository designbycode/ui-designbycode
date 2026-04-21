import { cn } from '@/lib/utils';

export default function AppLogoIcon({
    className,
    ...props
}: {
    className?: string;
}) {
    return (
        <span
            className={cn(
                `text-md grid size-7 place-content-center rounded-sm bg-foreground font-semibold text-background`,
                className,
            )}
            {...props}
        >
            ui
        </span>
    );
}
