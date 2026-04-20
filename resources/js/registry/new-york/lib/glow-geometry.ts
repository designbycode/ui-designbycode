export interface Point {
    x: number;
    y: number;
}
export interface Rect {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export const isCircleOverlappingRect = (p: Point, r: number, rect: Rect) =>
    p.x + r >= rect.left &&
    p.x - r <= rect.right &&
    p.y + r >= rect.top &&
    p.y - r <= rect.bottom;

export const isPointInRect = (p: Point, rect: Rect) =>
    p.x >= rect.left &&
    p.x <= rect.right &&
    p.y >= rect.top &&
    p.y <= rect.bottom;

export const toElementSpace = (p: Point, rect: Rect): Point => ({
    x: p.x - rect.left,
    y: p.y - rect.top,
});
