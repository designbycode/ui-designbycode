export type PixelShape = 'square' | 'circle' | 'diamond' | 'star' | 'hexagon';

export type AnimationType =
    | 'radial'
    | 'wave'
    | 'random'
    | 'diagonal'
    | 'spiral';

export type AnimationDirection = 'appear' | 'disappear';

export interface PixelConfig {
    /** Array of colors for pixels */
    colors: string[];
    /** Gap between pixels in pixels */
    gap: number;
    /** Animation speed (0-100) */
    speed: number;
    /** Minimum pixel size */
    minSize: number;
    /** Maximum pixel size */
    maxSize: number;
    /** Shimmer intensity (0-1) */
    shimmerIntensity: number;
    /** Shape of pixels */
    shape: PixelShape;
    /** Animation pattern type */
    animationType: AnimationType;
    /** Whether to disable focus events */
    noFocus: boolean;
}

export interface PixelState {
    x: number;
    y: number;
    color: string;
    size: number;
    maxSize: number;
    minSize: number;
    speed: number;
    delay: number;
    sizeStep: number;
    counter: number;
    counterStep: number;
    isIdle: boolean;
    isReverse: boolean;
    isShimmer: boolean;
}

export const defaultPixelConfig: PixelConfig = {
    colors: ['#f8fafc', '#f1f5f9', '#cbd5e1'],
    gap: 6,
    speed: 35,
    minSize: 0.5,
    maxSize: 2,
    shimmerIntensity: 0.5,
    shape: 'square',
    animationType: 'radial',
    noFocus: false,
};

// Preset color palettes
export const colorPresets = {
    slate: ['#f8fafc', '#f1f5f9', '#cbd5e1'],
    blue: ['#dbeafe', '#93c5fd', '#3b82f6'],
    emerald: ['#d1fae5', '#6ee7b7', '#10b981'],
    amber: ['#fef3c7', '#fcd34d', '#f59e0b'],
    rose: ['#ffe4e6', '#fda4af', '#f43f5e'],
    violet: ['#ede9fe', '#c4b5fd', '#8b5cf6'],
    cyan: ['#cffafe', '#67e8f9', '#06b6d4'],
    sunset: ['#fef3c7', '#fdba74', '#f97316'],
    ocean: ['#cffafe', '#7dd3fc', '#0ea5e9'],
    forest: ['#dcfce7', '#86efac', '#22c55e'],
    neon: ['#f0fdf4', '#4ade80', '#22d3ee'],
    midnight: ['#1e293b', '#334155', '#475569'],
};

