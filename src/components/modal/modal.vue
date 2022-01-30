<template>
    <div
        :id="id"
        ref="baseElement"
        class="b-modal"
        tabindex="-1"
        @click="close()"
        @keydown.esc.prevent="close()"
        @keydown.tab="onTab"
    >
        <dialog open @click.stop>
            <slot></slot>
        </dialog>
    </div>
</template>

<script lang="ts">
import {nextTick, onMounted, ref} from "vue";

import {generateID} from "~src/components/common";

import {closeModal} from ".";

export default {
    name: "b-modal",
};
</script>

<script lang="ts" setup>
const id = generateID("modal");

const baseElement = ref<HTMLElement>();

const focus = () => baseElement.value?.focus();

const close = () => closeModal("dismissed", true);

const onTab = (ev: KeyboardEvent) => {
    const focusable = baseElement.value?.querySelectorAll<HTMLElement>(
        'input, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (!focusable) {
        return;
    }

    let idx: number | undefined;
    if (!ev.shiftKey && ev.target === focusable[focusable.length - 1]) {
        idx = 0;
    } else if (ev.shiftKey && ev.target === focusable[0]) {
        idx = focusable.length - 1;
    }

    if (idx !== undefined) {
        ev.preventDefault();
        nextTick(() => focusable[idx as number].focus());
    }
};

onMounted(() => {
    if (baseElement.value?.querySelector('[data-autofocus="true"]') === null) {
        focus();
    }
});
</script>

<style lang="scss" scoped>
.b-modal {
    align-items: flex-start;
    background-color: var(--modal-background);
    display: flex;
    inset: 0;
    justify-content: center;
    position: fixed;
    z-index: 500;

    dialog {
        background-color: var(--background);
        border: none;
        border-radius: 0.35rem;
        box-shadow: 0 0.5rem 2rem var(--modal-dialog-shadow);
        color: inherit;
        margin: 10vh 0;
        padding: var(--modal-dialog-padding);
        position: relative;
    }
}
</style>
