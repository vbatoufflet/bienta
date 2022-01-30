<template>
    <div
        :id="id"
        ref="baseElement"
        :aria-disabled="disabled || undefined"
        :aria-invalid="(reportInvalid && Boolean(validationMessage)) || undefined"
        :aria-readonly="readonly || undefined"
        class="b-color"
        :class="{dragging, 'has-help': help || (reportInvalid && Boolean(validationMessage))}"
        :data-label="label ?? placeholder"
        :data-validity="true"
        @autofocus="focus()"
        @focusout="reportValidity()"
        @reportValidity="reportValidity()"
        @reset="reset()"
        @shortcut="!disabled && focus(true)"
    >
        <div
            class="paint"
            :class="{empty: !normalized || Boolean(validationMessage)}"
            :style="normalized ? `--color-paint-background: ${normalizedColor}` : undefined"
            @click="toggleDropdown()"
        >
            <b-icon-picker />
        </div>

        <input
            ref="inputElement"
            v-model="color"
            :aria-expanded="dropdownVisibility"
            aria-haspopup="true"
            :aria-label="label ?? placeholder"
            autocapitalize="off"
            :disabled="disabled"
            :placeholder="placeholder"
            :readonly="readonly"
            @focusout="onFocusout"
            @keydown="onKeydown"
        />

        <span
            v-if="reportInvalid && validationMessage"
            v-tooltip="validationMessage"
            class="invalid"
        ></span>

        <span v-else-if="help" v-tooltip="help" class="help"></span>

        <b-dropdown
            ref="dropdownComponent"
            :style="`--hue-color: ${hueColor}`"
            @click.stop="onClick"
            @focusout="onFocusout"
            @pointerdown="onPointer"
        >
            <div ref="saturationElement" class="saturation" data-key="saturation">
                <div
                    v-show="normalizedColor"
                    class="cursor"
                    :style="{left: `${saturationCursor.x}px`, top: `${saturationCursor.y}px`}"
                    tabindex="0"
                    @keydown="onKeydown"
                ></div>
            </div>

            <div
                v-if="alpha"
                ref="alphaElement"
                aria-orientation="vertical"
                class="alpha"
                data-key="alpha"
                role="slider"
            >
                <div
                    class="cursor"
                    :style="{top: `${alphaCursor.y}px`}"
                    tabindex="0"
                    @keydown="onKeydown"
                >
                    <div class="tooltip">{{ Math.round((data.a * 100) / 255) }}</div>
                </div>
            </div>

            <div
                ref="hueElement"
                aria-orientation="vertical"
                class="hue"
                data-key="hue"
                role="slider"
            >
                <div
                    class="cursor"
                    :style="{top: `${hueCursor.y}px`}"
                    tabindex="0"
                    @keydown="onKeydown"
                >
                    <div class="tooltip">{{ data.h }}</div>
                </div>
            </div>
        </b-dropdown>
    </div>
</template>

<script lang="ts">
import {hex, hsv} from "color-convert";
import {PropType, computed, nextTick, ref, watch} from "vue";

import {generateID} from "~src/components/common";
import bDropdown from "~src/components/dropdown/dropdown.vue";
import bIconPicker from "~src/components/icon/internal/picker.vue";
import {touchOnly} from "~src/helpers";
import {ColorCase, DropdownPublicInstance} from "~types";

interface Data {
    h: number;
    s: number;
    v: number;
    a: number;
}

const keys = ["alpha", "hue", "saturation"] as const;

type Key = typeof keys[number];

const colorRegExp = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export default {
    name: "b-color",
    components: {
        bDropdown,
        bIconPicker,
    },
};
</script>

