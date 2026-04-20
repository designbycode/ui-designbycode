import { useCallback, useEffect, useRef, useState } from 'react';

export interface ToleranceConfig {
    up: number;
    down: number;
}

export interface UseHeadroomOptions {
    enabled?: boolean;
    offset?: number;
    tolerance?: number | ToleranceConfig;
    scroller?: Element | null;
}

/**
 * useHeadroom - A React hook that replicates headroom.js behavior.
 *
 * Returns an object with CSS class flags based on scroll direction and position,
 * plus a ref to attach to your header element (for scroll offset calculation).
 *
 * @param {Object} options
 * @param {boolean} [options.enabled=true]    - Enable/disable the headroom behavior. When false, header is always pinned.
 * @param {number} [options.offset=0]        - Scroll distance (px) before the hook activates.
 * @param {number} [options.tolerance=0]     - Scroll delta (px) required to trigger a state change.
 *                                             Can also be { up: number, down: number }.
 * @param {Element|null} [options.scroller]  - Scrollable element to listen on (default: window).
 *
 * @returns {{
 *   ref: React.RefObject,   - Attach this to your header element.
 *   pinned: boolean,        - true when header should be visible (scroll up or at top).
 *   unpinned: boolean,      - true when header should be hidden (scroll down).
 *   top: boolean,          - true when at the very top (within offset).
 *   notTop: boolean,       - true when scrolled past offset.
 *   bottom: boolean,       - true when at the bottom of the page/scroller.
 *   notBottom: boolean,    - true when not at the bottom.
 * }}
 *
 */
function useHeadroom({
    enabled = true,
    offset = 0,
    tolerance = 0,
    scroller = null,
}: UseHeadroomOptions = {}) {
    const ref = useRef(null);

    const getInitialState = useCallback(
        () => ({
            pinned: true,
            unpinned: false,
            top: true,
            notTop: false,
            bottom: false,
            notBottom: true,
        }),
        [],
    );

    const [state, setState] = useState(getInitialState);

    // Normalize tolerance into { up, down }
    const getTolerance = useCallback((): ToleranceConfig => {
        if (typeof tolerance === 'number') {
            return { up: tolerance, down: tolerance };
        }

        return tolerance;
    }, [tolerance]);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const scrollEl = scroller ?? window;

        const getScrollY = () =>
            scrollEl instanceof Element
                ? scrollEl.scrollTop
                : (window.scrollY ?? window.pageYOffset);

        const getScrollHeight = () =>
            scrollEl instanceof Element
                ? scrollEl.scrollHeight
                : document.documentElement.scrollHeight;

        const getClientHeight = () =>
            scrollEl instanceof Element
                ? scrollEl.clientHeight
                : window.innerHeight;

        let lastScrollY = getScrollY();
        let ticking = false;

        const update = () => {
            const currentScrollY = getScrollY();
            const scrollHeight = getScrollHeight();
            const clientHeight = getClientHeight();
            const tolerances = getTolerance();

            const isTop = currentScrollY <= offset;
            const isBottom = currentScrollY + clientHeight >= scrollHeight - 1;
            const delta = currentScrollY - lastScrollY;
            const scrollingDown = delta > 0;
            const scrollingUp = delta < 0;

            // Determine pin/unpin only when tolerance is exceeded
            setState((prev) => {
                let pinned = prev.pinned;

                if (isTop) {
                    // Always pin at the top
                    pinned = true;
                } else if (
                    scrollingDown &&
                    Math.abs(delta) >= tolerances.down
                ) {
                    pinned = false;
                } else if (scrollingUp && Math.abs(delta) >= tolerances.up) {
                    pinned = true;
                }

                return {
                    pinned,
                    unpinned: !pinned,
                    top: isTop,
                    notTop: !isTop,
                    bottom: isBottom,
                    notBottom: !isBottom,
                };
            });

            lastScrollY = currentScrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        };

        scrollEl.addEventListener('scroll', onScroll, { passive: true });

        // Run once on mount to set initial state
        update();

        return () => {
            scrollEl.removeEventListener('scroll', onScroll);
        };
    }, [enabled, offset, getTolerance, scroller]);

    return { ref, ...state };
}

export default useHeadroom;
