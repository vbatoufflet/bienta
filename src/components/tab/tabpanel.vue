<template>
    <div
        v-if="parentID"
        :id="id"
        ref="baseElement"
        :aria-expanded="active"
        class="b-tabpanel"
        :data-name="name"
        role="tabpanel"
        @tabswitch="onTabswitch"
    >
        <teleport :to="`#${parentID} .list`">
            <b-button
                :aria-selected="active"
                :badge="badge"
                :badge-color="badgeColor"
                :class="{active}"
                :controls="id"
                :disabled="disabled ? true : undefined"
                :icon-badge="iconBadge"
                :icon-name="iconName"
                :icon-pack="iconPack"
                :to="to"
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
import {BadgeColor, IconPack} from "~types";

export interface TabswitchEvent {
    name?: string;
}

export default {
    name: "b-tabpanel",
    components: {
        bButton,
    },
};
</script>

<script lang="ts" setup>
const props = defineProps({
    badge: {
        default: undefined,
        type: [Number, String],
    },
    badgeColor: {
        default: undefined,
        type: String as PropType<BadgeColor>,
    },
    default: {
        default: false,
        type: Boolean,
    },
    disabled: {
        default: false,
        type: Boolean,
    },
    iconBadge: {
        default: undefined,
        type: [Number, String],
    },
    iconName: {
        default: undefined,
        type: String,
    },
    iconPack: {
        default: undefined,
        type: String as PropType<IconPack>,
    },
    label: {
        required: true,
        type: String,
    },
    name: {
        required: true,
        type: String,
    },
    to: {
        default: undefined,
        type: Object as PropType<Record<string, unknown>>,
    },
});

const id = generateID("tabpanel");

const active = ref(false);
const baseElement = ref<HTMLElement>();
const parentID = ref<string>();

const onTabswitch = (ev: CustomEvent<TabswitchEvent>) => {
    active.value = (ev.detail.name === undefined && props.default) || ev.detail.name === props.name;
};

const swicth = () => {
    active.value = true;

    const ev = new CustomEvent<TabswitchEvent>("tabswitch", {
        detail: {name: props.name},
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
