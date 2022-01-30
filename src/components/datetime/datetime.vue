<template>
    <div
        :id="id"
        ref="baseElement"
        :aria-disabled="disabled || undefined"
        :aria-invalid="invalid || undefined"
        :aria-readonly="readonly || undefined"
        class="b-datetime"
        :class="{empty: !modelValue}"
        :data-label="label"
        :data-type="type"
        :tabindex="!disabled ? 0 : undefined"
        @autofocus="focus()"
        @copy="copy()"
        @keydown="!disabled && !readonly && onKeydown($event)"
        @paste.prevent="!disabled && !readonly && paste($event)"
        @shortcut="!disabled && focus()"
    >
        <b-icon
            v-if="iconName !== undefined"
            :badge="iconBadge"
            :flip="iconFlip"
            :name="iconName"
        />

        <template v-for="(part, index) in parts">
            <span v-if="part.type === 'literal'" :key="`literal-${index}`" class="literal">
                {{ formatPart(part) }}
            </span>

            <span
                v-else
                :key="`value-${index}`"
                class="value"
                :class="{focus: index === selectedIndex}"
                :data-type="part.type"
                @mousedown="!disabled && !readonly && setSelection(index)"
            >
                {{ formatPart(part) }}
            </span>
        </template>

        <input ref="inputElement" type="hidden" :value="modelValue" />
    </div>
</template>

<script lang="ts">
import {debounce} from "debounce";
import {PropType, computed, ref, watch} from "vue";

import {generateID} from "~src/components/common";
import {DatetimeType, IconFlip} from "~types";

const numberTypes = ["day", "hour", "minute", "month", "second", "year"] as const;

type NumberType = typeof numberTypes[number];

function isNumberType(value: unknown): value is NumberType {
    return numberTypes.includes(value as NumberType);
}

type Data = Record<NumberType, number> & {
    dayPeriod?: "AM" | "PM";
};

type Part =
    | {type: "dayPeriod"}
    | {type: "literal"; value: string}
    | {type: NumberType; length: 2 | 4};

export default {
    name: "b-datetime",
};
</script>

