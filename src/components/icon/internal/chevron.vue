<template>
    <svg
        class="b-icon"
        :class="{flip}"
        data-icon="chevron"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M15.646 6.29264C15.2559 5.90252 14.6234 5.90252 14.2333 6.29264L9.99503 10.5309L5.75674 6.29259C5.36661 5.90247 4.7341 5.90247 4.34398 6.29259L3.63759 6.99897C3.24747 7.3891 3.24747 8.02161 3.63759 8.41174L9.28864 14.0628C9.67877 14.4529 10.3113 14.4529 10.7014 14.0628L16.3524 8.41179C16.7425 8.02166 16.7425 7.38915 16.3524 6.99902L15.646 6.29264Z"
            fill="currentColor"
        ></path>
    </svg>
</template>

<script lang="ts">
export default {
    name: "b-icon-chevron",
};
</script>

<script lang="ts" setup>
defineProps({
    flip: {
        default: false,
        type: Boolean,
    },
});
</script>

<style lang="scss">
.b-icon {
    &.flip path {
        transform: scaleY(-1);
        transform-origin: center;
    }
}
</style>
