import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type WaveStyle =
    | 'wireframe' // triangulated mesh (has diagonals — legacy)
    | 'grid' // axis-aligned squares, no diagonals
    | 'dots' // round filled circles at every vertex (shader-based)
    | 'dots-wave' // round dots that scale in size with Z height
    | 'crosses' // small + at every vertex
    | 'diagonal-left' // parallel lines leaning left  (\\\)
    | 'diagonal-right' // parallel lines leaning right (///)
    | 'zigzag' // alternating chevron rows
    | 'hexagons' // hexagonal cell grid
    | 'dashes' // dashed horizontal + vertical lines (gaps between cells)
    | 'contour' // topographic iso-lines drawn at fixed Z thresholds
    | 'solid'; // shaded solid surface with lighting

export interface WavesThreeProps {
    className?: string;

    /**
     * Visual style of the wave. See WaveStyle for all options.
     * Default: 'grid'
     */
    style?: WaveStyle;

    /**
     * Which lines to draw — applies to 'grid' and 'dashes' styles.
     *  - 'both'       — horizontal + vertical (default)
     *  - 'horizontal' — only lines running left→right
     *  - 'vertical'   — only lines running top→bottom
     */
    lines?: 'both' | 'horizontal' | 'vertical';

    /**
     * CSS/hex color strings blended left→right across the mesh.
     * Minimum 2. Auto-detects dark/light mode if omitted.
     */
    colors?: string[];

    /** Camera XYZ position. Default: { x:0, y:0, z:10 } */
    cameraPosition?: { x: number; y: number; z: number };

    /** Plane width in world units. Default: 80 */
    planeWidth?: number;
    /** Plane height in world units. Default: 40 */
    planeHeight?: number;

    /** Grid columns — higher = denser. Default: 60 */
    segmentsX?: number;
    /** Grid rows. Default: 30 */
    segmentsY?: number;

    /** Animation speed multiplier. Default: 1 */
    speed?: number;
    /** Wave peak height. Default: 1.5 */
    amplitude?: number;
    /** Wave spatial density — lower = wider. Default: 0.3 */
    frequency?: number;
    /** Global opacity 0–1. Default: 0.6 */
    opacity?: number;
    /** Pause animation. Default: false */
    paused?: boolean;

    /** Mouse influence on wave phase. Default: 2 */
    mouseInfluence?: number;
    /** Mouse influence on mesh tilt. Default: 0.1 */
    mouseRotation?: number;

    /**
     * Dot radius in screen pixels — 'dots' and 'dots-wave' styles.
     * Dots are perfectly round via a GLSL discard shader. Default: 3
     */
    dotSize?: number;

    /**
     * For 'dots-wave': minimum dot size at wave valleys. Default: 1
     */
    dotSizeMin?: number;

    /** Cross arm half-length in world units — 'crosses' style. Default: 0.3 */
    crossSize?: number;

    /**
     * Dash fill ratio 0–1 — 'dashes' style.
     * 0.5 = half line, half gap. Default: 0.5
     */
    dashRatio?: number;

    /**
     * Number of contour threshold levels — 'contour' style. Default: 6
     */
    contourLevels?: number;

    /** High-DPI pixel ratio cap. Default: 2 */
    maxPixelRatio?: number;

    /** Called once the renderer and first frame are ready */
    onReady?: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_LIGHT: string[] = ['#525252', '#525252'];
const DEFAULT_DARK: string[] = ['#444444', '#757575'];

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

function lerpPalette(t: number, stops: THREE.Color[]): THREE.Color {
    const scaled = Math.max(0, Math.min(1, t)) * (stops.length - 1);
    const lo = Math.floor(scaled);
    const hi = Math.min(lo + 1, stops.length - 1);

    return stops[lo].clone().lerp(stops[hi], scaled - lo);
}

function makeColorBuffer(count: number, stops: THREE.Color[]): Float32Array {
    const buf = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const c = lerpPalette(i / Math.max(count - 1, 1), stops);
        buf[i * 3] = c.r;
        buf[i * 3 + 1] = c.g;
        buf[i * 3 + 2] = c.b;
    }

    return buf;
}

// ---------------------------------------------------------------------------
// Shared vertex-grid builder
// Returns a flat XY grid of (cols+1)×(rows+1) vertices, Z=0.
// ---------------------------------------------------------------------------

function makeVertexGrid(
    cols: number,
    rows: number,
    w: number,
    h: number,
): Float32Array {
    const cx = cols + 1;
    const ry = rows + 1;
    const pos = new Float32Array(cx * ry * 3);
    const sx = w / cols;
    const sy = h / rows;

    for (let r = 0; r < ry; r++) {
        for (let c = 0; c < cx; c++) {
            const i = (r * cx + c) * 3;
            pos[i] = -w / 2 + c * sx;
            pos[i + 1] = -h / 2 + r * sy;
            pos[i + 2] = 0;
        }
    }

    return pos;
}

