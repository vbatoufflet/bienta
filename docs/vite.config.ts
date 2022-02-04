import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import hljs from "highlight.js";
import {defineConfig} from "vite";
import markdown from "vite-plugin-md";
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
    plugins: [
        markdown({
            markdownItOptions: {
                highlight: (str, lang) => {
                    if (lang && hljs.getLanguage(lang)) {
                        try {
                            return hljs.highlight(str, {language: lang}).value;
                        } catch {}
                    }
                    return "";
                },
            },
        }),
        tsconfigPaths(),
        vue({include: [/\.md$/, /\.vue$/]}),
    ],
});
