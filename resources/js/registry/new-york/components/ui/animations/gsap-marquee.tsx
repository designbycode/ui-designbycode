'use client';

import { gsap } from 'gsap';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type MarqueeDirection = 'left' | 'right' | 'up' | 'down';
export type MarqueeLoopMode = 'continuous' | 'yoyo';
export type MarqueeEasing =
    | 'none'
    | 'power1.inOut'
    | 'power2.inOut'
    | 'power3.inOut'
    | 'elastic.out'
    | 'bounce.out'
    | 'back.inOut';

export interface GSAPMarqueeProps {
    /** Content to be displayed in the marquee */
    children: React.ReactNode;
    /** Direction of movement */
    direction?: MarqueeDirection;
    /** Loop mode: continuous or yoyo (ping-pong) */
    loopMode?: MarqueeLoopMode;
    /** Base duration in seconds for one complete cycle */
    duration?: number;
    /** Gap between repeated items (in pixels or CSS value) */
    gap?: number;
    /** Number of times to repeat the content */
    repeat?: number;
    /** Pause animation on hover */
    pauseOnHover?: boolean;
    /** Enable scroll-based velocity adjustment */
    scrollVelocity?: boolean;
    /** Multiplier for scroll velocity effect (higher = more responsive) */
    velocityMultiplier?: number;
    /** Maximum velocity cap to prevent extreme speeds */
    maxVelocity?: number;
    /** Minimum velocity (can be negative for reverse on scroll) */
    minVelocity?: number;
    /** GSAP easing function for yoyo mode */
    easing?: MarqueeEasing;
    /** Delay before animation starts (in seconds) */
    delay?: number;
    /** Whether the animation should start automatically */
    autoPlay?: boolean;
    /** Callback when animation completes one cycle */
    onCycleComplete?: () => void;
    /** Callback when animation updates */
    onUpdate?: (progress: number) => void;
    /** Additional class names for the container */
    className?: string;
    /** Additional class names for the track */
    trackClassName?: string;
    /** Additional class names for individual items */
    itemClassName?: string;
    /** Enable GPU acceleration */
    useGPU?: boolean;
    /** Scrub animation to scroll position (0-1 for smoothness, true for instant) */
    scrub?: boolean | number;
    /** Reverse the default direction */
    reverse?: boolean;
}