// ---------------------------------------------------------------------------
// Wave Z calculator — used in every style's animation loop
// ---------------------------------------------------------------------------

function calcZ(
    x: number,
    y: number,
    time: number,
    freq: number,
    amp: number,
    mx: number,
    my: number,
    mi: number,
): number {
    return (
        Math.sin(x * freq + time * 2 + mx * mi) * amp +
        Math.cos(y * freq + time * 1.5 + my * mi)
    );
}

// ---------------------------------------------------------------------------
// Geometry builders
// ---------------------------------------------------------------------------

// GRID — axis-aligned lines only, no diagonals
function buildGrid(
    cols: number,
    rows: number,
    w: number,
    h: number,
    stops: THREE.Color[],
    lines: 'both' | 'horizontal' | 'vertical',
): { geo: THREE.BufferGeometry; pos: Float32Array } {
    const cx = cols + 1;
    const ry = rows + 1;
    const total = cx * ry;
    const pos = makeVertexGrid(cols, rows, w, h);

    const hSegs = lines !== 'vertical' ? ry * cols : 0;
    const vSegs = lines !== 'horizontal' ? cx * rows : 0;
    const idx = new Uint32Array((hSegs + vSegs) * 2);
    let ptr = 0;

    if (lines !== 'vertical') {
        for (let r = 0; r < ry; r++) {
            for (let c = 0; c < cols; c++) {
                idx[ptr++] = r * cx + c;
                idx[ptr++] = r * cx + c + 1;
            }
        }
    }

    if (lines !== 'horizontal') {
        for (let c = 0; c < cx; c++) {
            for (let r = 0; r < rows; r++) {
                idx[ptr++] = r * cx + c;
                idx[ptr++] = (r + 1) * cx + c;
            }
        }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute(
        'color',
        new THREE.BufferAttribute(makeColorBuffer(total, stops), 3),
    );
    geo.setIndex(new THREE.BufferAttribute(idx, 1));

    return { geo, pos };
}

// DOTS — round circles via ShaderMaterial + gl_PointCoord discard
function buildDots(
    cols: number,
    rows: number,
    w: number,
    h: number,
    stops: THREE.Color[],
): { geo: THREE.BufferGeometry; pos: Float32Array } {
    const total = (cols + 1) * (rows + 1);
    const pos = makeVertexGrid(cols, rows, w, h);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute(
        'color',
        new THREE.BufferAttribute(makeColorBuffer(total, stops), 3),
    );

    return { geo, pos };
}

// Round-dot ShaderMaterial — discards fragments outside the circle
function makeRoundDotMaterial(
    size: number,
    opacity: number,
): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
        uniforms: {
            uSize: { value: size },
            uOpacity: { value: opacity },
        },
        vertexShader: /* glsl */ `
            attribute vec3 color;
            varying   vec3 vColor;
            uniform   float uSize;
            void main() {
                vColor = color;
                vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = uSize;
                gl_Position  = projectionMatrix * mvPos;
            }
        `,
        fragmentShader: /* glsl */ `
            varying vec3  vColor;
            uniform float uOpacity;
            void main() {
                // gl_PointCoord is 0..1 across the point sprite
                vec2  uv   = gl_PointCoord - vec2(0.5);
                float dist = length(uv);
                if (dist > 0.5) discard;          // outside circle → transparent
                // soft anti-alias ring at the edge
                float alpha = 1.0 - smoothstep(0.45, 0.5, dist);
                gl_FragColor = vec4(vColor, alpha * uOpacity);
            }
        `,
        transparent: true,
        depthWrite: false,
    });
}