<script lang="ts" setup>
const props = defineProps({
    alpha: {
        default: false,
        type: Boolean,
    },
    case: {
        default: "lower",
        type: String as PropType<ColorCase>,
    },
    disabled: {
        default: false,
        type: Boolean,
    },
    help: {
        default: undefined,
        type: String,
    },
    label: {
        default: undefined,
        type: String,
    },
    modelValue: {
        required: true,
        type: [String],
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
});

const emit = defineEmits<{
    (ev: "update:modelValue", value: number | string): void;
}>();

const id = generateID("color");

const alphaElement = ref<HTMLElement>();
const baseElement = ref<HTMLElement>();
const color = ref("");
const data = ref<Data>({h: 0, s: 100, v: 100, a: 255});
const dragging = ref<Key>();
const dropdownComponent = ref<DropdownPublicInstance>();
const dropdownVisibility = ref(false);
const hueElement = ref<HTMLElement>();
const inputElement = ref<HTMLInputElement>();
const normalized = ref(false);
const rect = ref<Record<typeof keys[number], DOMRect | undefined>>();
const reportInvalid = ref(false);
const saturationElement = ref<HTMLElement>();
const validationMessage = ref("");

const alphaCursor = computed(() =>
    rect.value?.alpha
        ? {y: rect.value.alpha.height - (data.value.a * rect.value.alpha.height) / 255}
        : {y: 0},
);

const hueColor = computed(() => `#${hsv.hex([data.value.h, 100, 100])}`);

const hueCursor = computed(() =>
    rect.value?.hue
        ? {y: rect.value.hue.height - (data.value.h * rect.value.hue.height) / 360}
        : {y: 0},
);

const normalizedColor = computed(() => normalizeValue(color.value));

const saturationCursor = computed(() =>
    rect.value?.saturation
        ? {
              x: (data.value.s * rect.value.saturation.width) / 100,
              y: rect.value.saturation.height - (data.value.v * rect.value.saturation.height) / 100,
          }
        : {
              x: 0,
              y: 0,
          },
);

const checkValidity = () => {
    if (props.disabled || props.readonly) {
        return true;
    }

    if (!inputElement.value?.value && props.required) {
        validationMessage.value = "Missing value";
    } else if (inputElement.value && !colorRegExp.test(inputElement.value.value)) {
        validationMessage.value = "Invalid color";
    } else {
        validationMessage.value = "";
    }

    return !validationMessage.value;
};

const emitFromData = () => {
    let value = `#${hsv.hex([data.value.h, data.value.s, data.value.v])}`;
    if (props.alpha) {
        value += data.value.a.toString(16).padStart(2, "0");
    }

    emit("update:modelValue", value[props.case === "lower" ? "toLowerCase" : "toUpperCase"]());
};

const focus = (select = false) => {
    inputElement.value?.[select ? "select" : "focus"]();
};

const isKey = (value: unknown): value is Key => {
    return keys.includes(value as Key);
};

const normalizeValue = (input: string) => {
    const matches = colorRegExp.exec(input);
    if (!matches?.[1]) {
        normalized.value = false;
        return input;
    }

    normalized.value = true;

    if (input.startsWith("#")) {
        input = input.slice(1);
    }

    input = input[props.case === "lower" ? "toLowerCase" : "toUpperCase"]();

    if (props.alpha) {
        switch (input.length) {
            case 3:
                return `#${input[0].repeat(2) + input[1].repeat(2) + input[2].repeat(2)}ff`;
            case 4:
                return `#${
                    input[0].repeat(2) +
                    input[1].repeat(2) +
                    input[2].repeat(2) +
                    input[3].repeat(2)
                }`;
            case 6:
                return `#${input}ff`;
        }
    } else {
        switch (input.length) {
            case 3:
            case 4:
                return `#${input[0].repeat(2)}${input[1].repeat(2)}${input[2].repeat(2)}`;
            case 8:
                return `#${input.slice(0, 6)}`;
        }
    }

    return `#${input}`;
};

const onClick = (ev: MouseEvent) => {
    const key = (ev.target as HTMLElement | null)?.dataset.key;
    if (isKey(key)) {
        select(ev, key);
    }
};

const onPointer = (ev: PointerEvent) => {
    switch (ev.type) {
        case "pointerdown": {
            const target = ev.target as HTMLElement | null;
            if (!target?.classList.contains("cursor")) {
                target?.querySelector<HTMLElement>(".cursor")?.focus();
                ev.preventDefault();
            }

            const key = target?.closest<HTMLElement>("[data-key]")?.dataset.key;
            if (!isKey(key)) {
                return;
            }

            rect.value = {
                alpha: alphaElement.value?.getBoundingClientRect(),
                hue: hueElement.value?.getBoundingClientRect(),
                saturation: saturationElement.value?.getBoundingClientRect(),
            };

            document.addEventListener("pointermove", onPointer);
            document.addEventListener("pointerup", onPointer);
            dragging.value = key;

            break;
        }
        case "pointerup": {
            document.removeEventListener("pointermove", onPointer);
            document.removeEventListener("pointerup", onPointer);
            dragging.value = undefined;

            break;
        }
        case "pointermove": {
            if (dragging.value) {
                select(ev, dragging.value);
            }

            break;
        }
    }
};

const onFocusout = (ev: FocusEvent) => {
    if (ev.relatedTarget === null || !baseElement.value?.contains(ev.relatedTarget as Node)) {
        toggleDropdown(false);
        emit("update:modelValue", color.value ? normalizeValue(color.value) : "");
        reportValidity();
    }
};

const onKeydown = (ev: KeyboardEvent) => {
    const target = ev.target as HTMLElement | null;
    if (!target) {
        return;
    }

    switch (ev.code) {
        case "ArrowDown":
        case "ArrowUp": {
            const key = target.closest<HTMLElement>("[data-key]")?.dataset.key;
            if (!key) {
                break;
            }

            ev.preventDefault();

            const step = ev.code === "ArrowUp" ? 1 : -1;

            switch (key) {
                case "saturation":
                    data.value.v = Math.min(Math.max(data.value.v + step, 0), 100);
                    break;
                case "alpha":
                    data.value.a = Math.min(Math.max(data.value.a + step, 0), 255);
                    break;
                case "hue": {
                    data.value.h = Math.min(Math.max(data.value.h + step, 0), 360);
                    break;
                }
            }

            emitFromData();

            break;
        }
        case "ArrowLeft":
        case "ArrowRight": {
            const key = target.closest<HTMLElement>("[data-key]")?.dataset.key;
            if (!key) {
                break;
            }

            ev.preventDefault();

            data.value.s = Math.min(
                Math.max(data.value.s + (ev.code === "ArrowRight" ? 1 : -1), 0),
                100,
            );

            emitFromData();

            break;
        }
        case "Enter": {
            if (color.value === normalizedColor.value) {
                toggleDropdown();
            }
            emit("update:modelValue", color.value ? normalizeValue(color.value) : "");
            ev.stopPropagation();

            if (target.classList.contains("cursor")) {
                focus();
            }

            break;
        }
        case "Escape": {
            if (dropdownComponent.value?.isActive()) {
                toggleDropdown(false);
                ev.preventDefault();
                ev.stopPropagation();

                if (target.classList.contains("cursor")) {
                    focus();
                }
            }

            break;
        }
    }
};

const reportValidity = () => {
    reportInvalid.value = true;
    return checkValidity();
};

const reset = () => {
    reportInvalid.value = false;
    validationMessage.value = "";
    emit("update:modelValue", "");
};

const select = (ev: MouseEvent | PointerEvent, key: Key) => {
    if (key === "alpha" && rect.value?.alpha) {
        const {y, height} = rect.value.alpha;

        data.value.a = Math.round(
            255 -
                ((ev.pageY < y ? 0 : ev.pageY > y + height ? height : ev.pageY - y) * 255) / height,
        );
    } else if (key === "hue" && rect.value?.hue) {
        const {y, height} = rect.value.hue;

        data.value.h = Math.round(
            360 -
                ((ev.pageY < y ? 0 : ev.pageY > y + height ? height : ev.pageY - y) * 360) / height,
        );
    } else if (key === "saturation" && rect.value?.saturation) {
        const {x, y, width, height} = rect.value.saturation;

        Object.assign(data.value, {
            s: ((ev.pageX < x ? 0 : ev.pageX > x + width ? width : ev.pageX - x) * 100) / width,
            v:
                100 -
                ((ev.pageY < y ? 0 : ev.pageY > y + height ? height : ev.pageY - y) * 100) / height,
        });
    } else {
        return;
    }

    emitFromData();
};

const toggleDropdown = (state = !dropdownVisibility.value) => {
    dropdownComponent.value?.toggle(state);
    dropdownVisibility.value = state;

    if (state) {
        nextTick(() => {
            rect.value = {
                alpha: alphaElement.value?.getBoundingClientRect(),
                hue: hueElement.value?.getBoundingClientRect(),
                saturation: saturationElement.value?.getBoundingClientRect(),
            };
        });

        if (touchOnly()) {
            nextTick(() =>
                dropdownComponent.value?.$el.querySelector<HTMLElement>('[tabindex="0"]')?.focus(),
            );
        } else {
            focus();
        }
    }
};

watch(
    () => props.modelValue,
    to => {
        try {
            color.value = normalizeValue(to);
            [data.value.h, data.value.s, data.value.v] = hex.hsv(color.value);
            if (props.alpha) {
                data.value.a = Number.parseInt(color.value.slice(-2), 16);
            }
        } catch {
            color.value = "";
            data.value = {h: 0, s: 100, v: 100, a: 255};
        }

        if (reportInvalid.value) {
            nextTick(() => checkValidity());
        }
    },
    {immediate: true},
);

defineExpose({checkValidity, focus, reportValidity});
</script>

<style lang="scss" scoped>
@import "../../directives/tooltip/mixins";
@import "../../style/mixins";
@import "../input/mixins";

.b-color {
    @include input;

    .paint {
        background-color: var(--color-paint-background);
        align-items: center;
        border-radius: 0.2rem;
        cursor: pointer;
        display: flex;
        height: 1.25rem;
        justify-content: center;
        left: 0.75rem;
        position: absolute;
        width: 1.75rem;

        &.empty {
            border: 1px dashed var(--color-paint-border);

            .b-icon {
                display: unset;
            }
        }

        .b-icon {
            display: none;
            height: 1.35rem;
            width: 1.35rem;
        }
    }

    &[aria-readonly="true"] .paint {
        pointer-events: none;
    }

    &.has-help input {
        padding-right: var(--input-icon-size);
    }

    .help,
    .invalid {
        height: var(--input-icon-size);
        position: absolute;
        width: var(--input-icon-size);
    }

    input {
        padding-left: 3.25rem;

        &:focus {
            box-shadow: none;
        }
    }

    .help,
    .invalid {
        height: 1rem;
        right: 0;
        top: 0.75rem;
    }

    &.dragging {
        input {
            caret-color: transparent;
        }

        .cursor {
            pointer-events: none;
        }
    }

    .b-dropdown {
        flex-direction: row;
        gap: 0.65rem;
        height: 12rem;
        padding: 0.65rem;
        width: 16rem;

        &[data-anchor^="bottom"] {
            transform: translateY(0.15rem);
        }

        &[data-anchor^="top"] {
            transform: translateY(-0.15rem);
        }

        .cursor {
            border: 0.2rem solid rgba(255, 255, 255, 0.75);
            border-radius: 100%;
            filter: drop-shadow(0 0 0.15rem var(--dropdown-shadow));
            height: 1rem;
            position: absolute;
            width: 1rem;
            z-index: 1;

            @include focus-style(":focus");
            --focus-style-radius: 100%;
            --focus-style-inset: -0.35rem;

            &:active,
            &:focus,
            &:hover {
                .tooltip {
                    visibility: visible;
                }
            }
        }

        .tooltip {
            @include tooltip;

            line-height: normal;
            position: absolute;
            right: 100%;
            top: 50%;
            transform: translate(-0.65rem, -50%);

            &::before {
                border-left-color: var(--tooltip-background);
                left: calc(100% + var(--tooltip-padding));
            }
        }

        .saturation {
            background-color: var(--hue-color);
            border-radius: 0.2rem;
            flex-grow: 1;
            position: relative;

            &::before,
            &::after {
                border-radius: inherit;
                content: "";
                position: absolute;
                width: 100%;
                height: 100%;
            }

            &::before {
                background-image: linear-gradient(to right, white, transparent);
            }

            &::after {
                background-image: linear-gradient(to top, black, transparent);
            }

            .cursor {
                transform: translate(-0.5rem, -0.5rem);
            }
        }

        .alpha,
        .hue {
            border-radius: 0.2rem;
            position: relative;
            width: 1rem;

            .cursor {
                transform: translateY(-0.5rem);
            }
        }

        .alpha {
            &::before {
                background-color: var(--dropdown-input-background);
                border-radius: inherit;
                content: "";
                height: 100%;
                mask-image: url('data:image/svg+xml,<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" width="5" height="5" fill="currentColor"/><rect y="5" width="5" height="5" fill="currentColor"/></svg>');
                position: absolute;
                width: 100%;
                z-index: -1;
            }

            background-image: linear-gradient(to bottom, var(--hue-color), transparent);
        }

        .hue {
            background-image: linear-gradient(to top, red, yellow, green, cyan, blue, magenta, red);
        }
    }
}
</style>
