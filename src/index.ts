import {App, Component, ExtractPropTypes, inject, nextTick, reactive, watch} from "vue";

import * as components from "~src/components";
import {closeModal, openModal} from "~src/components/modal";
import * as directives from "~src/directives";
import {mergeObjects} from "~src/helpers";
import {withDefaults} from "~src/options";
import themes, {switchTheme} from "~src/themes";
import {DeepRequired, Options, State, Theme} from "~types";

// eslint-disable-next-line import/no-unassigned-import
import "./style/index.scss";

const injectKey = "bienta";

export class Bienta {
    public container: HTMLElement | undefined;
    public options: DeepRequired<Options>;
    public state: State;

    private app: App | undefined;

    constructor(opts?: Options) {
        this.options = withDefaults(opts);

        const state: State = {
            shortcut: {
                enable: this.options.shortcuts,
                map: new Map(),
                modifiers: {alt: false, control: false, meta: false, shift: false},
            },
            sidebar: {
                size: undefined,
            },
            tooltip: {
                mount: false,
            },
        };

        if (this.options.persistState) {
            this.loadState(state);
        }

        this.state = reactive<State>(state);
    }

    public closeModal(value?: unknown, reject = false): void {
        closeModal(value, reject);
    }

    public install(app: App): void {
        this.app = app;

        app.config.globalProperties.$bienta = this;
        app.provide(injectKey, this);

        for (const component of Object.values(components)) {
            app.component(component.name, component);
        }

        for (const directive of Object.values(directives)) {
            app.directive(directive.name, directive);
        }

        // Define CSS custom properties from theme on application container. Once applied, remove
        // transient "preload" class from it.
        nextTick(() => {
            this.container = app._container as HTMLElement;
            switchTheme(this.container, this.options.theme);
            this.container.classList.replace("preload", "b-app");
            this.container.setAttribute("role", "application");

            // Disable double-tap zoom globally. Thus, attach empty listener as
            // "touch-action: manipulation" requires its associated element to be clickable.
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            this.container.addEventListener("click", () => {});
        });

        if (this.options.persistState) {
            watch(this.state, () => this.persistState(), {immediate: true});
        }
    }

    public openModal<T = unknown>(
        component: Component<T>,
        props: Partial<ExtractPropTypes<T>>,
    ): Promise<unknown> {
        if (!this.app) {
            return Promise.reject("cannot get application");
        }

        return openModal(this.app, component, props);
    }

    public switchTheme(name: string | null): void;
    public switchTheme(name: "external", theme: Theme): void;
    public switchTheme(name: string | null, theme?: Theme): void {
        if (this.container) {
            switchTheme(this.container, name, theme);
        }
    }

    public get themes(): Record<string, Theme> {
        return themes;
    }

    public toggleShortcuts(state?: boolean): void {
        if (state !== this.state.shortcut.enable) {
            this.state.shortcut.enable = state !== undefined ? state : !this.state.shortcut.enable;
            [...this.state.shortcut.map.values()].forEach(s =>
                s.toogle(this.state.shortcut.enable),
            );
        }
    }

    private loadState(dst: State): void {
        if (!this.options.persistState) {
            return;
        }

        try {
            const data = this.options.persistState.storage.getItem(this.options.persistState.key);
            if (data !== null) {
                mergeObjects(dst, JSON.parse(data));
            }
        } catch {}
    }

    private persistState(): void {
        if (!this.options.persistState) {
            return;
        }

        this.options.persistState.storage?.setItem(
            this.options.persistState.key,
            JSON.stringify({
                shortcut: {
                    enable: this.state.shortcut.enable,
                },
                sidebar: {
                    size: this.state.sidebar.size,
                },
            }),
        );
    }
}

export default Bienta;

export function createBienta(opts?: Options): Bienta {
    return new Bienta(opts);
}

export function useBienta(): Bienta {
    const bienta = inject<Bienta>(injectKey);
    if (!bienta) {
        throw new Error("cannot inject Bienta");
    }

    return bienta;
}
