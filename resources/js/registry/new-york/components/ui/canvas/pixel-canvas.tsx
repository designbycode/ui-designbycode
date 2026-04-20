'use client';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { usePixelCanvas } from '@/registry/new-york/hooks/use-pixel-canvas';
import type {
    AnimationType,
    PixelConfig,
    PixelShape,
} from '@/registry/new-york/lib/pixel-canvas';
import { colorPresets } from '@/registry/new-york/lib/pixel-canvas';

const pixelCanvasVariants = cva('relative overflow-hidden', {
    variants: {
        /**
         * Visual style variant
         * - default: Standard pixel animation
         * - subtle: Softer, more muted animation
         * - vibrant: Bold, high-contrast colors
         * - glow: Adds a subtle glow effect
         * - minimal: Very sparse pixel density
         */
        variant: {
            default: '',
            subtle: '',
            vibrant: '',
            glow: '',
            minimal: '',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

// Variant configurations
const variantConfigs: Record<string, Partial<PixelConfig>> = {
    default: {
        colors: colorPresets.slate,
        gap: 6,
        speed: 35,
        shimmerIntensity: 0.5,
    },
    subtle: {
        colors: ['#f8fafc', '#f1f5f9', '#e2e8f0'],
        gap: 8,
        speed: 20,
        shimmerIntensity: 0.3,
    },
    vibrant: {
        colors: colorPresets.neon,
        gap: 5,
        speed: 50,
        shimmerIntensity: 0.7,
    },
    glow: {
        colors: colorPresets.cyan,
        gap: 6,
        speed: 40,
        shimmerIntensity: 0.6,
    },
    minimal: {
        colors: colorPresets.slate,
        gap: 12,
        speed: 25,
        shimmerIntensity: 0.4,
    },
};

export interface PixelCanvasProps
    extends
        React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof pixelCanvasVariants> {
    /** Custom colors array (overrides variant colors) - e.g. ['#ff0000', '#00ff00', '#0000ff'] */
    colors?: string[];
    /** Color preset name */
    colorPreset?: keyof typeof colorPresets;
    /** Gap between pixels */
    gap?: number;
    /** Animation speed (0-100) */
    speed?: number;
    /** Minimum pixel size */
    minSize?: number;
    /** Maximum pixel size */
    maxSize?: number;
    /** Shimmer intensity (0-1) */
    shimmerIntensity?: number;
    /** Pixel shape */
    shape?: PixelShape;
    /** Animation pattern type */
    animationType?: AnimationType;
    /**
     * Controls continuous animation
     * - true: Animation runs continuously without interaction
     * - false: Animation only runs when triggered
     */
    active?: boolean;
    /**
     * Enable mouse interaction
     * - true: Hover triggers appear/disappear
     * - false: Mouse events are ignored
     */
    mouseActive?: boolean;
    /** @deprecated Use `active` instead */
    autoStart?: boolean;
    /** @deprecated Use `mouseActive` instead */
    hoverTrigger?: boolean;
    /** Disable focus events */
    noFocus?: boolean;
}

const PixelCanvas = React.forwardRef<HTMLDivElement, PixelCanvasProps>(
    (
        {
            className,
            variant = 'default',
            colors,
            colorPreset,
            gap,
            speed,
            minSize,
            maxSize,
            shimmerIntensity,
            shape,
            animationType,
            active,
            mouseActive,
            autoStart,
            hoverTrigger,
            noFocus = false,
            style,
            ...props
        },
        ref,
    ) => {
        const variantConfig = variantConfigs[variant || 'default'];

        const resolvedColors =
            colors ||
            (colorPreset ? colorPresets[colorPreset] : variantConfig.colors);

        // Handle backwards compatibility
        const resolvedActive = active ?? autoStart ?? false;
        // If active is explicitly set, disable mouse events to override hover behavior
        const resolvedMouseActive =
            active !== undefined
                ? false
                : (mouseActive ?? hoverTrigger ?? true);

        const { canvasRef, containerRef } = usePixelCanvas({
            colors: resolvedColors,
            gap: gap ?? variantConfig.gap,
            speed: speed ?? variantConfig.speed,
            minSize: minSize ?? 0.5,
            maxSize: maxSize ?? 2,
            shimmerIntensity:
                shimmerIntensity ?? variantConfig.shimmerIntensity,
            shape: shape ?? 'square',
            animationType: animationType ?? 'radial',
            active: resolvedActive,
            mouseActive: resolvedMouseActive,
            noFocus,
        });

        // Merge refs
        React.useImperativeHandle(
            ref,
            () => containerRef.current as HTMLDivElement,
        );

        return (
            <div
                ref={containerRef}
                className={cn(pixelCanvasVariants({ variant }), className)}
                style={style}
                {...props}
            >
                <canvas
                    ref={canvasRef}
                    className={cn(
                        'absolute inset-0 h-full w-full',
                        variant === 'glow' && 'blur-[0.5px]',
                    )}
                    style={{ pointerEvents: 'none' }}
                />
            </div>
        );
    },
);
PixelCanvas.displayName = 'PixelCanvas';

export { PixelCanvas, pixelCanvasVariants };
