module.exports = {
    root: true,
    env: {
        "node": true,
        "vue/setup-compiler-macros": true,
    },
    extends: [
        "@batou.dev/eslint-config-typescript",
        "@vue/prettier",
        "@vue/typescript/recommended",
        "plugin:vue/vue3-recommended",
    ],
    overrides: [
        {
            files: "docs/**/*.vue",
            rules: {"vue/multi-word-component-names": "off"},
        },
    ],
    rules: {
        "vue/component-definition-name-casing": ["error", "kebab-case"],
        "vue/html-indent": ["error", 4],
        "vue/html-quotes": ["error", "double", {avoidEscape: true}],
        "vue/html-self-closing": [
            "error",
            {
                html: {void: "always", normal: "never", component: "always"},
                math: "never",
                svg: "never",
            },
        ],
        "vue/max-attributes-per-line": "off",
        "vue/singleline-html-element-content-newline": "off",
    },
};
