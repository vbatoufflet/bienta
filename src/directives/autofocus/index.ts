import {DirectiveBinding} from "vue";

interface AutofocusEvent {
    select: boolean;
}

export default {
    name: "autofocus",

    beforeMount(el: HTMLElement): void {
        el.dataset.autofocus = "true";
    },

    mounted(el: HTMLElement, binding: DirectiveBinding): void {
        if (binding.value === undefined || Boolean(binding.value)) {
            el.dispatchEvent(
                new CustomEvent<AutofocusEvent>("autofocus", {
                    detail: {select: binding.modifiers.select},
                }),
            );
        }
    },
};