<script lang="ts" setup>
const props = defineProps({
    disabled: {
        default: false,
        type: Boolean,
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
    locale: {
        default: undefined,
        type: String,
    },
    modelValue: {
        required: true,
        type: String,
    },
    readonly: {
        default: false,
        type: Boolean,
    },
    type: {
        default: "datetime",
        type: String as PropType<DatetimeType>,
    },
    utc: {
        default: false,
        type: Boolean,
    },
});

const emit = defineEmits<{
    (ev: "update:modelValue", value: string): void;
}>();

const id = generateID("datetime");

const boundaries: {
    [key: string]: {min: number; max: number | undefined};
} = {
    hour12: {min: 1, max: 12},
    hour24: {min: 0, max: 23},
    minute: {min: 0, max: 59},
    month: {min: 1, max: 12},
    second: {min: 0, max: 59},
    year: {min: 0, max: undefined},
};

let typeLength = 0;

const baseElement = ref<HTMLElement>();
const data = ref<Data>({year: 0, month: 1, day: 1, hour: 0, minute: 0, second: 0});
const inputElement = ref<HTMLInputElement>();
const invalid = ref(false);
const parts = ref<Part[]>([]);
const selectedIndex = ref<number>();

const dayMax = computed(() => new Date(data.value.year, data.value.month, 0).getDate());

const applyData = (type: NumberType, value: number, useZero = false) => {
    let boundary: {min: number; max: number | undefined};
    if (type === "day") {
        boundary = {min: 1, max: dayMax.value};
    } else if (type === "hour") {
        boundary = data.value.dayPeriod ? boundaries.hour12 : boundaries.hour24;
    } else {
        boundary = boundaries[type];
    }

    data.value[type] = Math.min(
        Math.max(value, useZero ? 0 : boundary.min),
        boundary.max ?? Number.POSITIVE_INFINITY,
    );
};

const checkValidity = () => {
    reportValidity();
    return inputElement.value?.checkValidity() ?? false;
};

const copy = () => {
    navigator.clipboard.writeText(formatValue());
};

const emitValue = debounce((value: string) => {
    reportValidity();
    emit("update:modelValue", value);
}, 200);

const focus = () => baseElement.value?.focus();

const formatPart = (part: Part) => {
    if (part.type === "dayPeriod") {
        return data.value.dayPeriod;
    } else if (part.type === "literal") {
        return part.value;
    }

    return data.value[part.type].toString().padStart(part.length, "0");
};

const formatValue = (placeholder = false) => {
    let out = "";

    if (props.type.includes("date")) {
        out += [
            padNumber(data.value.year, 4),
            padNumber(data.value.month, 2),
            padNumber(data.value.day, 2),
        ].join("-");
    } else if (placeholder) {
        out += "0000-01-01";
    }

    if (props.type === "datetime" || placeholder) {
        out += "T";
    }

    if (props.type.includes("time")) {
        let hour = data.value.hour;
        if (hour === 12 && data.value.dayPeriod === "AM") {
            hour = 0;
        } else if (hour < 12 && data.value.dayPeriod === "PM") {
            hour += 12;
        }

        out += [
            padNumber(hour, 2),
            padNumber(data.value.minute, 2),
            padNumber(data.value.second, 2),
        ].join(":");
    } else if (placeholder) {
        out += "00:00:00";
    }

    return out;
};

const moveSelection = (step: -1 | 1) => {
    if (selectedIndex.value === undefined) {
        return;
    }

    if (step === -1) {
        const subParts = parts.value.slice(0, selectedIndex.value);
        const prev = subParts.reverse().findIndex(v => v.type !== "literal");
        if (prev !== -1) {
            selectedIndex.value = selectedIndex.value - prev - 1;
        }
    } else {
        const next = parts.value
            .slice(selectedIndex.value + 1)
            .findIndex(v => v.type !== "literal");

        if (next !== -1) {
            selectedIndex.value = selectedIndex.value + next + 1;
        }
    }
};

const onKeydown = (ev: KeyboardEvent) => {
    const index = selectedIndex.value;
    if (index === undefined) {
        return;
    }

    if (ev.code.startsWith("Digit")) {
        const part = parts.value[index];
        if (part.type !== "dayPeriod" && part.type !== "literal" && typeLength < part.length) {
            applyData(
                part.type,
                Number.parseInt(
                    typeLength === 0 ? ev.key : data.value[part.type].toString() + ev.key,
                    10,
                ),
                true,
            );

            typeLength++;
            if (typeLength === part.length) {
                moveSelection(1);
            }

            emitValue(formatValue());
        }
        return;
    }

    switch (ev.code) {
        case "ArrowLeft": {
            moveSelection(-1);
            break;
        }
        case "ArrowRight": {
            moveSelection(1);
            break;
        }
        case "ArrowUp":
        case "ArrowDown": {
            ev.preventDefault();

            const type = parts.value[index].type;

            if (type === "dayPeriod") {
                data.value.dayPeriod = data.value.dayPeriod === "AM" ? "PM" : "AM";
            } else if (type !== "literal") {
                applyData(type, data.value[type] + (ev.code === "ArrowDown" ? -1 : 1));
            }

            if (data.value.day === 0) {
                data.value.day = 1;
            }
            if (data.value.month === 0) {
                data.value.month = 1;
            }

            emitValue(formatValue());

            break;
        }
        case "Backspace": {
            data.value = placeholderData();
            emitValue("");
            break;
        }
    }
};

const padNumber = (value: number, length: number): string => {
    return value.toString().padStart(length, "0");
};

const reportValidity = () => {
    invalid.value = Boolean(props.modelValue) && Number.isNaN(Date.parse(formatValue(true)));
    inputElement.value?.setCustomValidity(invalid.value ? `invalid ${props.type}` : "");
};

const paste = (ev: ClipboardEvent) => {
    let value = ev.clipboardData?.getData("text");
    if (value) {
        updateData(value);
        emitValue(formatValue());
    }
};

const placeholderData = (): Data => {
    const date = new Date();
    return {
        day: date.getDate(),
        dayPeriod: data.value.dayPeriod ? "AM" : undefined,
        hour: data.value.dayPeriod ? 12 : 0,
        minute: 0,
        month: date.getMonth() + 1,
        second: 0,
        year: date.getFullYear(),
    };
};

const setSelection = (index: number) => {
    selectedIndex.value = index;
};

const updateData = (value: string) => {
    if (!value) {
        data.value = placeholderData();
        return;
    }

    if (props.type === "time") {
        value = `0000-01-01T${value}`;
    }

    const ms = Date.parse(value);
    if (Number.isNaN(ms)) {
        return;
    }

    const date = new Date(ms);

    let dayPeriod: "AM" | "PM" | undefined;
    let hour = props.utc ? date.getUTCHours() : date.getHours();
    if (data.value.dayPeriod) {
        if (hour === 0) {
            dayPeriod = "AM";
            hour = 12;
        } else if (hour === 12) {
            dayPeriod = "PM";
        } else if (hour > 12) {
            dayPeriod = "PM";
            hour -= 12;
        } else {
            dayPeriod = "AM";
        }
    }

    data.value = props.utc
        ? {
              day: date.getUTCDate(),
              dayPeriod,
              hour,
              minute: date.getUTCMinutes(),
              month: date.getUTCMonth() + 1,
              second: date.getUTCSeconds(),
              year: date.getUTCFullYear(),
          }
        : {
              day: date.getDate(),
              dayPeriod,
              hour,
              minute: date.getMinutes(),
              month: date.getMonth() + 1,
              second: date.getSeconds(),
              year: date.getFullYear(),
          };
};

watch(
    () => props.locale,
    to => {
        const opts: Intl.DateTimeFormatOptions = {};
        if (props.type === "date" || props.type === "datetime") {
            Object.assign(opts, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        }
        if (props.type === "time" || props.type === "datetime") {
            Object.assign(opts, {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
        }

        parts.value = new Intl.DateTimeFormat(to, opts)
            .formatToParts()
            .reduce<Part[]>((out, part) => {
                if (part.type === "dayPeriod") {
                    data.value.dayPeriod = "AM";
                    out.push({type: "dayPeriod"});
                } else if (part.type === "literal") {
                    out.push({type: "literal", value: part.value});
                } else if (isNumberType(part.type)) {
                    out.push({type: part.type, length: part.type === "year" ? 4 : 2});
                }
                return out;
            }, []);

        if (!props.disabled && !props.readonly) {
            selectedIndex.value = parts.value.findIndex(v => v.type !== "literal");
        }
    },
    {immediate: true},
);

watch(
    () => props.modelValue,
    to => updateData(to),
    {immediate: true},
);

watch(selectedIndex, () => {
    typeLength = 0;
});

defineExpose({checkValidity, focus});
</script>

<style lang="scss" scoped>
@import "../input/mixins";

.b-datetime {
    @include input;

    --input-min-width: auto;

    cursor: default;
    font-variant-numeric: tabular-nums;
    padding: 0 var(--input-padding);
    white-space: pre;

    &:focus .value.focus {
        background-color: var(--primary);
        color: white;
    }

    > .b-icon {
        height: var(--input-icon-size);
        left: 0;
        position: absolute;
        width: var(--input-icon-size);

        + span {
            margin-left: calc(var(--input-icon-size) - var(--input-padding));
        }
    }

    .value {
        border-radius: 0.2rem;
        line-height: 1.25rem;
        padding: 0 0.15rem;
        text-align: center;
    }

    &.empty span {
        color: rgba(var(--color-rgb), var(--placeholder-opacity));
    }
}
</style>
