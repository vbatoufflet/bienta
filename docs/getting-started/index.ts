import {RouteRecordRaw} from "vue-router";

import installation from "./installation.md";
import introduction from "./introduction.md";

const routes: RouteRecordRaw[] = [
    {
        name: "getting-started",
        path: "/getting-started",
        redirect: {
            name: "introduction",
        },
    },
    {
        name: "introduction",
        path: "/getting-started/introduction",
        component: introduction,
    },
    {
        name: "installation",
        path: "/getting-started/installation",
        component: installation,
    },
];

export default routes;