export interface GSAPMarqueeRef {
    /** Play the animation */
    play: () => void;
    /** Pause the animation */
    pause: () => void;
    /** Reverse the animation direction */
    reverse: () => void;
    /** Seek to a specific progress (0-1) */
    seek: (progress: number) => void;
    /** Get current progress (0-1) */
    getProgress: () => number;
    /** Set animation speed (1 = normal, 2 = double speed, etc.) */
    setSpeed: (speed: number) => void;
    /** Kill the animation and clean up */
    kill: () => void;
    /** Restart the animation */
    restart: () => void;
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

function useScrollVelocity(
    enabled: boolean,
    multiplier: number,
    maxVelocity: number,
    minVelocity: number,
) {
    const velocityRef = useRef(1);
    const lastScrollY = useRef(0);
    const lastTime = useRef(0);
    const rafId = useRef<number | null>(null);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        lastTime.current = Date.now();

        const calculateVelocity = () => {
            const currentScrollY = window.scrollY;
            const currentTime = Date.now();
            const deltaY = Math.abs(currentScrollY - lastScrollY.current);
            const deltaTime = currentTime - lastTime.current;

            if (deltaTime > 0) {
                const rawVelocity = (deltaY / deltaTime) * multiplier;
                const targetVelocity = Math.max(
                    minVelocity,
                    Math.min(maxVelocity, 1 + rawVelocity),
                );

                // Smooth interpolation
                velocityRef.current = gsap.utils.interpolate(
                    velocityRef.current,
                    targetVelocity,
                    0.1,
                );
            }

            lastScrollY.current = currentScrollY;
            lastTime.current = currentTime;
            rafId.current = requestAnimationFrame(calculateVelocity);
        };

        rafId.current = requestAnimationFrame(calculateVelocity);

        return () => {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, [enabled, multiplier, maxVelocity, minVelocity]);

    return velocityRef;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const GSAPMarquee = React.forwardRef<GSAPMarqueeRef, GSAPMarqueeProps>(
    (
        {
            children,
            direction = 'left',
            loopMode = 'continuous',
            duration = 20,
            gap = 24,
            repeat = 4,
            pauseOnHover = true,
            scrollVelocity = false,
            velocityMultiplier = 0.5,
            maxVelocity = 5,
            minVelocity = 0.2,
            easing = 'none',
            delay = 0,
            autoPlay = true,
            onCycleComplete,
            onUpdate,
            className,
            trackClassName,
            itemClassName,
            useGPU = true,
            reverse = false,
            scrub = false,
        },
        ref,
    ) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const trackRef = useRef<HTMLDivElement>(null);
        const tweenRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(
            null,
        );
        const velocityRef = useScrollVelocity(
            scrollVelocity,
            velocityMultiplier,
            maxVelocity,
            minVelocity,
        );
        const isPausedRef = useRef(false);

        const isHorizontal = direction === 'left' || direction === 'right';
        const isPositive = direction === 'right' || direction === 'down';
        const actualDirection = reverse ? !isPositive : isPositive;

        // Calculate animation properties
        const animationProps = useMemo(() => {
            const prop = isHorizontal ? 'xPercent' : 'yPercent';
            const startValue = actualDirection ? -100 / repeat : 0;
            const endValue = actualDirection ? 0 : -100 / repeat;

            return { prop, startValue, endValue };
        }, [isHorizontal, actualDirection, repeat]);

        // Create and manage animation
        useEffect(() => {
            if (!trackRef.current) {
                return;
            }

            const track = trackRef.current;
            const { prop, startValue, endValue } = animationProps;

            // Set initial position
            gsap.set(track, { [prop]: startValue });

            // Create the animation
            if (loopMode === 'continuous') {
                tweenRef.current = gsap.to(track, {
                    [prop]: endValue,
                    duration,
                    ease: 'none',
                    repeat: -1,
                    delay,
                    force3D: useGPU,
                    onRepeat: onCycleComplete,
                    onUpdate: () => {
                        if (onUpdate && tweenRef.current) {
                            onUpdate(tweenRef.current.progress());
                        }
                    },
                });
            } else {
                // Yoyo mode
                tweenRef.current = gsap.to(track, {
                    [prop]: endValue,
                    duration,
                    ease: easing,
                    repeat: -1,
                    yoyo: true,
                    delay,
                    force3D: useGPU,
                    onRepeat: onCycleComplete,
                    onUpdate: () => {
                        if (onUpdate && tweenRef.current) {
                            onUpdate(tweenRef.current.progress());
                        }
                    },
                });
            }

            if (!autoPlay) {
                tweenRef.current.pause();
            }

            return () => {
                tweenRef.current?.kill();
            };
        }, [
            animationProps,
            duration,
            loopMode,
            easing,
            delay,
            autoPlay,
            useGPU,
            onCycleComplete,
            onUpdate,
        ]);

        // Handle scroll velocity
        useEffect(() => {
            if (!scrollVelocity || !tweenRef.current) {
                return;
            }

            const updateVelocity = () => {
                if (tweenRef.current && !isPausedRef.current) {
                    tweenRef.current.timeScale(velocityRef.current);
                }

                requestAnimationFrame(updateVelocity);
            };

            const rafId = requestAnimationFrame(updateVelocity);

            return () => cancelAnimationFrame(rafId);
        }, [scrollVelocity, velocityRef]);

        // Handle scrub
        useEffect(() => {
            if (!scrub || !trackRef.current) {
                return;
            }

            const { prop, startValue, endValue } = animationProps;

            // Kill existing tween for scrub mode
            tweenRef.current?.kill();

            const handleScroll = () => {
                const scrollProgress =
                    window.scrollY /
                    (document.body.scrollHeight - window.innerHeight);
                const value = gsap.utils.interpolate(
                    startValue,
                    endValue,
                    scrollProgress,
                );

                if (typeof scrub === 'number') {
                    gsap.to(trackRef.current, {
                        [prop]: value,
                        duration: scrub,
                        ease: 'power2.out',
                        overwrite: true,
                    });
                } else {
                    gsap.set(trackRef.current, { [prop]: value });
                }
            };

            window.addEventListener('scroll', handleScroll, { passive: true });

            return () => window.removeEventListener('scroll', handleScroll);
        }, [scrub, animationProps]);

        // Hover handlers
        const handleMouseEnter = useCallback(() => {
            if (pauseOnHover && tweenRef.current) {
                isPausedRef.current = true;
                gsap.to(tweenRef.current, {
                    timeScale: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                });
            }
        }, [pauseOnHover]);

        const handleMouseLeave = useCallback(() => {
            if (pauseOnHover && tweenRef.current) {
                isPausedRef.current = false;
                gsap.to(tweenRef.current, {
                    timeScale: scrollVelocity ? velocityRef.current : 1,
                    duration: 0.5,
                    ease: 'power2.out',
                });
            }
        }, [pauseOnHover, scrollVelocity, velocityRef]);

        // Expose imperative handle
        React.useImperativeHandle(ref, () => ({
            play: () => {
                isPausedRef.current = false;
                tweenRef.current?.play();
            },
            pause: () => {
                isPausedRef.current = true;
                tweenRef.current?.pause();
            },
            reverse: () => {
                tweenRef.current?.reverse();
            },
            seek: (progress: number) => {
                tweenRef.current?.progress(progress);
            },
            getProgress: () => tweenRef.current?.progress() ?? 0,
            setSpeed: (speed: number) => {
                tweenRef.current?.timeScale(speed);
            },
            kill: () => {
                tweenRef.current?.kill();
            },
            restart: () => {
                tweenRef.current?.restart();
            },
        }));

        // Generate repeated children
        const repeatedChildren = useMemo(() => {
            return Array.from({ length: repeat }, (_, i) => (
                <div
                    key={i}
                    className={cn(
                        'shrink-0',
                        isHorizontal
                            ? 'flex items-center'
                            : 'flex flex-col items-center',
                        itemClassName,
                    )}
                    style={{
                        [isHorizontal ? 'paddingRight' : 'paddingBottom']: gap,
                    }}
                >
                    {children}
                </div>
            ));
        }, [children, repeat, gap, isHorizontal, itemClassName]);

        return (
            <div
                ref={containerRef}
                className={cn(
                    'overflow-hidden',
                    isHorizontal ? 'w-full' : 'h-full',
                    className,
                )}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    ref={trackRef}
                    className={cn(
                        'flex will-change-transform',
                        isHorizontal ? 'flex-row' : 'flex-col',
                        trackClassName,
                    )}
                    style={{
                        [isHorizontal ? 'width' : 'height']: `${repeat * 100}%`,
                    }}
                >
                    {repeatedChildren}
                </div>
            </div>
        );
    },
);

GSAPMarquee.displayName = 'GSAPMarquee';

// ============================================================================
// PRESET COMPONENTS
// ============================================================================

export interface MarqueeTextProps extends Omit<GSAPMarqueeProps, 'children'> {
    text: string;
    separator?: React.ReactNode;
    textClassName?: string;
}

export function MarqueeText({
    text,
    separator = <span className="px-8 text-muted-foreground/50">•</span>,
    textClassName,
    ...props
}: MarqueeTextProps) {
    return (
        <GSAPMarquee {...props}>
            <span
                className={cn(
                    'whitespace-nowrap text-foreground',
                    textClassName,
                )}
            >
                {text}
            </span>
            {separator}
        </GSAPMarquee>
    );
}

export interface MarqueeImagesProps extends Omit<GSAPMarqueeProps, 'children'> {
    images: Array<{
        src: string;
        alt: string;
        width?: number;
        height?: number;
    }>;
    imageClassName?: string;
}

export function MarqueeImages({
    images,
    imageClassName,
    gap = 32,
    ...props
}: MarqueeImagesProps) {
    return (
        <GSAPMarquee gap={gap} {...props}>
            <div className="flex items-center gap-8">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        className={cn(
                            'h-12 w-auto object-contain grayscale transition-all duration-300 hover:grayscale-0',
                            imageClassName,
                        )}
                    />
                ))}
            </div>
        </GSAPMarquee>
    );
}

