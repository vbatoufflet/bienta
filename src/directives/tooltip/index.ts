import {deepEqual} from "fast-equals";
import {DirectiveBinding, createVNode, render} from "vue";

import {NamedDirective} from "~types/vue";

import tooltip from "./tooltip.vue";

// eslint-disable-next-line @typescript-eslint/naming-convention
export type ElementWithTooltip = HTMLElement & {
    _binding: DirectiveBinding;
    _handler(ev: MouseEvent | TouchEvent): void;
};

export interface TooltipEvent {
    data?: TooltipData;
    relatedElement: HTMLElement | null;
}

export interface TooltipData {
    domRect: DOMRect;
    anchor?: TooltipAnchor;
    content?: string;
    nowrap?: boolean;
    shortcut?: string;
}

export type TooltipAnchor = "bottom" | "top";

const directive: NamedDirective = {
    name: "tooltip",
    beforeMount,
    beforeUpdate,
    beforeUnmount,
};

export default directive;

const elements: Set<ElementWithTooltip> = new Set();
let tooltipTimeout: number | undefined;
let wrapper: HTMLElement | undefined;

function beforeMount(el: ElementWithTooltip, binding: DirectiveBinding): void {
    el._binding = binding;
    el._handler = handle.bind(el);

    if (!wrapper) {
        ensureTooltipMount(binding, true);
        if (binding.instance) {
            binding.instance.$bienta.state.tooltip.mount = true;
        }
    }

    el.addEventListener("pointerenter", el._handler);
    el.addEventListener("pointerleave", el._handler);
    el.addEventListener("pointerup", el._handler);

    elements.add(el);
}

function beforeUpdate(el: ElementWithTooltip, binding: DirectiveBinding): void {
    if (binding.oldValue && !deepEqual(binding.oldValue, binding.value)) {
        el._binding = binding;
    }
}

function beforeUnmount(el: ElementWithTooltip, binding: DirectiveBinding): void {
    delete (el as any)._binding; // eslint-disable-line @typescript-eslint/no-explicit-any

    document.dispatchEvent(
        new CustomEvent<TooltipEvent>("tooltip-unmount", {
            detail: {relatedElement: el},
        }),
    );

    el.removeEventListener("pointerenter", el._handler);
    el.removeEventListener("pointerleave", el._handler);
    el.removeEventListener("pointerup", el._handler);

    elements.delete(el);

    if (wrapper && elements.size === 0) {
        ensureTooltipMount(binding, false);
        if (binding.instance) {
            binding.instance.$bienta.state.tooltip.mount = false;
        }
    }
}

export function ensureTooltipMount(binding: DirectiveBinding, state: boolean): void {
    if (!binding.instance) {
        throw new Error("cannot get instance");
    }

    if (state && !wrapper) {
        wrapper = document.body.appendChild(document.createElement("div"));
        wrapper.classList.add("b-wrapper");

        const vnode = createVNode(tooltip);
        vnode.appContext = binding.instance?.$.appContext ?? null;
        render(vnode, wrapper);
    } else if (!state && wrapper) {
        render(null, wrapper);
        wrapper.remove();
        wrapper = undefined;
    }
}

export function handle(this: ElementWithTooltip, ev: PointerEvent): void {
    if (!this._binding) {
        return;
    }

    if (tooltipTimeout !== undefined) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = undefined;
    }

    if (ev.type.startsWith("touch")) {
        ev.preventDefault();
    }

    if (
        ev.type === "pointerleave" ||
        ev.type === "pointerup" ||
        this.classList.contains("active") ||
        this.classList.contains("in-dropdown")
    ) {
        document.dispatchEvent(
            new CustomEvent<TooltipEvent>("tooltip-hide", {
                detail: {relatedElement: ev.target as HTMLElement | null},
            }),
        );
        return;
    }

    tooltipTimeout = window.setTimeout(() => {
        const relatedElement = ev.target as HTMLElement | null;

        let anchorModifier = Object.keys(this._binding.modifiers).slice(-1)?.[0];
        if (ev.pointerType === "touch") {
            anchorModifier = "top";
        }

        document.dispatchEvent(
            new CustomEvent<TooltipEvent>("tooltip-show", {
                detail: {
                    relatedElement,
                    data: {
                        domRect: this.getBoundingClientRect(),
                        anchor: isAnchor(anchorModifier) ? anchorModifier : undefined,
                        content: this._binding.value,
                        nowrap: this._binding.modifiers.nowrap,
                        shortcut: relatedElement?.dataset.shortcut,
                    },
                },
            }),
        );
    }, 400);
}

function isAnchor(value: unknown): value is TooltipAnchor {
    return typeof value === "string" ? ["bottom", "top"].includes(value.toLowerCase()) : false;
}
