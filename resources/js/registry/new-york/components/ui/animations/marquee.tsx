'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { CSSProperties, ReactNode } from 'react';
import React, { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ============================================================================
// Types
// ============================================================================

export type MarqueeDirection = 'left' | 'right';

export interface MarqueeItemStyle {
    className?: string;
    style?: CSSProperties;
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    fontWeight?: string | number;
    padding?: string;
    borderRadius?: string;
}

export interface MarqueeRowData<T = unknown> {
    id: string | number;
    items: T[];
    direction?: MarqueeDirection;
    /** Base speed in px/frame at 60fps. Default: 0.5 */
    speed?: number;
}

export interface MarqueeStyleProps {
    textColor?: string;
    fontSize?: string;
    fontWeight?: string | number;
    textTransform?: CSSProperties['textTransform'];
    gap?: number;
    className?: string;
}

export interface MarqueeProps extends MarqueeStyleProps {
    children: ReactNode;
    /** Base movement speed in px/frame at 60fps. Default: 0.5 */
    speed?: number;
    /** @deprecated Use `speed` (px/frame). Converted automatically. */
    velocity?: number;
    direction?: MarqueeDirection;
    pauseOnHover?: boolean;
    /**
     * Extra px/frame added at peak scroll velocity in the row's own direction.
     * At max scroll the strip moves `baseSpeed + scrollBoostFactor` px/frame.
     * Default: 10.
     */
    scrollBoostFactor?: number;
    /**
     * Seconds to ease back to base speed after scrolling stops.
     * Passed to gsap.quickTo duration. Default: 0.7.
     */
    scrollDecay?: number;
    /**
     * Scroll velocity (px/s) that maps to full boost.
     * Default: 2500.
     */
    maxScrollVelocity?: number;
    contentClassName?: string;
    style?: CSSProperties;
}

export interface MultiRowMarqueeProps<T = unknown> extends MarqueeStyleProps {
    rows: MarqueeRowData<T>[];
    speed?: number;
    direction?: MarqueeDirection;
    pauseOnHover?: boolean;
    scrollBoostFactor?: number;
    scrollDecay?: number;
    maxScrollVelocity?: number;
    renderItem: (item: T, index: number, rowIndex: number) => ReactNode;
    rowGap?: number;
    contentClassName?: string;
}

// ============================================================================
// Shared ScrollTrigger velocity bus
//
// One ScrollTrigger for the whole page, shared across every Marquee instance.
// ============================================================================

interface VelocitySubscriber {
    onVelocity(vel: number): void;
}

const velocityBus = (() => {
    const subs = new Set<VelocitySubscriber>();
    let trigger: ScrollTrigger | null = null;

    function boot() {
        if (trigger) return;
        trigger = ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate(self) {
                const vel = self.getVelocity(); // signed px/s
                subs.forEach((s) => s.onVelocity(vel));
            },
        });
    }

    return {
        subscribe(sub: VelocitySubscriber): () => void {
            subs.add(sub);
            boot();
            return () => {
                subs.delete(sub);
                if (subs.size === 0 && trigger) {
                    trigger.kill();
                    trigger = null;
                }
            };
        },
    };
})();

// ============================================================================
// Marquee — single row
// ============================================================================

