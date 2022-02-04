<template>
    <div :id="id" class="b-list">
        <div v-for="(item, index) in modelValue" :key="index" class="b-list-item">
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
import {PropType, computed, unref} from "vue";

import {generateID} from "~src/components/common";

export default {
    name: "b-list",
};
</script>

<script lang="ts" setup>
const props = defineProps({
    selectable: {
        default: false,
        type: Boolean,
    },
    selection: {
        default: () => [],
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

const id = generateID("list");

let selectionLast: number | undefined;

const selectionState = computed(() => {
    if (!props.selectable) {
        return {};
    }

    const hashes = new Set(props.selection.map((value: unknown) => hash(value)));

    return props.modelValue.reduce<Record<number, boolean>>((out, v, idx) => {
        out[idx] = hashes.has(hash(v));
        return out;
    }, {});
});

const hash = (input: unknown): string => {
    return xxHash32(JSON.stringify(input), 0).toString(16);
};

const select = (index: number, shiftKey = false) => {
    const state = unref(selectionState);

    if (shiftKey && selectionLast !== undefined) {
        const [start, end] = [selectionLast, index].sort((a, b) => a - b);
        for (let i: number = start; i <= end; i++) {
            state[i] = state[selectionLast];
        }
    }

    emit(
        "update:selection",
        props.modelValue.filter((_v, idx) => state[idx]),
    );

    selectionLast = index;
};

const selectAll = (state = true) => {
    if (props.selectable) {
        emit("update:selection", state ? props.modelValue : []);
    }
};

defineExpose({selectAll});
</script>

<style lang="scss">
.b-list {
    margin: var(--main-block-margin) 0;

    .b-list-item {
        align-items: center;
        border-bottom: 1px solid var(--list-border);
        border-top: 1px solid var(--list-border);
        display: flex;
        padding: var(--list-padding);

        + .b-list-item {
            border-top: none;
        }

        .b-checkbox {
            user-select: none;
            margin-right: var(--list-padding);
        }
    }
}
</style>
