<template>
    <div
        :id="id"
        ref="baseElement"
        :aria-disabled="disabled || undefined"
        class="b-button"
        :class="{
            active,
            'icon': !hasLabel && (!hasDropdown || (!iconName && hasDropdown)),
            'in-dropdown': inDropdown,
            'in-tablist': inTablist,
        }"
        :data-color="color"
        :data-label="label"
        @autofocus="focus"
        @shortcut="!disabled && onShortcut()"
    >
        <component
            :is="tag"
            ref="contentElement"
            :aria-controls="controls"
            :aria-expanded="hasDropdown ? active : undefined"
            :aria-haspopup="hasDropdown ? 'menu' : undefined"
            :aria-label="label"
            class="content"
            :role="inTablist ? 'tab' : 'button'"
            :tabindex="tabindex ?? (!disabled ? 0 : undefined)"
            :target="target"
            :to="to"
            @click.passive="onClick"
            @focusout="onFocusout"
            @keydown.enter="onKeydown"
            @keydown.space.prevent="onKeydown"
            @pointerdown="onPointer"
            @pointerenter="hasDropdown && inDropdown && onPointer($event)"
            @pointerleave="hasDropdown && inDropdown && onPointer($event)"
        >
            <b-icon
                v-if="iconName !== undefined"
                :badge="iconBadge"
                :flip="iconFlip"
                :name="iconName"
            />

            <template v-if="hasLabel">
                <div class="label">
                    <slot></slot>
                </div>

                <b-badge v-if="badge" :color="badgeColor">{{ badge }}</b-badge>
            </template>

            <div v-if="shortcutEnable && inDropdown && shortcut" class="shortcut">
                {{ shortcutLabel(shortcut) }}
            </div>

            <b-icon
                v-if="hasDropdown && !iconName?.startsWith('angle-')"
                class="caret"
                :name="dropdownIcon ?? (inDropdown ? 'angle-right' : 'angle-down')"
            />
        </component>

        <b-dropdown
            v-if="hasDropdown"
            ref="dropdownComponent"
            role="menu"
            tabindex="-1"
            :anchor="dropdownAnchor"
            @focusout="onFocusout"
            @pointerleave="inDropdown && onPointer($event)"
        >
            <slot name="dropdown"></slot>
        </b-dropdown>
    </div>
</template>

<script lang="ts">
import {PropType, computed, onMounted, onUpdated, ref, useSlots, watch} from "vue";

import bBadge from "~src/components/badge/badge.vue";
import {generateID} from "~src/components/common";
import bDropdown from "~src/components/dropdown/dropdown.vue";
import bIcon from "~src/components/icon/icon.vue";
import {shortcutLabel} from "~src/directives/shortcut";
import {useBienta} from "~src/inject";
import {BadgeColor, ButtonType, DropdownAnchor, DropdownPublicInstance, IconFlip} from "~types";

export default {
    name: "b-button",
    components: {
        bBadge,
        bDropdown,
        bIcon,
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
    color: {
        default: undefined,
        type: String,
    },
    controls: {
        default: undefined,
        type: String,
    },
    disabled: {
        default: false,
        type: Boolean,
    },
    dropdownAnchor: {
        default: "bottom-left",
        type: String as PropType<DropdownAnchor>,
    },
    dropdownIcon: {
        default: undefined,
        type: String,
    },
    href: {
        default: undefined,
        type: String,
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
        default: undefined,
        type: String,
    },
    target: {
        default: undefined,
        type: String,
    },
    to: {
        default: undefined,
        type: Object as PropType<Record<string, unknown>>,
    },
    tabindex: {
        default: undefined,
        type: Number,
    },
    type: {
        default: "button",
        type: String as PropType<ButtonType>,
    },
});

const bienta = useBienta();
const slots = useSlots();

const id = generateID("button");

const active = ref(false);
const baseElement = ref<HTMLElement>();
const contentElement = ref<HTMLAnchorElement>();
const dropdownComponent = ref<DropdownPublicInstance>();
const hasDropdown = ref(false);
const hasLabel = ref(false);
const inDropdown = ref(false);
const inTablist = ref(false);

const shortcut = computed(() => baseElement.value?.dataset.shortcut);
const shortcutEnable = computed(() => bienta.state.shortcut.enable);
const tag = computed(() => (props.to ? "router-link" : "a"));

const focus = () => contentElement.value?.focus();

