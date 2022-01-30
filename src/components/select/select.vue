<template>
    <div
        :id="id"
        :aria-disabled="disabled || undefined"
        :aria-invalid="(reportInvalid && Boolean(validationMessage)) || undefined"
        class="b-select"
        :class="{
            'fixed': typeof props.options === 'function',
            'has-help': help || (reportInvalid && Boolean(validationMessage)),
        }"
        :data-label="label ?? placeholder"
        :data-validity="true"
        :style="fitWidth ? `--fit-width: ${fitWidth}` : undefined"
        @autofocus="focus()"
        @click="!dropdownVisibility && toggleDropdown(true)"
        @focusout="reportValidity()"
        @reportValidity="reportValidity()"
        @reset="reset()"
        @shortcut="!disabled && focus()"
    >
        <b-icon
            v-if="iconName !== undefined"
            :badge="iconBadge"
            :flip="iconFlip"
            :name="iconName"
        />

        <template v-if="!dropdownVisibility">
            <b-label
                ref="labelComponent"
                :class="{placeholder: !selectedLabel}"
                :tabindex="!disabled ? 0 : undefined"
                @keydown.enter="toggleDropdown(true)"
            >
                {{ selectedLabel ?? placeholder }}
            </b-label>

            <span
                v-if="reportInvalid && validationMessage"
                v-tooltip="validationMessage"
                class="invalid"
            ></span>

            <span v-else-if="help" v-tooltip="help" class="help"></span>

            <div class="arrows">
                <b-icon-chevron />
            </div>
        </template>

        <input
            v-else
            ref="inputElement"
            v-model="filter"
            aria-autocomplete="list"
            :aria-expanded="dropdownVisibility"
            aria-haspopup="true"
            :aria-label="label ?? placeholder"
            autocapitalize="off"
            autocomplete="off"
            :placeholder="placeholder"
            role="combobox"
            @focusout="toggleDropdown(false)"
            @input="updateDebounce"
            @keydown="onKeydown"
        />

        <b-dropdown
            ref="dropdownComponent"
            :aria-activedescendant="activeID"
            role="listbox"
            tabindex="-1"
            @click="onPointer"
            @pointerdown.prevent
            @pointerover="onPointer"
        >
            <b-spinner v-if="pending" :size="16" />

            <slot
                v-for="(option, index) in options"
                v-else
                v-bind="{
                    index,
                    value: option,
                    active: index === activeIndex,
                    selected: index === selectedIndex,
                }"
            >
                <b-button
                    :aria-selected="index === selectedIndex"
                    :class="{active: index === activeIndex}"
                    :data-item="index"
                    role="option"
                    :tabindex="-1"
                >
                    {{ typeof option === "string" ? option : option.value }}
                </b-button>
            </slot>
        </b-dropdown>
    </div>
</template>

<script lang="ts">
import {debounce} from "debounce";
import {PropType, computed, nextTick, ref, watch} from "vue";

import bButton from "~src/components/button/button.vue";
import {generateID, onDropdownKeydown, onDropdownMouse} from "~src/components/common";
import bDropdown from "~src/components/dropdown/dropdown.vue";
import bIcon from "~src/components/icon/icon.vue";
import bIconChevron from "~src/components/icon/internal/chevron.vue";
import bLabel from "~src/components/label/label.vue";
import bSpinner from "~src/components/spinner/spinner.vue";
import {DropdownPublicInstance, IconFlip, LabelPublicInstance, SelectOption} from "~types";

export default {
    name: "b-select",
    components: {
        bButton,
        bDropdown,
        bIcon,
        bIconChevron,
        bLabel,
        bSpinner,
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
    iconFlip: {
        default: undefined,
        type: String as PropType<IconFlip>,
    },
    label: {
        default: undefined,
        type: String,
    },
    // eslint-disable-next-line vue/require-prop-types
    modelValue: {
        required: true,
    },
    options: {
        required: true,
        type: [Array, Function] as PropType<
            SelectOption[] | ((value?: string) => Promise<SelectOption[]>)
        >,
    },
    placeholder: {
        default: undefined,
        type: String,
    },
    required: {
        default: false,
        type: Boolean,
    },
});

const emit = defineEmits<{
    (ev: "update:modelValue", value: unknown): void;
}>();

const id = generateID("select");

const activeIndex = ref(0);
const dropdownComponent = ref<DropdownPublicInstance>();
const dropdownVisibility = ref(false);
const filter = ref("");
const fitWidth = ref<string>();
const inputElement = ref<HTMLInputElement>();
const labelComponent = ref<LabelPublicInstance>();
const options = ref<SelectOption[]>([]);
const pending = ref(false);
const selectedIndex = ref<number>();
const reportInvalid = ref(false);
const validationMessage = ref("");

const activeID = computed(
    () =>
        dropdownComponent.value?.$el.querySelectorAll(':scope > [role="option"]')?.[
            activeIndex.value
        ]?.id,
);

const selectedLabel = computed(() => {
    if (typeof props.options === "function") {
        return props.modelValue;
    } else if (selectedIndex.value === undefined) {
        return;
    }

    const option = props.options?.[selectedIndex.value];
    return typeof option === "string" ? option : option?.label;
});

