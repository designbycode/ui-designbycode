'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { CSSProperties, ElementType, KeyboardEvent } from 'react';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react';

// ─── Animation Type Union ────────────────────────────────────────────────────

export type AnimationType =
    // Fades
    | 'fadeIn'
    | 'fadeInUp'
    | 'fadeInDown'
    | 'fadeInLeft'
    | 'fadeInRight'
    | 'fadeInTopLeft'
    | 'fadeInTopRight'
    | 'fadeInBottomLeft'
    | 'fadeInBottomRight'
    // Slides
    | 'slideUp'
    | 'slideDown'
    | 'slideLeft'
    | 'slideRight'
    | 'slideTopLeft'
    | 'slideTopRight'
    | 'slideBottomLeft'
    | 'slideBottomRight'
    // Scale
    | 'scaleUp'
    | 'scaleDown'
    | 'scaleIn'
    | 'scaleInUp'
    | 'scaleInDown'
    // Blur
    | 'blurIn'
    | 'blurOut'
    | 'blurInLeft'
    | 'blurInRight'
    | 'blurInUp'
    | 'blurInDown'
    // Rotate
    | 'rotateIn'
    | 'rotateOut'
    | 'rotateInLeft'
    | 'rotateInRight'
    | 'rotateOutLeft'
    | 'rotateOutRight'
    // Physics
    | 'bounce'
    | 'elastic'
    | 'jelly'
    | 'squash'
    | 'liquid'
    | 'swing'
    | 'stretch'
    | 'spring'
    | 'wobble'
    | 'shake'
    | 'drift'
    | 'float'
    // Character
    | 'wave'
    | 'pop'
    | 'flip'
    | 'rollIn'
    | 'skewIn'
    | 'spiral'
    | 'morph'
    | 'crash'
    | 'explode'
    | 'letterByLetter'
    | 'typewriter'
    | 'jitter'
    // Text effects
    | 'reveal'
    | 'glitch'
    | 'gradient'
    | 'shadow'
    | 'neon'
    | 'marquee'
    | 'flicker'
    | 'spotlight'
    | 'outline'
    | 'pulse'
    | 'breathe'
    | 'aurora'
    // Special effects
    | 'matrix'
    | 'fire'
    | 'rainbow'
    | 'magnetic'
    | 'particles'
    | 'dissolve'
    | 'scramble'
    | 'zap'
    | 'orbit'
    | 'vortex'
    | 'ripple'
    | 'piano'
    | 'domino'
    | 'pendulum'
    | 'shatter'
    | 'smoke'
    | 'thunder'
    | 'crystallize'
    | 'warp'
    | 'cinema'
    | 'gravity'
    | 'levitate'
    | 'twinkle'
    | 'shimmerFade'
    | 'fold'
    | 'cascade'
    | 'pinball'
    | 'neonFlicker'
    | 'rise'
    | 'unfurl'
    | 'stampIn'
    | 'blinds';

// ─── Trigger Type ─────────────────────────────────────────────────────────────

export type TriggerType = 'onClick' | 'onHover' | 'scrollTrigger';

// ─── Split Mode ────────────────────────────────────────────────────────────────

export type SplitMode = 'chars' | 'words' | 'lines';

// ─── Easing Presets ───────────────────────────────────────────────────────────

export type EasePreset =
    | 'power1.in'
    | 'power1.out'
    | 'power1.inOut'
    | 'power2.in'
    | 'power2.out'
    | 'power2.inOut'
    | 'power3.in'
    | 'power3.out'
    | 'power3.inOut'
    | 'power4.in'
    | 'power4.out'
    | 'power4.inOut'
    | 'back.in'
    | 'back.out'
    | 'back.inOut'
    | 'bounce.in'
    | 'bounce.out'
    | 'bounce.inOut'
    | 'elastic.in'
    | 'elastic.out'
    | 'elastic.inOut'
    | 'circ.in'
    | 'circ.out'
    | 'circ.inOut'
    | 'expo.in'
    | 'expo.out'
    | 'expo.inOut'
    | 'sine.in'
    | 'sine.out'
    | 'sine.inOut'
    | 'none'
    | (string & {});

// ─── ScrollTrigger Options ────────────────────────────────────────────────────

export interface ScrollTriggerOptions {
    /** ScrollTrigger start position. Default: `"top 80%"` */
    start?: string;
    /** ScrollTrigger end position. Default: `"bottom 20%"` */
    end?: string;
    /** Scrub the animation to scroll position. Default: `false` */
    scrub?: boolean | number;
    /** Markers for debugging (dev only). Default: `false` */
    markers?: boolean;
    /** Toggle actions string. Default: `"play none none reverse"` */
    toggleActions?: string;
    /** Pin the element while animating. Default: `false` */
    pin?: boolean;
}

// ─── Stagger Options ─────────────────────────────────────────────────────────

export interface StaggerOptions {
    /** Time between each character animation in seconds. Default: `0.04` */
    each?: number;
    /** Stagger from: `"start"` | `"end"` | `"center"` | `"edges"` | number */
    from?: 'start' | 'end' | 'center' | 'edges' | number;
    /** Grid stagger for 2D layouts */
    grid?: [number, number] | 'auto';
    /** Axis for grid stagger */
    axis?: 'x' | 'y';
    /** Amount distributes the stagger across total duration */
    amount?: number;
}

// ─── Component Props ──────────────────────────────────────────────────────────

export interface TextAnimatorProps {
    text?: string;
    children?: string;
    animation?: AnimationType;
    trigger?: TriggerType;
    splitBy?: SplitMode;
    duration?: number;
    delay?: number;
    stagger?: number | StaggerOptions;
    ease?: EasePreset;
    repeat?: number;
    yoyo?: boolean;
    scrollTrigger?: ScrollTriggerOptions;
    tag?: ElementType;
    color?: string;
    fontSize?: string | number;
    className?: string;
    style?: CSSProperties;
    /**
     * Custom color(s) for color-driven animations:
     * aurora, fire, glitch, gradient, matrix, neon, neonFlicker, rainbow, zap.
     * Accepts a single CSS color string or an array.
     * When one color is given it fills both the primary and secondary slots.
     */
    effectColor?: string | string[];
    onComplete?: () => void;
    onStart?: () => void;
    onRepeat?: () => void;
}

// ─── Ref API ──────────────────────────────────────────────────────────────────

export interface TextAnimatorRef {
    play: () => void;
    pause: () => void;
    reverse: () => void;
    restart: () => void;
    seek: (timeOrProgress: number) => void;
    kill: () => void;
    timeline: () => gsap.core.Timeline | null;
    isPlaying: () => boolean;
    progress: () => number;
}

// ─── Animation Config (internal) ─────────────────────────────────────────────

export interface AnimationContext {
    chars: HTMLElement[];
    words: HTMLElement[];
    el: HTMLElement;
    opts: ResolvedAnimOpts;
    effectColors: string[];
}

export interface ResolvedAnimOpts {
    duration: number;
    delay: number;
    stagger: number | StaggerOptions;
    ease: string;
    repeat: number;
    yoyo: boolean;
}

export interface AnimationConfig {
    targets?: HTMLElement[];
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
    overrideEase?: boolean;
    special?: (tl: gsap.core.Timeline) => void;
}

export type AnimationDefinition = (ctx: AnimationContext) => AnimationConfig;

// ─── Plugin Registration ─────────────────────────────────────────────────────

gsap.registerPlugin(ScrollTrigger);

// ─── Utility: Resolve stagger ─────────────────────────────────────────────────

function resolveStagger(s: number | StaggerOptions, fallback = 0.04): number {
    return typeof s === 'number' ? s : fallback;
}

