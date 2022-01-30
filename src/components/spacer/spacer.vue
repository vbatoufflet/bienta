<template>
    <div :id="id" class="b-spacer"></div>
</template>

<script lang="ts">
import {generateID} from "~src/components/common";

export default {
    name: "b-spacer",
};
</script>

<script lang="ts" setup>
const id = generateID("spacer");
</script>

<style lang="scss" scoped>
.b-spacer {
    flex-grow: 1;
}
</style>
