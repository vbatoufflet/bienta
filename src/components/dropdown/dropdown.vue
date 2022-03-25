<template>
    <div
        :id="id"
        ref="baseElement"
        class="b-dropdown"
        :class="{active}"
        :data-anchor="anchorOverride || anchor"
    >
        <slot></slot>
    </div>
</template>

<script lang="ts">
import {PropType, nextTick, onBeforeUnmount, onMounted, ref} from "vue";

import {generateID} from "~src/components/common";
import {updateDOMDataset} from "~src/helpers";
import {DropdownAnchor} from "~types";

export default {
    name: "b-dropdown",
};
</script>

<script lang="ts" setup>
const props = defineProps({
    anchor: {
        default: "bottom-left",
        type: String as PropType<DropdownAnchor>,
    },
});

let observer: MutationObserver;

const active = ref(false);
const anchorOverride = ref<DropdownAnchor>();
const baseElement = ref<HTMLElement>();

const adaptAnchor = () => {
    if (!baseElement.value || !active.value) {
        return;
    }

    const rect = baseElement.value.getBoundingClientRect();

    // Look for closest scrollable parent. If not found, handle placement relative to window
    let cur = baseElement.value.parentElement;
    let scrollable: DOMRect | undefined;
    while (cur && !scrollable) {
        const overflow = getComputedStyle(cur).overflowY;
        if (overflow === "auto" || overflow === "scroll") {
            scrollable = cur.getBoundingClientRect();
            break;
        }
        cur = cur.parentElement;
    }

    let anchor = props.anchor;
    anchor =
        rect.top - (scrollable?.top ?? 0) + rect.height > (scrollable?.height ?? window.innerHeight)
            ? (anchor.replace(/^bottom/, "top") as DropdownAnchor)
            : (anchor.replace(/^top/, "bottom") as DropdownAnchor);
    anchor =
        rect.left - (scrollable?.left ?? 0) + rect.width > (scrollable?.width ?? window.innerWidth)
            ? (anchor.replace(/left$/, "right") as DropdownAnchor)
            : (anchor.replace(/right$/, "left") as DropdownAnchor);

    if (anchor !== props.anchor || anchorOverride.value !== props.anchor) {
        anchorOverride.value = anchor;
    }
};

const isActive = () => {
    return active.value;
};

const toggle = (state?: boolean) => {
    active.value = state !== undefined ? state : !active.value;
    if (active.value) {
        anchorOverride.value = undefined;
        updateDOMDataset(document.body, "lock", null, id);
    } else {
        updateDOMDataset(document.body, "lock", id, null);
    }
    return active.value;
};

const id = generateID("dropdown");

onMounted(() => {
    if (baseElement.value) {
        observer = new MutationObserver(() => nextTick(adaptAnchor));

        observer.observe(baseElement.value, {
            attributeFilter: ["class"],
            attributes: true,
        });
    }
});

onBeforeUnmount(() => {
    observer.disconnect();
});

defineExpose({isActive, toggle});
</script>

<style lang="scss" scoped>
.b-dropdown {
    background-color: var(--dropdown-background);
    border-radius: 0.2rem;
    box-shadow: 0 0.1rem 0.5rem var(--dropdown-shadow);
    display: none;
    flex-direction: column;
    padding: 0.35rem;
    position: absolute;
    z-index: 400;

    &[data-anchor="bottom-left"],
    &[data-anchor="bottom-right"] {
        top: 100%;
    }

    &[data-anchor="top-left"],
    &[data-anchor="top-right"] {
        bottom: 100%;
    }

    &[data-anchor="bottom-left"],
    &[data-anchor="top-left"] {
        left: 0;
    }

    &[data-anchor="bottom-right"],
    &[data-anchor="top-right"] {
        right: 0;
    }

    &[data-anchor="left"],
    &[data-anchor="right"] {
        top: -0.35rem;
    }

    &[data-anchor="left"] {
        left: 100%;
    }

    &[data-anchor="right"] {
        right: 100%;
    }

    &.active {
        display: flex;
    }

    ::v-deep() {
        --input-background: var(--dropdown-input-background);

        > .b-button {
            --background: var(--dropdown-background);
            --button-hover-background: var(--dropdown-background);
            --main-button-background: var(--dropdown-background);
            --orig-color: var(--color);

            display: inline-block;

            &[data-color] > .content {
                --background: transparent;
                --color: var(--orig-color);
            }

            > .content > .label {
                justify-content: flex-start;
            }

            &.active > .content {
                --button-hover-background: var(--dropdown-active-background);
            }

            > .content:active,
            > .content:focus:is(:hover),
            > .content:hover {
                --button-hover-background: var(--primary);
                --color: white;
            }
        }

        > .b-checkbox,
        > .b-label {
            padding: 0 var(--button-padding);
        }

        > .b-input {
            margin: 0.35rem var(--button-padding);
        }

        > .b-label {
            white-space: nowrap;
        }

        > .b-message {
            margin: var(--button-padding);
        }

        > .b-separator {
            margin: 0.35rem 0;
        }
    }
}
</style>
