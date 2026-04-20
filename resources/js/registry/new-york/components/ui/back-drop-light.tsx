import type { ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/utils';

type BackDropLightProps = {
    children?: ReactNode;
    className?: string;
    blur?: number;
    intensity?: number;
    saturation?: number;
    opacity?: number;
};

export function BackDropLight({
    blur = 20,
    intensity = 1,
    saturation = 4,
    opacity = 0.6,
    children,
    className,
}: BackDropLightProps) {
    const id = useId();

    return (
        <div className={cn('relative', className)}>
            <svg width="0" height="0" aria-hidden="true">
                <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation={blur} result="blur" />
                    <feColorMatrix
                        in="blur"
                        type="matrix"
                        values={`
              ${saturation} 0 0 0 0
              0 ${saturation} 0 0 0
              0 0 ${saturation} 0 0
              0 0 0 ${intensity} 0
            `}
                    />
                </filter>
            </svg>

            {/* Glow layer */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    filter: `url(#${id})`,
                    opacity,
                    pointerEvents: 'none',
                    willChange: 'filter',
                    transform: 'translateZ(0)',
                }}
            >
                {children}
            </div>

            {/* Actual content */}
            <div style={{ position: 'relative' }}>{children}</div>
        </div>
    );
}
