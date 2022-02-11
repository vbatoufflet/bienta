<template>
    <aside :id="id" class="b-sidebar" :class="{resizing}" :data-clip="clip" :data-mode="mode">
        <slot></slot>

        <div v-if="resizable" class="handle" @dblclick="resetSize" @pointerdown="onPointer"></div>
    </aside>
</template>

<script lang="ts">
import {PropType, nextTick, onBeforeMount, onBeforeUnmount, ref, watch} from "vue";

import {generateID} from "~src/components/common";
import {updateDOMDataset} from "~src/helpers";
import {useBienta} from "~src/index";
import {SidebarClip, SidebarMode} from "~types";

export default {
    name: "b-sidebar",
};
</script>

<script lang="ts" setup>
const props = defineProps({
    clip: {
        default: "left",
        type: String as PropType<SidebarClip>,
    },
    mode: {
        default: "static",
        type: String as PropType<SidebarMode>,
    },
    resizable: {
        default: false,
        type: Boolean,
    },
});

const bienta = useBienta();

const id = generateID("sidebar");

let origSidebarSize: string | undefined;

const resizing = ref(false);

const onPointer = (ev: PointerEvent) => {
    switch (ev.type) {
        case "pointerdown": {
            document.addEventListener("pointermove", onPointer);
            document.addEventListener("pointerup", onPointer);

            updateDOMDataset(document.body, "lock", null, id);
            resizing.value = true;

            break;
        }
        case "pointermove": {
            if (!resizing.value) {
                return;
            }

            let size: number = ev.pageX;
            if (props.clip === "right") {
                size = window.innerWidth - size;
            }

            bienta.state.sidebar.size = size;
            bienta.container?.style.setProperty("--sidebar-size", `${size}px`);

            break;
        }
        case "pointerup": {
            document.removeEventListener("pointermove", onPointer);
            document.removeEventListener("pointerup", onPointer);

            setTimeout(() => {
                updateDOMDataset(document.body, "lock", id, null);
                resizing.value = false;
            }, 200);

            break;
        }
    }
};

const resetSize = () => {
    bienta.state.sidebar.size = undefined;
    if (origSidebarSize) {
        bienta.container?.style.setProperty("--sidebar-size", origSidebarSize);
    }
};

onBeforeMount(() => {
    nextTick(() => {
        origSidebarSize = bienta.container?.style.getPropertyValue("--sidebar-size");

        // eslint-disable-next-line unicorn/explicit-length-check
        if (bienta.state.sidebar.size) {
            bienta.container?.style.setProperty("--sidebar-size", `${bienta.state.sidebar.size}px`);
        }
    });
});

onBeforeUnmount(() => {
    delete document.body.dataset.sidebar;
});

watch(
    () => ({
        clip: props.clip,
        mode: props.mode,
    }),
    to => {
        document.body.dataset.sidebar = `${to.clip} ${to.mode}`;
    },
    {immediate: true},
);
</script>

<style lang="scss" scoped>
.b-sidebar {
    --background: var(--sidebar-background);
    --color: var(--sidebar-color);

    background-color: var(--background);
    bottom: 0;
    color: var(--color);
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    overflow: auto;
    padding: var(--sidebar-padding);
    position: fixed;
    top: 0;
    width: var(--sidebar-size);
    z-index: 200;

    &[data-clip="left"] {
        left: 0;

        .handle {
            right: 0;
        }
    }

    &[data-clip="right"] {
        right: 0;

        .handle {
            left: 0;
        }
    }

    &[data-mode="float"].active {
        box-shadow: 0 0 1.5rem 0.25rem var(--sidebar-shadow);
    }

    &[data-toolbar~="bottom"] {
        padding-bottom: var(--toolbar-size);
    }

    &[data-toolbar~="left"] {
        padding-left: var(--toolbar-size);
    }

    &[data-toolbar~="right"] {
        padding-right: var(--toolbar-size);
    }

    &[data-toolbar~="top"] {
        padding-top: var(--toolbar-size);
    }

    .handle {
        background-color: transparent;
        bottom: 0;
        cursor: ew-resize;
        position: absolute;
        top: 0;
        width: 0.3rem;
    }

    .handle:hover,
    &.resizing .handle {
        background-color: var(--primary);
    }

    &.resizing {
        overflow: hidden;
    }

    ::v-deep() {
        .b-button {
            --button-size: var(--sidebar-button-size);

            display: inline-block;

            .content > .label {
                justify-content: flex-start;
            }

            > .content:focus,
            > .content:hover {
                --background: var(--sidebar-hover-background);
            }

            &.active > .content,
            > .content:active,
            > .content.active {
                --background: var(--sidebar-active-background);
            }
        }

        .b-label {
            display: flex;
            letter-spacing: 0.1rem;
            opacity: 0.65;
            padding: 0 var(--button-padding);
            text-transform: uppercase;
        }
    }
}

body[data-toolbar="bottom"] .b-sidebar {
    bottom: var(--toolbar-size);
}

body[data-toolbar="left"] .b-sidebar[data-clip="left"] {
    left: var(--toolbar-size);
}

body[data-toolbar="right"] .b-sidebar[data-clip="right"] {
    right: var(--toolbar-size);
}

body[data-toolbar="top"] .b-sidebar {
    top: var(--toolbar-size);
}
</style>
