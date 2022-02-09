<template>
    <div :id="id" class="b-label">
        <b-icon
            v-if="iconName !== undefined"
            :badge="iconBadge"
            :name="iconName"
            :pack="iconPack"
        />

        <slot></slot>

        <b-badge v-if="badge" :color="badgeColor">{{ badge }}</b-badge>
    </div>
</template>

<script lang="ts">
import {PropType} from "vue";

import bBadge from "~src/components/badge/badge.vue";
import {generateID} from "~src/components/common";
import bIcon from "~src/components/icon/icon.vue";
import {BadgeColor, IconPack} from "~types";

export default {
    name: "b-label",
    components: {
        bBadge,
        bIcon,
    },
};
</script>

<script lang="ts" setup>
defineProps({
    badge: {
        default: undefined,
        type: [Number, String],
    },
    badgeColor: {
        default: undefined,
        type: String as PropType<BadgeColor>,
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
});

const id = generateID("label");
</script>

<style lang="scss" scoped>
.b-label {
    align-items: center;
    display: inline-flex;
    gap: 0.75rem;
    height: var(--label-size);
    line-height: var(--label-size);
    min-height: var(--label-size);
    vertical-align: middle;
}
</style>
