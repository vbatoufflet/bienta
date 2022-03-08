<template>
    <div :id="id" ref="baseElement" class="b-tablist">
        <div class="list" role="tablist"></div>

        <slot></slot>
    </div>
</template>

<script lang="ts">
import {nextTick, onMounted, onUpdated, ref} from "vue";

import {generateID} from "~src/components/common";
import {TabswitchEvent} from "~src/components/tab/tabpanel.vue";

export default {
    name: "b-tablist",
};
</script>

<script lang="ts" setup>
const props = defineProps({
    modelValue: {
        default: undefined,
        type: String,
    },
});

const emit = defineEmits<{
    (ev: "update:modelValue", value: string | undefined): void;
}>();

const id = generateID("tablist");

const baseElement = ref<HTMLElement>();

const switchTab = (name?: string) => {
    const ev = new CustomEvent<TabswitchEvent>("tabswitch", {detail: {name}});
    baseElement.value?.querySelectorAll('[role="tabpanel"]').forEach(el => el.dispatchEvent(ev));

    emit("update:modelValue", name);
};

const refresh = () => {
    nextTick(() => switchTab(props.modelValue));
};

onMounted(refresh);

onUpdated(refresh);

defineExpose({switchTab});
</script>

<style lang="scss" scoped>
.b-tablist {
    .list {
        align-items: center;
        border-bottom: 1px solid var(--tablist-border);
        display: flex;
        height: var(--tablist-size);
        line-height: var(--tablist-size);
        margin: var(--main-block-margin) 0;

        ::v-deep() {
            > .b-button {
                height: calc(100% + 2px);
                line-height: calc(100% + 2px);
                min-height: calc(100% + 2px);

                > .content {
                    --background: transparent;

                    border-bottom: 0.25rem solid transparent;
                    border-radius: 0;
                }

                &.active > .content {
                    border-color: var(--primary);
                }
            }
        }
    }
}
</style>