export interface MarqueeCardsProps extends Omit<GSAPMarqueeProps, 'children'> {
    cards: Array<{
        id: string | number;
        content: React.ReactNode;
    }>;
    cardClassName?: string;
}

export function MarqueeCards({
    cards,
    cardClassName,
    gap = 24,
    ...props
}: MarqueeCardsProps) {
    return (
        <GSAPMarquee gap={gap} {...props}>
            <div
                className={cn(
                    'flex items-stretch',
                    props.direction === 'up' || props.direction === 'down'
                        ? 'flex-col gap-6'
                        : 'gap-6',
                )}
            >
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className={cn(
                            'shrink-0 rounded-xl border border-border bg-card p-6 shadow-sm',
                            cardClassName,
                        )}
                    >
                        {card.content}
                    </div>
                ))}
            </div>
        </GSAPMarquee>
    );
}

// ============================================================================
// STAGGERED MARQUEE (Multiple rows with different speeds)
// ============================================================================

export interface StaggeredMarqueeProps {
    rows: Array<{
        children: React.ReactNode;
        direction?: MarqueeDirection;
        duration?: number;
        reverse?: boolean;
    }>;
    gap?: number;
    rowGap?: number;
    className?: string;
    pauseOnHover?: boolean;
    scrollVelocity?: boolean;
}

