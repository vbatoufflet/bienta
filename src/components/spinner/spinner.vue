<template>
    <div
        :id="id"
        aria-busy="true"
        :aria-label="label"
        class="b-spinner"
        :data-clip="clip ?? undefined"
        role="status"
    >
        <svg
            :height="size"
            :width="size"
            :viewBox="`0 0 ${size} ${size}`"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g fill="none" fill-rule="evenodd" :stroke-width="strokeWidth">
                <circle
                    :cx="half"
                    :cy="half"
                    :r="innerHalf"
                    stroke="var(--spinner-background)"
                ></circle>
                <circle
                    class="dash"
                    :cx="half"
                    :cy="half"
                    :r="innerHalf"
                    stroke="var(--primary)"
                    :stroke-dasharray="dash"
                    stroke-linecap="round"
                ></circle>
            </g>
        </svg>
    </div>
</template>

<script lang="ts">
import {computed} from "vue";

import {generateID} from "~src/components/common";

export default {
    name: "b-spinner",
};
</script>

<script lang="ts" setup>
const props = defineProps({
    clip: {
        default: false,
        type: Boolean,
    },
    label: {
        default: undefined,
        type: String,
    },
    size: {
        default: 48,
        type: Number,
    },
});

const id = generateID("spinner");

const dash = computed(() => {
    const q = (Math.PI * half.value) / 2;
    return `${q},${q * 3}`;
});

const half = computed(() => props.size / 2);

const innerHalf = computed(() => (props.size - strokeWidth.value) / 2);

const strokeWidth = computed(() => Math.max(2, props.size / 16));
</script>

<style lang="scss" scoped>
@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(359deg);
    }
}

.b-spinner {
    align-items: center;
    display: inline-flex;
    justify-content: center;
    pointer-events: none;
    vertical-align: middle;

    &[data-clip="true"] {
        bottom: 0;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        z-index: -1;
    }

    .dash {
        animation: rotate 0.65s infinite linear;
        transform-origin: center;
    }
}
</style>
