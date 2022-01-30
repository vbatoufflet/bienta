export function touchOnly(): boolean {
    return window.matchMedia("(hover: none)").matches;
}
