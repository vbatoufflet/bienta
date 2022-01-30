<template>
    <div
        :id="id"
        ref="baseElement"
        :aria-checked="checked"
        :aria-disabled="disabled || undefined"
        :aria-label="label"
        :aria-labelledby="hasLabel ? labelID : undefined"
        class="b-checkbox"
        :class="{'has-label': hasLabel}"
        :data-type="type"
        :role="type === 'check' ? 'checkbox' : 'switch'"
        :tabindex="!disabled ? 0 : undefined"
        @autofocus="focus"
        @click="toggle"
        @keydown.space.prevent="toggle"
        @shortcut="toggle"
    >
        <div v-if="type === 'check'" class="check">
            <b-icon-check v-if="checked" />
        </div>

        <div v-else aria-hidden="true" class="toggle"></div>

        <div v-if="hasLabel" :id="labelID" class="label">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import {PropType, computed, onMounted, onUpdated, ref, useSlots} from "vue";

import {generateID} from "~src/components/common";
import bIconCheck from "~src/components/icon/internal/check.vue";
import {CheckboxType} from "~types";

export default {
    name: "b-checkbox",
    components: {
        bIconCheck,
    },
};
</script>

<script lang="ts" setup>
const props = defineProps({
    disabled: {
        default: false,
        type: Boolean,
    },
    label: {
        default: undefined,
        type: String,
    },
    modelValue: {
        required: true,
        type: [Array, Boolean],
    },
    type: {
        default: "check",
        type: String as PropType<CheckboxType>,
    },
    // eslint-disable-next-line vue/require-prop-types
    value: {
        default: false,
    },
});

const emit = defineEmits<{
    (ev: "update:modelValue", value: unknown[] | boolean): void;
}>();

const id = generateID("checkbox");
const labelID = id.replace("checkbox-", "label-");

const slots = useSlots();

const baseElement = ref<HTMLElement>();
const hasLabel = ref(false);

const checked = computed(() => {
    return Array.isArray(props.modelValue)
        ? props.modelValue.includes(props.value)
        : props.modelValue;
});

const focus = () => baseElement.value?.focus();

const toggle = () => {
    let value: unknown[] | boolean;
    if (Array.isArray(props.modelValue)) {
        value = [...props.modelValue];

        const idx = props.modelValue.indexOf(props.value);
        if (idx === -1) {
            value.push(props.value);
        } else {
            value.splice(idx, 1);
        }
    } else {
        value = !props.modelValue;
    }

    emit("update:modelValue", value);
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

.b-checkbox {
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

    .check,
    .toggle {
        align-items: center;
        display: flex;
        background-color: var(--input-background);
        border: 0.2rem solid transparent;
        height: 1.35rem;
    }

    .check {
        border-radius: 0.2rem;
        color: var(--color);
        font-size: 0.8rem;
        width: 1.35rem;
    }

    .toggle {
        border-radius: 1.35rem;
        position: relative;
        width: 2.25rem;

        &::before {
            background-color: var(--color);
            border-radius: 100%;
            content: "";
            display: block;
            height: 1rem;
            left: 0;
            opacity: 0.5;
            position: absolute;
            transition: all 0.35s var(--timing-function);
            width: 1rem;
        }
    }

    .label {
        padding-right: 0.75rem;
    }

    &[aria-checked="true"] {
        .check,
        .toggle {
            --color: white;
            --input-background: var(--primary);
        }

        &[data-type="toggle"] .toggle::before {
            left: calc(100% - 1rem);
            opacity: unset;
        }
    }
}
</style>
