'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
    AnimationDirection,
    PixelConfig,
    PixelState,
} from '@/registry/new-york/lib/pixel-canvas';
import {
    calculateDelay,
    createPixelState,
    defaultPixelConfig,
    drawPixel,
    updatePixelAppear,
    updatePixelDisappear,
} from '@/registry/new-york/lib/pixel-canvas';

interface UsePixelCanvasOptions extends Partial<PixelConfig> {
    /**
     * Controls whether animation runs continuously
     * - When true: animation runs automatically and continuously
     * - When false: animation only runs when triggered via JS or mouse
     */
    active?: boolean;
    /**
     * Enable mouse interaction (hover triggers animation)
     * - When true: mouseenter triggers appear, mouseleave triggers disappear
     * - When false: mouse events are ignored
     */
    mouseActive?: boolean;
    /** @deprecated Use `active` instead. Auto-start animation on mount */
    autoStart?: boolean;
    /** @deprecated Use `mouseActive` instead. Trigger animation on hover */
    hoverTrigger?: boolean;
}

interface UsePixelCanvasReturn {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
    isAnimating: boolean;
    triggerAppear: () => void;
    triggerDisappear: () => void;
    reset: () => void;
}

export function usePixelCanvas(
    options: UsePixelCanvasOptions = {},
): UsePixelCanvasReturn {
    const config: PixelConfig = { ...defaultPixelConfig, ...options };

    // Handle both old and new prop names for backwards compatibility
    const {
        active,
        mouseActive,
        autoStart = false,
        hoverTrigger = true,
    } = options;

    // New props take precedence over deprecated ones
    const shouldAutoStart = active ?? autoStart;
    const shouldReactToMouse = mouseActive ?? hoverTrigger;

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const pixelsRef = useRef<PixelState[]>([]);
    const animationRef = useRef<number | null>(null);
    const directionRef = useRef<AnimationDirection>('appear');
    const isInitializedRef = useRef(false);
    const activeRef = useRef(shouldAutoStart);
    const [isAnimating, setIsAnimating] = useState(false);

    const speedMultiplier = config.speed * 0.001;

    // Keep activeRef in sync with prop
    useEffect(() => {
        activeRef.current = shouldAutoStart;
    }, [shouldAutoStart]);

    const initPixels = useCallback(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);

        if (width <= 0 || height <= 0) {
            return;
        }

        // Set canvas size with device pixel ratio for crisp rendering
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);

        const pixels: PixelState[] = [];
        const reducedMotion = window.matchMedia(
            '(prefers-reduced-tabs: reduce)',
        ).matches;

        for (let x = 0; x < width; x += config.gap) {
            for (let y = 0; y < height; y += config.gap) {
                const color =
                    config.colors[
                        Math.floor(Math.random() * config.colors.length)
                    ];
                const delay = reducedMotion
                    ? 0
                    : calculateDelay(x, y, width, height, config.animationType);

                pixels.push(
                    createPixelState(
                        x,
                        y,
                        color,
                        delay,
                        speedMultiplier,
                        config.minSize,
                        config.maxSize,
                        width,
                        height,
                    ),
                );
            }
        }

        pixelsRef.current = pixels;
        isInitializedRef.current = true;
    }, [
        config.gap,
        config.colors,
        config.animationType,
        config.minSize,
        config.maxSize,
        speedMultiplier,
    ]);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;

        ctx.clearRect(0, 0, width, height);

        let allIdle = true;
        const direction = directionRef.current;

        pixelsRef.current = pixelsRef.current.map((pixel) => {
            let updated: PixelState;

            if (direction === 'appear') {
                updated = updatePixelAppear(pixel, config.shimmerIntensity);
            } else {
                updated = updatePixelDisappear(pixel);
            }

            // Draw pixel if it has size > 0 (clamp to prevent negative values)
            const safeSize = Math.max(0, updated.size);

            if (safeSize > 0.01) {
                allIdle = false;
                drawPixel(
                    ctx,
                    updated.x,
                    updated.y,
                    safeSize,
                    config.maxSize,
                    updated.color,
                    config.shape,
                );
            } else if (!updated.isIdle) {
                allIdle = false;
            }

            return updated;
        });

        // For disappear: stop when all pixels are gone
        // For appear: never stop - keep shimmering
        if (direction === 'disappear' && allIdle) {
            setIsAnimating(false);

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }

            // Reset pixels for next appear animation
            initPixels();

            return;
        }

        animationRef.current = requestAnimationFrame(animate);
    }, [config.shimmerIntensity, config.maxSize, config.shape, initPixels]);

    const startAnimation = useCallback(
        (direction: AnimationDirection) => {
            // If disappearing, just change direction - don't reinit
            if (direction === 'disappear') {
                directionRef.current = direction;

                if (!animationRef.current) {
                    setIsAnimating(true);
                    animationRef.current = requestAnimationFrame(animate);
                }

                return;
            }

            // For appear, always reset pixel states for fresh animation
            initPixels();

            directionRef.current = direction;
            setIsAnimating(true);

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            animationRef.current = requestAnimationFrame(animate);
        },
        [animate, initPixels],
    );

    const triggerAppear = useCallback(() => {
        startAnimation('appear');
    }, [startAnimation]);

    const triggerDisappear = useCallback(() => {
        startAnimation('disappear');
    }, [startAnimation]);

    const reset = useCallback(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        setIsAnimating(false);
        directionRef.current = 'appear';
        initPixels();

        const canvas = canvasRef.current;

        if (canvas) {
            const ctx = canvas.getContext('2d');

            if (ctx) {
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
            }
        }
    }, [initPixels]);

    // Initialize and handle resize
    useEffect(() => {
        initPixels();

        const container = containerRef.current;

        if (!container) {
            return;
        }

        const resizeObserver = new ResizeObserver(() => {
            initPixels();

            // Restart animation if it was running and we're in active mode
            if (activeRef.current && animationRef.current) {
                triggerAppear();
            }
        });

        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [initPixels, triggerAppear]);

    // Handle mouse events
    useEffect(() => {
        if (!shouldReactToMouse) {
            return;
        }

        const container = containerRef.current;

        if (!container) {
            return;
        }

        const handleMouseEnter = () => {
            // Reset and start fresh appear animation
            triggerAppear();
        };

        const handleMouseLeave = () => {
            triggerDisappear();
        };

        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        if (!config.noFocus) {
            container.addEventListener('focusin', handleMouseEnter);
            container.addEventListener('focusout', handleMouseLeave);
        }

        return () => {
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
            container.removeEventListener('focusin', handleMouseEnter);
            container.removeEventListener('focusout', handleMouseLeave);
        };
    }, [shouldReactToMouse, config.noFocus, triggerAppear, triggerDisappear]);

    // Handle active prop - continuous animation
    useEffect(() => {
        if (shouldAutoStart) {
            triggerAppear();
        } else if (!shouldReactToMouse) {
            // If neither active nor mouseActive, clear canvas
            reset();
        }
    }, [shouldAutoStart, shouldReactToMouse, triggerAppear, reset]);

    return {
        canvasRef,
        containerRef,
        isAnimating,
        triggerAppear,
        triggerDisappear,
        reset,
    };
}
