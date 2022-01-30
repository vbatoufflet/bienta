<template>
    <div
        v-if="parentID"
        :id="id"
        ref="baseElement"
        :aria-expanded="active"
        class="b-tabpanel"
        role="tabpanel"
        @tabswitch="onTabswitch"
    >
        <teleport :to="`#${parentID} .list`">
            <b-button
                :aria-selected="active"
                :badge="badge"
                :class="{active}"
                :controls="id"
                :disabled="disabled ? true : undefined"
                :icon-badge="iconBadge"
                :icon-flip="iconFlip"
                :icon-name="iconName"
                @click="swicth"
            >
                {{ label }}
            </b-button>
        </teleport>

        <slot v-if="active"></slot>
    </div>
</template>

<script lang="ts">
import {PropType, getCurrentInstance, onMounted, onUpdated, ref} from "vue";

import bButton from "~src/components/button/button.vue";
import {generateID} from "~src/components/common";
import {IconFlip} from "~types";

export interface TabswitchEvent {
    id: string;
}

export default {
    name: "b-tabpanel",
    components: {
        bButton,
    },
};
</script>

<script lang="ts" setup>
defineProps({
    badge: {
        default: undefined,
        type: [Number, String],
    },
    disabled: {
        default: false,
        type: Boolean,
    },
    iconName: {
        default: undefined,
        type: String,
    },
    iconBadge: {
        default: undefined,
        type: [Number, String],
    },
    iconFlip: {
        default: undefined,
        type: String as PropType<IconFlip>,
    },
    label: {
        required: true,
        type: String,
    },
});

const id = generateID("tabpanel");

const active = ref(false);
const baseElement = ref<HTMLElement>();
const parentID = ref<string>();

const onTabswitch = (ev: CustomEvent<TabswitchEvent>) => {
    active.value = ev.detail.id === id;
};

const swicth = () => {
    active.value = true;

    const ev = new CustomEvent<TabswitchEvent>("tabswitch", {
        detail: {id},
    });

    baseElement.value?.parentElement
        ?.querySelectorAll(`[role="tabpanel"]:not(#${id})`)
        .forEach(el => el.dispatchEvent(ev));
};

const refresh = () => {
    parentID.value = getCurrentInstance()?.parent?.subTree.el?.id ?? null;
};

onMounted(refresh);

onUpdated(refresh);
</script>
