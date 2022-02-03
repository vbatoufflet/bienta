<template>
    <nav v-if="pages > 1" :id="id" :aria-label="label" class="b-pagination">
        <b-button
            :disabled="modelValue === 1"
            icon-name="chevron-left"
            @click="switchPage(modelValue - 1)"
        />

        <b-button
            v-for="(item, index) in items"
            :key="index"
            :aria-current="item === modelValue ? true : undefined"
            :aria-label="item"
            :color="item === modelValue ? 'primary' : undefined"
            :disabled="item === null"
            @click="item !== null && switchPage(item)"
        >
            {{ item !== null ? item : "…" }}
        </b-button>

        <b-button
            :disabled="modelValue === pages"
            icon-name="chevron-right"
            @click="switchPage(modelValue + 1)"
        />
    </nav>
</template>

<script lang="ts">
import {computed} from "vue";

import bButton from "~src/components/button/button.vue";
import {generateID} from "~src/components/common";

type PageItem = number | null;

export default {
    name: "b-pagination",
    components: {
        bButton,
    },
};
</script>

<script lang="ts" setup>
const props = defineProps({
    adjacency: {
        default: 1,
        type: Number,
    },
    label: {
        default: undefined,
        type: String,
    },
    modelValue: {
        required: true,
        type: Number,
    },
    pages: {
        required: true,
        type: Number,
    },
});

const emit = defineEmits<{
    (ev: "update:modelValue", value: number): void;
}>();

const id = generateID("pagination");

const items = computed<PageItem[]>(() => {
    const total = props.adjacency + 5;
    if (props.pages <= total) {
        return range(1, props.pages);
    }

    const leftSibling = Math.max(props.modelValue - props.adjacency, 1);
    const leftEllipsis = leftSibling > 2;
    const rightSibling = Math.min(props.modelValue + props.adjacency, props.pages);
    const rightEllipsis = rightSibling < props.pages - 2;

    if (!leftEllipsis && rightEllipsis) {
        return [...range(1, 3 + 2 * props.adjacency), null, props.pages];
    }

    if (leftEllipsis && !rightEllipsis) {
        return [1, null, ...range(props.pages - (3 + 2 * props.adjacency) + 1, props.pages)];
    }

    return [1, null, ...range(leftSibling, rightSibling), null, props.pages];
});

const range = (start: number, end: number): PageItem[] => {
    return Array.from({length: end - start + 1}, (_, idx) => start + idx);
};

const switchPage = (page: number) => {
    emit("update:modelValue", page);
};

defineExpose({switchPage});
</script>

<style lang="scss" scoped>
.b-pagination {
    align-items: center;
    display: flex;
    gap: 0.75rem;
    justify-content: center;
}
</style>