// DOTS-WAVE — same as dots but size is modulated by Z in the vertex shader
function makeRoundDotWaveMaterial(
    sizeMin: number,
    sizeMax: number,
    amplitude: number,
    opacity: number,
): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
        uniforms: {
            uSizeMin: { value: sizeMin },
            uSizeMax: { value: sizeMax },
            uAmp: { value: amplitude },
            uOpacity: { value: opacity },
        },
        vertexShader: /* glsl */ `
            attribute vec3  color;
            varying   vec3  vColor;
            uniform   float uSizeMin;
            uniform   float uSizeMax;
            uniform   float uAmp;
            void main() {
                vColor = color;
                // Map Z (-amp..+amp) → (sizeMin..sizeMax)
                float t       = clamp((position.z + uAmp) / (2.0 * uAmp), 0.0, 1.0);
                gl_PointSize  = mix(uSizeMin, uSizeMax, t);
                gl_Position   = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: /* glsl */ `
            varying vec3  vColor;
            uniform float uOpacity;
            void main() {
                vec2  uv   = gl_PointCoord - vec2(0.5);
                float dist = length(uv);
                if (dist > 0.5) discard;
                float alpha = 1.0 - smoothstep(0.45, 0.5, dist);
                gl_FragColor = vec4(vColor, alpha * uOpacity);
            }
        `,
        transparent: true,
        depthWrite: false,
    });
}

// CROSSES
function buildCrosses(
    cols: number,
    rows: number,
    w: number,
    h: number,
    stops: THREE.Color[],
    armLen: number,
): { geo: THREE.BufferGeometry; centers: Float32Array; pos: Float32Array } {
    const cx = cols + 1;
    const ry = rows + 1;
    const total = cx * ry;
    const half = armLen / 2;
    const sx = w / cols;
    const sy = h / rows;

    const centers = new Float32Array(total * 3);
    const pos = new Float32Array(total * 4 * 3);
    const col = new Float32Array(total * 4 * 3);

    for (let r = 0; r < ry; r++) {
        for (let c = 0; c < cx; c++) {
            const vi = r * cx + c;
            const bx = -w / 2 + c * sx;
            const by = -h / 2 + r * sy;
            centers[vi * 3] = bx;
            centers[vi * 3 + 1] = by;
            centers[vi * 3 + 2] = 0;
            const b = vi * 12;
            pos[b] = bx - half;
            pos[b + 1] = by;
            pos[b + 2] = 0;
            pos[b + 3] = bx + half;
            pos[b + 4] = by;
            pos[b + 5] = 0;
            pos[b + 6] = bx;
            pos[b + 7] = by - half;
            pos[b + 8] = 0;
            pos[b + 9] = bx;
            pos[b + 10] = by + half;
            pos[b + 11] = 0;
            const clr = lerpPalette(vi / Math.max(total - 1, 1), stops);

            for (let p = 0; p < 4; p++) {
                col[b + p * 3] = clr.r;
                col[b + p * 3 + 1] = clr.g;
                col[b + p * 3 + 2] = clr.b;
            }
        }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    return { geo, centers, pos };
}

// DIAGONAL-LEFT (\\\) or DIAGONAL-RIGHT (///)
function buildDiagonal(
    cols: number,
    rows: number,
    w: number,
    h: number,
    stops: THREE.Color[],
    dir: 'left' | 'right',
): { geo: THREE.BufferGeometry; pos: Float32Array } {
    const cx = cols + 1;
    const ry = rows + 1;
    const pos = makeVertexGrid(cols, rows, w, h);

    // Each diagonal goes from (r,c) → (r+1,c+1) for right, (r,c+1) → (r+1,c) for left
    const idx = new Uint32Array(cols * rows * 2);
    let ptr = 0;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (dir === 'right') {
                idx[ptr++] = r * cx + c;
                idx[ptr++] = (r + 1) * cx + c + 1;
            } else {
                idx[ptr++] = r * cx + c + 1;
                idx[ptr++] = (r + 1) * cx + c;
            }
        }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute(
        'color',
        new THREE.BufferAttribute(makeColorBuffer(cx * ry, stops), 3),
    );
    geo.setIndex(new THREE.BufferAttribute(idx, 1));

    return { geo, pos };
}

// ZIGZAG — alternating row direction creates chevrons
function buildZigzag(
    cols: number,
    rows: number,
    w: number,
    h: number,
    stops: THREE.Color[],
): { geo: THREE.BufferGeometry; pos: Float32Array } {
    const cx = cols + 1;
    const ry = rows + 1;
    const pos = makeVertexGrid(cols, rows, w, h);

    // Per row: connect across the row as a zigzag (top vertices to bottom vertices alternating)
    const segCount = rows * cols * 2; // 2 segments per cell (v-shape)
    const idx = new Uint32Array(segCount * 2);
    let ptr = 0;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const even = r % 2 === 0;

            // Each cell: draw one diagonal and horizontal to form chevron
            if (even) {
                idx[ptr++] = r * cx + c;
                idx[ptr++] = (r + 1) * cx + c + 1;
                idx[ptr++] = r * cx + c + 1;
                idx[ptr++] = (r + 1) * cx + c + 1;
            } else {
                idx[ptr++] = r * cx + c + 1;
                idx[ptr++] = (r + 1) * cx + c;
                idx[ptr++] = r * cx + c;
                idx[ptr++] = (r + 1) * cx + c;
            }
        }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute(
        'color',
        new THREE.BufferAttribute(makeColorBuffer(cx * ry, stops), 3),
    );
    geo.setIndex(new THREE.BufferAttribute(idx, 1));

    return { geo, pos };
}

// HEXAGONS — flat-top hexagonal cells
function buildHexagons(
    cols: number,
    rows: number,
    w: number,
    h: number,
    stops: THREE.Color[],
): { geo: THREE.BufferGeometry; pos: Float32Array; hexCenters: Float32Array } {
    // Each hexagon = 6 line segments = 12 endpoints (no shared verts → clean vertex colors)
    const hexCols = cols;
    const hexRows = rows;
    const hexCount = hexCols * hexRows;
    const hexR = w / hexCols / 2; // circumradius
    const hexH = hexR * Math.sqrt(3); // flat-top hex height

    const pos = new Float32Array(hexCount * 12 * 3); // 6 edges × 2 pts × 3 floats
    const col = new Float32Array(hexCount * 12 * 3);
    const centers = new Float32Array(hexCount * 3);

    let hi = 0; // hex index

    for (let row = 0; row < hexRows; row++) {
        for (let col2 = 0; col2 < hexCols; col2++) {
            const offset = col2 % 2 === 0 ? 0 : hexH * 0.5;
            const cx2 = -w / 2 + hexR + col2 * hexR * 1.5;
            const cy2 = -h / 2 + hexH * 0.5 + row * hexH + offset;

            centers[hi * 3] = cx2;
            centers[hi * 3 + 1] = cy2;
            centers[hi * 3 + 2] = 0;

            const t = hi / Math.max(hexCount - 1, 1);
            const clr = lerpPalette(t, stops);

            // 6 vertices of flat-top hexagon
            const verts: [number, number][] = [];

            for (let k = 0; k < 6; k++) {
                const angle = (Math.PI / 3) * k; // 0°,60°,120°…
                verts.push([
                    cx2 + hexR * Math.cos(angle),
                    cy2 + hexR * Math.sin(angle),
                ]);
            }

            // 6 edges — each as a line segment pair
            for (let k = 0; k < 6; k++) {
                const a = verts[k];
                const b = verts[(k + 1) % 6];
                const base = (hi * 6 + k) * 6; // 2 pts × 3 floats per edge
                pos[base] = a[0];
                pos[base + 1] = a[1];
                pos[base + 2] = 0;
                pos[base + 3] = b[0];
                pos[base + 4] = b[1];
                pos[base + 5] = 0;

                for (let p = 0; p < 2; p++) {
                    col[base + p * 3] = clr.r;
                    col[base + p * 3 + 1] = clr.g;
                    col[base + p * 3 + 2] = clr.b;
                }
            }

            hi++;
        }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
        'position',
        new THREE.BufferAttribute(pos.slice(0, hi * 6 * 6), 3),
    );
    geo.setAttribute(
        'color',
        new THREE.BufferAttribute(col.slice(0, hi * 6 * 6), 3),
    );

    return { geo, pos, hexCenters: centers.slice(0, hi * 3) };
}

// DASHES — like grid but with a gap in the middle of each segment
function buildDashes(
    cols: number,
    rows: number,
    w: number,
    h: number,
    stops: THREE.Color[],
    lines: 'both' | 'horizontal' | 'vertical',
    dashRatio: number,
): { geo: THREE.BufferGeometry; pos: Float32Array; basePos: Float32Array } {
    const cx = cols + 1;
    const ry = rows + 1;
    const sx = w / cols;
    const sy = h / rows;
    const half = dashRatio / 2;

    // Each dash = 2 endpoints, no shared verts
    const hCount = lines !== 'vertical' ? ry * cols : 0;
    const vCount = lines !== 'horizontal' ? cx * rows : 0;
    const total = (hCount + vCount) * 2;

    const pos = new Float32Array(total * 3);
    const basePos = new Float32Array(total * 3); // stored XY, updated Z each frame
    const col = new Float32Array(total * 3);

    let p = 0;
    const allVtx = makeVertexGrid(cols, rows, w, h);
    const colorGrid = makeColorBuffer(cx * ry, stops);

    const push = (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        ci: number,
    ) => {
        const clr = ci / Math.max(cx * ry - 1, 1);
        const c = lerpPalette(clr, stops);

        for (let k = 0; k < 2; k++) {
            const [px2, py] = k === 0 ? [x1, y1] : [x2, y2];
            pos[p * 3] = px2;
            pos[p * 3 + 1] = py;
            pos[p * 3 + 2] = 0;
            basePos[p * 3] = px2;
            basePos[p * 3 + 1] = py;
            basePos[p * 3 + 2] = 0;
            col[p * 3] = c.r;
            col[p * 3 + 1] = c.g;
            col[p * 3 + 2] = c.b;
            p++;
        }
    };

    if (lines !== 'vertical') {
        for (let r = 0; r < ry; r++) {
            for (let c2 = 0; c2 < cols; c2++) {
                const x1 = -w / 2 + c2 * sx;
                const x2 = x1 + sx;
                const y = -h / 2 + r * sy;
                push(x1 + sx * half, y, x2 - sx * half, y, r * cx + c2);
            }
        }
    }

    if (lines !== 'horizontal') {
        for (let c2 = 0; c2 < cx; c2++) {
            for (let r = 0; r < rows; r++) {
                const y1 = -h / 2 + r * sy;
                const y2 = y1 + sy;
                const x = -w / 2 + c2 * sx;
                push(x, y1 + sy * half, x, y2 - sy * half, r * cx + c2);
            }
        }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    return { geo, pos, basePos };
}

// CONTOUR — draws horizontal lines only at fixed Z thresholds (resampled each frame)
// We build a flat placeholder geo; indices are rebuilt each frame as Z changes.
// For performance we use a fixed vertex pool and swap positions.
function buildContourPlaceholder(
    cols: number,
    rows: number,
    w: number,
    h: number,
    stops: THREE.Color[],
    levels: number,
): { geo: THREE.BufferGeometry; vtxGrid: Float32Array } {
    // Max line segments = rows * cols * 4 (at most 4 crossing per cell edge), generous upper bound
    const maxSegs = cols * rows * 4 * 2;
    const pos = new Float32Array(maxSegs * 3);
    const col = new Float32Array(maxSegs * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
        'position',
        new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage),
    );
    geo.setAttribute(
        'color',
        new THREE.BufferAttribute(col, 3).setUsage(THREE.DynamicDrawUsage),
    );
    geo.setDrawRange(0, 0);
    const vtxGrid = makeVertexGrid(cols, rows, w, h);

    return { geo, vtxGrid };
}

// SOLID — PlaneGeometry + MeshPhongMaterial with lighting
function buildSolid(
    cols: number,
    rows: number,
    w: number,
    h: number,
    stops: THREE.Color[],
): { geo: THREE.PlaneGeometry; pos: Float32Array } {
    const geo = new THREE.PlaneGeometry(w, h, cols, rows);
    const count = geo.attributes.position.count;
    geo.setAttribute(
        'color',
        new THREE.BufferAttribute(makeColorBuffer(count, stops), 3),
    );
    const pos = geo.attributes.position.array as Float32Array;

    return { geo, pos };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const WavesThree = ({
    className,
    style = 'grid',
    lines = 'both',
    colors,
    cameraPosition = { x: 0, y: 0, z: 10 },
    planeWidth = 80,
    planeHeight = 40,
    segmentsX = 60,
    segmentsY = 30,
    speed = 1,
    amplitude = 1.5,
    frequency = 0.3,
    opacity = 0.6,
    paused = false,
    mouseInfluence = 2,
    mouseRotation = 0.1,
    dotSize = 3,
    dotSizeMin = 1,
    crossSize = 0.3,
    dashRatio = 0.5,
    contourLevels = 6,
    maxPixelRatio = 2,
    onReady,
}: WavesThreeProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    // Hot-update refs — no scene restart needed for these
    const mouseRef = useRef({ x: 0, y: 0 });
    const speedRef = useRef(speed);
    const pausedRef = useRef(paused);
    const amplitudeRef = useRef(amplitude);
    const frequencyRef = useRef(frequency);
    const mouseInfluenceRef = useRef(mouseInfluence);
    const mouseRotationRef = useRef(mouseRotation);
    const opacityRef = useRef(opacity);

    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);
    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);
    useEffect(() => {
        amplitudeRef.current = amplitude;
    }, [amplitude]);
    useEffect(() => {
        frequencyRef.current = frequency;
    }, [frequency]);
    useEffect(() => {
        mouseInfluenceRef.current = mouseInfluence;
    }, [mouseInfluence]);
    useEffect(() => {
        mouseRotationRef.current = mouseRotation;
    }, [mouseRotation]);
    useEffect(() => {
        opacityRef.current = opacity;
    }, [opacity]);

    // Container size
    useEffect(() => {
        const el = containerRef.current;

        if (!el) {
            return;
        }

        const ro = new ResizeObserver((entries) => {
            const r = entries[0].contentRect;
            setSize({ width: r.width, height: r.height });
        });
        ro.observe(el);

        return () => ro.disconnect();
    }, []);

    // Main scene
    useEffect(() => {
        const el = containerRef.current;

        if (!el || size.width === 0 || size.height === 0) {
            return;
        }

        // Scene & Camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            size.width / size.height,
            0.1,
            1000,
        );
        camera.position.set(
            cameraPosition.x,
            cameraPosition.y,
            cameraPosition.z,
        );
        camera.lookAt(0, 0, 0);

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, maxPixelRatio),
        );
        renderer.setSize(size.width, size.height);
        renderer.setClearColor(0x000000, 0);
        el.appendChild(renderer.domElement);

        // Colors
        const isDark = document.documentElement.classList.contains('dark');
        const rawColors = colors ?? (isDark ? DEFAULT_DARK : DEFAULT_LIGHT);
        const colorStops = rawColors.map((c) => new THREE.Color(c));

        // Per-style setup
        let object3d: THREE.Object3D;
        let geo: THREE.BufferGeometry;
        let mat: THREE.Material;
        let posBuf: Float32Array | null = null;
        let baseBuf: Float32Array | null = null; // for dashes: stores XY reference
        let posAttr: THREE.BufferAttribute | null = null;
        let crossCenters: Float32Array | null = null;
        let hexCentersBuf: Float32Array | null = null;
        let hexPosBuf: Float32Array | null = null;
        let contourVtxGrid: Float32Array | null = null;
        const extraDispose: THREE.Material[] = [];
        let lights: THREE.Light[] = [];

        const cols = segmentsX;
        const rows = segmentsY;

        if (style === 'wireframe') {
            const g = new THREE.PlaneGeometry(
                planeWidth,
                planeHeight,
                cols,
                rows,
            );
            g.setAttribute(
                'color',
                new THREE.BufferAttribute(
                    makeColorBuffer(g.attributes.position.count, colorStops),
                    3,
                ),
            );
            const m = new THREE.MeshBasicMaterial({
                vertexColors: true,
                wireframe: true,
                transparent: true,
                opacity: opacityRef.current,
            });
            object3d = new THREE.Mesh(g, m);
            posAttr = g.attributes.position as THREE.BufferAttribute;
            posBuf = posAttr.array as Float32Array;
            geo = g;
            mat = m;
        } else if (style === 'grid') {
            const { geo: g, pos } = buildGrid(
                cols,
                rows,
                planeWidth,
                planeHeight,
                colorStops,
                lines,
            );
            const m = new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: opacityRef.current,
            });
            object3d = new THREE.LineSegments(g, m);
            posAttr = g.attributes.position as THREE.BufferAttribute;
            posBuf = pos;
            geo = g;
            mat = m;
        } else if (style === 'dots') {
            const { geo: g, pos } = buildDots(
                cols,
                rows,
                planeWidth,
                planeHeight,
                colorStops,
            );
            const m = makeRoundDotMaterial(dotSize * 2, opacityRef.current);
            object3d = new THREE.Points(g, m);
            posAttr = g.attributes.position as THREE.BufferAttribute;
            posBuf = pos;
            geo = g;
            mat = m;
        } else if (style === 'dots-wave') {
            const { geo: g, pos } = buildDots(
                cols,
                rows,
                planeWidth,
                planeHeight,
                colorStops,
            );
            const m = makeRoundDotWaveMaterial(
                dotSizeMin * 2,
                dotSize * 2,
                amplitude,
                opacityRef.current,
            );
            object3d = new THREE.Points(g, m);
            posAttr = g.attributes.position as THREE.BufferAttribute;
            posBuf = pos;
            geo = g;
            mat = m;
        } else if (style === 'crosses') {
            const {
                geo: g,
                centers,
                pos,
            } = buildCrosses(
                cols,
                rows,
                planeWidth,
                planeHeight,
                colorStops,
                crossSize,
            );
            const m = new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: opacityRef.current,
            });
            object3d = new THREE.LineSegments(g, m);
            posAttr = g.attributes.position as THREE.BufferAttribute;
            posBuf = pos;
            crossCenters = centers;
            geo = g;
            mat = m;
        } else if (style === 'diagonal-left' || style === 'diagonal-right') {
            const dir = style === 'diagonal-left' ? 'left' : 'right';
            const { geo: g, pos } = buildDiagonal(
                cols,
                rows,
                planeWidth,
                planeHeight,
                colorStops,
                dir,
            );
            const m = new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: opacityRef.current,
            });
            object3d = new THREE.LineSegments(g, m);
            posAttr = g.attributes.position as THREE.BufferAttribute;
            posBuf = pos;
            geo = g;
            mat = m;
        } else if (style === 'zigzag') {
            const { geo: g, pos } = buildZigzag(
                cols,
                rows,
                planeWidth,
                planeHeight,
                colorStops,
            );
            const m = new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: opacityRef.current,
            });
            object3d = new THREE.LineSegments(g, m);
            posAttr = g.attributes.position as THREE.BufferAttribute;
            posBuf = pos;
            geo = g;
            mat = m;
        } else if (style === 'hexagons') {
            const {
                geo: g,
                pos,
                hexCenters,
            } = buildHexagons(cols, rows, planeWidth, planeHeight, colorStops);
            const m = new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: opacityRef.current,
            });
            object3d = new THREE.LineSegments(g, m);
            posAttr = g.attributes.position as THREE.BufferAttribute;
            hexPosBuf = pos;
            hexCentersBuf = hexCenters;
            geo = g;
            mat = m;
        } else if (style === 'dashes') {
            const {
                geo: g,
                pos,
                basePos,
            } = buildDashes(
                cols,
                rows,
                planeWidth,
                planeHeight,
                colorStops,
                lines,
                dashRatio,
            );
            const m = new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: opacityRef.current,
            });
            object3d = new THREE.LineSegments(g, m);
            posAttr = g.attributes.position as THREE.BufferAttribute;
            posBuf = pos;
            baseBuf = basePos;
            geo = g;
            mat = m;
        } else if (style === 'contour') {
            const { geo: g, vtxGrid } = buildContourPlaceholder(
                cols,
                rows,
                planeWidth,
                planeHeight,
                colorStops,
                contourLevels,
            );
            const m = new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: opacityRef.current,
            });
            object3d = new THREE.LineSegments(g, m);
            posAttr = g.attributes.position as THREE.BufferAttribute;
            contourVtxGrid = vtxGrid;
            geo = g;
            mat = m;
        } else {
            // solid
            const { geo: g, pos } = buildSolid(
                cols,
                rows,
                planeWidth,
                planeHeight,
                colorStops,
            );
            const m = new THREE.MeshPhongMaterial({
                vertexColors: true,
                transparent: true,
                opacity: opacityRef.current,
                side: THREE.DoubleSide,
                shininess: 60,
            });
            const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
            keyLight.position.set(5, 10, 7);
            const fillLight = new THREE.AmbientLight(0xffffff, 0.4);
            scene.add(keyLight, fillLight);
            lights = [keyLight, fillLight];
            object3d = new THREE.Mesh(g, m);
            posAttr = g.attributes.position as THREE.BufferAttribute;
            posBuf = pos;
            geo = g;
            mat = m;
        }

        scene.add(object3d);

        // Event listeners
        const handleResize = () => {
            camera.aspect = el.clientWidth / el.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(el.clientWidth, el.clientHeight);
        };
        const handleMouse = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouse);

        // Contour iso-line builder (marching squares, edge-interpolated)
        const rebuildContour = (
            vtxGrid: Float32Array,
            zGrid: Float32Array,
            thresholds: number[],
            posAttrC: THREE.BufferAttribute,
            colAttrC: THREE.BufferAttribute,
        ) => {
            const cx2 = cols + 1;
            let ptr = 0;
            const posArr = posAttrC.array as Float32Array;
            const colArr = colAttrC.array as Float32Array;

            for (const thresh of thresholds) {
                const t = (thresh - (-amplitude - 1)) / ((amplitude + 1) * 2);
                const clr = lerpPalette(t, colorStops);

                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const i00 = r * cx2 + c;
                        const i10 = r * cx2 + c + 1;
                        const i01 = (r + 1) * cx2 + c;
                        const i11 = (r + 1) * cx2 + c + 1;

                        const z00 = zGrid[i00];
                        const z10 = zGrid[i10];
                        const z01 = zGrid[i01];
                        const z11 = zGrid[i11];

                        const x00 = vtxGrid[i00 * 3];
                        const y00 = vtxGrid[i00 * 3 + 1];
                        const x10 = vtxGrid[i10 * 3];
                        const y10 = vtxGrid[i10 * 3 + 1];
                        const x01 = vtxGrid[i01 * 3];
                        const y01 = vtxGrid[i01 * 3 + 1];
                        const x11 = vtxGrid[i11 * 3];
                        const y11 = vtxGrid[i11 * 3 + 1];

                        // Collect edge crossing points
                        const pts: [number, number, number][] = [];

                        const cross = (
                            zA: number,
                            zB: number,
                            xA: number,
                            yA: number,
                            zA2: number,
                            xB: number,
                            yB: number,
                            zB2: number,
                        ) => {
                            if (zA < thresh !== zB < thresh) {
                                const t2 = (thresh - zA) / (zB - zA);
                                pts.push([
                                    xA + (xB - xA) * t2,
                                    yA + (yB - yA) * t2,
                                    thresh,
                                ]);
                            }
                        };
                        cross(z00, z10, x00, y00, z00, x10, y10, z10); // bottom edge
                        cross(z10, z11, x10, y10, z10, x11, y11, z11); // right edge
                        cross(z01, z11, x01, y01, z01, x11, y11, z11); // top edge
                        cross(z00, z01, x00, y00, z00, x01, y01, z01); // left edge

                        if (pts.length >= 2 && ptr + 6 <= posArr.length) {
                            for (let k = 0; k < 2; k++) {
                                posArr[ptr] = pts[k][0];
                                posArr[ptr + 1] = pts[k][1];
                                posArr[ptr + 2] = pts[k][2];
                                colArr[ptr] = clr.r;
                                colArr[ptr + 1] = clr.g;
                                colArr[ptr + 2] = clr.b;
                                ptr += 3;
                            }
                        }
                    }
                }
            }

            posAttrC.needsUpdate = true;
            colAttrC.needsUpdate = true;
            (object3d as THREE.LineSegments).geometry.setDrawRange(0, ptr / 3);
        };

        // Z grid for contour (shared scratch)
        const zGrid =
            style === 'contour'
                ? new Float32Array((cols + 1) * (rows + 1))
                : null;

        // Animation loop
        let rafId: number;

        const animate = () => {
            rafId = requestAnimationFrame(animate);

            // Sync opacity to all material types
            if ((mat as any).opacity !== undefined) {
                (mat as any).opacity = opacityRef.current;
            }

            if ((mat as any).uniforms?.uOpacity) {
                (mat as any).uniforms.uOpacity.value = opacityRef.current;
            }

            if (!pausedRef.current) {
                const time = performance.now() * 0.001 * speedRef.current;
                const freq = frequencyRef.current;
                const amp = amplitudeRef.current;
                const mi = mouseInfluenceRef.current;
                const mx = mouseRef.current.x;
                const my = mouseRef.current.y;

                if (style === 'crosses' && crossCenters && posAttr && posBuf) {
                    const vtxCount = (cols + 1) * (rows + 1);

                    for (let vi = 0; vi < vtxCount; vi++) {
                        const bx = crossCenters[vi * 3];
                        const by = crossCenters[vi * 3 + 1];
                        const z = calcZ(bx, by, time, freq, amp, mx, my, mi);
                        const b = vi * 12;
                        posBuf[b + 2] = z;
                        posBuf[b + 5] = z;
                        posBuf[b + 8] = z;
                        posBuf[b + 11] = z;
                    }

                    posAttr.needsUpdate = true;
                } else if (
                    style === 'hexagons' &&
                    hexCentersBuf &&
                    hexPosBuf &&
                    posAttr
                ) {
                    const hexCount = hexCentersBuf.length / 3;

                    for (let hi = 0; hi < hexCount; hi++) {
                        const bx = hexCentersBuf[hi * 3];
                        const by = hexCentersBuf[hi * 3 + 1];
                        const z = calcZ(bx, by, time, freq, amp, mx, my, mi);
                        // 6 edges × 2 pts = 12 endpoints per hex
                        const base = hi * 6 * 6; // 6edges × 6floats

                        for (let k = 0; k < 12; k++) {
                            hexPosBuf[base + k * 3 + 2] = z;
                        }
                    }

                    // Sync the slice used in geo
                    const posA = geo.attributes
                        .position as THREE.BufferAttribute;
                    const arr = posA.array as Float32Array;
                    arr.set(hexPosBuf.slice(0, arr.length));
                    posA.needsUpdate = true;
                } else if (style === 'dashes' && posBuf && baseBuf && posAttr) {
                    const total = posBuf.length / 3;

                    for (let i = 0; i < total; i++) {
                        const x = baseBuf[i * 3];
                        const y = baseBuf[i * 3 + 1];
                        posBuf[i * 3 + 2] = calcZ(
                            x,
                            y,
                            time,
                            freq,
                            amp,
                            mx,
                            my,
                            mi,
                        );
                    }

                    posAttr.needsUpdate = true;
                } else if (
                    style === 'contour' &&
                    contourVtxGrid &&
                    zGrid &&
                    posAttr
                ) {
                    const vtxCount = (cols + 1) * (rows + 1);

                    for (let i = 0; i < vtxCount; i++) {
                        const x = contourVtxGrid[i * 3];
                        const y = contourVtxGrid[i * 3 + 1];
                        zGrid[i] = calcZ(x, y, time, freq, amp, mx, my, mi);
                    }

                    const thresholds: number[] = [];

                    for (let l = 0; l < contourLevels; l++) {
                        thresholds.push(
                            -amp -
                                1 +
                                (l / (contourLevels - 1)) * (amp + 1) * 2,
                        );
                    }

                    rebuildContour(
                        contourVtxGrid,
                        zGrid,
                        thresholds,
                        geo.attributes.position as THREE.BufferAttribute,
                        geo.attributes.color as THREE.BufferAttribute,
                    );
                } else if (posBuf && posAttr) {
                    // All other styles: simple per-vertex Z update
                    const total = posBuf.length / 3;

                    for (let i = 0; i < total; i++) {
                        const x = posBuf[i * 3];
                        const y = posBuf[i * 3 + 1];
                        posBuf[i * 3 + 2] = calcZ(
                            x,
                            y,
                            time,
                            freq,
                            amp,
                            mx,
                            my,
                            mi,
                        );
                    }

                    posAttr.needsUpdate = true;

                    // Solid needs normals recomputed for correct lighting
                    if (style === 'solid') {
                        (geo as THREE.PlaneGeometry).computeVertexNormals();
                    }
                }

                object3d.rotation.x = my * mouseRotationRef.current;
                object3d.rotation.y = mx * mouseRotationRef.current;
            }

            renderer.render(scene, camera);
        };

        animate();
        onReady?.();

        // Cleanup
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouse);
            lights.forEach((l) => scene.remove(l));
            scene.remove(object3d);
            geo.dispose();
            mat.dispose();
            extraDispose.forEach((m2) => m2.dispose());
            renderer.dispose();

            if (el.contains(renderer.domElement)) {
                el.removeChild(renderer.domElement);
            }
        };
    }, [
        size.width,
        size.height,
        style,
        colors,
        lines,
        cameraPosition,
        planeWidth,
        planeHeight,
        segmentsX,
        segmentsY,
        dotSize,
        dotSizeMin,
        crossSize,
        dashRatio,
        contourLevels,
        maxPixelRatio,
        onReady,
    ]);

    return (
        <div
            ref={containerRef}
            className={cn(`pointer-events-none absolute inset-0`, className)}
            aria-hidden="true"
        />
    );
};

export default WavesThree;
