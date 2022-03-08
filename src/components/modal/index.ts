import {App, Component, ExtractPropTypes, createVNode, render, withCtx} from "vue";

import {generateID} from "~src/components/common";

import bModal from "./modal.vue";

interface ModalRef {
    resolve(value?: unknown): void;
    reject(reason?: any): void; // eslint-disable-line @typescript-eslint/no-explicit-any
    wrapper: HTMLElement;
}

const modals = new Array<ModalRef>();

export function openModal<T = unknown>(
    app: App,
    type: Component<T>,
    props: Partial<ExtractPropTypes<T>>,
): Promise<unknown | undefined> {
    if (modals.length > 0) {
        modals[0].wrapper.style.display = "none";
    }

    const wrapper = document.body.appendChild(document.createElement("div"));
    wrapper.id = generateID("modal");
    wrapper.classList.add("b-wrapper");

    const child = createVNode(type, props);
    child.appContext = app._context ?? null;

    const modal = createVNode(bModal, null, {default: withCtx(() => [child])});
    modal.appContext = app._context ?? null;
    render(modal, wrapper);

    return new Promise((resolve, reject) => {
        modals.unshift({resolve, reject, wrapper});
    });
}

export function closeModal(value: unknown, reject = false): void {
    const ref = modals.shift();
    if (ref?.wrapper) {
        render(null, ref.wrapper);
        ref.wrapper.remove();

        (reject ? ref.reject : ref.resolve)?.(value);

        if (modals.length > 0) {
            modals[0].wrapper.style.removeProperty("display");
        }
    }
}