// ─── Utility: Text Splitting ─────────────────────────────────────────────────

function splitChars(el: HTMLElement): HTMLElement[] {
    const text = el.textContent ?? '';
    el.innerHTML = '';

    return [...text].map((ch) => {
        const span = document.createElement('span');
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.display = 'inline-block';
        el.appendChild(span);

        return span;
    });
}

function splitWords(el: HTMLElement): HTMLElement[] {
    const words = (el.textContent ?? '').split(' ');
    el.innerHTML = '';

    return words.map((word, i) => {
        const clip = document.createElement('span');
        clip.style.cssText =
            'display:inline-block;overflow:hidden;vertical-align:bottom;';
        const inner = document.createElement('span');
        inner.textContent = word;
        inner.style.display = 'inline-block';
        clip.appendChild(inner);
        el.appendChild(clip);

        if (i < words.length - 1) {
            el.appendChild(document.createTextNode('\u00A0'));
        }

        return inner;
    });
}

function splitLines(el: HTMLElement): HTMLElement[] {
    const lines = (el.textContent ?? '').split('\n');
    el.innerHTML = '';

    return lines.map((line, lineIndex) => {
        const lineWrap = document.createElement('span');
        lineWrap.style.cssText = 'display:block;';
        const lineInner = document.createElement('span');
        lineInner.style.cssText =
            'display:inline-block;overflow:hidden;vertical-align:bottom;';
        const words = line.split(' ');
        words.forEach((word, wordIndex) => {
            const wordClip = document.createElement('span');
            wordClip.style.cssText =
                'display:inline-block;overflow:hidden;vertical-align:bottom;';
            const wordInner = document.createElement('span');
            wordInner.textContent = word;
            wordInner.style.display = 'inline-block';
            wordClip.appendChild(wordInner);
            lineInner.appendChild(wordClip);

            if (wordIndex < words.length - 1) {
                lineInner.appendChild(document.createTextNode('\u00A0'));
            }
        });
        lineWrap.appendChild(lineInner);
        el.appendChild(lineWrap);

        if (lineIndex < lines.length - 1) {
            el.appendChild(document.createTextNode('\n'));
        }

        return lineInner;
    });
}

// ─── Shared special builder helpers ──────────────────────────────────────────

/** Builds a standard `from` tween over chars with stagger. */
function fromChars(
    tl: gsap.core.Timeline,
    chars: HTMLElement[],
    opts: ResolvedAnimOpts,
    vars: gsap.TweenVars,
    staggerFallback = 0.04,
): void {
    tl.from(chars, {
        ...vars,
        duration: opts.duration,
        stagger: resolveStagger(opts.stagger, staggerFallback),
        ease: vars.ease ?? opts.ease,
    });
}

// ─── Animation Definitions ───────────────────────────────────────────────────

