import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';

export default function AppLogo({
    className,
    ...props
}: {
    className?: string;
}) {
    return (
        <div
            {...props}
            className={cn(
                'flex items-center space-x-1 text-xl tracking-tight focus:outline-offset-4',
                className,
            )}
        >
            <AppLogoIcon />

            <span className="text-md">designbycode</span>
        </div>
    );
}