const checkValidity = () => {
    if (
        props.disabled ||
        !props.required ||
        (typeof props.options === "function" && selectedIndex.value !== undefined)
    ) {
        return true;
    }

    let value: unknown;

    if (typeof props.options !== "function" && selectedIndex.value !== undefined) {
        const option = props.options?.[selectedIndex.value];
        value = typeof option === "string" ? option : option?.value;
    }

    validationMessage.value = props.required && !value ? "Missing value" : "";

    return !validationMessage.value;
};

const focus = () => {
    labelComponent.value?.$el.focus();
};

const onKeydown = (ev: KeyboardEvent) => {
    onDropdownKeydown(ev, activeIndex, selectOption, options.value.length);

    if (ev.code === "Escape" && dropdownVisibility.value) {
        ev.preventDefault();
        toggleDropdown(false);
        nextTick(() => focus());
    }
};

const onPointer = (ev: MouseEvent) => onDropdownMouse(ev, activeIndex, selectOption);

const reportValidity = () => {
    reportInvalid.value = true;
    return checkValidity();
};

const reset = () => {
    reportInvalid.value = false;
    validationMessage.value = "";
    // eslint-disable-next-line unicorn/no-useless-undefined
    emit("update:modelValue", undefined);
};

const selectOption = (index: number) => {
    const option = options.value?.[index];
    if (option) {
        emit("update:modelValue", typeof option === "string" ? option : option.value);
    } else {
        emit("update:modelValue", inputElement.value?.value ?? "");
    }

    toggleDropdown(false);

    nextTick(() => focus());
};

const toggleDropdown = async (state = !dropdownVisibility.value) => {
    dropdownComponent.value?.toggle(state);
    dropdownVisibility.value = state;

    if (state) {
        filter.value = "";
        nextTick(() => inputElement.value?.focus());

        if (typeof props.options === "function") {
            pending.value = true;
            options.value = await props.options();
            pending.value = false;

            updateSelection();
        } else {
            options.value = props.options;
        }
    } else {
        if (typeof props.options === "function") {
            options.value = [];
        }
    }
};

const updateDebounce = debounce(async () => {
    if (typeof props.options === "function") {
        pending.value = true;
        options.value = await props.options(filter.value);
        pending.value = false;
    } else {
        options.value = filter.value
            ? props.options.filter(v =>
                  (typeof v === "string" ? v : v.label)
                      .toLowerCase()
                      .includes(filter.value.toLowerCase()),
              )
            : props.options;
    }

    activeIndex.value = 0;
}, 200);

const updateSelection = (value = props.modelValue) => {
    selectedIndex.value = options.value.findIndex(
        v => (typeof v === "string" ? v : v.value) === value,
    );
};

watch(
    () => props.modelValue,
    to => {
        if (typeof props.options !== "function") {
            updateSelection(to);
        }

        if (reportInvalid.value) {
            nextTick(() => checkValidity());
        }
    },
);

watch(
    () => props.options,
    to => {
        const isAsync = typeof to === "function";

        if (!isAsync) {
            // Measure text for each option to ensure the select width fits the longest label
            const ctx = document.createElement("canvas").getContext("2d");
            if (ctx) {
                const style = getComputedStyle(document.body);
                ctx.font = `${style.fontSize} ${style.fontFamily}`;
                fitWidth.value = `${Math.max(
                    ...to.map(v => ctx.measureText(typeof v === "string" ? v : v.label).width),
                )}px`;
            }

            options.value = to;
            updateSelection();
        } else {
            // Ensure select won't grow past its initial size given that labels received
            // asynchronously might be larger
            nextTick(() => {
                fitWidth.value = labelComponent.value
                    ? `${labelComponent.value.$el.clientWidth}px`
                    : undefined;
            });

            options.value = [];
        }
    },
    {immediate: true},
);

defineExpose({checkValidity, focus, reportValidity});
</script>

<style lang="scss" scoped>
@import "../input/mixins";

.b-select {
    --fit-width: 0px;

    @include input;

    &:not(.fixed) {
        input,
        .b-label {
            min-width: calc(2 * var(--input-padding) + var(--input-icon-size) + var(--fit-width));
        }
    }

    &.fixed {
        max-width: var(--fit-width);

        .b-label {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .b-label {
        border-radius: inherit;
        display: inline-block;
        flex-grow: 1;
        padding: 0 var(--input-icon-size) 0 var(--input-padding);
        user-select: none;

        &.placeholder {
            color: rgba(var(--color-rgb), var(--placeholder-opacity));
        }
    }

    &.has-help .b-label {
        padding-right: calc(1rem + var(--input-padding) + var(--input-icon-size));
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
            + .b-label {
                padding-left: var(--input-icon-size);
            }
        }
    }

    input {
        padding-left: var(--input-padding);
    }

    .help,
    .invalid {
        right: var(--input-icon-size);
        width: 1rem;
    }

    .arrows {
        right: 0;

        .b-icon {
            height: 1.1rem;
            width: 1.1rem;
        }
    }

    .b-dropdown {
        .b-spinner {
            --spinner-background: var(--dropdown-input-background);

            height: var(--button-size);
            justify-content: flex-start;
            padding: 0 0.65rem;
        }
    }
}
</style>