const ANIMATIONS: Partial<Record<AnimationType, AnimationDefinition>> = {
    // ── Fades ─────────────────────────────────────────────────────────────────

    fadeIn: ({ chars }) => ({
        targets: chars,
        from: { opacity: 0 },
        to: { opacity: 1 },
    }),
    fadeInUp: ({ chars }) => ({
        targets: chars,
        from: { opacity: 0, y: 40 },
        to: { opacity: 1, y: 0 },
    }),
    fadeInDown: ({ chars }) => ({
        targets: chars,
        from: { opacity: 0, y: -40 },
        to: { opacity: 1, y: 0 },
    }),
    fadeInLeft: ({ chars }) => ({
        targets: chars,
        from: { opacity: 0, x: -40 },
        to: { opacity: 1, x: 0 },
    }),
    fadeInRight: ({ chars }) => ({
        targets: chars,
        from: { opacity: 0, x: 40 },
        to: { opacity: 1, x: 0 },
    }),
    fadeInTopLeft: ({ chars }) => ({
        targets: chars,
        from: { opacity: 0, x: -40, y: -40 },
        to: { opacity: 1, x: 0, y: 0 },
    }),
    fadeInTopRight: ({ chars }) => ({
        targets: chars,
        from: { opacity: 0, x: 40, y: -40 },
        to: { opacity: 1, x: 0, y: 0 },
    }),
    fadeInBottomLeft: ({ chars }) => ({
        targets: chars,
        from: { opacity: 0, x: -40, y: 40 },
        to: { opacity: 1, x: 0, y: 0 },
    }),
    fadeInBottomRight: ({ chars }) => ({
        targets: chars,
        from: { opacity: 0, x: 40, y: 40 },
        to: { opacity: 1, x: 0, y: 0 },
    }),

    // ── Slides ────────────────────────────────────────────────────────────────

    slideUp: ({ chars }) => ({
        targets: chars,
        from: { y: '100%', opacity: 0 },
        to: { y: '0%', opacity: 1 },
    }),
    slideDown: ({ chars }) => ({
        targets: chars,
        from: { y: '-100%', opacity: 0 },
        to: { y: '0%', opacity: 1 },
    }),
    slideLeft: ({ chars }) => ({
        targets: chars,
        from: { x: '-120%', opacity: 0 },
        to: { x: '0%', opacity: 1 },
    }),
    slideRight: ({ chars }) => ({
        targets: chars,
        from: { x: '120%', opacity: 0 },
        to: { x: '0%', opacity: 1 },
    }),
    slideTopLeft: ({ chars }) => ({
        targets: chars,
        from: { x: '-120%', y: '-100%', opacity: 0 },
        to: { x: '0%', y: '0%', opacity: 1 },
    }),
    slideTopRight: ({ chars }) => ({
        targets: chars,
        from: { x: '120%', y: '-100%', opacity: 0 },
        to: { x: '0%', y: '0%', opacity: 1 },
    }),
    slideBottomLeft: ({ chars }) => ({
        targets: chars,
        from: { x: '-120%', y: '100%', opacity: 0 },
        to: { x: '0%', y: '0%', opacity: 1 },
    }),
    slideBottomRight: ({ chars }) => ({
        targets: chars,
        from: { x: '120%', y: '100%', opacity: 0 },
        to: { x: '0%', y: '0%', opacity: 1 },
    }),

    // ── Scale ─────────────────────────────────────────────────────────────────

    scaleUp: ({ chars }) => ({
        targets: chars,
        from: { scale: 0, opacity: 0 },
        to: { scale: 1, opacity: 1 },
    }),
    scaleDown: ({ chars }) => ({
        targets: chars,
        from: { scale: 2.5, opacity: 0 },
        to: { scale: 1, opacity: 1 },
    }),
    scaleIn: ({ chars }) => ({
        targets: chars,
        from: { scale: 0, opacity: 0 },
        to: { scale: 1, opacity: 1, ease: 'back.out(2)' },
        overrideEase: true,
    }),
    scaleInUp: ({ chars }) => ({
        targets: chars,
        from: { scale: 0, y: 30, opacity: 0 },
        to: { scale: 1, y: 0, opacity: 1 },
    }),
    scaleInDown: ({ chars }) => ({
        targets: chars,
        from: { scale: 0, y: -30, opacity: 0 },
        to: { scale: 1, y: 0, opacity: 1 },
    }),

    // ── Blur ──────────────────────────────────────────────────────────────────

    blurIn: ({ chars }) => ({
        targets: chars,
        from: { filter: 'blur(12px)', opacity: 0 },
        to: { filter: 'blur(0px)', opacity: 1 },
    }),
    blurOut: ({ chars }) => ({
        targets: chars,
        from: { filter: 'blur(0px)', opacity: 1 },
        to: { filter: 'blur(12px)', opacity: 0 },
    }),
    blurInLeft: ({ chars }) => ({
        targets: chars,
        from: { filter: 'blur(12px)', x: -40, opacity: 0 },
        to: { filter: 'blur(0px)', x: 0, opacity: 1 },
    }),
    blurInRight: ({ chars }) => ({
        targets: chars,
        from: { filter: 'blur(12px)', x: 40, opacity: 0 },
        to: { filter: 'blur(0px)', x: 0, opacity: 1 },
    }),
    blurInUp: ({ chars }) => ({
        targets: chars,
        from: { filter: 'blur(12px)', y: 40, opacity: 0 },
        to: { filter: 'blur(0px)', y: 0, opacity: 1 },
    }),
    blurInDown: ({ chars }) => ({
        targets: chars,
        from: { filter: 'blur(12px)', y: -40, opacity: 0 },
        to: { filter: 'blur(0px)', y: 0, opacity: 1 },
    }),

    // ── Rotate ────────────────────────────────────────────────────────────────

    rotateIn: ({ chars }) => ({
        targets: chars,
        from: { rotation: -180, opacity: 0, scale: 0 },
        to: { rotation: 0, opacity: 1, scale: 1 },
    }),
    rotateOut: ({ chars }) => ({
        targets: chars,
        from: { rotation: 0, opacity: 1 },
        to: { rotation: 180, opacity: 0 },
    }),
    rotateInLeft: ({ chars }) => ({
        targets: chars,
        from: { rotation: -90, x: -40, opacity: 0 },
        to: { rotation: 0, x: 0, opacity: 1 },
    }),
    rotateInRight: ({ chars }) => ({
        targets: chars,
        from: { rotation: 90, x: 40, opacity: 0 },
        to: { rotation: 0, x: 0, opacity: 1 },
    }),
    rotateOutLeft: ({ chars }) => ({
        targets: chars,
        from: { rotation: 0, opacity: 1 },
        to: { rotation: -90, x: -40, opacity: 0 },
    }),
    rotateOutRight: ({ chars }) => ({
        targets: chars,
        from: { rotation: 0, opacity: 1 },
        to: { rotation: 90, x: 40, opacity: 0 },
    }),

    // ── Physics ───────────────────────────────────────────────────────────────

    bounce: ({ chars, opts }) => ({
        special: (tl) => {
            fromChars(tl, chars, opts, {
                y: -60,
                opacity: 0,
                ease: 'bounce.out',
            });
        },
    }),

    elastic: ({ chars, opts }) => ({
        special: (tl) => {
            fromChars(tl, chars, opts, {
                scale: 0,
                opacity: 0,
                ease: 'elastic.out(1, 0.3)',
            });
        },
    }),

    jelly: ({ chars, opts }) => ({
        special: (tl) => {
            fromChars(tl, chars, opts, {
                scaleX: 1.6,
                scaleY: 0.4,
                opacity: 0,
                ease: 'elastic.out(1, 0.4)',
            });
        },
    }),

    squash: ({ chars, opts }) => ({
        special: (tl) => {
            fromChars(tl, chars, opts, {
                scaleY: 2.5,
                scaleX: 0.5,
                y: -30,
                opacity: 0,
                ease: 'bounce.out',
            });
        },
    }),

    liquid: ({ chars, opts }) => ({
        special: (tl) => {
            fromChars(tl, chars, opts, {
                scaleY: 2.5,
                scaleX: 0.4,
                opacity: 0,
                ease: 'elastic.out(0.5, 0.3)',
            });
        },
    }),

    swing: ({ chars, opts }) => ({
        special: (tl) => {
            fromChars(tl, chars, opts, {
                rotation: -45,
                transformOrigin: 'top center',
                opacity: 0,
                ease: 'elastic.out(0.8, 0.4)',
            });
        },
    }),

    stretch: ({ chars }) => ({
        targets: chars,
        from: { scaleX: 3, opacity: 0 },
        to: { scaleX: 1, opacity: 1 },
    }),

    spring: ({ chars, opts }) => ({
        special: (tl) => {
            fromChars(tl, chars, opts, {
                scale: 0,
                opacity: 0,
                ease: 'elastic.out(1, 0.5)',
            });
        },
    }),

    wobble: ({ chars, opts }) => ({
        special: (tl) => {
            fromChars(tl, chars, opts, {
                rotation: -15,
                opacity: 0,
                ease: 'elastic.out(1, 0.3)',
            });
        },
    }),

    shake: ({ chars, opts }) => ({
        special: (tl) => {
            tl.from(chars, {
                x: -10,
                opacity: 0,
                duration: opts.duration * 0.5,
                stagger: resolveStagger(opts.stagger),
                ease: 'power1.inOut',
            });
        },
    }),

    drift: ({ chars, opts }) => ({
        special: (tl) => {
            fromChars(tl, chars, opts, {
                x: -30,
                y: 20,
                opacity: 0,
                ease: 'power2.out',
            });
        },
    }),

    float: ({ chars, opts }) => ({
        special: (tl) => {
            fromChars(tl, chars, opts, { y: 30, opacity: 0, ease: 'sine.out' });
        },
    }),

    // ── Character ─────────────────────────────────────────────────────────────

    wave: ({ chars, opts }) => ({
        special: (tl) => {
            tl.from(chars, {
                y: -20,
                opacity: 0,
                duration: opts.duration,
                ease: 'sine.inOut',
                stagger: {
                    each: resolveStagger(opts.stagger, 0.06),
                    yoyo: true,
                    repeat: 1,
                },
            });
        },
    }),

    pop: ({ chars, opts }) => ({
        special: (tl) => {
            fromChars(tl, chars, opts, {
                scale: 0,
                opacity: 0,
                ease: 'back.out(3)',
            });
        },
    }),

    flip: ({ chars }) => ({
        targets: chars,
        from: { rotationX: 90, opacity: 0, transformPerspective: 400 },
        to: { rotationX: 0, opacity: 1, transformPerspective: 400 },
    }),

    rollIn: ({ chars }) => ({
        targets: chars,
        from: { x: -60, rotation: -120, opacity: 0 },
        to: { x: 0, rotation: 0, opacity: 1 },
    }),

    skewIn: ({ chars }) => ({
        targets: chars,
        from: { skewX: 30, opacity: 0, x: -30 },
        to: { skewX: 0, opacity: 1, x: 0 },
    }),

    spiral: ({ chars }) => ({
        targets: chars,
        from: {
            rotation: -720,
            scale: 0,
            opacity: 0,
            x: () => gsap.utils.random(-40, 40) as number,
        },
        to: { rotation: 0, scale: 1, opacity: 1, x: 0 },
    }),

    morph: ({ chars }) => ({
        targets: chars,
        from: { borderRadius: '50%', scale: 0.3, opacity: 0 },
        to: { borderRadius: '0%', scale: 1, opacity: 1 },
    }),

    crash: ({ chars, opts }) => ({
        special: (tl) => {
            tl.from(chars, {
                y: () => gsap.utils.random(-200, -80) as number,
                x: () => gsap.utils.random(-20, 20) as number,
                rotation: () => gsap.utils.random(-30, 30) as number,
                opacity: 0,
                scale: () => gsap.utils.random(0.5, 1.5) as number,
                duration: opts.duration * 0.6,
                stagger: resolveStagger(opts.stagger),
                ease: 'bounce.out',
            });
        },
    }),

    explode: ({ chars, opts }) => ({
        special: (tl) => {
            tl.from(chars, {
                x: () => gsap.utils.random(-120, 120) as number,
                y: () => gsap.utils.random(-120, 120) as number,
                rotation: () => gsap.utils.random(-360, 360) as number,
                opacity: 0,
                scale: 0,
                duration: opts.duration,
                stagger: resolveStagger(opts.stagger),
                ease: opts.ease,
            });
        },
    }),

    // ── Text Entry ────────────────────────────────────────────────────────────

    letterByLetter: ({ chars, opts }) => ({
        special: (tl) => {
            gsap.set(chars, { visibility: 'hidden' });
            tl.to(chars, {
                visibility: 'visible',
                duration: 0,
                stagger: (opts.duration * 0.9) / chars.length,
            });
        },
    }),

    typewriter: ({ chars, opts }) => ({
        special: (tl) => {
            const firstChar = chars[0];

            if (!firstChar?.parentNode) {
                return;
            }

            const cursor = document.createElement('span');
            cursor.textContent = '|';
            cursor.style.cssText = 'display:inline-block;margin-left:1px;';

            const styleEl = document.createElement('style');
            styleEl.textContent =
                '@keyframes cursorBlink{0%,50%{opacity:1}51%,100%{opacity:0}}';
            cursor.style.animation = 'cursorBlink 0.8s infinite';
            document.head.appendChild(styleEl);

            firstChar.parentNode.insertBefore(cursor, firstChar);
            gsap.set(chars, { visibility: 'hidden' });

            const charTime = (opts.duration * 0.8) / chars.length;
            chars.forEach((char, i) => {
                tl.call(
                    () => {
                        char.style.visibility = 'visible';
                        cursor.parentNode?.insertBefore(
                            cursor,
                            char.nextSibling,
                        );
                    },
                    undefined,
                    i * charTime,
                );
            });

            tl.call(
                () => {
                    const last = chars[chars.length - 1];

                    if (last) {
                        cursor.parentNode?.insertBefore(
                            cursor,
                            last.nextSibling,
                        );
                    }
                },
                undefined,
                chars.length * charTime,
            );

            tl.eventCallback('onComplete', () => {
                cursor.remove();
                styleEl.remove();
            });
        },
    }),

    jitter: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger, 0.02);

                for (let j = 0; j < 3; j++) {
                    tl.to(
                        char,
                        {
                            x: () => gsap.utils.random(-3, 3),
                            duration: 0.05,
                            ease: 'none',
                        },
                        t + j * 0.05,
                    );
                }

                tl.to(
                    char,
                    {
                        x: 0,
                        opacity: 1,
                        duration: opts.duration * 0.3,
                        ease: 'power2.out',
                    },
                    t,
                );
            });
        },
    }),

    reveal: ({ words, opts }) => ({
        special: (tl) => {
            tl.from(words, {
                y: '110%',
                opacity: 0,
                duration: opts.duration,
                stagger:
                    typeof opts.stagger === 'number'
                        ? opts.stagger * 2
                        : opts.stagger,
                ease: opts.ease,
            });
        },
    }),

    // ── Visual Effects ────────────────────────────────────────────────────────

    glitch: ({ chars, opts, effectColors }) => ({
        special: (tl) => {
            const glitchChars = '!@#$%^&*()[]{}|;:,.<>?~`';
            const primary = effectColors[0] ?? '#ff003c';
            const secondary = effectColors[1] ?? '#00f7ff';

            chars.forEach((char, i) => {
                const originalText = char.textContent ?? '';
                const t = i * resolveStagger(opts.stagger, 0.02);
                const glitchCount = 5 + Math.floor(Math.random() * 3);

                gsap.set(char, { opacity: 0, scale: 0.8 });
                tl.to(
                    char,
                    {
                        opacity: 1,
                        scale: 1,
                        duration: opts.duration * 0.15,
                        ease: 'power2.out',
                    },
                    t,
                );

                for (let g = 0; g < glitchCount; g++) {
                    const gs =
                        t + opts.duration * 0.2 + g * opts.duration * 0.08;
                    tl.to(
                        char,
                        {
                            x: () => gsap.utils.random(-6, 6),
                            y: () => gsap.utils.random(-4, 4),
                            duration: 0.03,
                            ease: 'none',
                        },
                        gs,
                    );
                    tl.to(
                        char,
                        {
                            textShadow: `${gsap.utils.random(-4, 4)}px ${gsap.utils.random(-2, 2)}px ${primary}, ${gsap.utils.random(-4, 4)}px ${gsap.utils.random(-2, 2)}px ${secondary}`,
                            duration: 0.03,
                            ease: 'none',
                        },
                        gs,
                    );
                    tl.to(
                        char,
                        {
                            opacity: () => (Math.random() > 0.3 ? 1 : 0.5),
                            duration: 0.02,
                        },
                        gs,
                    );
                    tl.call(
                        () => {
                            if (Math.random() > 0.4) {
                                char.textContent =
                                    glitchChars[
                                        Math.floor(
                                            Math.random() * glitchChars.length,
                                        )
                                    ] ?? originalText;
                            }
                        },
                        [],
                        gs + 0.015,
                    );
                }

                tl.to(
                    char,
                    {
                        x: 0,
                        y: 0,
                        textShadow: 'none',
                        opacity: 1,
                        scale: 1,
                        duration: opts.duration * 0.15,
                        ease: 'elastic.out(1, 0.3)',
                    },
                    t + opts.duration * 0.6,
                );
                tl.call(
                    () => {
                        char.textContent = originalText;
                    },
                    [],
                    t + opts.duration * 0.8,
                );
            });
        },
    }),

    gradient: ({ el, opts, effectColors }) => ({
        special: (tl) => {
            const colors =
                effectColors.length > 0
                    ? effectColors
                    : ['#ff6ec7', '#ffe259', '#4af', '#ff6ec7'];
            el.style.backgroundImage = `linear-gradient(90deg, ${colors.join(', ')})`;
            el.style.backgroundSize = '300% 100%';
            el.style.backgroundClip = 'text';
            (
                el.style as CSSStyleDeclaration & {
                    webkitTextFillColor: string;
                }
            ).webkitTextFillColor = 'transparent';
            tl.fromTo(
                el,
                { backgroundPosition: '0% 50%' },
                {
                    backgroundPosition: '100% 50%',
                    duration: opts.duration,
                    ease: 'none',
                    repeat: opts.repeat,
                },
            );
        },
    }),

    shadow: ({ chars, opts }) => ({
        special: (tl) => {
            tl.from(chars, {
                opacity: 0,
                duration: opts.duration,
                stagger: resolveStagger(opts.stagger),
            }).to(
                chars,
                {
                    textShadow: '4px 4px 12px rgba(0,0,0,0.5)',
                    duration: opts.duration * 0.6,
                },
                0,
            );
        },
    }),

    neon: ({ el, opts, effectColors }) => ({
        special: (tl) => {
            const c = effectColors[0] ?? '#39ff14';
            tl.fromTo(
                el,
                { textShadow: `0 0 0px ${c}`, opacity: 0 },
                {
                    textShadow: `0 0 8px ${c}, 0 0 20px ${c}, 0 0 40px ${c}`,
                    opacity: 1,
                    duration: opts.duration,
                },
            );
        },
    }),

    marquee: ({ chars, opts }) => ({
        special: (tl) => {
            fromChars(tl, chars, opts, {
                x: '110%',
                opacity: 0,
                ease: 'power3.out',
            });
        },
    }),

    flicker: ({ chars, opts }) => ({
        special: (tl) => {
            gsap.set(chars, { opacity: 0 });
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger, 0.03);
                tl.to(char, { opacity: 1, duration: 0.02 }, t);
                tl.to(char, { opacity: 0.3, duration: 0.02 }, t + 0.02);
                tl.to(char, { opacity: 1, duration: 0.02 }, t + 0.04);
                tl.to(char, { opacity: 0.5, duration: 0.02 }, t + 0.06);
                tl.to(
                    char,
                    { opacity: 1, duration: opts.duration * 0.3 },
                    t + 0.08,
                );
            });
        },
    }),

    spotlight: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger);
                tl.from(
                    char,
                    {
                        opacity: 0,
                        scale: 0.8,
                        textShadow: '0 0 0px transparent',
                        duration: opts.duration,
                        ease: 'power2.out',
                    },
                    t,
                );
                tl.to(
                    char,
                    {
                        textShadow:
                            '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4)',
                        duration: opts.duration * 0.2,
                    },
                    t,
                );
            });
        },
    }),

    outline: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger);
                tl.from(
                    char,
                    {
                        opacity: 0,
                        textShadow: '0 0 0 transparent',
                        duration: opts.duration,
                        ease: 'power2.out',
                    },
                    t,
                );
                tl.to(
                    char,
                    {
                        textShadow:
                            '0 0 2px white, 0 0 4px white, 0 0 6px white',
                        duration: opts.duration * 0.5,
                    },
                    t,
                );
            });
        },
    }),

    pulse: ({ chars, opts }) => ({
        special: (tl) => {
            gsap.set(chars, { opacity: 0, scale: 0.8 });
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger, 0.03);
                tl.to(
                    char,
                    {
                        opacity: 1,
                        scale: 1,
                        duration: opts.duration * 0.3,
                        ease: 'power2.out',
                    },
                    t,
                );
                tl.to(
                    char,
                    {
                        scale: 1.15,
                        duration: opts.duration * 0.15,
                        ease: 'sine.inOut',
                        yoyo: true,
                        repeat: 1,
                    },
                    t + opts.duration * 0.3,
                );
                tl.to(
                    char,
                    {
                        scale: 1,
                        duration: opts.duration * 0.15,
                        ease: 'power2.out',
                    },
                    t + opts.duration * 0.6,
                );
            });
        },
    }),

    breathe: ({ chars, opts }) => ({
        special: (tl) => {
            gsap.set(chars, { opacity: 0, scale: 0.9 });
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger);
                tl.to(
                    char,
                    {
                        opacity: 1,
                        scale: 1,
                        duration: opts.duration * 0.4,
                        ease: 'sine.out',
                    },
                    t,
                );
                tl.to(
                    char,
                    {
                        scale: 1.05,
                        duration: opts.duration * 0.25,
                        ease: 'sine.inOut',
                        yoyo: true,
                        repeat: 1,
                    },
                    t + opts.duration * 0.4,
                );
                tl.to(
                    char,
                    {
                        scale: 1,
                        duration: opts.duration * 0.35,
                        ease: 'sine.inOut',
                    },
                    t + opts.duration * 0.9,
                );
            });
        },
    }),

    aurora: ({ chars, opts, effectColors }) => ({
        special: (tl) => {
            const colors =
                effectColors.length > 0
                    ? effectColors
                    : ['#00d4ff', '#7b2cbf', '#2ec4b6', '#ff6b6b', '#4ecdc4'];
            gsap.set(chars, { opacity: 0, filter: 'blur(6px)' });
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger);
                const c = colors[i % colors.length]!;
                tl.to(
                    char,
                    {
                        opacity: 1,
                        filter: 'blur(0px)',
                        textShadow: `0 0 10px ${c}, 0 0 20px ${c}40`,
                        duration: opts.duration * 0.5,
                        ease: 'power2.out',
                    },
                    t,
                );
                tl.to(
                    char,
                    {
                        textShadow: `0 0 5px ${c}, 0 0 10px ${c}20`,
                        duration: opts.duration * 0.5,
                        ease: 'sine.inOut',
                    },
                    t + opts.duration * 0.5,
                );
            });
        },
    }),

    // ── Special Effects ───────────────────────────────────────────────────────

    matrix: ({ chars, opts, effectColors }) => ({
        special: (tl) => {
            const charset =
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
            const originals = chars.map((c) => c.textContent ?? '');
            const color1 = effectColors[0] ?? '#00ff41';
            const color2 = effectColors[1] ?? '#39ff14';

            gsap.set(chars, { opacity: 0 });
            chars.forEach((char, i) => {
                const scrambleCount = 6;
                const stepDuration = (opts.duration * 0.6) / scrambleCount;
                const startTime = i * resolveStagger(opts.stagger, 0.05);

                for (let s = 0; s < scrambleCount; s++) {
                    tl.call(
                        () => {
                            char.textContent =
                                charset[
                                    Math.floor(Math.random() * charset.length)
                                ] ?? originals[i];
                            char.style.opacity = '1';
                            char.style.color = s % 2 === 0 ? color1 : color2;
                        },
                        [],
                        startTime + s * stepDuration,
                    );
                }

                tl.call(
                    () => {
                        char.textContent = originals[i];
                        char.style.color = '';
                    },
                    [],
                    startTime + scrambleCount * stepDuration,
                );
            });
        },
    }),

    fire: ({ chars, opts, effectColors }) => ({
        special: (tl) => {
            const colors =
                effectColors.length > 0
                    ? effectColors
                    : ['#ff4500', '#ff6a00', '#ffae00', '#ffffff'];
            gsap.set(chars, {
                opacity: 0,
                y: 40,
                scaleY: 1.4,
                transformOrigin: 'bottom center',
            });
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger, 0.05);
                tl.to(
                    char,
                    {
                        opacity: 1,
                        y: 0,
                        scaleY: 1,
                        duration: opts.duration * 0.5,
                        ease: 'power2.out',
                    },
                    t,
                );
                colors.forEach((color, ci) => {
                    tl.to(
                        char,
                        { color, duration: opts.duration * 0.15, ease: 'none' },
                        t + ci * opts.duration * 0.15,
                    );
                });
                tl.to(
                    char,
                    { color: '', duration: opts.duration * 0.15 },
                    t + colors.length * opts.duration * 0.15,
                );
            });
        },
    }),

    rainbow: ({ chars, opts, effectColors }) => ({
        special: (tl) => {
            const defaultHues = [0, 30, 60, 120, 180, 240, 270, 310];
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger);
                const color =
                    effectColors.length > 0
                        ? effectColors[i % effectColors.length]!
                        : `hsl(${defaultHues[i % defaultHues.length]}, 100%, 60%)`;
                tl.from(
                    char,
                    {
                        opacity: 0,
                        y: -20,
                        duration: opts.duration,
                        ease: opts.ease,
                    },
                    t,
                );
                tl.to(char, { color, duration: opts.duration * 0.5 }, t);
            });
        },
    }),

    magnetic: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                const a = Math.random() * Math.PI * 2;
                const d = gsap.utils.random(100, 250) as number;
                tl.from(
                    char,
                    {
                        x: Math.cos(a) * d,
                        y: Math.sin(a) * d,
                        opacity: 0,
                        scale: 0.2,
                        duration: opts.duration,
                        ease: 'power4.out',
                    },
                    i * resolveStagger(opts.stagger, 0.05),
                );
            });
        },
    }),

    particles: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                tl.from(
                    char,
                    {
                        scale: 3,
                        opacity: 0,
                        rotation: gsap.utils.random(-180, 180) as number,
                        x: gsap.utils.random(-60, 60) as number,
                        y: gsap.utils.random(-60, 60) as number,
                        filter: 'blur(8px)',
                        duration: opts.duration,
                        ease: 'expo.out',
                    },
                    i * resolveStagger(opts.stagger, 0.06),
                );
            });
        },
    }),

    dissolve: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger);
                const steps = 5;
                gsap.set(char, { opacity: 0 });

                for (let s = 0; s < steps; s++) {
                    tl.to(
                        char,
                        {
                            opacity: s % 2 === 0 ? 0.6 : 0.1,
                            duration: opts.duration / steps / 2,
                            ease: 'none',
                        },
                        t + s * (opts.duration / steps / 2),
                    );
                }

                tl.to(
                    char,
                    {
                        opacity: 1,
                        duration: opts.duration / steps,
                        ease: 'power2.out',
                    },
                    t + steps * (opts.duration / steps / 2),
                );
            });
        },
    }),

    scramble: ({ chars, opts }) => ({
        special: (tl) => {
            const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
            const originals = chars.map((c) => c.textContent ?? '');
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger, 0.05);
                const iters = 8;
                const step = (opts.duration * 0.7) / iters;
                gsap.set(char, { opacity: 1 });

                for (let s = 0; s < iters; s++) {
                    tl.call(
                        () => {
                            char.textContent =
                                pool[Math.floor(Math.random() * pool.length)] ??
                                originals[i];
                        },
                        [],
                        t + s * step,
                    );
                }

                tl.call(
                    () => {
                        char.textContent = originals[i];
                    },
                    [],
                    t + iters * step,
                );
            });
        },
    }),

    zap: ({ chars, opts, effectColors }) => ({
        special: (tl) => {
            const c1 = effectColors[0] ?? '#ffe600';
            const c2 = effectColors[1] ?? '#ff6a00';
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger);
                tl.set(char, { opacity: 0 }, t)
                    .to(
                        char,
                        {
                            opacity: 1,
                            color: '#fff',
                            textShadow: `0 0 20px ${c1}, 0 0 40px ${c2}`,
                            scale: 1.3,
                            duration: 0.06,
                        },
                        t,
                    )
                    .to(
                        char,
                        {
                            color: '',
                            textShadow: 'none',
                            scale: 1,
                            duration: opts.duration * 0.6,
                            ease: 'power3.out',
                        },
                        t + 0.06,
                    );
            });
        },
    }),

    orbit: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                const angle = (i / chars.length) * Math.PI * 2 - Math.PI / 2;
                tl.from(
                    char,
                    {
                        x: Math.cos(angle) * 80,
                        y: Math.sin(angle) * 80,
                        opacity: 0,
                        scale: 0,
                        duration: opts.duration,
                        ease: 'power3.out',
                    },
                    i * resolveStagger(opts.stagger),
                );
            });
        },
    }),

    vortex: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                tl.from(
                    char,
                    {
                        rotation: (i / chars.length) * 720,
                        scale: 0,
                        opacity: 0,
                        x: Math.sin((i / chars.length) * Math.PI * 4) * 60,
                        y: Math.cos((i / chars.length) * Math.PI * 4) * 60,
                        duration: opts.duration,
                        ease: 'power3.out',
                    },
                    i * resolveStagger(opts.stagger, 0.03),
                );
            });
        },
    }),

    ripple: ({ chars, opts }) => ({
        special: (tl) => {
            const center = Math.floor(chars.length / 2);
            chars.forEach((char, i) => {
                tl.from(
                    char,
                    {
                        y: -30,
                        opacity: 0,
                        scale: 0.5,
                        duration: opts.duration,
                        ease: 'elastic.out(1, 0.5)',
                    },
                    Math.abs(i - center) *
                        resolveStagger(opts.stagger, 0.04) *
                        1.5,
                );
            });
        },
    }),

    piano: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger, 0.05);
                tl.from(
                    char,
                    {
                        y: -80,
                        scaleY: 1.5,
                        opacity: 0,
                        duration: opts.duration * 0.4,
                        ease: 'power2.in',
                    },
                    t,
                )
                    .to(
                        char,
                        { y: 5, scaleY: 0.9, duration: opts.duration * 0.1 },
                        t + opts.duration * 0.4,
                    )
                    .to(
                        char,
                        {
                            y: 0,
                            scaleY: 1,
                            duration: opts.duration * 0.5,
                            ease: 'bounce.out',
                        },
                        t + opts.duration * 0.5,
                    );
            });
        },
    }),

    domino: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                tl.from(
                    char,
                    {
                        rotationZ: -90,
                        transformOrigin: 'bottom center',
                        opacity: 0,
                        duration: opts.duration * 0.6,
                        ease: 'power2.out',
                    },
                    i * resolveStagger(opts.stagger, 0.07),
                );
            });
        },
    }),

    pendulum: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                tl.from(
                    char,
                    {
                        rotationZ: (i % 2 === 0 ? 1 : -1) * 60,
                        transformOrigin: 'top center',
                        opacity: 0,
                        duration: opts.duration,
                        ease: 'elastic.out(0.6, 0.3)',
                    },
                    i * resolveStagger(opts.stagger, 0.05),
                );
            });
        },
    }),

    shatter: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                tl.from(
                    char,
                    {
                        skewX: gsap.utils.random(-40, 40) as number,
                        skewY: gsap.utils.random(-20, 20) as number,
                        x: gsap.utils.random(-50, 50) as number,
                        scale: gsap.utils.random(0.1, 2) as number,
                        opacity: 0,
                        rotation: gsap.utils.random(-45, 45) as number,
                        duration: opts.duration,
                        ease: 'power4.out',
                    },
                    i * resolveStagger(opts.stagger),
                );
            });
        },
    }),

    smoke: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                tl.from(
                    char,
                    {
                        y: gsap.utils.random(20, 60) as number,
                        x: gsap.utils.random(-15, 15) as number,
                        opacity: 0,
                        filter: 'blur(8px)',
                        scale: gsap.utils.random(0.8, 1.4) as number,
                        duration: opts.duration,
                        ease: 'power1.out',
                    },
                    i * resolveStagger(opts.stagger, 0.05),
                );
            });
        },
    }),

    thunder: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger, 0.05);
                tl.set(char, { opacity: 0 }, t)
                    .to(char, { opacity: 1, y: -100, duration: 0.01 }, t)
                    .to(
                        char,
                        {
                            y: 0,
                            duration: opts.duration * 0.3,
                            ease: 'power4.in',
                        },
                        t + 0.01,
                    )
                    .to(
                        char,
                        { textShadow: '0 0 20px #ffe600', duration: 0.05 },
                        t + opts.duration * 0.3,
                    )
                    .to(
                        char,
                        {
                            textShadow: 'none',
                            duration: opts.duration * 0.3,
                            ease: 'power2.out',
                        },
                        t + opts.duration * 0.35,
                    )
                    .to(
                        char,
                        { y: -5, duration: 0.06 },
                        t + opts.duration * 0.3,
                    )
                    .to(
                        char,
                        { y: 0, duration: 0.1, ease: 'bounce.out' },
                        t + opts.duration * 0.36,
                    );
            });
        },
    }),

    crystallize: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger, 0.06);
                tl.from(
                    char,
                    {
                        opacity: 0,
                        scale: 1.8,
                        skewX: gsap.utils.random(-30, 30) as number,
                        skewY: gsap.utils.random(-15, 15) as number,
                        filter: 'blur(4px) brightness(2)',
                        color: '#a0e4ff',
                        duration: opts.duration,
                        ease: 'power3.out',
                    },
                    t,
                );
                tl.to(
                    char,
                    {
                        color: '',
                        filter: 'none',
                        duration: opts.duration * 0.3,
                    },
                    t + opts.duration * 0.7,
                );
            });
        },
    }),

    warp: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger);
                tl.from(
                    char,
                    {
                        scaleX: 8,
                        opacity: 0,
                        duration: opts.duration * 0.4,
                        ease: 'power3.out',
                    },
                    t,
                )
                    .to(
                        char,
                        { scaleX: 0.8, duration: opts.duration * 0.15 },
                        t + opts.duration * 0.4,
                    )
                    .to(
                        char,
                        {
                            scaleX: 1,
                            duration: opts.duration * 0.45,
                            ease: 'elastic.out(1, 0.6)',
                        },
                        t + opts.duration * 0.55,
                    );
            });
        },
    }),

    cinema: ({ el, opts }) => ({
        special: (tl) => {
            gsap.set(el, {
                opacity: 0,
                filter: 'sepia(1) contrast(2) brightness(0.5)',
            });

            for (let f = 0; f < 8; f++) {
                tl.to(el, {
                    opacity:
                        f % 2 === 0
                            ? (gsap.utils.random(0.2, 0.7) as number)
                            : 0,
                    duration: opts.duration / 16,
                    ease: 'none',
                });
            }

            tl.to(el, { opacity: 1, duration: opts.duration * 0.3 }).to(el, {
                filter: 'sepia(0) contrast(1) brightness(1)',
                duration: opts.duration * 0.5,
                ease: 'power2.inOut',
            });
        },
    }),

    gravity: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                tl.from(
                    char,
                    {
                        y: -100,
                        rotation: -30,
                        opacity: 0,
                        duration: opts.duration * 0.7,
                        ease: 'bounce.out',
                    },
                    i * resolveStagger(opts.stagger),
                );
            });
        },
    }),

    levitate: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                tl.from(
                    char,
                    {
                        y: 50,
                        opacity: 0,
                        duration: opts.duration,
                        ease: 'power3.out',
                    },
                    i * resolveStagger(opts.stagger, 0.05),
                );
            });
        },
    }),

    twinkle: ({ chars, opts }) => ({
        special: (tl) => {
            gsap.set(chars, { opacity: 0, scale: 0.5 });
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger, 0.03);
                tl.to(
                    char,
                    {
                        opacity: 1,
                        scale: 1,
                        duration: opts.duration * 0.3,
                        ease: 'power2.out',
                    },
                    t,
                );
                tl.to(
                    char,
                    {
                        opacity: 0.3,
                        scale: 0.8,
                        duration: opts.duration * 0.15,
                        ease: 'sine.inOut',
                        yoyo: true,
                        repeat: 1,
                    },
                    t + opts.duration * 0.3,
                );
                tl.to(
                    char,
                    { opacity: 1, scale: 1, duration: opts.duration * 0.2 },
                    t + opts.duration * 0.6,
                );
            });
        },
    }),

    shimmerFade: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger);
                tl.from(
                    char,
                    {
                        opacity: 0,
                        duration: opts.duration * 0.5,
                        ease: 'power2.out',
                    },
                    t,
                );
                tl.to(
                    char,
                    {
                        opacity: 0.7,
                        duration: opts.duration * 0.2,
                        ease: 'sine.inOut',
                        yoyo: true,
                        repeat: 1,
                    },
                    t + opts.duration * 0.5,
                );
                tl.to(
                    char,
                    { opacity: 1, duration: opts.duration * 0.3 },
                    t + opts.duration * 0.9,
                );
            });
        },
    }),

    fold: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                tl.from(
                    char,
                    {
                        scaleY: 0,
                        opacity: 0,
                        transformOrigin: 'bottom center',
                        duration: opts.duration,
                        ease: 'back.out(1.5)',
                    },
                    i * resolveStagger(opts.stagger, 0.05),
                );
            });
        },
    }),

    cascade: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                const startY = gsap.utils.random(-120, -40) as number;
                const t = i * resolveStagger(opts.stagger, 0.04);
                tl.from(
                    char,
                    {
                        y: startY,
                        opacity: 0,
                        duration: opts.duration * 0.6,
                        ease: 'power3.in',
                    },
                    t,
                ).to(
                    char,
                    { y: 0, duration: opts.duration * 0.4, ease: 'bounce.out' },
                    t + opts.duration * 0.6,
                );
            });
        },
    }),

    pinball: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger, 0.06);
                const dir = i % 2 === 0 ? 1 : -1;
                gsap.set(char, { opacity: 0 });
                tl.to(char, { opacity: 1, duration: 0.01 }, t)
                    .from(
                        char,
                        {
                            x: dir * 80,
                            duration: opts.duration * 0.25,
                            ease: 'power2.in',
                        },
                        t,
                    )
                    .to(
                        char,
                        {
                            x: -dir * 30,
                            duration: opts.duration * 0.2,
                            ease: 'power1.out',
                        },
                        t + opts.duration * 0.25,
                    )
                    .to(
                        char,
                        {
                            x: dir * 10,
                            duration: opts.duration * 0.15,
                            ease: 'power1.in',
                        },
                        t + opts.duration * 0.45,
                    )
                    .to(
                        char,
                        {
                            x: 0,
                            duration: opts.duration * 0.2,
                            ease: 'bounce.out',
                        },
                        t + opts.duration * 0.6,
                    );
            });
        },
    }),

    neonFlicker: ({ chars, opts, effectColors }) => ({
        special: (tl) => {
            const glowColor = effectColors[0] ?? '#39ff14';
            const flickerOffsets = [0, 0.05, 0.1, 0.16, 0.22, 0.3];
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger, 0.05);
                gsap.set(char, { opacity: 0 });
                flickerOffsets.forEach((offset, fi) => {
                    tl.to(
                        char,
                        {
                            opacity: fi % 2 === 0 ? 1 : 0.15,
                            color: glowColor,
                            textShadow:
                                fi % 2 === 0
                                    ? `0 0 6px ${glowColor}, 0 0 20px ${glowColor}`
                                    : 'none',
                            duration: 0.04,
                            ease: 'none',
                        },
                        t + offset,
                    );
                });
                tl.to(
                    char,
                    {
                        opacity: 1,
                        color: '',
                        textShadow: 'none',
                        duration: opts.duration * 0.4,
                        ease: 'power2.out',
                    },
                    t + 0.34,
                );
            });
        },
    }),

    rise: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                const sway = gsap.utils.random(-12, 12) as number;
                const t = i * resolveStagger(opts.stagger, 0.05);
                tl.from(
                    char,
                    {
                        y: 60,
                        x: sway,
                        opacity: 0,
                        scale: 0.7,
                        filter: 'blur(4px)',
                        duration: opts.duration,
                        ease: 'power2.out',
                    },
                    t,
                );
                tl.to(
                    char,
                    {
                        x: 0,
                        filter: 'blur(0px)',
                        duration: opts.duration * 0.4,
                        ease: 'sine.out',
                    },
                    t + opts.duration * 0.6,
                );
            });
        },
    }),

    unfurl: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                tl.from(
                    char,
                    {
                        rotationY: -90,
                        opacity: 0,
                        transformPerspective: 600,
                        transformOrigin: 'left center',
                        duration: opts.duration,
                        ease: 'back.out(1.4)',
                    },
                    i * resolveStagger(opts.stagger, 0.05),
                );
            });
        },
    }),

    stampIn: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                const t = i * resolveStagger(opts.stagger, 0.12);
                tl.from(
                    char,
                    {
                        y: -120,
                        scaleY: 1.4,
                        opacity: 0,
                        transformOrigin: 'top center',
                        duration: opts.duration * 0.35,
                        ease: 'power4.in',
                    },
                    t,
                )
                    .to(
                        char,
                        {
                            scaleY: 0.6,
                            scaleX: 1.3,
                            duration: opts.duration * 0.1,
                            ease: 'power1.out',
                        },
                        t + opts.duration * 0.35,
                    )
                    .to(
                        char,
                        {
                            scaleY: 1.1,
                            scaleX: 0.95,
                            duration: opts.duration * 0.12,
                            ease: 'power1.inOut',
                        },
                        t + opts.duration * 0.45,
                    )
                    .to(
                        char,
                        {
                            scaleY: 1,
                            scaleX: 1,
                            duration: opts.duration * 0.31,
                            ease: 'elastic.out(1, 0.5)',
                        },
                        t + opts.duration * 0.57,
                    );
            });
        },
    }),

    blinds: ({ chars, opts }) => ({
        special: (tl) => {
            chars.forEach((char, i) => {
                gsap.set(char, {
                    transformOrigin: 'top center',
                    scaleY: 0,
                    opacity: 1,
                });
                tl.to(
                    char,
                    {
                        scaleY: 1,
                        duration: opts.duration,
                        ease: 'back.out(1.6)',
                    },
                    i * resolveStagger(opts.stagger, 0.1),
                );
            });
        },
    }),
};

