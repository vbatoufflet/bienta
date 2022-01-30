import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import {defineConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import pkg from "../package.json";

export default defineConfig({
    css: {
        postcss: {
            plugins: [autoprefixer()],
        },
    },
    define: {
        VERSION: `"v${pkg.version}"`,
    },
    plugins: [tsconfigPaths(), vue()],
});
