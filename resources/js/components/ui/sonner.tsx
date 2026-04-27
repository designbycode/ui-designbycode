import { useFlashToast } from '@/hooks/use-flash-toast';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
    const { isDark } = useDarkMode();

    useFlashToast();

    return (
        <Sonner
            theme={isDark ? 'dark' : 'light'}
            className="toaster group"
            position="bottom-right"
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                } as React.CSSProperties
            }
            {...props}
        />
    );
}

export { Toaster };