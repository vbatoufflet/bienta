<template>
    <div :id="id" class="b-radiogroup" role="radiogroup" @autofocus="focus">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import {generateID} from "~src/components/common";

export default {
    name: "b-radiogroup",
};
</script>

<script lang="ts" setup>
const id = generateID("radiogroup");
</script>
