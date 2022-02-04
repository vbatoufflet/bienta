<template>
    <b-search
        ref="searchComponent"
        v-shortcut="'/'"
        :completion="searchCompletion"
        placeholder="Search documentation"
        @select="(item: CompletionRecord) => $router.push({name: item.value})"
    >
        <template #default="item">
            <b-button
                aria-selected="false"
                :class="{active: item.active}"
                :data-item="item.index"
                role="option"
            >
                {{ item.value.label }}
                <b-spacer />
                <span class="subtle">{{ item.value.group }}</span>
            </b-button>
        </template>

        <template #empty>
            <b-label class="subtle">No matches</b-label>
        </template>
    </b-search>

    <b-toolbar app>
        <b-button
            v-shortcut="'meta+b'"
            icon-name="bars"
            label="Toggle sidebar"
            @click="toggleSidebar"
        />
        <b-button :badge="version">Bienta</b-button>
    </b-toolbar>

    <b-sidebar v-if="sidebar">
        <b-label icon-name="tachometer">Getting started</b-label>
        <b-button icon-name="" :to="{name: 'introduction'}">Introduction</b-button>
        <b-button icon-name="" :to="{name: 'installation'}">Installation</b-button>

        <b-label icon-name="code">Components</b-label>
        <b-button
            v-for="(label, route) in components"
            :key="route"
            icon-name=""
            :to="{name: route}"
        >
            {{ label }}
        </b-button>

        <b-label icon-name="florin-sign">Directives</b-label>
        <b-button
            v-for="(label, route) in directives"
            :key="route"
            icon-name=""
            :to="{name: route}"
        >
            {{ label }}
        </b-button>

        <b-label icon-name="cubes">API</b-label>
        <b-button v-for="(label, route) in api" :key="route" icon-name="" :to="{name: route}">
            {{ label }}
        </b-button>
    </b-sidebar>

    <b-main>
        <router-view />
    </b-main>
</template>

<script lang="ts" setup>
import {computed, nextTick, ref, watch} from "vue";
import {RouteRecordRaw, useRouter} from "vue-router";

import {CompletionItem} from "~types";

import apiRoutes from "./api";
import componentRoutes from "./components";
import directiveRoutes from "./directives";

interface CompletionRecord {
    label: string;
    group: string;
    value: string;
}

/* global VERSION */
const version = VERSION;

const router = useRouter();

const sidebar = ref(true);

const api = computed(() => filterRoutes(apiRoutes, "-api"));

const components = computed(() => filterRoutes(componentRoutes, "-component"));

const directives = computed(() => filterRoutes(directiveRoutes, "-directive"));

const searchRecords = [...apiRoutes, ...componentRoutes, ...directiveRoutes].reduce<
    CompletionRecord[]
>((out, route) => {
    const name = route.name?.toString();
    if (name?.includes("-")) {
        const idx = name.lastIndexOf("-");
        out.push({
            label: name[0].toUpperCase() + name.slice(1, idx),
            group: name.slice(idx + 1),
            value: name,
        });
    }
    return out;
}, []);

const filterRoutes = (routes: RouteRecordRaw[], suffix: string): Record<string, string> =>
    routes.reduce<Record<string, string>>((out, route) => {
        const name = route.name?.toString();
        if (name?.endsWith(suffix)) {
            out[name] = name[0].toUpperCase() + name.slice(1, -suffix.length);
        }
        return out;
    }, {});

const searchCompletion = (value: string): Promise<CompletionItem<string>[]> => {
    value = value.toLowerCase();
    return Promise.resolve(searchRecords.filter(record => record.value.includes(value)));
};

const toggleSidebar = () => {
    sidebar.value = !sidebar.value;
};

watch(router.currentRoute, () => {
    nextTick(() => {
        document
            .querySelectorAll<HTMLElement>("pre > code.language-html:first-child, .toggle-code")
            .forEach(el => {
                if (el.tagName === "CODE") {
                    const button = document.createElement("a");
                    button.append(document.createTextNode("Toggle code"));
                    button.classList.add("toggle-code");

                    button.addEventListener("click", () => {
                        el.style.display = el.style.display === "none" ? "block" : "none";
                    });

                    el.before(button);
                    el.style.display = "none";
                } else {
                    const sibling = el.nextElementSibling as HTMLElement | null;
                    if (sibling) {
                        el.addEventListener("click", () => {
                            sibling.style.display =
                                sibling.style.display === "none" ? "block" : "none";
                        });
                    }
                }
            });
    });
});
</script>

<style lang="scss">
$fa-font-path: "../node_modules/@fortawesome/fontawesome-free/webfonts";
@import "../node_modules/@fortawesome/fontawesome-free/scss/fontawesome";
@import "../node_modules/@fortawesome/fontawesome-free/scss/solid";

@import "material-icons/iconfont/material-icons.css";

pre {
    .hljs-comment {
        color: #636367;
    }

    .hljs-keyword,
    .hljs-tag {
        color: #1976d2;
    }

    .hljs-title {
        font-weight: bold;
    }

    .hljs-string {
        color: #689f38;
    }
}

table {
    border-spacing: 0;
    margin: 2rem 0;
    width: 100%;

    th {
        color: rgba(var(--color-rgb), var(--placeholder-opacity));
        font-weight: normal;
        text-align: left;
        text-transform: uppercase;
    }

    th,
    td {
        border-bottom: 1px solid var(--list-border);
        padding: 0.5rem 1rem;

        &:first-child,
        code,
        em {
            white-space: nowrap;
        }

        &:last-child {
            width: 65%;
        }
    }
}

.b-flex {
    margin: 2rem 0;
}

.preview + .preview {
    margin-top: -1rem;
}

.subtle {
    opacity: var(--placeholder-opacity);
}

.toggle-code {
    cursor: pointer;
    display: block;
    font-size: 0.9rem;
    opacity: 0.65;
    text-align: center;

    &:hover {
        text-decoration: underline;
    }

    + code {
        border-top: 1px solid var(--separator-background);
        margin-top: 0.65rem;
        padding-top: 0.65rem !important;
    }
}

@media (min-width: 1000px) {
    .b-main {
        padding-left: calc(var(--main-padding) + var(--sidebar-size)) !important;
        padding-right: calc(var(--main-padding) + var(--sidebar-size)) !important;
    }

    body[data-sidebar="left static"] .b-main {
        padding-left: var(--main-padding) !important;
    }
}
</style>
