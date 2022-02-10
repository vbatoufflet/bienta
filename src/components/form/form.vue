<template>
    <form
        :id="id"
        ref="baseElement"
        class="b-form"
        novalidate
        @reset="onReset"
        @submit.prevent="onSubmit"
    >
        <slot></slot>
    </form>
</template>

<script lang="ts">
import {nextTick, ref} from "vue";

import {generateID} from "~src/components/common";

export default {
    name: "b-form",
};
</script>

<script lang="ts" setup>
const emit = defineEmits<{
    (ev: "submit"): void;
}>();

const id = generateID("form");

const baseElement = ref<HTMLFormElement>();

const onReset = () => {
    const resetEv = new CustomEvent("reset");
    baseElement.value?.querySelectorAll("[data-validity]").forEach(el => el.dispatchEvent(resetEv));
};

const onSubmit = (ev: Event) => {
    ev.stopImmediatePropagation();

    const reportEv = new CustomEvent("report-validity");

    baseElement.value
        ?.querySelectorAll("[data-validity]")
        .forEach(el => el.dispatchEvent(reportEv));

    nextTick(() => {
        if (
            baseElement.value?.checkValidity() &&
            baseElement.value?.querySelector('[aria-invalid="true"]') === null
        ) {
            emit("submit");
        }
    });
};

const reset = () => baseElement.value?.reset();

const submit = () => baseElement.value?.submit();

defineExpose({reset, submit});
</script>
