<template>
    <div :id="id" class="b-list">
        <div v-for="(item, index) in modelValue" :key="index" class="b-list-item">
            <slot v-bind="{index, value: item}"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import {PropType} from "vue";

import {generateID} from "~src/components/common";

export default {
    name: "b-list",
};
</script>

<script lang="ts" setup>
defineProps({
    modelValue: {
        required: true,
        type: Array as PropType<unknown[]>,
    },
});

const id = generateID("list");
</script>

<style lang="scss">
.b-list {
    margin: var(--main-block-margin) 0;

    .b-list-item {
        border-bottom: 1px solid var(--list-border);
        border-top: 1px solid var(--list-border);
        padding: var(--list-padding);

        + .b-list-item {
            border-top: none;
        }
    }
}
</style>
