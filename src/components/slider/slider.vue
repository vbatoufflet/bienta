<template>
    <div
        :id="id"
        ref="baseElement"
        :aria-disabled="disabled || undefined"
        :aria-label="label"
        :aria-valuemax="max.toString()"
        :aria-valuemin="min.toString()"
        :aria-valuenow="!range ? modelValue.toString() : undefined"
        class="b-slider"
        :class="{dragging: dragging !== undefined}"
        role="slider"
        :style="`--first: ${positions[0]}%; --last: ${positions[1]}%`"
        @autofocus="focus"
        @click="onClick"
    >
        <div class="track">
            <div
                v-if="range"
                class="cursor"
                data-index="0"
                :tabindex="!disabled ? 0 : undefined"
                @click.stop
                @keydown="onKeydown($event, 0)"
                @pointerdown="onPointer($event, 0)"
            >
                <div class="tooltip" data-anchor="top">
                    {{ formatTooltip?.(values[0]) ?? values[0] }}
                </div>
            </div>

            <div
                class="cursor"
                data-index="1"
                :tabindex="!disabled ? 0 : undefined"
                @click.stop
                @keydown="onKeydown($event, 1)"
                @pointerdown="onPointer($event, 1)"
            >
                <div class="tooltip" data-anchor="top">
                    {{ formatTooltip?.(values[1]) ?? values[1] }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {PropType, computed, ref} from "vue";

import {generateID} from "~src/components/common";

export default {
    name: "b-slider",
};
</script>

<script lang="ts" setup>
const props = defineProps({
    disabled: {
        default: false,
        type: Boolean,
    },
    formatTooltip: {
        default: undefined,
        type: Function as PropType<(value: number) => string>,
    },
    label: {
        default: undefined,
        type: String,
    },
    max: {
        default: 100,
        type: Number,
    },
    min: {
        default: 0,
        type: Number,
    },
    modelValue: {
        required: true,
        type: [Array, Number] as PropType<number | [number, number]>,
    },
    step: {
        default: 1,
        type: Number,
    },
});

const emit = defineEmits<{
    (ev: "update:modelValue", value: number | [number, number]): void;
}>();

const id = generateID("slider");

let rect: DOMRect | undefined;

const baseElement = ref<HTMLElement>();
const dragging = ref<0 | 1>();

const positions = computed(() =>
    typeof props.modelValue === "number"
        ? [0, Math.round((props.modelValue * props.max) / 100)]
        : props.modelValue.map(v => Math.round((v * props.max) / 100)),
);

const range = computed(() => Array.isArray(props.modelValue));

const values = computed<[number, number]>(() =>
    Array.isArray(props.modelValue) ? props.modelValue : [0, props.modelValue],
);

const apply = (mode: "step" | "value", value: number, index: 0 | 1) => {
    if (!props.disabled) {
        let out: number | [number, number];
        if (typeof props.modelValue === "number") {
            out = closestValue(mode === "step" ? props.modelValue + value : value);
        } else {
            out = [...props.modelValue];
            out[index] = closestValue(mode === "step" ? props.modelValue[index] + value : value);
            out.sort((a, b) => a - b);
        }

        emit("update:modelValue", out);
    }
};

const closestValue = (value: number) =>
    Math.min(Math.max(Math.ceil(value / props.step) * props.step, props.min), props.max);

const focus = () => baseElement.value?.focus();

const onClick = (ev: MouseEvent) => {
    const target = ev.target as Element | null;
    if (!target) {
        return;
    }

    const value = closestValue((ev.offsetX * 100) / target.clientWidth);
    const deltas = values.value.map(v => Math.abs(value - v));
    const index = deltas.indexOf(Math.min(...deltas));
    if (index !== -1) {
        apply("value", value, index as 0 | 1);
    }
};

const onPointer = (ev: PointerEvent, index?: 0 | 1) => {
    switch (ev.type) {
        case "pointerdown": {
            if (baseElement.value && index !== undefined) {
                rect = baseElement.value.getBoundingClientRect();

                document.addEventListener("pointermove", onPointer);
                document.addEventListener("pointerup", onPointer);
                dragging.value = index;
            }

            break;
        }
        case "pointermove": {
            if (dragging.value === undefined || !rect) {
                return;
            }

            apply(
                "value",
                ev.pageX <= rect.x
                    ? props.min
                    : ev.pageX >= rect.x + rect.width
                    ? props.max
                    : closestValue(((ev.pageX - rect.x) * 100) / rect.width),
                dragging.value,
            );

            break;
        }
        case "pointerup": {
            document.removeEventListener("pointermove", onPointer);
            document.removeEventListener("pointerup", onPointer);
            dragging.value = undefined;

            break;
        }
    }
};

const onKeydown = (ev: KeyboardEvent, index: 0 | 1) => {
    if (["ArrowUp", "ArrowRight", "PageUp"].includes(ev.code)) {
        apply("step", props.step, index);
    } else if (["ArrowDown", "ArrowLeft", "PageDown"].includes(ev.code)) {
        apply("step", -props.step, index);
    } else if (["Home", "End"].includes(ev.code)) {
        apply("value", ev.code === "Home" ? props.min : props.max, index);
    } else {
        return;
    }

    ev.preventDefault();
};

defineExpose({focus});
</script>

<style lang="scss" scoped>
@import "../../directives/tooltip/mixins";
@import "../../style/mixins";

.b-slider {
    align-items: center;
    display: inline-flex;
    height: var(--input-size);
    justify-content: center;
    line-height: var(--input-size);
    position: relative;
    vertical-align: middle;
    width: var(--input-min-width);

    .track {
        align-items: center;
        background-color: var(--slider-background);
        border-radius: 0.6rem;
        content: "";
        display: flex;
        height: 0.6rem;
        width: 100%;

        &::before {
            background-color: var(--primary);
            border-radius: inherit;
            content: "";
            height: inherit;
            left: var(--first);
            position: absolute;
            width: calc(var(--last) - var(--first));
        }
    }

    .cursor {
        background-color: var(--color);
        border-radius: 100%;
        cursor: grab;
        display: flex;
        height: 1rem;
        justify-content: center;
        position: absolute;
        transform: translateX(-50%);
        width: 1rem;
        z-index: 1;

        &:active,
        &:focus,
        &:hover {
            .tooltip {
                visibility: visible;
            }
        }

        @include focus-style(":focus");
        --focus-style-radius: 100%;
        --focus-style-size: 0.25rem;
        --focus-style-inset: -0.25rem;

        &:first-child:not(:last-child) {
            left: var(--first);
        }

        &:last-child {
            left: var(--last);
        }
    }

    .tooltip {
        @include tooltip;

        bottom: calc(100% + 0.25rem);
        line-height: normal;
        position: absolute;
    }

    &.dragging .tooltip {
        visibility: visible;
    }
}
</style>
