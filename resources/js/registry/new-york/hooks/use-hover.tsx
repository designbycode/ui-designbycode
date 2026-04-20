import { useCallback, useState } from 'react';

export function useHover() {
    const [isHovered, setIsHovered] = useState(false);

    const hoverRef = useCallback((node: HTMLElement | null) => {
        if (!node) {
            return;
        }

        node.onmouseenter = () => setIsHovered(true);
        node.onmouseleave = () => setIsHovered(false);
    }, []);

    return { isHovered, hoverRef };
}
