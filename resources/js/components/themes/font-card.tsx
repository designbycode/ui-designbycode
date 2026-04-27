import type { CSSProperties } from 'react';
import type { RegistryProps } from '@/types';

export default function FontCard({ font }: { font: RegistryProps }) {
    return (
        <div
            style={
                {
                    cornerShape: 'scoop',
                    fontFamily: font.font?.family,
                } as CSSProperties
            }
            className={`group relative isolate overflow-hidden rounded-xl border border-border bg-linear-to-b from-muted to-background p-4 px-18 text-[clamp(2rem,3vh,4rem)] text-nowrap shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] shadow-lg transition-all duration-100 hover:font-bold`}
        >
            <span
                aria-hidden={true}
                style={
                    {
                        cornerShape: 'scoop',
                    } as CSSProperties
                }
                className="absolute inset-1 rounded-[inherit] border border-dashed border-border mix-blend-multiply group-hover:bg-accent/50"
            ></span>
            <span
                aria-hidden={true}
                className="absolute inset-y-2 left-12 w-px border-x border-dashed border-r-white/50 border-l-black/50 mix-blend-overlay shadow-sm shadow-black/40"
            ></span>
            <span
                aria-hidden={true}
                className="absolute inset-y-2 right-12 w-px border-x border-dashed border-r-white/50 border-l-black/50 mix-blend-overlay shadow-sm shadow-black/40"
            ></span>
            <div className="relative z-10">{font.title}</div>
        </div>
    );
}

FontCard.displayName = 'FontCard';
