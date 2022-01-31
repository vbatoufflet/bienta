<template>
    <main :id="id" class="b-main">
        <slot></slot>
    </main>
</template>

<script lang="ts">
import {generateID} from "~src/components/common";

export default {
    name: "b-main",
};
</script>

<script lang="ts" setup>
const id = generateID("main");
</script>

<style lang="scss" scoped>
.b-main {
    --delta-bottom: 0px;
    --delta-left-sidebar: 0px;
    --delta-left: 0px;
    --delta-right-sidebar: 0px;
    --delta-right: 0px;
    --delta-top: 0px;

    margin: var(--delta-top) calc(var(--delta-right) + var(--delta-right-sidebar))
        var(--delta-bottom) calc(var(--delta-left) + var(--delta-left-sidebar));
    min-height: calc(100vh - 2 * var(--main-padding));
    padding: var(--main-padding);
    position: relative;

    &[data-toolbar~="bottom"] {
        padding-bottom: calc(var(--main-padding) + var(--toolbar-size));
    }

    &[data-toolbar~="left"] {
        padding-left: calc(var(--main-padding) + var(--toolbar-size));
    }

    &[data-toolbar~="right"] {
        padding-right: calc(var(--main-padding) + var(--toolbar-size));
    }

    &[data-toolbar~="top"] {
        padding-top: calc(var(--main-padding) + var(--toolbar-size));
    }

    ::v-deep() {
        > :first-child {
            margin-top: 0;
        }

        h1,
        h2,
        h3 {
            font-weight: normal;
        }

        h1 {
            font-size: 2rem;
        }

        h2 {
            font-size: 1.5rem;
            margin-top: var(--main-block-margin);
        }

        dl,
        ol,
        ul,
        p,
        pre {
            margin: 1.5rem 0;
        }

        code,
        pre {
            background-color: var(--main-pre-background);
            border-radius: 0.2rem;
        }

        code {
            padding: 0.175rem 0.35rem;
        }

        pre {
            padding: 0.75rem;

            code {
                padding: 0;
            }
        }

        dl,
        ol,
        ul {
            padding: 0 1.25rem;
        }

        .b-button {
            --background: var(--main-button-background);
            --color: var(--main-button-color);
        }

        > .b-toolbar {
            &[data-clip] {
                position: fixed;
            }

            &[data-clip="bottom"],
            &[data-clip="top"] {
                left: var(--delta-left);
                right: var(--delta-right);
            }

            &[data-clip="left"],
            &[data-clip="right"] {
                bottom: var(--delta-bottom);
                top: var(--delta-top);
            }

            &[data-clip="bottom"] {
                bottom: var(--delta-bottom);
            }

            &[data-clip="left"] {
                left: var(--delta-left);
            }

            &[data-clip="right"] {
                right: var(--delta-right);
            }

            &[data-clip="top"] {
                top: var(--delta-top);
            }
        }
    }

    &:fullscreen {
        --delta-bottom: 0px !important;
        --delta-left-sidebar: 0px !important;
        --delta-left: 0px !important;
        --delta-right-sidebar: 0px !important;
        --delta-right: 0px !important;
        --delta-top: 0px !important;
        --sidebar-size: 0px !important;
    }
}

body[data-toolbar="bottom"] .b-main {
    --delta-bottom: var(--toolbar-size);
}

body[data-toolbar="left"] .b-main {
    --delta-left: var(--toolbar-size);
}

body[data-toolbar="right"] .b-main {
    --delta-right: var(--toolbar-size);
}

body[data-toolbar="top"] .b-main {
    --delta-top: var(--toolbar-size);
}

body[data-sidebar="left static"] .b-main {
    --delta-left-sidebar: var(--sidebar-size);

    ::v-deep() {
        > .b-toolbar[data-clip="bottom"],
        > .b-toolbar[data-clip="left"],
        > .b-toolbar[data-clip="top"] {
            left: calc(var(--sidebar-size) + var(--delta-left));
        }
    }
}

body[data-sidebar="right static"] .b-main {
    --delta-right-sidebar: var(--sidebar-size);

    ::v-deep() {
        > .b-toolbar[data-clip="bottom"],
        > .b-toolbar[data-clip="right"],
        > .b-toolbar[data-clip="top"] {
            right: calc(var(--sidebar-size) + var(--delta-right));
        }
    }
}
</style>
