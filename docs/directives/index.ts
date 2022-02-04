import {RouteRecordRaw} from "vue-router";

import autofocus from "./autofocus.md";
import shortcut from "./shortcut.md";
import tooltip from "./tooltip.md";

const routes: RouteRecordRaw[] = [
    {name: "directives", path: "/directives", redirect: {name: "badge-directive"}},
    {name: "autofocus-directive", path: "/directives/autofocus", component: autofocus},
    {name: "shortcut-directive", path: "/directives/shortcut", component: shortcut},
    {name: "tooltip-directive", path: "/directives/tooltip", component: tooltip},
];

export default routes;