export function StaggeredMarquee({
    rows,
    gap = 24,
    rowGap = 16,
    className,
    pauseOnHover = true,
    scrollVelocity = false,
}: StaggeredMarqueeProps) {
    return (
        <div className={cn('flex flex-col', className)} style={{ gap: rowGap }}>
            {rows.map((row, index) => (
                <GSAPMarquee
                    key={index}
                    direction={row.direction ?? 'left'}
                    duration={row.duration ?? 20 + index * 5}
                    reverse={row.reverse}
                    gap={gap}
                    pauseOnHover={pauseOnHover}
                    scrollVelocity={scrollVelocity}
                >
                    {row.children}
                </GSAPMarquee>
            ))}
        </div>
    );
}

// ============================================================================
// VERTICAL SCROLL MARQUEE (Scroll-triggered)
// ============================================================================

export interface ScrollTriggeredMarqueeProps extends GSAPMarqueeProps {
    /** Start position (e.g., "top bottom" means animation starts when top of element hits bottom of viewport) */
    start?: string;
    /** End position */
    end?: string;
    /** Pin the element during scroll */
    pin?: boolean;
}

export function ScrollTriggeredMarquee({
    start = 'top bottom',
    end = 'bottom top',
    pin = false,
    children,
    ...props
}: ScrollTriggeredMarqueeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !trackRef.current) {
            return;
        }

        const isHorizontal =
            props.direction === 'left' ||
            props.direction === 'right' ||
            !props.direction;
        const prop = isHorizontal ? 'xPercent' : 'yPercent';
        const repeat = props.repeat ?? 4;
        const isPositive =
            props.direction === 'right' || props.direction === 'down';
        const startValue = isPositive ? -100 / repeat : 0;
        const endValue = isPositive ? 0 : -100 / repeat;

        // Dynamic import ScrollTrigger
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
            gsap.registerPlugin(ScrollTrigger);

            const tween = gsap.fromTo(
                trackRef.current,
                { [prop]: startValue },
                {
                    [prop]: endValue,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start,
                        end,
                        scrub: props.scrub ?? 1,
                        pin,
                    },
                },
            );

            return () => {
                tween.kill();
                ScrollTrigger.getAll().forEach((st) => st.kill());
            };
        });
    }, [props.direction, props.repeat, props.scrub, start, end, pin]);

    const isHorizontal =
        props.direction === 'left' ||
        props.direction === 'right' ||
        !props.direction;
    const repeat = props.repeat ?? 4;
    const gap = props.gap ?? 24;

    const repeatedChildren = useMemo(() => {
        return Array.from({ length: repeat }, (_, i) => (
            <div
                key={i}
                className={cn(
                    'shrink-0',
                    isHorizontal
                        ? 'flex items-center'
                        : 'flex flex-col items-center',
                )}
                style={{
                    [isHorizontal ? 'paddingRight' : 'paddingBottom']: gap,
                }}
            >
                {children}
            </div>
        ));
    }, [children, repeat, gap, isHorizontal]);

    return (
        <div
            ref={containerRef}
            className={cn(
                'overflow-hidden',
                isHorizontal ? 'w-full' : 'h-full',
                props.className,
            )}
        >
            <div
                ref={trackRef}
                className={cn(
                    'flex will-change-transform',
                    isHorizontal ? 'flex-row' : 'flex-col',
                )}
                style={{
                    [isHorizontal ? 'width' : 'height']: `${repeat * 100}%`,
                }}
            >
                {repeatedChildren}
            </div>
        </div>
    );
}

export default GSAPMarquee;
