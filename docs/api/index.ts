import {RouteRecordRaw} from "vue-router";

import modal from "./modal.md";
import options from "./options.md";
import shortcuts from "./shortcuts.md";
import theme from "./theme.md";

const routes: RouteRecordRaw[] = [
    {name: "api", path: "/api", redirect: {name: "options-api"}},
    {name: "options-api", path: "/api/options", component: options},
    {name: "theme-api", path: "/api/theme", component: theme},
    {name: "modal-api", path: "/api/modal", component: modal},
    {name: "shortcuts-api", path: "/api/shortcuts", component: shortcuts},
];

export default routes;