export function Marquee({
    children,
    speed,
    velocity,
    direction = 'left',
    pauseOnHover = false,
    scrollBoostFactor = 10,
    scrollDecay = 0.7,
    maxScrollVelocity = 2500,
    gap = 24,
    textColor,
    fontSize,
    fontWeight,
    textTransform,
    className,
    contentClassName,
    style,
}: MarqueeProps) {
    const baseSpeed = speed ?? (velocity != null ? velocity / 60 : 0.5);
    // left → negative x movement, right → positive x movement
    const sign = direction === 'left' ? -1 : 1;

    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    // Mutable refs that the ticker reads/writes — never trigger re-renders
    const xRef = useRef(0);
    const setWRef = useRef(0);
    const isPausedRef = useRef(false);
    // gsap.quickTo writes into this object's `.value` every frame
    const liveSpeed = useRef({ value: baseSpeed * sign });
    // Stable ref to the quickTo function so the ticker closure can call it
    const quickToRef = useRef<gsap.QuickToFunc | null>(null);
    // Stable ref to unsubscribe from the velocity bus
    const unsubRef = useRef<(() => void) | null>(null);

    const [cloneCount, setCloneCount] = useState(3);

    // ── All GSAP work lives inside useGSAP ───────────────────────────────────
    // `scope: containerRef` means gsap.context() scopes all selector queries
    // to the container. Cleanup (ticker removal, quickTo, ScrollTrigger) is
    // handled automatically when the component unmounts or deps change.
    useGSAP(
        () => {
            if (!trackRef.current) return;

            // ── 1. Measure and build clone count ─────────────────────────
            const measure = () => {
                const contentEl = trackRef.current!.querySelector(
                    '[data-marquee-content]',
                ) as HTMLElement | null;
                if (!contentEl) return;

                const singleW = contentEl.offsetWidth + gap;
                if (singleW === 0) return;

                setWRef.current = singleW;

                const copies = Math.ceil((window.innerWidth * 3) / singleW) + 1;
                const count = Math.max(3, copies);
                setCloneCount(count);

                // Right-moving rows start mid-track so content fills from frame 0
                xRef.current =
                    sign === 1 ? -singleW * Math.floor(count / 2) : 0;
                gsap.set(trackRef.current!, { x: xRef.current });
            };

            // Double-rAF so the browser has laid out the clones before we measure
            const raf1 = requestAnimationFrame(() => {
                const raf2 = requestAnimationFrame(() => {
                    measure();

                    // ── 2. quickTo — smooth speed transitions ─────────────
                    liveSpeed.current.value = baseSpeed * sign;
                    quickToRef.current = gsap.quickTo(
                        liveSpeed.current,
                        'value',
                        {
                            duration: scrollDecay,
                            ease: 'power3.out',
                        },
                    );

                    // ── 3. Subscribe to scroll velocity bus ───────────────
                    if (unsubRef.current) unsubRef.current();
                    unsubRef.current = velocityBus.subscribe({
                        onVelocity(rawVel) {
                            if (!quickToRef.current) return;
                            const clamped = Math.max(
                                -maxScrollVelocity,
                                Math.min(maxScrollVelocity, rawVel),
                            );
                            const norm = clamped / maxScrollVelocity;
                            // Base movement + velocity-proportional boost, both
                            // multiplied by sign so each row follows its own direction.
                            // Scrolling UP can flip sign and briefly reverse the strip.
                            quickToRef.current(
                                baseSpeed * sign +
                                    norm * scrollBoostFactor * sign,
                            );
                        },
                    });

                    // ── 4. Resize handler ─────────────────────────────────
                    let resizeTimer: ReturnType<typeof setTimeout>;
                    const onResize = () => {
                        clearTimeout(resizeTimer);
                        resizeTimer = setTimeout(measure, 150);
                    };
                    window.addEventListener('resize', onResize);
                    // Returned cleanup runs when useGSAP tears down this context
                    return () => {
                        clearTimeout(resizeTimer);
                        window.removeEventListener('resize', onResize);
                    };
                });
                // Cancel raf2 if context cleans up before it fires
                return () => cancelAnimationFrame(raf2);
            });

            // ── 5. Ticker — advances the track every frame ────────────────
            // Registered inside useGSAP so gsap.context() removes it on cleanup.
            const tick = () => {
                if (isPausedRef.current || setWRef.current === 0) return;

                xRef.current -= liveSpeed.current.value;

                // Modular wrap: keep x inside [-setW, 0)
                const setW = setWRef.current;
                if (xRef.current <= -setW) xRef.current += setW;
                if (xRef.current >= 0) xRef.current -= setW;

                gsap.set(trackRef.current!, { x: xRef.current });
            };

            gsap.ticker.add(tick);

            // Cleanup: context kills the ticker, cancels raf1, and unsubscribes
            return () => {
                cancelAnimationFrame(raf1);
                gsap.ticker.remove(tick);
                if (unsubRef.current) {
                    unsubRef.current();
                    unsubRef.current = null;
                }
            };
        },
        {
            scope: containerRef,
            dependencies: [
                baseSpeed,
                sign,
                gap,
                scrollDecay,
                scrollBoostFactor,
                maxScrollVelocity,
                // Re-run when cloneCount settles so we measure the final DOM
                cloneCount,
            ],
        },
    );

    // ── Hover pause (no GSAP needed — just flips a ref) ──────────────────────
    const handleMouseEnter = useCallback(() => {
        if (pauseOnHover) isPausedRef.current = true;
    }, [pauseOnHover]);

    const handleMouseLeave = useCallback(() => {
        if (pauseOnHover) isPausedRef.current = false;
    }, [pauseOnHover]);

    // ── Render ────────────────────────────────────────────────────────────────
    const contentStyle: CSSProperties = {
        gap: `${gap}px`,
        color: textColor,
        fontSize,
        fontWeight,
        textTransform,
    };

    const contentElements = Array.from({ length: cloneCount }, (_, i) => (
        <div
            key={`mq-${i}`}
            {...(i === 0
                ? { 'data-marquee-content': 'true' }
                : { 'data-marquee-clone': 'true', 'aria-hidden': 'true' })}
            className={cn('flex shrink-0 items-center', contentClassName)}
            style={contentStyle}
        >
            {children}
        </div>
    ));

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative flex items-center overflow-hidden',
                className,
            )}
            style={style}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={trackRef}
                className="flex shrink-0 items-center whitespace-nowrap"
                style={{ gap: `${gap}px`, willChange: 'transform' }}
            >
                {contentElements}
            </div>
        </div>
    );
}

