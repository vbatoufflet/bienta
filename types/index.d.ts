import {App, Component, ComponentPublicInstance, ExtractPropTypes} from "vue";

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $bienta: Bienta;
    }
}

export declare type DeepPartial<T> = {[K in keyof T]?: DeepPartial<T[K]>};

export declare type DeepRequired<T> = T extends
    | Function // eslint-disable-line @typescript-eslint/ban-types
    | boolean
    | number
    | string
    | null
    | undefined
    ? T
    : {[K in keyof T]-?: T[K] extends (infer U)[] ? DeepRequired<U>[] : DeepRequired<T[K]>};

export declare class Bienta {
    public readonly options: DeepRequired<Options>;
    public readonly state: State;

    constructor(opts: Options);

    public closeModal(value?: unknown, reject?: boolean): void;

    public install(app: App): void;

    public openModal<T = unknown>(
        component: Component<T>,
        props: Partial<ExtractPropTypes<T>>,
    ): Promise<unknown>;

    public switchTheme(name: string | null): void;
    public switchTheme(name: "external", theme: Theme): void;

    public get themes(): Record<string, Theme>;

    public toggleShortcuts(state?: boolean): void;
}

export declare interface Options {
    iconPack?: IconPack;
    persistState?: false | {key?: string; storage?: Storage};
    shortcuts?: boolean;
    theme?: string;
}

export declare function createBienta(opts?: Options): Bienta;

export declare function useBienta(): Bienta;

export declare interface State {
    shortcut: ShortcutState;
    sidebar: SidebarState;
    tooltip: TooltipState;
}

export declare interface Theme {
    name: string;
    [key: string]: string;
}

export declare type CompletionFunc<T> = (value: T) => Promise<CompletionItem<T>[]>;

export declare type CompletionItem<T> = T | (unknown & {value: T});

export declare type PublicInstance<T = unknown, U = HTMLElement> = Omit<
    ComponentPublicInstance<T>,
    "$el"
> & {$el: U};

export declare type BadgeColor = "danger" | "info" | "success" | "warning";

export declare type BadgePublicInstance = PublicInstance;

export declare type ButtonColor = "danger" | "primary" | "success" | "warning";

export declare type ButtonType = "button" | "reset" | "submit";

export declare type ButtonPublicInstance = PublicInstance<{
    focus(): void;
}>;

export declare type CheckboxType = "check" | "toggle";

export declare type CheckboxPublicInstance = PublicInstance<{
    focus(): void;
    toggle(): void;
}>;

export declare type ColorCase = "lower" | "upper";

export declare type ColorPublicInstance = PublicInstance<{
    checkValidity(): boolean;
    focus(select?: boolean): void;
    reportValidity(): boolean;
}>;

export declare type DropdownAnchor =
    | "bottom-left"
    | "bottom-right"
    | "left"
    | "right"
    | "top-left"
    | "top-right";

export declare type DropdownPublicInstance = PublicInstance<{
    isActive(): boolean;
    toggle(state?: boolean): boolean;
}>;

export declare type FlexAlign = "baseline" | "center" | "end" | "normal" | "start" | "stretch";

export declare type FlexDirection = "column-reverse" | "column" | "row-reverse" | "row";

export declare type FlexJustify =
    | "around"
    | "between"
    | "center"
    | "end"
    | "evenly"
    | "normal"
    | "start";

export declare type FlexWrap = "nowrap" | "wrap-reverse" | "wrap";

export declare type FlexPublicInstance = PublicInstance;

export declare type FormPublicInstance = PublicInstance<{
    reset(): void;
    submit(): void;
}>;

export declare type IconPack = "font-awesome" | "material";

export declare type IconPublicInstance = PublicInstance;

export declare type InputType =
    | "email"
    | "file"
    | "number"
    | "password"
    | "search"
    | "text"
    | "textarea"
    | "url";

export declare type InputPublicInstance = PublicInstance<{
    checkValidity(): boolean;
    focus(select?: boolean): void;
    reportValidity(): boolean;
}>;

export declare type LabelPublicInstance = PublicInstance;

export declare type ListPublicInstance = PublicInstance<{
    selectAll(state?: boolean): void;
}>;

export declare type MainPublicInstance = PublicInstance;

export declare type MarkdownPublicInstance = PublicInstance;

export declare type MessageType = "error" | "info" | "success" | "warning";

export declare type MessagePublicInstance = PublicInstance;

export declare type ModalPublicInstance = PublicInstance;

export declare type PaginationPublicInstance = PublicInstance<{
    switchPage(page: number): void;
}>;

export declare type RadioPublicInstance = PublicInstance<{
    focus(): void;
    toggle(): void;
}>;

export declare type RadiogroupPublicInstance = PublicInstance;

export declare type SearchPublicInstance = PublicInstance<{
    isActive(): boolean;
    toggle(state?: boolean): void;
}>;

export declare type SelectOption =
    | string
    | {
          label: string;
          value: unknown;
      };

export declare type SelectPublicInstance = PublicInstance<{
    checkValidity(): boolean;
    focus(): void;
    reportValidity(): boolean;
}>;

export declare type SeparatorOrientation = "horizontal" | "vertical";

export declare type SeparatorPublicInstance = PublicInstance;

export declare type SidebarClip = "left" | "right";

export declare type SidebarMode = "float" | "static";

export declare type SidebarPublicInstance = PublicInstance;

export declare interface SidebarState {
    size?: number;
}

export declare type SliderPublicInstance = PublicInstance<{
    focus(): void;
}>;

export declare type SpacerPublicInstance = PublicInstance;

export declare type SpinnerPublicInstance = PublicInstance;

export declare type TablistPublicInstance = PublicInstance<{
    switchTab(index: number): void;
}>;

export declare type TabpanelPublicInstance = PublicInstance;

export declare type TaglistPublicInstance = PublicInstance<{
    checkValidity(): boolean;
    focus(): void;
    reportValidity(): boolean;
}>;

export declare type ToolbarClip = "bottom" | "left" | "right" | "top";

export declare type ToolbarPublicInstance = PublicInstance;

export declare interface ShortcutState {
    enable: boolean;
    map: Map<string, ShortcutEntry>;
    modifiers: Record<ModifierKey, boolean>;
}

export declare interface ShortcutEntry {
    help?: string;
    toogle(state: boolean): void;
}

export declare type ModifierKey = "alt" | "control" | "meta" | "shift";

export declare interface TooltipState {
    mount: boolean;
}
