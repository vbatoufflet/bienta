<template>
    <div :id="id" :aria-orientation="orientation" class="b-separator" role="separator"></div>
</template>

<script lang="ts">
import {PropType} from "vue";

import {generateID} from "~src/components/common";
import {SeparatorOrientation} from "~types";

export default {
    name: "b-separator",
};
</script>

<script lang="ts" setup>
defineProps({
    orientation: {
        required: true,
        type: String as PropType<SeparatorOrientation>,
    },
});

const id = generateID("separator");
</script>

<style lang="scss" scoped>
.b-separator {
    background-color: var(--separator-background);

    &[aria-orientation="horizontal"] {
        height: 1px;
        width: 100%;
    }

    &[aria-orientation="vertical"] {
        height: 100%;
        width: 1px;
    }
}
</style>
