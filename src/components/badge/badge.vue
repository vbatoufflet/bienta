<template>
    <div :id="id" class="b-badge" :data-color="color" role="note">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import {PropType} from "vue";

import {generateID} from "~src/components/common";
import {BadgeColor} from "~types";

export default {
    name: "b-badge",
};
</script>

<script lang="ts" setup>
defineProps({
    color: {
        default: undefined,
        type: String as PropType<BadgeColor>,
    },
});

const id = generateID("badge");
</script>

<style lang="scss" scoped>
.b-badge {
    background-color: var(--color);
    border-radius: 1.25rem;
    color: var(--background);
    font-size: 0.8rem;
    height: 1.25rem;
    line-height: 1.25rem;
    min-width: 1.25rem;
    padding: 0 0.5rem;
    text-align: center;

    &[data-color] {
        color: white;
    }

    &[data-color="danger"] {
        background-color: var(--red);
    }

    &[data-color="info"] {
        background-color: var(--blue);
    }

    &[data-color="success"] {
        background-color: var(--green);
    }

    &[data-color="warning"] {
        background-color: var(--yellow);
    }
}
</style>
