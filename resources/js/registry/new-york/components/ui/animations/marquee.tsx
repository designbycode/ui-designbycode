'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { CSSProperties, ReactNode } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
    direction?: MarqueeDirection;
    pauseOnHover?: boolean;
    /**
     * When true, the mouse wheel / trackpad controls the marquee:
     *   - Scroll magnitude  → speed boost on top of base speed
     *   - Scroll direction  → flips marquee direction while scrolling
     *   - Stopping scroll   → eases back to base speed + base direction
     * Default: true.
     */
    scrollEnabled?: boolean;
    /**
     * Extra px/frame added at peak normalised scroll input.
     * Default: 8.
     */
    scrollBoostFactor?: number;
    /**
     * Seconds to ease back to base speed + direction after scrolling stops.
     * Default: 0.6.
     */
    scrollDecay?: number;
    /**
     * ms of inactivity after the last wheel event before the ease-back starts.
     * Default: 120.
     */
    scrollTimeout?: number;
    contentClassName?: string;
    style?: CSSProperties;
}

export interface MultiRowMarqueeProps<T = unknown> extends MarqueeStyleProps {
    rows: MarqueeRowData<T>[];
    speed?: number;
    direction?: MarqueeDirection;
    pauseOnHover?: boolean;
    scrollEnabled?: boolean;
    scrollBoostFactor?: number;
    scrollDecay?: number;
    scrollTimeout?: number;
    renderItem: (item: T, index: number, rowIndex: number) => ReactNode;
    rowGap?: number;
    contentClassName?: string;
}

// ============================================================================
// Wheel input bus
//
// One 'wheel' listener shared across every mounted Marquee.
// Normalises raw deltaY so mouse wheel and trackpad feel identical,
// then broadcasts to all subscribers.
// ============================================================================

interface WheelSubscriber {
    idleMs: number;

    onWheel(normalisedDelta: number): void;

    onIdle(): void;
}

