<!-- eslint-disable vue/no-v-html -->
<template>
    <div :id="id" class="b-markdown" v-html="html"></div>
</template>

<script lang="ts">
import DOMPurify from "dompurify";
import {marked} from "marked";
import {computed} from "vue";

import {generateID} from "~src/components/common";

export default {
    name: "b-markdown",
};
</script>

<script lang="ts" setup>
const props = defineProps({
    content: {
        required: true,
        type: String,
    },
});

const id = generateID("markdown");

const html = computed(() => DOMPurify.sanitize(marked(props.content.trim())));
</script>
