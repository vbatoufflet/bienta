<template>
    <div
        :id="id"
        class="b-flex"
        :data-align="align"
        :data-direction="direction"
        :data-justify="justify"
        :data-wrap="wrap"
        :style="gap ? `--gap: ${gap}` : undefined"
    >
        <slot></slot>
    </div>
</template>

<script lang="ts">
import {PropType} from "vue";

import {generateID} from "~src/components/common";
import {FlexAlign, FlexDirection, FlexJustify, FlexWrap} from "~types";

export default {
    name: "b-flex",
};
</script>

<script lang="ts" setup>
defineProps({
    align: {
        default: "normal",
        type: String as PropType<FlexAlign>,
    },
    direction: {
        default: "row",
        type: String as PropType<FlexDirection>,
    },
    gap: {
        default: undefined,
        type: String,
    },
    justify: {
        default: "normal",
        type: String as PropType<FlexJustify>,
    },
    wrap: {
        default: "nowrap",
        type: String as PropType<FlexWrap>,
    },
});

const id = generateID("flex");
</script>

<style lang="scss" scoped>
.b-flex {
    display: flex;
    gap: var(--gap);

    &[data-align="baseline"] {
        align-items: baseline;
    }

    &[data-align="center"] {
        align-items: center;
    }

    &[data-align="end"] {
        align-items: flex-end;
    }

    &[data-align="start"] {
        align-items: flex-start;
    }

    &[data-align="stretch"] {
        align-items: stretch;
    }

    &[data-direction="column"] {
        flex-direction: column;
    }

    &[data-direction="column-reverse"] {
        flex-direction: column-reverse;
    }

    &[data-direction="row"] {
        flex-direction: row;
    }

    &[data-direction="row-reverse"] {
        flex-direction: row-reverse;
    }

    &[data-justify="around"] {
        justify-content: space-around;
    }

    &[data-justify="between"] {
        justify-content: space-between;
    }

    &[data-justify="center"] {
        justify-content: center;
    }

    &[data-justify="end"] {
        justify-content: flex-end;
    }

    &[data-justify="evenly"] {
        justify-content: space-evenly;
    }

    &[data-justify="start"] {
        justify-content: flex-start;
    }

    &[data-wrap="nowrap"] {
        flex-wrap: nowrap;
    }

    &[data-wrap="wrap"] {
        flex-wrap: wrap;
    }

    &[data-wrap="wrap-reverse"] {
        flex-wrap: wrap-reverse;
    }
}
</style>
