<template>
    <div
        :id="id"
        ref="baseElement"
        :aria-disabled="disabled || undefined"
        :aria-invalid="(reportInvalid && Boolean(validationMessage)) || undefined"
        :aria-readonly="readonly || undefined"
        class="b-input"
        :class="{'has-help': help || (reportInvalid && Boolean(validationMessage))}"
        :data-label="label ?? placeholder"
        :data-type="type"
        :data-validity="true"
        @autofocus="focus()"
        @click="focus()"
        @focusout="reportValidity()"
        @reportValidity="reportValidity()"
        @reset="reset()"
        @shortcut="!disabled && focus(true)"
    >
        <b-icon
            v-if="iconName !== undefined"
            :badge="iconBadge"
            :name="iconName"
            :pack="iconPack"
        />

        <textarea
            v-if="type === 'textarea'"
            ref="inputElement"
            :aria-label="label ?? placeholder"
            :autocomplete="autocomplete"
            :disabled="disabled"
            :placeholder="placeholder"
            :readonly="readonly"
            :required="required"
            :value="modelValue"
            @input="update(false)"
        ></textarea>

        <input
            v-else
            ref="inputElement"
            :aria-autocomplete="completion ? 'list' : undefined"
            :aria-expanded="completion ? dropdownVisibility : undefined"
            :aria-haspopup="completion ? true : undefined"
            :aria-label="label ?? placeholder"
            :autocapitalize="autocapitalize"
            :autocomplete="autocomplete"
            :disabled="disabled"
            :inputmode="inputMode"
            :max="type === 'number' ? max : undefined"
            :min="type === 'number' ? min : undefined"
            :pattern="pattern"
            :placeholder="placeholder"
            :readonly="readonly"
            :required="required"
            :role="completion ? 'combobox' : undefined"
            :step="type === 'number' ? step : undefined"
            :type="type === 'number' ? 'text' : type"
            :value="modelValue"
            @focusout="toggleDropdown(false)"
            @input="update(false)"
            @keydown="onKeydown"
        />

        <span
            v-if="reportInvalid && validationMessage"
            v-tooltip="validationMessage"
            class="invalid"
        ></span>

        <span v-else-if="help" v-tooltip="help" class="help"></span>

        <div v-if="showArrows" aria-hidden="true" class="arrows">
            <b-icon-chevron flip :tabindex="-1" @click="applyStep(step)" />
            <b-icon-chevron :tabindex="-1" @click="applyStep(-step)" />
        </div>

        <b-dropdown
            v-if="completion"
            ref="dropdownComponent"
            :aria-activedescendant="activeID"
            role="listbox"
            tabindex="-1"
            @click="onPointer"
            @pointerdown.prevent
            @pointerover="onPointer"
        >
            <slot v-if="completionItems.length === 0" name="empty"></slot>
            <slot
                v-for="(item, index) in completionItems"
                v-else
                v-bind="{
                    index,
                    value: item,
                    active: index === activeIndex,
                }"
            >
                <b-button
                    aria-selected="false"
                    :class="{active: index === activeIndex}"
                    :data-item="index"
                    role="option"
                >
                    {{ typeof item === "string" ? item : item.value }}
                </b-button>
            </slot>
        </b-dropdown>
    </div>
</template>

<script lang="ts">
import {debounce} from "debounce";
import {PropType, computed, nextTick, onMounted, onUpdated, ref, useSlots, watch} from "vue";

import bButton from "~src/components/button/button.vue";
import {generateID, onDropdownKeydown, onDropdownMouse} from "~src/components/common";
import bDropdown from "~src/components/dropdown/dropdown.vue";
import bIcon from "~src/components/icon/icon.vue";
import bIconChevron from "~src/components/icon/internal/chevron.vue";
import {touchOnly} from "~src/helpers";
import {CompletionFunc, CompletionItem, DropdownPublicInstance, IconPack, InputType} from "~types";

