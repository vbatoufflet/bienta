<template>
    <div
        v-if="data"
        ref="baseElement"
        class="b-tooltip"
        :class="{nowrap: data.nowrap}"
        :data-anchor="anchor"
    >
        <b-markdown v-if="data.content" :content="data.content" />

        <div v-if="data.shortcut" class="shortcut">
            {{ shortcutLabel(data.shortcut) }}
        </div>
    </div>
</template>

<script lang="ts">
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";

import bMarkdown from "~src/components/markdown/markdown.vue";
import {shortcutLabel} from "~src/directives/shortcut";

import {TooltipAnchor, TooltipData, TooltipEvent} from ".";

export default {
    name: "b-tooltip",
    components: {
        bMarkdown,
    },
};
</script>

<script lang="ts" setup>
const anchor = ref<TooltipAnchor>("bottom");
const baseElement = ref<HTMLElement>();
const data = ref<TooltipData>();

const onTooltip = ((ev: CustomEvent<TooltipEvent>) => {
    data.value = ev.type === "tooltip-show" ? ev.detail.data : undefined;
}) as (ev: Event) => void;

onMounted(() => {
    document.addEventListener("tooltip-show", onTooltip);
    document.addEventListener("tooltip-hide", onTooltip);
});

onBeforeUnmount(() => {
    document.removeEventListener("tooltip-show", onTooltip);
    document.removeEventListener("tooltip-hide", onTooltip);
});

watch(data, to => {
    if (!to) {
        return;
    }
    nextTick(() => {
        const tooltip = baseElement.value;
        if (!tooltip) {
            return;
        }

        if (to === null) {
            tooltip.style.removeProperty("left");
            tooltip.style.removeProperty("top");
            tooltip.style.removeProperty("visibility");

            return;
        }

        let deltaX = 0;
        let newAnchor: TooltipAnchor = "bottom";
        let left = to.domRect.left + to.domRect.width / 2 - tooltip.clientWidth / 2;
        let top = to.domRect.top + to.domRect.height;

        if (left < 0) {
            deltaX = left;
            left = 0;
        }

        let delta = left + tooltip.clientWidth - window.innerWidth;
        if (delta > 0) {
            deltaX = delta;
            left -= delta;
        }

        delta = data.value?.anchor === "top" ? 1 : top + tooltip.clientHeight - window.innerHeight;
        if (delta > 0) {
            top = to.domRect.top - tooltip.clientHeight;
            newAnchor = "top";
        }

        Object.assign(tooltip.style, {
            left: `${left}px`,
            top: `${top}px`,
            visibility: "visible",
        });

        if (deltaX) {
            tooltip.style.setProperty("--delta-x", `${deltaX}px`);
        } else {
            tooltip.style.removeProperty("--delta-x");
        }

        anchor.value = newAnchor;
    });
});
</script>

<style lang="scss" scoped>
@import "./mixins";

.b-tooltip {
    --delta-x: 0px;

    @include tooltip;

    position: fixed;

    &::before {
        transform: translateX(calc(-0.5rem + var(--delta-x)));
    }

    .b-markdown ::v-deep() > * {
        margin: 0;
    }

    &.nowrap .b-markdown {
        min-width: fit-content;
    }

    .shortcut {
        align-items: center;
        display: flex;
        font-size: 0.8rem;
        gap: 0.5rem;
        opacity: 0.65;
        white-space: nowrap;
    }
}
</style>
