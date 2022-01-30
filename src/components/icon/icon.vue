<template>
    <div :id="id" aria-hidden="true" class="b-icon" :data-pack="pack">
        <div class="icon" :class="classList">{{ icon }}</div>

        <div v-if="badge" class="badge">{{ badge }}</div>
    </div>
</template>

<script lang="ts">
import {PropType, computed} from "vue";

import {generateID} from "~src/components/common";
import {useBienta} from "~src/inject";
import {IconPack} from "~types";

export default {
    name: "b-icon",
};
</script>

<script lang="ts" setup>
const props = defineProps({
    badge: {
        default: undefined,
        type: [Number, String],
    },
    name: {
        required: true,
        type: String,
    },
    pack: {
        default: undefined,
        type: String as PropType<IconPack>,
    },
});

const bienta = useBienta();

const id = generateID("icon");

const classList = computed(() => {
    const out: string[] = [];

    switch (props.pack ?? bienta.options.iconPack) {
        case "font-awesome": {
            out.push("fa-fw");

            const idx = props.name.indexOf("/");
            if (idx !== -1) {
                out.push(
                    props.name.slice(0, Math.max(0, idx)),
                    `fa-${props.name.slice(Math.max(0, idx + 1))}`,
                );
            } else {
                out.push("fa", `fa-${props.name}`);
            }

            break;
        }
        case "material": {
            out.push("material-icons");

            break;
        }
    }

    return out;
});

const icon = computed(() => {
    switch (props.pack ?? bienta.options.iconPack) {
        case "material":
            return props.name;
    }

    return null;
});
</script>

<style lang="scss" scoped>
.b-icon {
    align-items: center;
    display: inline-flex;
    justify-content: center;
    position: relative;
    vertical-align: middle;

    .badge,
    .icon {
        pointer-events: none;
    }

    .icon {
        font-size: inherit;
    }

    .badge {
        background-color: var(--primary);
        border-radius: 1rem;
        box-shadow: 0 0 0 0.15rem var(--background);
        color: white;
        left: 100%;
        line-height: normal;
        min-height: 1.2rem;
        min-width: 1.2rem;
        padding: 0 0.35rem;
        position: absolute;
        text-align: center;
        top: 100%;
        transform: scale(0.65) translate(-100%, -100%);
    }
}
</style>
