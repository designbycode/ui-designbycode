'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface MouseGlowContext {
    position: { x: number; y: number };
    radius: number;
}
export const GlowContext = createContext<MouseGlowContext>({
    position: { x: -9999, y: -9999 },
    radius: 100,
});
export const useGlowStack = (): MouseGlowContext => {
    const context = useContext(GlowContext);

    return context ?? { position: { x: -9999, y: -9999 }, radius: 100 };
};

interface GlowStackProps {
    children: ReactNode;
    radius?: number;
    className?: string;
}

export function GlowStack({
    children,
    radius = 100,
    className,
}: GlowStackProps) {
    const [pos, setPos] = useState({ x: -9999, y: -9999 });
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() =>
                setPos({ x: e.clientX, y: e.clientY }),
            );
        };

        window.addEventListener('mousemove', onMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <GlowContext.Provider value={{ position: pos, radius }}>
            <div className={className}>{children}</div>
        </GlowContext.Provider>
    );
}
