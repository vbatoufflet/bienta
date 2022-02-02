<template>
    <div :id="id" class="b-message" :class="{inline}" :data-type="type">
        <b-icon
            v-if="iconName !== undefined"
            :badge="iconBadge"
            :name="iconName"
            :pack="iconPack"
        />
        <b-icon-check v-else-if="type === 'success'" />
        <b-icon-exclamation v-else-if="type === 'warning'" />
        <b-icon-info v-else-if="type === 'info'" />
        <b-icon-times v-else-if="type === 'error'" />

        <slot></slot>
    </div>
</template>

<script lang="ts">
import {PropType} from "vue";

import {generateID} from "~src/components/common";
import bIcon from "~src/components/icon/icon.vue";
import bIconCheck from "~src/components/icon/internal/check.vue";
import bIconExclamation from "~src/components/icon/internal/exclamation.vue";
import bIconInfo from "~src/components/icon/internal/info.vue";
import bIconTimes from "~src/components/icon/internal/times.vue";
import {IconPack, MessageType} from "~types";

export default {
    name: "b-message",
    components: {
        bIcon,
        bIconCheck,
        bIconExclamation,
        bIconInfo,
        bIconTimes,
    },
};
</script>

<script lang="ts" setup>
defineProps({
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
    inline: {
        default: false,
        type: Boolean,
    },
    type: {
        default: undefined,
        type: String as PropType<MessageType>,
    },
});

const id = generateID("message");
</script>

<style lang="scss">
.b-message {
    align-items: center;
    background-color: var(--message-background);
    border-radius: 0.2rem;
    display: flex;
    gap: 0.75rem;
    line-height: 1.5;
    margin: 1rem 0;
    padding: 0.75rem 1rem;

    &[data-type="error"] .b-icon {
        background-color: var(--red);
    }

    &[data-type="info"] .b-icon {
        background-color: var(--blue);
    }

    &[data-type="success"] .b-icon {
        background-color: var(--green);
    }

    &[data-type="warning"] .b-icon {
        background-color: var(--yellow);
    }

    &.inline {
        display: inline-flex;
        vertical-align: middle;
    }

    .b-icon {
        align-self: flex-start;
        background-color: var(--input-background);
        border-radius: 100%;
        font-size: 0.8rem;
        height: 1.5rem;
        min-width: 1.5rem;
        width: 1.5rem;

        &[data-icon] {
            border: 0.25rem solid transparent;
            color: white;
        }
    }
}
</style>
