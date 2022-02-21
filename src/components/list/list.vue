<template>
    <div :id="id" class="b-list">
        <b-toolbar v-if="hasHeading" class="b-list-heading">
            <b-checkbox
                v-if="selectable"
                v-model="selectionHeading"
                :partial="selectionPartial"
                @click.prevent="selectAll()"
            />

            <slot name="heading"></slot>
        </b-toolbar>

        <div
            v-for="(item, index) in modelValue"
            :key="index"
            class="b-list-item"
            :class="{selected: selectionState[index], ...itemClass?.(item)}"
        >
            <b-checkbox
                v-if="selectable"
                v-model="selectionState[index]"
                :value="item"
                @click.prevent="select(index, $event.shiftKey)"
            />

            <slot v-bind="{index, value: item}"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import {xxHash32} from "js-xxhash";
import {PropType, computed, onMounted, onUpdated, ref, unref, useSlots, watch} from "vue";

import {generateID} from "~src/components/common";

export default {
    name: "b-list",
};
</script>

<script lang="ts" setup>
const props = defineProps({
    itemClass: {
        default: undefined,
        type: Function as PropType<(item: unknown) => Record<string, unknown>>,
    },
    selection: {
        default: undefined,
        type: Array as PropType<unknown[]>,
    },
    modelValue: {
        required: true,
        type: Array as PropType<unknown[]>,
    },
});

const emit = defineEmits<{
    (ev: "update:selection", value: unknown[]): void;
}>();

const slots = useSlots();

const id = generateID("list");

const selectionHashes = new Map<string, unknown>();
let selectionLast: number | undefined;

const hasHeading = ref(false);
const selectionHeading = ref(false);
const selectionPartial = ref(false);

const selectable = computed(() => props.selection !== undefined);

const selectionState = computed(() => {
    if (props.selection === undefined) {
        return {};
    }

    return props.modelValue.reduce<Record<number, boolean>>((out, v, idx) => {
        out[idx] = selectionHashes.has(computeHash(v));
        return out;
    }, {});
});

const computeHash = (input: unknown): string => {
    return xxHash32(JSON.stringify(input), 0).toString(16);
};

const select = (index: number, shiftKey = false) => {
    if (props.selection === undefined) {
        return;
    }

    const state = unref(selectionState);

    if (shiftKey && selectionLast !== undefined) {
        const [start, end] = [selectionLast, index].sort((a, b) => a - b);
        for (let i: number = start; i <= end; i++) {
            state[i] = state[selectionLast];
        }
    }

    const set = new Set(props.selection);
    props.modelValue.forEach((v, idx) => {
        const hash = computeHash(v);
        if (state[idx]) {
            if (!selectionHashes.has(hash)) {
                set.add(v);
            }
        } else if (selectionHashes.has(hash)) {
            set.delete(selectionHashes.get(hash));
        }
    });
    emit("update:selection", [...set]);

    selectionLast = index;
};

const selectAll = () => {
    if (props.selection === undefined) {
        return;
    }

    const set = new Set(props.selection);

    props.modelValue.forEach(v => {
        const hash = computeHash(v);
        if (selectionHeading.value || selectionPartial.value) {
            if (!selectionHashes.has(hash)) {
                set.add(v);
            }
        } else if (selectionHashes.has(hash)) {
            set.delete(selectionHashes.get(hash));
        }
    });

    emit("update:selection", [...set]);
};

const refresh = () => {
    hasHeading.value = Boolean(slots.heading);
};

onMounted(refresh);

onUpdated(refresh);

watch(
    () => [props.modelValue, props.selection],
    to => {
        selectionHashes.clear();

        if (to[0] && to[1]) {
            to[1].forEach(v => selectionHashes.set(computeHash(v), v));

            const a = new Set(to[0].map(v => selectionHashes.has(computeHash(v))));
            selectionHeading.value = a.has(true);
            selectionPartial.value = a.has(false);
        }
    },
    {immediate: true},
);

defineExpose({selectAll});
</script>

<style lang="scss">
.b-list {
    margin: var(--main-block-margin) 0;

    .b-checkbox {
        user-select: none;
    }

    .b-toolbar {
        --toolbar-background: var(--list-toolbar-background);

        border-radius: 0.2rem;
        margin-bottom: 0.5rem;
        position: sticky;
        top: 0;
        z-index: 1;

        .b-checkbox {
            --button-padding: 0.5rem;
        }
    }

    .b-list-item {
        align-items: center;
        border-bottom: 1px solid var(--list-border);
        display: flex;
        gap: var(--list-padding);
        padding: var(--list-padding);

        &:last-child {
            border-bottom: none;
        }
    }
}
</style>
