import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    "relative isolate inline-flex items-center justify-center gap-2 overflow-visible rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
                destructive:
                    'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
                outline:
                    'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
                secondary:
                    'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-9 px-4 py-2 has-[>svg]:px-3',
                sm: 'h-8 rounded-md px-3 has-[>svg]:px-2.5',
                lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
                icon: 'size-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

// --- Particle style injection ---
// One unique keyframe per particle slot so each gets its own randomised
// endpoint baked in at style-injection time. CSS custom properties
// (--pdx, --pdy, --pdur) are set on the element at click time.

const DEFAULT_PARTICLE_COUNT = 20;
const PARTICLE_STYLE_ID = 'button-particle-styles-v2';

function injectParticleStyles(maxIndex: number) {
    if (typeof document === 'undefined') {
        return;
    }

    let style = document.getElementById(PARTICLE_STYLE_ID);
    let existingCss = '';
    let existingMax = 0;

    if (style) {
        existingCss = style.textContent || '';
        existingMax = parseInt(style.dataset.maxIndex || '0', 10);

        if (existingMax >= maxIndex) {
            return;
        }
    } else {
        style = document.createElement('style');
        style.id = PARTICLE_STYLE_ID;
    }

    style.dataset.maxIndex = String(maxIndex);

    let css = existingCss;

    if (!css) {
        css = `
        .bp-particle {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            will-change: transform, opacity;
        }
    `;
    }

    for (let i = existingMax + 1; i <= maxIndex; i++) {
        css += `
            @keyframes particle-burst-${i} {
                0%   { transform: translate(-50%, -50%) translate(0px, 0px) scale(1); opacity: 1; }
                60%  { opacity: 0.9; }
                100% { transform: translate(-50%, -50%) translate(var(--pdx), var(--pdy)) scale(0); opacity: 0; }
            }
            .bp-particle[data-particle="burst"][data-idx="${i}"] {
                animation: particle-burst-${i} var(--pdur) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }

            @keyframes sparkle-burst-${i} {
                0%   { transform: translate(-50%, -50%) translate(0px, 0px) rotate(0deg) scale(1); opacity: 1; }
                60%  { opacity: 0.9; }
                100% { transform: translate(-50%, -50%) translate(var(--pdx), var(--pdy)) rotate(180deg) scale(0.3); opacity: 0; }
            }
            .bp-particle[data-particle="sparkle"][data-idx="${i}"] {
                animation: sparkle-burst-${i} var(--pdur) cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            }

            @keyframes confetti-spray-${i} {
                0%   { transform: translate(-50%, -50%) translate(0px, 0px) rotate(0deg) scale(1); opacity: 1; }
                60%  { opacity: 0.9; }
                100% { transform: translate(-50%, -50%) translate(var(--pdx), var(--pdy)) rotate(360deg) scale(0.5); opacity: 0; }
            }
            .bp-particle[data-particle="confetti"][data-idx="${i}"] {
                animation: confetti-spray-${i} var(--pdur) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }

            @keyframes vburst-${i} {
                0%   { transform: translate(-50%, -50%) translate(0px, 0px) scale(1); opacity: 1; }
                60%  { opacity: 0.9; }
                100% { transform: translate(-50%, -50%) translate(var(--pdx), var(--pdy)) scale(0); opacity: 0; }
            }
            .bp-particle[data-particle="vburst"][data-idx="${i}"] {
                animation: vburst-${i} var(--pdur) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }

            @keyframes hburst-${i} {
                0%   { transform: translate(-50%, -50%) translate(0px, 0px) scale(1); opacity: 1; }
                60%  { opacity: 0.9; }
                100% { transform: translate(-50%, -50%) translate(var(--pdx), var(--pdy)) scale(0); opacity: 0; }
            }
            .bp-particle[data-particle="hburst"][data-idx="${i}"] {
                animation: hburst-${i} var(--pdur) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }

            @keyframes spiral-burst-${i} {
                0%   { transform: translate(-50%, -50%) translate(0px, 0px) rotate(0deg) scale(1); opacity: 1; }
                60%  { opacity: 0.9; }
                100% { transform: translate(-50%, -50%) translate(var(--pdx), var(--pdy)) rotate(720deg) scale(0); opacity: 0; }
            }
            .bp-particle[data-particle="spiral"][data-idx="${i}"] {
                animation: spiral-burst-${i} var(--pdur) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
        `;
    }

    style.textContent = css;
    document.head.appendChild(style);
}

