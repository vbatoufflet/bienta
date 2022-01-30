<template>
    <div
        :id="id"
        ref="baseElement"
        :aria-disabled="disabled || undefined"
        :aria-invalid="(reportInvalid && Boolean(validationMessage)) || undefined"
        :aria-readonly="readonly || undefined"
        class="b-taglist"
        :class="{'has-help': help}"
        :data-label="label ?? placeholder"
        :data-validity="true"
        :tabindex="readonly ? 0 : undefined"
        @autofocus="focus()"
        @click="focus()"
        @copy="copy()"
        @focusout="handleValue"
        @paste.prevent="!disabled && !readonly && paste($event)"
        @reportValidity="reportValidity()"
        @reset="reset()"
        @shortcut="!disabled && focus()"
    >
        <b-icon
            v-if="iconName !== undefined"
            :badge="iconBadge"
            :name="iconName"
            :pack="iconPack"
        />

        <div class="container">
            <span
                v-for="(tag, index) in modelValue"
                :key="index"
                class="tag"
                :class="{invalid: reportInvalid && invalid.includes(index)}"
                :tabindex="!disabled && !readonly ? 0 : undefined"
                @click.stop
                @keydown.delete="!disabled && !readonly && removeValue(index)"
            >
                {{ tag }}

                <b-icon-times v-if="!disabled && !readonly" @click="removeValue(index)" />
            </span>

            <input
                v-if="!disabled && !readonly"
                ref="inputElement"
                v-model="content"
                :aria-label="label ?? placeholder"
                autocapitalize="off"
                autocomplete="off"
                :disabled="disabled"
                :placeholder="modelValue.length === 0 ? placeholder : undefined"
                :readonly="readonly"
                @keydown="onKeydown"
            />
        </div>

        <span v-if="help" v-tooltip="help" class="help"></span>
    </div>
</template>

<script lang="ts">
import {PropType, computed, nextTick, ref} from "vue";

import {generateID} from "~src/components/common";
import bIcon from "~src/components/icon/icon.vue";
import bIconTimes from "~src/components/icon/internal/times.vue";
import {IconPack} from "~types";

const defaultSeparator = ",";

export default {
    name: "b-taglist",
    components: {
        bIcon,
        bIconTimes,
    },
};
</script>

<script lang="ts" setup>
const props = defineProps({
    disabled: {
        default: false,
        type: Boolean,
    },
    help: {
        default: undefined,
        type: String,
    },
    iconName: {
        default: undefined,
        type: String,
    },
    iconBadge: {
        default: undefined,
        type: [Number, String],
    },
    iconPack: {
        default: undefined,
        type: String as PropType<IconPack>,
    },
    label: {
        default: undefined,
        type: String,
    },
    modelValue: {
        required: true,
        type: Array as PropType<string[]>,
    },
    pattern: {
        default: undefined,
        type: String,
    },
    placeholder: {
        default: undefined,
        type: String,
    },
    readonly: {
        default: false,
        type: Boolean,
    },
    required: {
        default: false,
        type: Boolean,
    },
    separators: {
        default: defaultSeparator,
        type: String,
    },
});

const emit = defineEmits<{
    (ev: "update:modelValue", value: string[]): void;
}>();

const id = generateID("taglist");

const baseElement = ref<HTMLElement>();
const content = ref("");
const inputElement = ref<HTMLInputElement>();
const reportInvalid = ref(false);
const validationMessage = ref("");

const invalid = computed(() => {
    const pattern = patternRegExp.value;
    if (!pattern) {
        return [];
    }

    return props.modelValue.reduce<number[]>((out, v, idx) => {
        if (!pattern.test(v)) {
            out.push(idx);
        }
        return out;
    }, []);
});

const patternRegExp = computed(() =>
    props.pattern ? new RegExp(`^(?:${props.pattern})$`) : undefined,
);

const appendValue = (value: string) => {
    emit("update:modelValue", [...new Set([...props.modelValue, value])]);
};

const checkValidity = () => {
    if (props.disabled || props.readonly) {
        return true;
    }

    if (props.required && props.modelValue.length === 0) {
        validationMessage.value = "Missing value";
    } else if (invalid.value.length > 0) {
        validationMessage.value = "Invalid value";
    } else {
        validationMessage.value = "";
    }

    return !validationMessage.value;
};

const copy = () => {
    navigator.clipboard.writeText(props.modelValue.join(props.separators[0] ?? defaultSeparator));
};

const focus = () => {
    inputElement.value?.focus();
};

const handleValue = () => {
    const value = content.value.trim();
    if (value) {
        appendValue(value);
        content.value = "";
    }

    nextTick(() => reportValidity());
};

const onKeydown = (ev: KeyboardEvent) => {
    if (ev.code === "Enter" || props.separators.includes(ev.key)) {
        ev.preventDefault();
        handleValue();
    } else if (ev.code === "Backspace" && !content.value) {
        emit("update:modelValue", [...props.modelValue.slice(0, -1)]);
    }
};

const paste = (ev: ClipboardEvent) => {
    let value =
        ev.clipboardData
            ?.getData("text")
            .split(new RegExp(`[${props.separators}]`))
            .map(v => v.trim()) ?? [];

    const pattern = patternRegExp.value;
    if (pattern) {
        value = value.filter(v => pattern.test(v));
    }

    if (value.length > 0) {
        emit("update:modelValue", [...new Set([...props.modelValue, ...value])]);
        nextTick(() => (content.value = ""));
    }
};

const removeValue = (index: number) => {
    const value = [...props.modelValue];
    value.splice(index, 1);
    emit("update:modelValue", value);

    nextTick(() => {
        if (!baseElement.value?.contains(document.activeElement)) {
            focus();
        }
    });
};

const reportValidity = () => {
    reportInvalid.value = true;
    return checkValidity();
};

const reset = () => {
    reportInvalid.value = false;
    emit("update:modelValue", []);
};

defineExpose({checkValidity, focus, reportValidity});
</script>

<style lang="scss" scoped>
@import "../input/mixins";

.b-taglist {
    @include input;

    height: auto;

    &.has-help .container {
        padding-right: var(--input-icon-size);
    }

    > .b-icon,
    .help {
        height: var(--input-icon-size);
        position: absolute;
        top: 0;
        width: var(--input-icon-size);

        &:first-child {
            left: 0;

            + .container {
                margin-left: calc(var(--input-icon-size) - 0.5rem);
            }
        }
    }

    .help {
        right: 0;
    }

    .container {
        align-content: flex-start;
        display: flex;
        flex-grow: 1;
        flex-wrap: wrap;
        gap: 0.5rem;
        line-height: 1.5rem;
        min-height: 6.5rem;
        overflow: scroll;
        padding: 0.5rem;
        resize: both;
        width: calc(var(--input-min-width) * 1.5 - 2rem);
    }

    input {
        padding: 0;
        min-width: 25%;
    }

    .tag {
        align-items: center;
        background-color: var(--primary);
        border-radius: 0.2rem;
        color: white;
        display: flex;
        padding: 0 0.65rem;

        &.invalid {
            background-color: var(--red);
        }

        &:focus {
            background-color: var(--color);
            color: var(--input-background);
            outline: none;
        }

        .b-icon {
            height: 1rem;
            opacity: 0.5;
            transform: translateX(0.35rem);
            width: 1rem;

            &:hover {
                opacity: 1;
            }
        }
    }
}
</style>
