export function clamp(value, min = 0, max = 100) {
    return Math.min(max, Math.max(min, value));
}
export function per100Kcal(value, kcal) {
    if (kcal <= 0)
        return 0;
    return (value / kcal) * 100;
}
