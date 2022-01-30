import {Theme} from "~types";

import common from "./common";
import dark from "./dark";
import light from "./light";

export function detectTheme(): string {
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function switchTheme(el: HTMLElement, name: string | null, theme?: Theme): void {
    if (!name) {
        name = detectTheme();
    }

    const props = name === "external" ? theme : themes[name];
    if (!props) {
        throw new Error(`unsupported theme: ${name}`);
    }

    el.removeAttribute("style");
    Object.entries({...common, ...props}).forEach(([key, value]) => {
        if (key !== "name") {
            el.style.setProperty(`--${key}`, value);
        }
    });

    el.dataset.theme = name;
}

const themes = Object.entries({
    dark,
    light,
}).reduce<Record<string, Theme>>((out, [name, theme]) => {
    out[name] = {...common, ...theme};
    return out;
}, {});

export default themes;
