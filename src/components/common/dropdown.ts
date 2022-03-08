import {Ref} from "vue";

export function onDropdownKeydown(
    ev: KeyboardEvent,
    active: Ref<number>,
    select: (index: number) => void,
    count: number,
): void {
    switch (ev.code) {
        case "ArrowDown":
            ev.preventDefault();
            if (active.value < count - 1) {
                active.value++;
            }
            break;
        case "ArrowUp":
            ev.preventDefault();
            if (active.value > 0) {
                active.value--;
            }
            break;
        case "Enter":
            if (active.value >= 0) {
                select(active.value);
            }
            break;
    }
}

export function onDropdownMouse(
    ev: MouseEvent,
    active: Ref<number>,
    select: (index: number) => void,
): void {
    const item = (ev.target as Element | null)?.closest<HTMLElement>("[role=option]") ?? null;
    if (!item) {
        return;
    }

    switch (ev.type) {
        case "click":
            if (item.dataset.item) {
                select(Number.parseInt(item.dataset.item, 10));
            }
            ev.stopPropagation();
            break;
        case "pointerover":
            if (item.dataset.item) {
                active.value = Number.parseInt(item.dataset.item, 10);
            }
            break;
    }
}
