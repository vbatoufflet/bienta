export function updateDOMDataset(
    el: HTMLElement,
    key: string,
    from: string | null,
    to: string | null,
): void {
    const parts = new Set(el.dataset[key]?.split(" "));
    if (from) {
        parts.delete(from);
    }
    if (to) {
        parts.add(to);
    }

    if (parts.size === 0) {
        delete el.dataset[key];
    } else {
        el.dataset[key] = [...parts].join(" ");
    }
}