const wheelBus = (() => {
    const subs = new Set<WheelSubscriber>();
    const timers = new WeakMap<
        WheelSubscriber,
        ReturnType<typeof setTimeout>
    >();
    let listening = false;

    /**
     * Normalise raw deltaY to a consistent [-60, 60] range.
     *
     * Trackpad: sends continuous small deltas (|delta| < 30) at high frequency.
     * Mouse wheel: sends discrete larger deltas (~100 px per notch).
     *
     * We scale trackpad up (×3) so both inputs land in the same perceived range,
     * then clamp the result.
     */
    function normalise(deltaY: number): number {
        const isTrackpad = Math.abs(deltaY) < 30;
        const scaled = isTrackpad ? deltaY * 3 : deltaY;
        return Math.max(-60, Math.min(60, scaled));
    }

    function onWheel(e: WheelEvent) {
        const norm = normalise(e.deltaY);
        subs.forEach((sub) => {
            sub.onWheel(norm);
            // Reset this subscriber's idle timer on every wheel event
            const prev = timers.get(sub);
            if (prev) clearTimeout(prev);
            timers.set(
                sub,
                setTimeout(() => sub.onIdle(), sub.idleMs),
            );
        });
    }

    function boot() {
        if (listening) return;
        listening = true;
        window.addEventListener('wheel', onWheel, { passive: true });
    }

    function teardown() {
        if (!listening) return;
        listening = false;
        window.removeEventListener('wheel', onWheel);
    }

    return {
        subscribe(sub: WheelSubscriber): () => void {
            subs.add(sub);
            boot();
            return () => {
                const t = timers.get(sub);
                if (t) clearTimeout(t);
                timers.delete(sub);
                subs.delete(sub);
                if (subs.size === 0) teardown();
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
    direction = 'left',
    pauseOnHover = false,
    scrollEnabled = true,
    scrollBoostFactor = 8,
    scrollDecay = 0.6,
    scrollTimeout = 120,
    gap = 24,
    textColor,
    fontSize,
    fontWeight,
    textTransform,
    className,
    contentClassName,
    style,
}: MarqueeProps) {
    const baseSpeed = speed ?? 0.5;

    // baseSign controls which axis the track moves along.
    // direction='left'  → track moves left  → x decreases → baseSign = -1
    // direction='right' → track moves right → x increases → baseSign = +1
    //
    // liveSpeed.value is always in px/frame; its sign encodes direction:
    //   positive → forward (baseSign direction)
    //   negative → reversed
    // The ticker applies: xRef += liveSpeed.value * baseSign
    const baseSign = direction === 'left' ? -1 : 1;

    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const xRef = useRef(0);
    const setWRef = useRef(0);
    const isPausedRef = useRef(false);

    // liveSpeed.value: positive = forward, negative = reversed
    const liveSpeed = useRef({ value: baseSpeed });
    const quickToRef = useRef<gsap.QuickToFunc | null>(null);

    const [cloneCount, setCloneCount] = useState(3);

    // ── GSAP: ticker + measure + resize ───────────────────────────────────────
    useGSAP(
        () => {
            if (!trackRef.current) return;

            const measure = () => {
                const contentEl = trackRef.current!.querySelector(
                    '[data-marquee-content]',
                ) as HTMLElement | null;
                if (!contentEl) return;

                const singleW = contentEl.offsetWidth + gap;
                if (singleW === 0) return;

                setWRef.current = singleW;

                const copies = Math.max(
                    3,
                    Math.ceil((window.innerWidth * 3) / singleW) + 1,
                );
                setCloneCount(copies);

                // Right-moving strips start mid-track so content is visible immediately.
                const rawStart =
                    baseSign === 1 ? -singleW * Math.floor(copies / 2) : 0;
                xRef.current = ((rawStart % singleW) - singleW) % singleW;
                gsap.set(trackRef.current!, { x: xRef.current });
            };

            const raf1 = requestAnimationFrame(() => {
                const raf2 = requestAnimationFrame(() => {
                    measure();

                    // quickTo eases liveSpeed.value to any target smoothly
                    liveSpeed.current.value = baseSpeed;
                    quickToRef.current = gsap.quickTo(
                        liveSpeed.current,
                        'value',
                        {
                            duration: scrollDecay,
                            ease: 'power2.inOut',
                        },
                    );

                    let resizeTimer: ReturnType<typeof setTimeout>;
                    const onResize = () => {
                        clearTimeout(resizeTimer);
                        resizeTimer = setTimeout(measure, 150);
                    };
                    window.addEventListener('resize', onResize);
                    return () => {
                        clearTimeout(resizeTimer);
                        window.removeEventListener('resize', onResize);
                    };
                });
                return () => cancelAnimationFrame(raf2);
            });

            const tick = () => {
                if (isPausedRef.current || setWRef.current === 0) return;

                // liveSpeed.value sign encodes direction; baseSign encodes axis.
                xRef.current += liveSpeed.current.value * baseSign;

                // True modulo wrap — never jumps regardless of speed magnitude
                const setW = setWRef.current;
                xRef.current = ((xRef.current % setW) - setW) % setW;

                gsap.set(trackRef.current!, { x: xRef.current });
            };

            gsap.ticker.add(tick);

            return () => {
                cancelAnimationFrame(raf1);
                gsap.ticker.remove(tick);
            };
        },
        {
            scope: containerRef,
            dependencies: [baseSpeed, baseSign, gap, scrollDecay, cloneCount],
        },
    );

    // ── Wheel bus subscription ─────────────────────────────────────────────────
    // Separate from the GSAP context so toggling scrollEnabled doesn't
    // teardown and re-run the entire animation.
    useEffect(() => {
        if (!scrollEnabled) return;

        const unsub = wheelBus.subscribe({
            idleMs: scrollTimeout,

            onWheel(norm) {
                if (!quickToRef.current) return;
                // norm: positive = scroll down = forward, negative = scroll up = reverse
                // Map magnitude to a speed boost, preserve direction sign
                const boost = (Math.abs(norm) / 60) * scrollBoostFactor;
                const targetSpeed = (norm >= 0 ? 1 : -1) * (baseSpeed + boost);
                quickToRef.current(targetSpeed);
            },

            onIdle() {
                // Ease back to original speed in original (forward) direction
                if (!quickToRef.current) return;
                quickToRef.current(baseSpeed);
            },
        });

        return unsub;
    }, [
        scrollEnabled,
        scrollBoostFactor,
        scrollDecay,
        scrollTimeout,
        baseSpeed,
    ]);

    // ── Hover pause ────────────────────────────────────────────────────────────
    const handleMouseEnter = useCallback(() => {
        if (pauseOnHover) isPausedRef.current = true;
    }, [pauseOnHover]);

    const handleMouseLeave = useCallback(() => {
        if (pauseOnHover) isPausedRef.current = false;
    }, [pauseOnHover]);

    // ── Render ─────────────────────────────────────────────────────────────────
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
    scrollEnabled = true,
    scrollBoostFactor = 8,
    scrollDecay = 0.6,
    scrollTimeout = 120,
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
                    scrollEnabled={scrollEnabled}
                    scrollBoostFactor={scrollBoostFactor}
                    scrollDecay={scrollDecay}
                    scrollTimeout={scrollTimeout}
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
