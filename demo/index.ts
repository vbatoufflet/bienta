import {createApp} from "vue";

import {createBienta} from "~src";

import demo from "./demo.vue";

createApp(demo).use(createBienta()).mount(document.body);
