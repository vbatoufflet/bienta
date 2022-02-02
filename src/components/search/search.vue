<template>
    <div
        :id="id"
        class="b-search"
        :class="{active}"
        :data-label="label ?? placeholder"
        @click="toggle(false)"
        @keydown.esc.prevent="toggle(false)"
        @shortcut="toggle(true)"
    >
        <b-input
            v-if="active"
            ref="inputComponent"
            v-model="model"
            v-autofocus
            :completion="completion"
            :icon-badge="iconBadge"
            :icon-name="iconName"
            :icon-pack="iconPack"
            :label="label"
            :placeholder="placeholder"
            type="search"
            @click.stop
            @keydown.tab.prevent
            @select="select"
        >
            <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                <slot :name="slot" v-bind="scope"></slot>
            </template>
        </b-input>
    </div>
</template>

<script lang="ts">
import {PropType, nextTick, ref} from "vue";

import {generateID} from "~src/components/common";
import bInput from "~src/components/input/input.vue";
import {CompletionFunc, IconPack, InputPublicInstance} from "~types";

export default {
    name: "b-search",
    components: {
        bInput,
    },
};
</script>

<script lang="ts" setup>
defineProps({
    completion: {
        default: undefined,
        type: Function as PropType<CompletionFunc<string>>,
    },
    iconBadge: {
        default: undefined,
        type: [Number, String],
    },
    iconName: {
        default: "search",
        type: String,
    },
    iconPack: {
        default: undefined,
        type: String as PropType<IconPack>,
    },
    label: {
        default: undefined,
        type: String,
    },
    placeholder: {
        default: undefined,
        type: String,
    },
});

const emit = defineEmits<{
    (ev: "select", item: unknown): void;
}>();

const id = generateID("search");

const active = ref(false);
const inputComponent = ref<InputPublicInstance>();
const model = ref("");

const isActive = () => {
    return active.value;
};

const select = (item: unknown) => {
    toggle(false);
    emit("select", item);
};

const toggle = (state?: boolean) => {
    active.value = typeof state === "boolean" ? state : !active.value;
    if (active.value) {
        model.value = "";
        nextTick(() => inputComponent.value?.focus(true));
    }
};

defineExpose({isActive, toggle});
</script>

<style lang="scss" scoped>
.b-search {
    display: none;

    &.active {
        align-items: flex-start;
        background-color: var(--search-background);
        display: flex;
        inset: 0;
        justify-content: center;
        position: fixed;
        z-index: 500;
    }

    .b-input {
        --input-size: 4.5rem;

        border-radius: 0.4rem;
        box-shadow: 0 0.5rem 2rem var(--search-input-shadow);
        flex-wrap: wrap;
        font-size: 1.5rem;
        height: auto;
        margin: 10vh 0;
        width: 35vw;

        &[aria-expanded="true"] ::v-deep() {
            input {
                border-bottom: 1px solid var(--separator-background);
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }
        }

        ::v-deep() {
            .b-icon {
                align-self: flex-start;
                height: var(--input-size);
                width: 4rem;

                + input {
                    padding: 0 1.25rem 0 4rem;
                }
            }

            input {
                height: var(--input-size);

                &:focus {
                    box-shadow: none;
                }
            }

            .b-dropdown {
                --button-size: 3rem;
                --label-size: 3rem;

                background-color: transparent;
                box-shadow: none;
                font-size: 1.1rem;
                position: static;
            }
        }
    }
}
</style>
