import {RouteRecordRaw} from "vue-router";

import badge from "./badge.md";
import button from "./button.md";
import checkbox from "./checkbox.md";
import color from "./color.md";
import flex from "./flex.md";
import form from "./form.md";
import icon from "./icon.md";
import input from "./input.md";
import label from "./label.md";
import list from "./list.md";
import main from "./main.md";
import markdown from "./markdown.md";
import message from "./message.md";
import pagination from "./pagination.md";
import radio from "./radio.md";
import search from "./search.md";
import select from "./select.md";
import separator from "./separator.md";
import sidebar from "./sidebar.md";
import slider from "./slider.md";
import spacer from "./spacer.md";
import spinner from "./spinner.md";
import tabs from "./tabs.md";
import taglist from "./taglist.md";
import toolbar from "./toolbar.md";

const routes: RouteRecordRaw[] = [
    {name: "components", path: "/components", redirect: {name: "badge-component"}},
    {name: "badge-component", path: "/components/badge", component: badge},
    {name: "button-component", path: "/components/button", component: button},
    {name: "checkbox-component", path: "/components/checkbox", component: checkbox},
    {name: "color-component", path: "/components/color", component: color},
    {name: "flex-component", path: "/components/flex", component: flex},
    {name: "form-component", path: "/components/form", component: form},
    {name: "icon-component", path: "/components/icon", component: icon},
    {name: "input-component", path: "/components/input", component: input},
    {name: "label-component", path: "/components/label", component: label},
    {name: "list-component", path: "/components/list", component: list},
    {name: "main-component", path: "/components/main", component: main},
    {name: "markdown-component", path: "/components/markdown", component: markdown},
    {name: "message-component", path: "/components/message", component: message},
    {name: "pagination-component", path: "/components/pagination", component: pagination},
    {name: "radio-component", path: "/components/radio", component: radio},
    {name: "search-component", path: "/components/search", component: search},
    {name: "select-component", path: "/components/select", component: select},
    {name: "slider-component", path: "/components/slider", component: slider},
    {name: "separator-component", path: "/components/separator", component: separator},
    {name: "sidebar-component", path: "/components/sidebar", component: sidebar},
    {name: "spacer-component", path: "/components/spacer", component: spacer},
    {name: "spinner-component", path: "/components/spinner", component: spinner},
    {name: "tabs-component", path: "/components/tabs", component: tabs},
    {name: "taglist-component", path: "/components/taglist", component: taglist},
    {name: "toolbar-component", path: "/components/toolbar", component: toolbar},
];

export default routes;
