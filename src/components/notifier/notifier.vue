<template>
    <div
        v-if="notifications.length > 0"
        ref="baseElement"
        class="b-notifier"
        :class="{dismiss: globalDismiss}"
        @transitioncancel="onTransition"
        @transitionend="onTransition"
    >
        <b-message
            v-for="notification in notifications"
            :key="notification.id"
            :class="{
                dismiss: dismissed.has(notification.id),
                insert: inserted.has(notification.id),
            }"
            :data-notification="notification.id"
            :icon-name="notification.opts.iconName"
            :type="notification.opts.type"
            @click="dismiss"
        >
            {{ notification.opts.text }}
        </b-message>

        <b-button v-if="dismissed.size < notifications.length" @click="dismissAll()">
            <b-icon-times />
        </b-button>
    </div>
</template>

<script lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";

import bButton from "~src/components/button/button.vue";
import bIconTimes from "~src/components/icon/internal/times.vue";
import bMessage from "~src/components/message/message.vue";

import {NotifyEvent} from ".";

export default {
    name: "b-notifier",
    components: {
        bButton,
        bIconTimes,
        bMessage,
    },
};
</script>

<script lang="ts" setup>
const timeouts = new Map<string, number>();

const baseElement = ref<HTMLElement>();
const dismissed = ref(new Set<string>());
const globalDismiss = ref(false);
const inserted = ref(new Set<string>());
const notifications = ref<NotifyEvent[]>([]);

const dismiss = (ev: MouseEvent) => {
    const target = (ev.target as HTMLElement | null)?.closest<HTMLElement>(".b-message");
    if (target) {
        target.style.height = `${target.clientHeight}px`;
        target.style.maxHeight = `${target.clientHeight}px`;

        const id = target.dataset.notification;
        if (id) {
            const timeout = timeouts.get(id);
            if (timeout) {
                clearTimeout(timeout);
                timeouts.delete(id);
            }

            dismissed.value.add(id);
        }
    }
};

const dismissAll = () => {
    globalDismiss.value = true;
};

const onNotify = ((ev: CustomEvent<NotifyEvent>) => {
    inserted.value.add(ev.detail.id);

    requestAnimationFrame(() => {
        notifications.value.unshift(ev.detail);

        requestAnimationFrame(() => {
            inserted.value.delete(ev.detail.id);
        });
    });

    if (ev.detail.opts.dismissAfter) {
        timeouts.set(
            ev.detail.id,
            window.setTimeout(() => {
                baseElement.value
                    ?.querySelector(`[data-notification="${ev.detail.id}"]`)
                    ?.dispatchEvent(new Event("click"));

                timeouts.delete(ev.detail.id);
            }, ev.detail.opts.dismissAfter),
        );
    }
}) as (ev: Event) => void;

const onTransition = (ev: TransitionEvent) => {
    if (ev.propertyName === "transform" && globalDismiss.value) {
        globalDismiss.value = false;
        notifications.value = [];
    } else if (ev.propertyName !== "height") {
        return;
    }

    const target = (ev.target as HTMLElement | null)?.closest<HTMLElement>(".b-message");
    if (!target?.classList.contains("dismiss")) {
        return;
    }

    const id = target?.dataset.notification;
    if (id && dismissed.value.has(id)) {
        const idx = notifications.value.findIndex(v => v.id === id);
        if (idx !== -1) {
            notifications.value.splice(idx, 1);
            dismissed.value.delete(id);
        }
    }
};

onMounted(() => {
    document.addEventListener("notify", onNotify);
});

onBeforeUnmount(() => {
    document.removeEventListener("notify", onNotify);
});
</script>

<style lang="scss" scoped>
.b-notifier {
    max-height: 100vh;
    overflow: hidden auto;
    padding: 1rem 1rem 2.5rem 2.5rem;
    position: fixed;
    right: 0;
    transition: transform 0.25s var(--timing-function);
    top: 0;
    z-index: 600;

    &.dismiss {
        transform: translateX(calc(100% + 3.25rem));

        &:hover .b-button {
            visibility: hidden;
        }
    }

    .b-message,
    .b-button > ::v-deep(.content) {
        box-shadow: 0 0.25rem 1.5rem var(--notifier-message-shadow);
    }

    .b-message {
        background-color: var(--notifier-message-background);
        border-radius: 0.35rem;
        padding: 1.25rem 1.75rem;
        margin: 0 0 1rem 0;
        overflow: hidden;
        transition: all 0.25s var(--timing-function), transform 0.25s var(--timing-function) 0.25s;
        width: 25vw;

        &.dismiss,
        &.insert {
            height: 0 !important;
            margin-bottom: 0;
            max-height: 0;
            padding: 0 1.75rem;
            transform: translateX(calc(100% + 2.25rem));
        }

        &.dismiss {
            transition: all 0.25s var(--timing-function) 0.25s,
                transform 0.25s var(--timing-function);
        }

        > ::v-deep(.b-icon) {
            align-self: center;
            margin-right: 0.35rem;
        }
    }

    .b-button {
        --background: var(--notifier-message-background);

        visibility: hidden;
        margin: 0.5rem 0 0 50%;
        transform: translateX(-50%);

        .b-icon {
            width: 1.1rem;
        }

        > ::v-deep(.content) {
            border-radius: var(--button-size);
        }
    }

    &:hover .b-button {
        visibility: visible;
    }
}
</style>
