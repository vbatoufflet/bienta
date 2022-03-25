<template>
    <component
        :is="tag"
        :id="id"
        ref="baseElement"
        :aria-orientation="orientation"
        class="b-toolbar"
        :data-clip="clip"
        @keydown="onKeydown"
    >
        <slot></slot>
    </component>
</template>

<script lang="ts">
import {PropType, computed, onBeforeUnmount, onMounted, onUpdated, ref, watch} from "vue";

import {generateID} from "~src/components/common";
import {updateDOMDataset} from "~src/helpers";
import {ToolbarClip} from "~types";

export default {
    name: "b-toolbar",
};
</script>

<script lang="ts" setup>
const props = defineProps({
    app: {
        default: false,
        type: Boolean,
    },
    clip: {
        default: undefined,
        type: String as PropType<ToolbarClip>,
    },
});

const id = generateID("toolbar");

let focusable: HTMLElement[] = [];
let observer: MutationObserver;

const baseElement = ref<HTMLElement>();

const clip = computed(() => props.clip ?? (props.app ? "top" : null));

const orientation = computed(() =>
    clip.value
        ? ["bottom", "top"].includes(clip.value)
            ? "horizontal"
            : "vertical"
        : "horizontal",
);

const tag = computed(() => (props.app ? "header" : "div"));

const onKeydown = (ev: KeyboardEvent) => {
    let index: number | undefined;

    if (
        (orientation.value === "horizontal" && ev.code === "ArrowLeft") ||
        (orientation.value === "vertical" && ev.code === "ArrowUp")
    ) {
        index = focusable.indexOf(ev.target as HTMLElement) - 1;
    } else if (
        (orientation.value === "horizontal" && ev.code === "ArrowRight") ||
        (orientation.value === "vertical" && ev.code === "ArrowDown")
    ) {
        index = focusable.indexOf(ev.target as HTMLElement) + 1;
    } else {
        return;
    }

    ev.preventDefault();
    if (index !== undefined && index >= 0 && index < focusable.length) {
        focusable[index].focus();
    }
};

const updateDataset = () => {
    if (props.app && clip.value !== null) {
        document.body.dataset.toolbar = clip.value;
    }

    if (baseElement.value?.parentElement) {
        updateDOMDataset(baseElement.value.parentElement, "toolbar", null, clip.value);
    }
};

const updateFocusable = () => {
    const elements = baseElement.value?.querySelectorAll<HTMLElement>(
        'input, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (elements) {
        focusable = [...elements];
    }
};

onMounted(() => {
    updateDataset();

    if (baseElement.value) {
        observer = new MutationObserver(updateFocusable);
        observer.observe(baseElement.value, {childList: true});
        updateFocusable();
    }
});

onUpdated(() => updateDataset());

onBeforeUnmount(() => {
    observer.disconnect();

    if (props.app) {
        delete document.body.dataset.toolbar;
    }

    if (baseElement.value?.parentElement) {
        updateDOMDataset(baseElement.value.parentElement, "toolbar", clip.value, null);
    }
});

watch(clip, (to, from) => {
    if (baseElement.value?.parentElement) {
        updateDOMDataset(baseElement.value.parentElement, "toolbar", from, to);
    }
});
</script>

<style lang="scss" scoped>
.b-toolbar {
    --background: var(--toolbar-background);
    --color: var(--toolbar-color);
    --spacing: calc((var(--toolbar-size) - var(--button-size)) / 2);

    align-items: center;
    background-color: var(--background);
    color: var(--color);
    display: flex;
    line-height: var(--toolbar-size);
    gap: var(--spacing);

    &[data-clip] {
        position: absolute;
        z-index: 100;

        &:is(header) {
            --background: var(--primary);
            --color: white;
            --input-background: var(--dark-primary);

            position: fixed;
            z-index: 300;

            ::v-deep() {
                --orig-primary: var(--primary);

                > * {
                    --button-hover-color: white;
                    --primary: white;
                }

                > .b-button .badge,
                > .b-icon .badge,
                > .b-label .badge {
                    color: var(--background);
                }

                > .b-button {
                    &.active > .content,
                    > .content.active {
                        --background: var(--orig-primary);
                    }

                    > .content:active,
                    > .content:focus,
                    > .content:hover {
                        --background: var(--dark-primary);
                    }
                }

                > .b-checkbox {
                    &[aria-checked="false"] .b-icon {
                        --input-background: var(--dark-primary);
                    }

                    &[aria-checked="true"] .b-icon {
                        color: var(--orig-primary);
                    }

                    &[data-type="toggle"] .icon {
                        opacity: 1;
                    }
                }

                .b-dropdown {
                    --primary: var(--orig-primary);
                }

                .b-input {
                    --primary: #ffffff78;
                }

                > .b-separator {
                    --separator-background: var(--light-primary);
                }
            }
        }
    }

    &:not([data-clip]),
    &[data-clip="bottom"],
    &[data-clip="top"] {
        height: var(--toolbar-size);
        padding: 0 var(--spacing);
    }

    &[data-clip="bottom"],
    &[data-clip="top"] {
        left: 0;
        right: 0;
    }

    &[data-clip="left"],
    &[data-clip="right"] {
        bottom: 0;
        flex-direction: column;
        padding: var(--spacing) 0;
        top: 0;
        width: var(--toolbar-size);

        ::v-deep() {
            > .b-button:not(.icon),
            > .b-checkbox,
            > .b-label {
                height: auto;
                width: var(--button-size);
            }

            > .b-button:not(.icon) > .content,
            > .b-checkbox,
            > .b-label {
                padding: var(--button-padding) 0;
                transform: rotate(180deg);
                writing-mode: vertical-rl;
            }

            > .b-button:not(.icon) > .content {
                height: auto;
                width: 100%;

                > .label + .b-badge {
                    margin: 0 0 0.25rem 0;
                }

                > .b-badge {
                    height: auto;
                    padding: 0.4rem 0;
                }
            }
        }
    }

    &[data-clip="bottom"] {
        bottom: 0;
    }

    &[data-clip="left"] {
        left: 0;
    }

    &[data-clip="right"] {
        right: 0;
    }

    &[data-clip="top"] {
        top: 0;
    }

    ::v-deep() {
        --input-background: var(--toolbar-input-background);

        > .b-button {
            --button-hover-background: var(--toolbar-hover-background);
            --main-button-background: var(--toolbar-background);
        }

        > .b-checkbox,
        > .b-label {
            padding: 0 var(--button-padding);
        }

        > .b-checkbox {
            &.has-label .label {
                padding-right: 0;
            }
        }
    }
}
</style>
