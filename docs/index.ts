import {createApp} from "vue";
import {RouteRecordRaw, createRouter, createWebHistory} from "vue-router";

import {createBienta} from "~src";

import api from "./api";
import app from "./app.vue";
import components from "./components";
import directives from "./directives";
import gettingStarted from "./getting-started";
import notFound from "./not-found.vue";

const routes: RouteRecordRaw[] = [
    ...api,
    ...components,
    ...directives,
    ...gettingStarted,
    {
        name: "root",
        path: "/",
        redirect: {name: "introduction"},
    },
    {
        name: "not-found",
        path: "/:path(.*)*",
        component: notFound,
    },
];

const bienta = createBienta();

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    linkActiveClass: "",
    linkExactActiveClass: "active",
});

// prettier-ignore
createApp(app)
    .use(bienta)
    .use(router)
    .mount(document.body);
