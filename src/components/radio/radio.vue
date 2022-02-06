<template>
    <div
        :id="id"
        ref="baseElement"
        :aria-checked="value === modelValue"
        :aria-disabled="disabled || undefined"
        :aria-labelledby="hasLabel ? labelID : undefined"
        class="b-radio"
        :class="{'has-label': hasLabel}"
        role="radio"
        :tabindex="!disabled ? 0 : undefined"
        @autofocus="focus"
        @click="toggle"
        @keydown="onKeydown"
    >
        <span class="circle"></span>

        <div v-if="hasLabel" :id="labelID" class="label">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import {onMounted, onUpdated, ref, useSlots} from "vue";

import {generateID} from "~src/components/common";

export default {
    name: "b-radio",
};
</script>

<script lang="ts" setup>
const props = defineProps({
    disabled: {
        default: false,
        type: Boolean,
    },
    // eslint-disable-next-line vue/require-prop-types
    modelValue: {
        required: true,
    },
    // eslint-disable-next-line vue/require-prop-types
    value: {
        default: false,
    },
});

const emit = defineEmits<{
    (ev: "update:modelValue", value: unknown): void;
}>();

const slots = useSlots();

const id = generateID("radio");
const labelID = id.replace("radio-", "label-");

const baseElement = ref<HTMLElement>();
const hasLabel = ref(false);

const focus = () => baseElement.value?.focus();

const onKeydown = (ev: KeyboardEvent) => {
    let step: number | undefined;

    if (["ArrowLeft", "ArrowUp"].includes(ev.code)) {
        step = -1;
    } else if (["ArrowRight", "ArrowDown"].includes(ev.code)) {
        step = 1;
    } else if (ev.code === "Space") {
        toggle();
    } else {
        return;
    }

    ev.preventDefault();

    if (step === undefined || !baseElement.value) {
        return;
    }

    const siblings = [
        ...(baseElement.value
            .closest('[role="radiogroup"]')
            ?.querySelectorAll<HTMLElement>(`[role="radio"]:not([aria-disabled="true"])`) ?? []),
    ];

    let index = siblings.indexOf(baseElement.value) + step;

    const sibling =
        siblings[index < 0 ? siblings.length - 1 : index >= siblings.length ? 0 : index];

    if (sibling) {
        sibling.focus();
        sibling.dispatchEvent(new MouseEvent("click"));
    }
};

const toggle = () => {
    emit("update:modelValue", props.value);
};

const refresh = () => {
    hasLabel.value = Boolean(slots.default);
};

onMounted(refresh);

onUpdated(refresh);

defineExpose({focus, toggle});
</script>

<style lang="scss" scoped>
@import "../../style/mixins";

.b-radio {
    align-items: center;
    color: var(--color);
    cursor: pointer;
    display: inline-flex;
    gap: 0.75rem;
    height: var(--input-size);
    line-height: var(--input-size);
    min-height: var(--input-size);
    position: relative;
    vertical-align: middle;
    white-space: nowrap;

    @include focus-style;
    --focus-style-inset: 0 -0.5rem;

    .circle {
        background-color: var(--input-background);
        border-radius: 100%;
        font-size: 0.8rem;
        height: 1.25rem;
        width: 1.25rem;
    }

    .label {
        padding-right: 0.75rem;
    }

    &[aria-checked="true"] .circle {
        --input-background: var(--primary);

        align-items: center;
        display: flex;
        justify-content: center;

        &::before {
            background-color: white;
            border-radius: 100%;
            content: "";
            display: block;
            height: 0.75rem;
            width: 0.75rem;
        }
    }
}
</style>