export default {
    name: "b-input",
    components: {
        bButton,
        bDropdown,
        bIcon,
        bIconChevron,
    },
};
</script>

<script lang="ts" setup>
const props = defineProps({
    autocapitalize: {
        default: undefined,
        type: String,
    },
    autocomplete: {
        default: undefined,
        type: String,
    },
    completion: {
        default: undefined,
        type: Function as PropType<CompletionFunc<string>>,
    },
    customValidity: {
        default: undefined,
        type: Function as PropType<(value: string) => Promise<string>>,
    },
    disabled: {
        default: false,
        type: Boolean,
    },
    help: {
        default: undefined,
        type: String,
    },
    iconBadge: {
        default: undefined,
        type: [Number, String],
    },
    iconName: {
        default: undefined,
        type: String,
    },
    iconPack: {
        default: undefined,
        type: String as PropType<IconPack>,
    },
    label: {
        default: undefined,
        type: String,
    },
    max: {
        default: undefined,
        type: Number,
    },
    min: {
        default: undefined,
        type: Number,
    },
    modelValue: {
        required: true,
        type: [Number, String],
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
    step: {
        default: 1,
        type: Number,
    },
    type: {
        default: "text",
        type: String as PropType<InputType>,
    },
});

const emit = defineEmits<{
    (ev: "select", item: unknown): void;
    (ev: "update:modelValue", value: number | string): void;
}>();

const slots = useSlots();

const id = generateID("input");

const activeIndex = ref(-1);
const baseElement = ref<HTMLElement>();
const completionItems = ref<CompletionItem<string>[]>([]);
const dropdownComponent = ref<DropdownPublicInstance>();
const dropdownVisibility = ref(false);
const hasEmpty = ref(false);
const inputElement = ref<HTMLInputElement | HTMLTextAreaElement>();
const reportInvalid = ref(false);
const showArrows = ref(false);
const validationMessage = ref("");

const activeID = computed(() =>
    activeIndex.value >= 0
        ? dropdownComponent.value?.$el.querySelectorAll(':scope > [role="option"]')?.[
              activeIndex.value
          ]?.id
        : undefined,
);

const inputMode = computed(() =>
    props.type === "number" ? (Number.isInteger(props.step) ? "numeric" : "decimal") : undefined,
);

const applyStep = (step: number) => {
    if (!props.readonly) {
        emit(
            "update:modelValue",
            (typeof props.modelValue === "number"
                ? props.modelValue
                : Number.parseFloat(props.modelValue)) + step,
        );
    }
};

const checkValidity = async () => {
    if (!inputElement.value) {
        return false;
    } else if (props.disabled || props.readonly) {
        return true;
    }

    if (props.customValidity) {
        validationMessage.value = await props.customValidity(inputElement.value.value);
    } else if (!inputElement.value.validity.valid) {
        validationMessage.value = inputElement.value.validity.valueMissing
            ? "Missing value"
            : "Invalid value";
    } else if (props.type === "number") {
        validationMessage.value =
            inputElement.value.value && Number.isNaN(Number(inputElement.value.value))
                ? "Invalid number"
                : "";
    } else {
        validationMessage.value = "";
    }

    return !validationMessage.value;
};

const clear = () => {
    inputElement.value?.setCustomValidity("");
    emit("update:modelValue", "");
};

const focus = (select = false) => {
    if (!baseElement.value?.contains(document.activeElement)) {
        inputElement.value?.[select ? "select" : "focus"]();
    }
};

const onKeydown = (ev: KeyboardEvent) => {
    if (props.type === "number" && (ev.code === "ArrowDown" || ev.code === "ArrowUp")) {
        ev.preventDefault();
        applyStep(ev.code === "ArrowDown" ? -props.step : props.step);
        return;
    }

    if (ev.code === "Escape") {
        if (dropdownVisibility.value) {
            ev.preventDefault();
            toggleDropdown(false);
            focus();
        } else if (props.type === "search" && props.modelValue) {
            ev.preventDefault();
            clear();
        }

        return;
    } else if (!dropdownVisibility.value) {
        return;
    }

    onDropdownKeydown(ev, activeIndex, selectItem, completionItems.value.length);
};

const onPointer = (ev: MouseEvent) => onDropdownMouse(ev, activeIndex, selectItem);

const reportValidity = async () => {
    reportInvalid.value = true;
    return await checkValidity();
};

const reset = () => {
    reportInvalid.value = false;
    validationMessage.value = "";
    emit("update:modelValue", "");
};

const selectItem = (index: number) => {
    toggleDropdown(false);

    const item = completionItems.value?.[index];
    if (item) {
        emit("update:modelValue", typeof item === "string" ? item : item.value);
        emit("select", item);
    } else {
        emit("update:modelValue", inputElement.value?.value ?? "");
    }

    nextTick(() => focus());
};

const toggleDropdown = (state = !dropdownVisibility.value) => {
    dropdownComponent.value?.toggle(state);
    dropdownVisibility.value = state;

    if (state) {
        nextTick(() => (activeIndex.value = 0));
    }
};

const update = async (apply = false) => {
    if (!props.completion || apply) {
        const value = inputElement.value?.value ?? "";

        if (props.completion) {
            completionItems.value = value ? await props.completion(value) : [];
            toggleDropdown(completionItems.value.length > 0 || (Boolean(value) && hasEmpty.value));
        }

        emit("update:modelValue", value);
    } else if (updateDebounce) {
        updateDebounce();
    }
};

const updateDebounce = props.completion ? debounce(() => update(true), 200) : undefined;

const refresh = () => {
    hasEmpty.value = Boolean(slots.empty);
    showArrows.value = props.type === "number" && !touchOnly();
};

onMounted(refresh);

onUpdated(refresh);

watch(
    () => props.modelValue,
    () => {
        if (reportInvalid.value) {
            nextTick(() => checkValidity());
        }
    },
);

defineExpose({checkValidity, focus, reportValidity});
</script>

<style lang="scss" scoped>
@import "./mixins";

.b-input {
    @include input;

    &[data-type="textarea"] {
        height: auto;

        .b-icon {
            align-self: flex-start;
        }
    }

    &[data-type="number"],
    &.has-help {
        input,
        textarea {
            padding-right: var(--input-icon-size);
        }
    }

    &[data-type="number"].has-help {
        input,
        textarea {
            padding-right: calc(1rem + var(--input-padding) + var(--input-icon-size));
        }

        .help,
        .invalid {
            right: var(--input-icon-size);
            width: 1rem;
        }
    }

    > .b-icon,
    .arrows,
    .help,
    .invalid {
        height: var(--input-icon-size);
        position: absolute;
        width: var(--input-icon-size);

        &:first-child {
            left: 0;

            + input,
            + textarea {
                padding-left: var(--input-icon-size);
            }
        }
    }

    input[type="number"] {
        -moz-appearance: textfield;

        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
            -webkit-appearance: none;
        }
    }

    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration {
        display: none;
    }

    textarea {
        line-height: normal;
        min-height: 5.25rem;
        padding: var(--input-padding);
        tab-size: 4;
        width: calc(var(--input-min-width) * 1.5 - 2rem);
    }

    .help,
    .invalid {
        height: 1rem;
        right: 0;
        top: 0.75rem;
    }

    .arrows {
        height: 1.65rem;
        right: 0;
        width: var(--input-icon-size);

        .b-icon {
            &:first-child {
                border-top-left-radius: 0.2rem;
                border-top-right-radius: 0.2rem;
            }

            &:last-child {
                border-bottom-left-radius: 0.2rem;
                border-bottom-right-radius: 0.2rem;
            }

            &:active,
            &:focus,
            &:hover {
                background-color: var(--toolbar-input-background);
            }
        }
    }
}
</style>
