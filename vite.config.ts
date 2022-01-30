import path from "path";

import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import {defineConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "Bienta",
            fileName: format => `bienta.${format}.js`,
        },
        rollupOptions: {
            output: {
                exports: "named",
            },
        },
    },
    css: {
        postcss: {
            plugins: [autoprefixer()],
        },
    },
    plugins: [tsconfigPaths(), vue()],
});
