import {App, createVNode, nextTick, render} from "vue";

import {generateID} from "~src/components/common";
import {NotifyOpts} from "~types";

import bNotifier from "./notifier.vue";

export interface NotifyEvent {
    id: string;
    opts: NotifyOpts;
}

let wrapper: HTMLElement | undefined;

export function notify(app: App, opts: NotifyOpts): void {
    if (!wrapper) {
        wrapper = document.body.appendChild(document.createElement("div"));
        wrapper.classList.add("b-wrapper");

        const modal = createVNode(bNotifier);
        modal.appContext = app._context ?? null;
        render(modal, wrapper);
    }

    nextTick(() =>
        document.dispatchEvent(
            new CustomEvent<NotifyEvent>("notify", {detail: {id: generateID(), opts}}),
        ),
    );
}
