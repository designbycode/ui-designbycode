'use client';
import type { HTMLAttributes, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useGlowStack } from '@/registry/new-york/components/ui/glow/glow-stack';
import {
    isCircleOverlappingRect,
    isPointInRect,
    toElementSpace,
} from '@/registry/new-york/lib/glow-geometry';

const BORDER_MASK = {
    padding: '2px',
    background: 'transparent',
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) border-box',
    maskComposite: 'exclude' as const,
    WebkitMask:
        'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) border-box',
    WebkitMaskComposite: 'xor' as const,
} as const;

interface GlowRadialProps extends HTMLAttributes<HTMLElement> {
    children?: ReactNode;
    /** Colors for the radial gradient. First color is the center. */
    colors?: string | string[];
    /** Gradient radius in px. Default: 500 */
    size?: number;
    /** Border width in px. Default: 2 */
    borderWidth?: number;
    /** Render as any block element. Default: "div" */
    as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer' | 'aside';
}

export function GlowRadial({
    className,
    children,
    colors = 'var(--color-primary)',
    size = 500,
    borderWidth = 3,
    as: Comp = 'div',
    style,
    ...props
}: GlowRadialProps) {
    const ref = useRef<HTMLDivElement>(null);
    const glowStack = useGlowStack();
    const position = glowStack?.position ?? { x: -1000, y: -1000 };
    const radius = glowStack?.radius ?? 100;
    const [rect, setRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        const updateRect = () => {
            setRect(ref.current?.getBoundingClientRect() ?? null);
        };

        updateRect();

        const handleUpdate = () => updateRect();
        window.addEventListener('resize', handleUpdate, { passive: true });
        window.addEventListener('scroll', handleUpdate, { passive: true });

        return () => {
            window.removeEventListener('resize', handleUpdate);
            window.removeEventListener('scroll', handleUpdate);
        };
    }, []);

    const near = rect ? isCircleOverlappingRect(position, radius, rect) : false;
    const over = rect ? isPointInRect(position, rect) : false;
    const ep = rect ? toElementSpace(position, rect) : { x: 0, y: 0 };

    const colorsArray = Array.isArray(colors)
        ? colors
        : [colors, 'transparent'];
    const gradient = `radial-gradient(circle at ${ep.x}px ${ep.y}px, ${colorsArray.join(', ')}, transparent ${size}px)`;
    const borderMask = { ...BORDER_MASK, padding: `${borderWidth}px` };

    return (
        <Comp
            ref={ref}
            className={cn('relative isolate rounded-[inherit]', className)}
            style={style}
            {...props}
        >
            {/* Hard border glow */}
            <div
                aria-hidden
                className={cn(
                    'pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300',
                    near ? 'opacity-100' : 'opacity-0',
                )}
                style={{ ...borderMask, background: gradient }}
            />
            {/* Soft blur halo */}
            <div
                aria-hidden
                className={cn(
                    'pointer-events-none absolute inset-0 rounded-[inherit] blur-2xl transition-opacity duration-300',
                    near ? 'opacity-10' : 'opacity-0',
                )}
                style={{ ...borderMask, background: gradient }}
            />
            {/* Subtle fill when directly over */}
            <div
                aria-hidden
                className={cn(
                    'pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300',
                    over ? 'opacity-5' : 'opacity-0',
                )}
                style={{ background: gradient }}
            />
            {children}
        </Comp>
    );
}
