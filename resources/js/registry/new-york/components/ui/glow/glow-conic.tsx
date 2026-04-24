import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface GlowConicProps {
    className?: string;
    style?: React.CSSProperties;
    [key: string]: unknown;
}

export default function GlowConic({
    className,
    style,
    ...props
}: GlowConicProps) {
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
                    'repeating-conic-gradient(from var(--glow-conic-angle), var(--conic-color) 0%, transparent 50%)',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) border-box',
                maskComposite: 'exclude' as const,
                WebkitMask:
                    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) border-box',
                WebkitMaskComposite: 'xor' as const,
                ...style,
            }}
        ></div>
    );
}
