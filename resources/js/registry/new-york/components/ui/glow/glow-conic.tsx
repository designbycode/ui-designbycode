import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface GlowConicProps {
    className?: string;
    [key: string]: unknown;
}

export default function GlowConic({ className, ...props }: GlowConicProps) {
    useEffect(() => {
        if (typeof CSS !== 'undefined' && CSS.registerProperty) {
            CSS.registerProperty({
                name: '--glow-conic-angle',
                syntax: '<angle>',
                initialValue: '0deg',
                inherits: false,
            });
        }
    }, []);

    return (
        <div
            {...props}
            className={cn(
                'absolute inset-0 animate-glow-conic rounded-[inherit] p-px',
                className,
            )}
            style={{
                background:
                    'repeating-conic-gradient(from var(--glow-conic-angle), transparent 10%, var(--conic-color) 20%, transparent 50%)',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) border-box',
                maskComposite: 'exclude' as const,
                WebkitMask:
                    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) border-box',
                WebkitMaskComposite: 'xor' as const,
            }}
        ></div>
    );
}