// ============================================================================
// MultiRowMarquee
// ============================================================================

export function MultiRowMarquee<T>({
    rows,
    speed = 0.5,
    direction = 'left',
    pauseOnHover = false,
    scrollBoostFactor = 10,
    scrollDecay = 0.7,
    maxScrollVelocity = 2500,
    gap = 24,
    rowGap = 16,
    textColor,
    fontSize,
    fontWeight,
    textTransform,
    className,
    contentClassName,
    renderItem,
}: MultiRowMarqueeProps<T>) {
    return (
        <div
            className={cn('flex flex-col', className)}
            style={{ gap: `${rowGap}px` }}
        >
            {rows.map((row, rowIndex) => (
                <Marquee
                    key={row.id}
                    speed={row.speed ?? speed}
                    direction={row.direction ?? direction}
                    pauseOnHover={pauseOnHover}
                    scrollBoostFactor={scrollBoostFactor}
                    scrollDecay={scrollDecay}
                    maxScrollVelocity={maxScrollVelocity}
                    gap={gap}
                    textColor={textColor}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    textTransform={textTransform}
                    contentClassName={contentClassName}
                >
                    {row.items.map((item, itemIndex) => (
                        <React.Fragment key={itemIndex}>
                            {renderItem(item, itemIndex, rowIndex)}
                        </React.Fragment>
                    ))}
                </Marquee>
            ))}
        </div>
    );
}

// ============================================================================
// MarqueeText — preset with per-item style support
// ============================================================================

export interface MarqueeTextItem {
    label: string;
    itemStyle?: MarqueeItemStyle;
}

export interface MarqueeTextProps extends Omit<MarqueeProps, 'children'> {
    items: string[] | MarqueeTextItem[];
    separator?: string;
    separatorColor?: string;
}

function isItemArray(
    items: string[] | MarqueeTextItem[],
): items is MarqueeTextItem[] {
    return items.length > 0 && typeof items[0] === 'object';
}

export function MarqueeText({
    items,
    separator = '•',
    separatorColor,
    textColor = 'currentColor',
    fontSize = 'clamp(1.5rem, 4vw, 3rem)',
    fontWeight = 'bold',
    textTransform = 'uppercase',
    ...props
}: MarqueeTextProps) {
    const normalized: MarqueeTextItem[] = isItemArray(items)
        ? items
        : items.map((label) => ({ label }));

    return (
        <Marquee
            textColor={textColor}
            fontSize={fontSize}
            fontWeight={fontWeight}
            textTransform={textTransform}
            {...props}
        >
            {normalized.map((item, index) => {
                const { label, itemStyle } = item;
                const resolvedStyle: CSSProperties = {
                    color: itemStyle?.color,
                    backgroundColor: itemStyle?.backgroundColor,
                    fontSize: itemStyle?.fontSize,
                    fontWeight: itemStyle?.fontWeight,
                    padding: itemStyle?.padding,
                    borderRadius: itemStyle?.borderRadius,
                    ...itemStyle?.style,
                };

                return (
                    <span
                        key={index}
                        className={cn(
                            'flex shrink-0 items-center gap-4',
                            itemStyle?.className,
                        )}
                    >
                        <span
                            className="shrink-0 select-none"
                            style={{
                                letterSpacing: '0.02em',
                                ...resolvedStyle,
                            }}
                        >
                            {label}
                        </span>
                        {separator && (
                            <span
                                className="shrink-0 opacity-50 select-none"
                                style={{
                                    color:
                                        separatorColor ||
                                        itemStyle?.color ||
                                        textColor,
                                    fontSize: '0.5em',
                                }}
                            >
                                {separator}
                            </span>
                        )}
                    </span>
                );
            })}
        </Marquee>
    );
}

export default Marquee;
