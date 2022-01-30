import {App, Component, ExtractPropTypes, createVNode, render, withCtx} from "vue";

import bModal from "./modal.vue";

let resolveFn: ((value?: unknown) => void) | undefined;
let rejectFn: ((reason?: any) => void) | undefined; // eslint-disable-line @typescript-eslint/no-explicit-any
let wrapper: HTMLElement | undefined;

export function openModal<T = unknown>(
    app: App,
    type: Component<T>,
    props: Partial<ExtractPropTypes<T>>,
): Promise<unknown | undefined> {
    if (wrapper) {
        rejectFn?.("canceled");
        render(null, wrapper);
    }

    wrapper = document.body.appendChild(document.createElement("div"));
    wrapper.classList.add("b-wrapper");

    const child = createVNode(type, props);
    child.appContext = app._context ?? null;

    const modal = createVNode(bModal, null, {default: withCtx(() => [child])});
    modal.appContext = app._context ?? null;
    render(modal, wrapper);

    return new Promise((resolve, reject) => {
        resolveFn = resolve;
        rejectFn = reject;
    });
}

export function closeModal(value: unknown, reject = false): void {
    if (wrapper) {
        render(null, wrapper);
        wrapper.remove();
        wrapper = undefined;

        (reject ? rejectFn : resolveFn)?.(value);
    }
}