export function getRandomValue(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function clampValue(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/** Maximum delay cap in milliseconds to ensure responsive animations */
const MAX_DELAY = 1200;

/**
 * Calculate delay based on animation type
 * All delays are capped at MAX_DELAY to ensure responsive animations
 */
export function calculateDelay(
    x: number,
    y: number,
    canvasWidth: number,
    canvasHeight: number,
    animationType: AnimationType,
): number {
    let delay: number;

    switch (animationType) {
        case 'radial': {
            const dx = x - canvasWidth / 2;
            const dy = y - canvasHeight / 2;
            delay = Math.sqrt(dx * dx + dy * dy);
            break;
        }
        case 'wave': {
            delay = x + y * 0.5;
            break;
        }
        case 'random': {
            delay =
                Math.random() *
                Math.min(MAX_DELAY, Math.max(canvasWidth, canvasHeight));
            break;
        }
        case 'diagonal': {
            delay = (x + y) * 0.7;
            break;
        }
        case 'spiral': {
            const dx = x - canvasWidth / 2;
            const dy = y - canvasHeight / 2;
            const angle = Math.atan2(dy, dx);
            const distance = Math.sqrt(dx * dx + dy * dy);
            delay = distance + angle * 50;
            break;
        }
        default:
            delay = 0;
    }

    // Normalize delay to be within 0 to MAX_DELAY range
    const maxRawDelay = Math.sqrt(
        canvasWidth * canvasWidth + canvasHeight * canvasHeight,
    );
    const normalizedDelay = (delay / maxRawDelay) * MAX_DELAY;

    return Math.min(normalizedDelay, MAX_DELAY);
}

/**
 * Draw pixel with specified shape
 */
export function drawPixel(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    maxSize: number,
    color: string,
    shape: PixelShape,
): void {
    // Ensure size is never negative
    const safeSize = Math.max(0, size);

    if (safeSize <= 0) {
        return;
    }

    const centerOffset = maxSize * 0.5 - safeSize * 0.5;
    const cx = x + centerOffset + safeSize / 2;
    const cy = y + centerOffset + safeSize / 2;

    ctx.fillStyle = color;

    switch (shape) {
        case 'square':
            ctx.fillRect(
                x + centerOffset,
                y + centerOffset,
                safeSize,
                safeSize,
            );
            break;

        case 'circle':
            ctx.beginPath();
            ctx.arc(cx, cy, safeSize / 2, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'diamond':
            ctx.beginPath();
            ctx.moveTo(cx, cy - safeSize / 2);
            ctx.lineTo(cx + safeSize / 2, cy);
            ctx.lineTo(cx, cy + safeSize / 2);
            ctx.lineTo(cx - safeSize / 2, cy);
            ctx.closePath();
            ctx.fill();
            break;

        case 'star': {
            const spikes = 5;
            const outerRadius = safeSize / 2;
            const innerRadius = safeSize / 4;
            ctx.beginPath();

            for (let i = 0; i < spikes * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / spikes - Math.PI / 2;
                const px = cx + Math.cos(angle) * radius;
                const py = cy + Math.sin(angle) * radius;

                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }

            ctx.closePath();
            ctx.fill();
            break;
        }

        case 'hexagon': {
            const sides = 6;
            const radius = safeSize / 2;
            ctx.beginPath();

            for (let i = 0; i < sides; i++) {
                const angle = (i * Math.PI * 2) / sides - Math.PI / 2;
                const px = cx + Math.cos(angle) * radius;
                const py = cy + Math.sin(angle) * radius;

                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }

            ctx.closePath();
            ctx.fill();
            break;
        }
    }
}

/**
 * Create initial pixel state
 */
export function createPixelState(
    x: number,
    y: number,
    color: string,
    delay: number,
    speed: number,
    minSize: number,
    maxSize: number,
    canvasWidth: number,
    canvasHeight: number,
): PixelState {
    return {
        x,
        y,
        color,
        size: 0,
        maxSize: getRandomValue(minSize, maxSize),
        minSize,
        speed: getRandomValue(0.1, 0.9) * speed,
        delay,
        sizeStep: Math.random() * 0.4,
        counter: 0,
        counterStep: Math.random() * 4 + (canvasWidth + canvasHeight) * 0.01,
        isIdle: false,
        isReverse: false,
        isShimmer: false,
    };
}

/**
 * Update pixel state for appear animation
 */
export function updatePixelAppear(
    pixel: PixelState,
    shimmerIntensity: number,
): PixelState {
    const updated = { ...pixel, isIdle: false };

    if (updated.counter <= updated.delay) {
        updated.counter += updated.counterStep;

        return updated;
    }

    if (updated.size >= updated.maxSize) {
        updated.isShimmer = true;
    }

    if (updated.isShimmer) {
        return updatePixelShimmer(updated, shimmerIntensity);
    } else {
        updated.size += updated.sizeStep;
    }

    return updated;
}

/**
 * Update pixel state for disappear animation
 */
export function updatePixelDisappear(pixel: PixelState): PixelState {
    const updated = { ...pixel, isShimmer: false, counter: 0 };

    if (updated.size <= 0) {
        updated.isIdle = true;
        updated.size = 0;

        return updated;
    }

    updated.size = Math.max(0, updated.size - 0.1);

    return updated;
}

/**
 * Update pixel shimmer effect
 */
export function updatePixelShimmer(
    pixel: PixelState,
    intensity: number,
): PixelState {
    const updated = { ...pixel };
    const shimmerSpeed = updated.speed * intensity;

    // Ensure minSize is at least 0.1 to prevent negative sizes
    const safeMinSize = Math.max(0.1, updated.minSize);

    if (updated.size >= updated.maxSize) {
        updated.isReverse = true;
    } else if (updated.size <= safeMinSize) {
        updated.isReverse = false;
        updated.size = safeMinSize; // Ensure we don't go below minSize
    }

    if (updated.isReverse) {
        updated.size -= shimmerSpeed;
    } else {
        updated.size += shimmerSpeed;
    }

    // Clamp size to prevent negative values and keep within bounds
    updated.size = Math.max(
        safeMinSize,
        Math.min(updated.size, updated.maxSize * 1.2),
    );

    return updated;
}