const onClick = (ev: MouseEvent) => {
    if (props.type !== "button") {
        const form = baseElement.value?.closest<HTMLFormElement>("form");
        if (form) {
            if (props.type === "reset") {
                form.reset();
            } else if (props.type === "submit") {
                form.requestSubmit
                    ? form.requestSubmit()
                    : // See https://bugs.webkit.org/show_bug.cgi?id=197958
                      form.dispatchEvent(new Event("submit", {cancelable: true}));
            }
        }
    }

    if (inDropdown.value && !hasDropdown.value) {
        // Ensure dropdown parent button is focused out (i.e. close dropdown)
        (ev.target as Element | null)
            ?.closest(".b-dropdown")
            ?.parentNode?.querySelector(".content")
            ?.dispatchEvent(new Event("focusout", {bubbles: true}));
    } else if (hasDropdown.value && !active.value) {
        onDropdown(ev);
    }
};

const onDropdown = (ev: Event) => {
    // Stop propagation needs to be handled here instead from a HTML modifier to avoid stopping on
    // non-dropdown buttons
    ev.stopPropagation();

    const target = ev.target as Element | null;
    if (
        target &&
        baseElement.value?.contains(target) &&
        baseElement.value === target.closest(".b-button")
    ) {
        active.value = !active.value;
    } else if (active.value) {
        active.value = false;
    }
};

const onFocusout = (ev: FocusEvent) => {
    if (ev.relatedTarget === null || !baseElement.value?.contains(ev.relatedTarget as Node)) {
        active.value = false;
    }
};

const onKeydown = (ev: KeyboardEvent) => {
    if (hasDropdown.value) {
        onDropdown(ev);
    } else {
        baseElement.value?.dispatchEvent(new Event("click"));
    }
};

const onPointer = (ev: PointerEvent) => {
    if (hasDropdown.value && inDropdown.value) {
        switch (ev.type) {
            case "pointerenter": {
                active.value = true;
                break;
            }
            case "pointerleave": {
                const dropdown = (ev.relatedTarget as Element).closest(".b-dropdown");
                active.value =
                    dropdown !== null &&
                    baseElement.value !== undefined &&
                    (dropdown.parentNode as Node).isSameNode(baseElement.value);
                break;
            }
        }
    }
};

const onShortcut = () => {
    if (props.href || props.to) {
        baseElement.value?.querySelector(".content")?.dispatchEvent(new Event("click"));
    } else {
        baseElement.value?.dispatchEvent(new Event("click"));
    }
};

const refresh = () => {
    if (props.href && contentElement.value) {
        contentElement.value.href = props.href;
    }

    hasDropdown.value = Boolean(slots.dropdown);
    hasLabel.value = Boolean(slots.default);
    inDropdown.value = baseElement.value?.closest(".b-dropdown") !== null;
    inTablist.value = baseElement.value?.closest(".b-tablist") !== null;
};

onMounted(refresh);

onUpdated(refresh);

watch(active, state => dropdownComponent.value?.toggle(state));
</script>

<style lang="scss" scoped>
@import "../../style/mixins";

.b-button {
    display: inline-flex;
    height: var(--button-size);
    line-height: var(--button-size);
    min-height: var(--button-size);
    position: relative;
    vertical-align: middle;

    &.icon {
        min-width: var(--button-size);
        width: var(--button-size);

        > .content {
            padding: 0;
            width: inherit;
        }
    }

    > .content {
        align-items: center;
        background-color: var(--background);
        border-radius: 0.2rem;
        color: var(--color);
        cursor: pointer;
        display: flex;
        gap: 0.75rem;
        height: 100%;
        justify-content: center;
        padding: 0 var(--button-padding);
        position: relative;
        text-decoration: none;
        white-space: nowrap;

        @include focus-style;

        .label {
            align-items: center;
            display: flex;
            flex-grow: 1;

            + .b-badge {
                margin-left: 0.25rem;
            }
        }

        .shortcut {
            font-size: 0.8rem;
            margin-left: 2rem;
            opacity: 0.5;
        }
    }

    &[data-color] > .content {
        --color: white;

        .b-icon {
            --primary: white;

            ::v-deep(.badge) {
                color: var(--background);
            }
        }
    }

    &[data-color="danger"] {
        > .content {
            --background: var(--red);
        }

        &.active > .content,
        > .content:active,
        > .content:focus,
        > .content:hover {
            --background: var(--light-red);
        }
    }

    &[data-color="primary"] {
        > .content {
            --background: var(--primary);
        }

        &.active > .content,
        > .content:active,
        > .content:focus,
        > .content:hover {
            --background: var(--light-primary);
        }
    }

    &[data-color="success"] {
        > .content {
            --background: var(--green);
        }

        &.active > .content,
        > .content:active,
        > .content:focus,
        > .content:hover {
            --background: var(--light-green);
        }
    }

    &[data-color="warning"] {
        > .content {
            --background: var(--yellow);
        }

        &.active > .content,
        > .content:active,
        > .content:focus,
        > .content:hover {
            --background: var(--light-yellow);
        }
    }

    &.active > .content,
    > .content:active,
    > .content:focus,
    > .content:hover {
        --background: var(--button-hover-background);
        --color: var(--button-hover-color);

        outline: none;
    }
}
</style>