injectParticleStyles(DEFAULT_PARTICLE_COUNT);

// --- Colour palette ---
const DEFAULT_COLORS = [
    '#ff0083', // hot pink
    '#ff6b6b', // coral red
    '#ffd93d', // golden yellow
    '#6bcb77', // mint green
    '#4d96ff', // vivid blue
    '#c77dff', // violet
    '#ff9f1c', // amber orange
    '#00f5d4', // cyan
];

export type ParticleType =
    | 'burst'
    | 'sparkle'
    | 'confetti'
    | 'vburst'
    | 'hburst'
    | 'spiral';

function ButtonParticles({
    className,
    variant,
    size,
    particle = 'burst',
    particles = DEFAULT_PARTICLE_COUNT,
    colors = DEFAULT_COLORS,
    children,
    asChild = false,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
        particle?: ParticleType;
        particles?: number;
        colors?: string[];
    }) {
    const Comp = asChild ? Slot : 'button';
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        injectParticleStyles(particles);
    }, [particles]);

    const createParticle = (
        buttonEl: HTMLElement,
        originX: number,
        originY: number,
        index: number,
    ) => {
        if (!buttonEl) {
            return;
        }

        const el = document.createElement('div');
        el.classList.add('bp-particle');
        el.dataset.idx = String(index);
        el.dataset.particle = particle;

        const color = colors[Math.floor(Math.random() * colors.length)];
        // Odd index → stroke only (mirrors the SCSS nth-of-type(odd) rule)
        const isStroke = index % 2 === 1;

        switch (particle) {
            case 'burst': {
                const angle = Math.random() * 2 * Math.PI;
                const dist = 70 + Math.random() * 90;
                const sz = 14 + Math.random() * 14;
                el.style.width = `${sz}px`;
                el.style.height = `${sz}px`;

                if (isStroke) {
                    el.style.backgroundColor = 'transparent';
                    el.style.border = `3px solid ${color}`;
                } else {
                    el.style.backgroundColor = color;
                    el.style.border = 'none';
                }

                const dur = 550 + Math.random() * 400;
                el.style.setProperty('--pdx', `${Math.cos(angle) * dist}px`);
                el.style.setProperty('--pdy', `${Math.sin(angle) * dist}px`);
                el.style.setProperty('--pdur', `${dur}ms`);
                el.style.left = `${originX - sz / 2}px`;
                el.style.top = `${originY - sz / 2}px`;
                buttonEl.appendChild(el);
                setTimeout(() => el.remove(), dur + 50);
                break;
            }
            case 'sparkle': {
                const dx = (Math.random() - 0.5) * 80;
                const dy = -(60 + Math.random() * 100);
                const sz = 8 + Math.random() * 12;
                el.style.width = `${sz}px`;
                el.style.height = `${sz}px`;

                if (isStroke) {
                    el.style.backgroundColor = 'transparent';
                    el.style.border = `2px solid ${color}`;
                } else {
                    el.style.backgroundColor = color;
                    el.style.border = 'none';
                }

                const dur = 600 + Math.random() * 400;
                el.style.setProperty('--pdx', `${dx}px`);
                el.style.setProperty('--pdy', `${dy}px`);
                el.style.setProperty('--pdur', `${dur}ms`);
                el.style.left = `${originX - sz / 2}px`;
                el.style.top = `${originY - sz / 2}px`;
                buttonEl.appendChild(el);
                setTimeout(() => el.remove(), dur + 50);
                break;
            }
            case 'confetti': {
                const spreadAngle = (Math.random() - 0.5) * Math.PI * 0.8;
                const angle = -Math.PI / 2 + spreadAngle;
                const dist = 80 + Math.random() * 120;
                const dx = Math.cos(angle) * dist;
                const dy = Math.sin(angle) * dist - 40;
                const sz = 10 + Math.random() * 8;
                el.style.width = `${sz}px`;
                el.style.height = `${sz * 0.5}px`;
                el.style.borderRadius = '2px';
                el.style.backgroundColor = color;
                el.style.border = 'none';
                const dur = 700 + Math.random() * 400;
                el.style.setProperty('--pdx', `${dx}px`);
                el.style.setProperty('--pdy', `${dy}px`);
                el.style.setProperty('--pdur', `${dur}ms`);
                el.style.left = `${originX - sz / 2}px`;
                el.style.top = `${originY - sz / 4}px`;
                buttonEl.appendChild(el);
                setTimeout(() => el.remove(), dur + 50);
                break;
            }
            case 'vburst': {
                const isUp = index % 2 === 0;
                const dist = 80 + Math.random() * 100;
                const sz = 12 + Math.random() * 12;
                el.style.width = `${sz}px`;
                el.style.height = `${sz}px`;
                el.style.backgroundColor = color;
                el.style.border = 'none';
                const dur = 550 + Math.random() * 400;
                el.style.setProperty(
                    '--pdx',
                    `${(Math.random() - 0.5) * 20}px`,
                );
                el.style.setProperty('--pdy', `${isUp ? -dist : dist}px`);
                el.style.setProperty('--pdur', `${dur}ms`);
                el.style.left = `${originX - sz / 2}px`;
                el.style.top = `${originY - sz / 2}px`;
                buttonEl.appendChild(el);
                setTimeout(() => el.remove(), dur + 50);
                break;
            }
            case 'hburst': {
                const isRight = index % 2 === 0;
                const dist = 80 + Math.random() * 100;
                const sz = 12 + Math.random() * 12;
                el.style.width = `${sz}px`;
                el.style.height = `${sz}px`;
                el.style.backgroundColor = color;
                el.style.border = 'none';
                const dur = 550 + Math.random() * 400;
                el.style.setProperty('--pdx', `${isRight ? dist : -dist}px`);
                el.style.setProperty(
                    '--pdy',
                    `${(Math.random() - 0.5) * 40}px`,
                );
                el.style.setProperty('--pdur', `${dur}ms`);
                el.style.left = `${originX - sz / 2}px`;
                el.style.top = `${originY - sz / 2}px`;
                buttonEl.appendChild(el);
                setTimeout(() => el.remove(), dur + 50);
                break;
            }
            case 'spiral': {
                const baseAngle = Math.random() * 2 * Math.PI;
                const dist = 60 + Math.random() * 100;
                const sz = 8 + Math.random() * 8;
                el.style.width = `${sz}px`;
                el.style.height = `${sz}px`;
                el.style.backgroundColor = color;
                el.style.border = 'none';
                const dur = 600 + Math.random() * 400;
                el.style.setProperty(
                    '--pdx',
                    `${Math.cos(baseAngle) * dist}px`,
                );
                el.style.setProperty(
                    '--pdy',
                    `${Math.sin(baseAngle) * dist}px`,
                );
                el.style.setProperty('--pdur', `${dur}ms`);
                el.style.left = `${originX - sz / 2}px`;
                el.style.top = `${originY - sz / 2}px`;
                buttonEl.appendChild(el);
                setTimeout(() => el.remove(), dur + 50);
                break;
            }
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) {
            return;
        }

        props.onClick?.(e);

        if (e.defaultPrevented) {
            return;
        }

        const cx = ref.current.offsetWidth / 2;
        const cy = ref.current.offsetHeight / 2;
        const buttonEl = ref.current;

        for (let i = 1; i <= particles; i++) {
            setTimeout(() => createParticle(buttonEl, cx, cy, i), i * 12);
        }
    };

    return (
        <Comp
            ref={ref}
            data-slot="button"
            data-particle={particle}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
            onClick={handleClick}
        >
            {children}
        </Comp>
    );
}

export { ButtonParticles, buttonVariants };