// ─── Component ───────────────────────────────────────────────────────────────

const TextAnimator = forwardRef<TextAnimatorRef, TextAnimatorProps>(
    function TextAnimator(
        {
            text,
            children,
            animation = 'fadeInUp',
            trigger = 'scrollTrigger',
            splitBy = 'chars',
            tag: Tag = 'span',
            duration = 0.8,
            delay = 0,
            stagger = 0.04,
            ease = 'power3.out',
            repeat = 0,
            yoyo = false,
            scrollTrigger: scrollTriggerOpts,
            color,
            fontSize,
            className = '',
            style = {},
            effectColor,
            onComplete,
            onStart,
            onRepeat,
        },
        ref,
    ) {
        const elRef = useRef<HTMLElement>(null);
        const tlRef = useRef<gsap.core.Timeline | null>(null);
        const stRef = useRef<ScrollTrigger | null>(null);

        // ── Stable callback refs ────────────────────────────────────────────
        const onCompleteRef = useRef(onComplete);
        const onStartRef = useRef(onStart);
        const onRepeatRef = useRef(onRepeat);

        useEffect(() => {
            onCompleteRef.current = onComplete;
        }, [onComplete]);
        useEffect(() => {
            onStartRef.current = onStart;
        }, [onStart]);
        useEffect(() => {
            onRepeatRef.current = onRepeat;
        }, [onRepeat]);

        const content: string = children ?? text ?? 'Animate Me';

        const resolvedOpts: ResolvedAnimOpts = useMemo(
            () => ({ duration, delay, stagger, ease, repeat, yoyo }),
            [duration, delay, stagger, ease, repeat, yoyo],
        );

        // ── Build timeline ──────────────────────────────────────────────────
        const buildTimeline = useCallback((): gsap.core.Timeline | null => {
            const el = elRef.current;

            if (!el) {
                return null;
            }

            const def = ANIMATIONS[animation] ?? ANIMATIONS['fadeIn']!;
            el.textContent = content;

            let chars: HTMLElement[] = [];
            let words: HTMLElement[] = [];

            if (splitBy === 'chars') {
                chars = splitChars(el);
            } else if (splitBy === 'words') {
                words = splitWords(el);
                chars = words;
            } else if (splitBy === 'lines') {
                words = splitLines(el);
                chars = words;
            }

            const rawColors = Array.isArray(effectColor)
                ? effectColor
                : effectColor
                  ? [effectColor]
                  : [];
            const effectColors =
                rawColors.length === 1
                    ? [rawColors[0]!, rawColors[0]!]
                    : rawColors;

            const ctx: AnimationContext = {
                chars,
                words,
                el,
                opts: resolvedOpts,
                effectColors,
            };
            const config = def(ctx);

            const tl = gsap.timeline({
                paused: true,
                defaults: {
                    duration: resolvedOpts.duration,
                    ease: resolvedOpts.ease,
                },
                onStart: () => onStartRef.current?.(),
                onComplete: () => onCompleteRef.current?.(),
                onRepeat: () => onRepeatRef.current?.(),
                delay: resolvedOpts.delay,
                repeat: resolvedOpts.repeat,
                yoyo: resolvedOpts.yoyo,
            });

            if (config.special) {
                config.special(tl);
            } else if (config.targets && config.from && config.to) {
                tl.fromTo(config.targets, config.from, {
                    ...config.to,
                    stagger: resolvedOpts.stagger,
                    ease: config.overrideEase
                        ? config.to.ease
                        : resolvedOpts.ease,
                });
            }

            return tl;
        }, [animation, content, splitBy, effectColor, resolvedOpts]);

        // ── GSAP context ────────────────────────────────────────────────────
        useGSAP(
            () => {
                const el = elRef.current;

                if (!el) {
                    return;
                }

                stRef.current?.kill();
                tlRef.current?.kill();

                const tl = buildTimeline();
                tlRef.current = tl;

                if (!tl) {
                    return;
                }

                if (trigger === 'scrollTrigger') {
                    stRef.current = ScrollTrigger.create({
                        trigger: el,
                        start: scrollTriggerOpts?.start ?? 'top 80%',
                        end: scrollTriggerOpts?.end ?? 'bottom 20%',
                        scrub: scrollTriggerOpts?.scrub ?? false,
                        markers: scrollTriggerOpts?.markers ?? false,
                        pin: scrollTriggerOpts?.pin ?? false,
                        toggleActions:
                            scrollTriggerOpts?.toggleActions ??
                            'play none none reverse',
                        animation: tl,
                    });
                }
            },
            {
                scope: elRef,
                dependencies: [
                    animation,
                    content,
                    trigger,
                    splitBy,
                    resolvedOpts,
                    scrollTriggerOpts,
                    buildTimeline,
                ],
            },
        );

        // ── Trigger handlers ────────────────────────────────────────────────
        const handleClick = useCallback(() => {
            if (trigger !== 'onClick') {
                return;
            }

            tlRef.current?.restart();
        }, [trigger]);

        const handleMouseEnter = useCallback(() => {
            if (trigger !== 'onHover') {
                return;
            }

            tlRef.current?.play();
        }, [trigger]);

        const handleMouseLeave = useCallback(() => {
            if (trigger !== 'onHover') {
                return;
            }

            tlRef.current?.reverse();
        }, [trigger]);

        const handleKeyDown = useCallback(
            (e: KeyboardEvent<Element>) => {
                if (
                    trigger === 'onClick' &&
                    (e.key === 'Enter' || e.key === ' ')
                ) {
                    handleClick();
                }
            },
            [trigger, handleClick],
        );

        // ── Ref API ─────────────────────────────────────────────────────────
        useImperativeHandle(ref, () => ({
            play: () => tlRef.current?.play(),
            pause: () => tlRef.current?.pause(),
            reverse: () => tlRef.current?.reverse(),
            restart: () => tlRef.current?.restart(),
            seek: (t: number) => tlRef.current?.seek(t),
            kill: () => {
                tlRef.current?.kill();
                stRef.current?.kill();
            },
            timeline: () => tlRef.current,
            isPlaying: () => tlRef.current?.isActive() ?? false,
            progress: () => tlRef.current?.progress() ?? 0,
        }));

        // ── Render ──────────────────────────────────────────────────────────
        const tagStyle: React.CSSProperties = {
            display: 'inline-block',
            cursor: trigger === 'onClick' ? 'pointer' : 'default',
            ...(color ? { color } : {}),
            ...(fontSize ? { fontSize } : {}),
            ...style,
        };

        return (
            <Tag
                ref={elRef as React.RefObject<HTMLElement>}
                className={`text-animator ${className}`.trim()}
                style={tagStyle}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-label={content}
                role={trigger === 'onClick' ? 'button' : undefined}
                tabIndex={trigger === 'onClick' ? 0 : undefined}
                onKeyDown={trigger === 'onClick' ? handleKeyDown : undefined}
            >
                {content}
            </Tag>
        );
    },
);

export default TextAnimator;
export { ANIMATIONS };
