import {deepEqual} from "fast-equals";
import {DirectiveBinding, VNode} from "vue";

import tooltip, {
    ElementWithTooltip,
    ensureTooltipMount,
    handle as handleTooltip,
} from "~src/directives/tooltip";
import {Bienta, ModifierKey} from "~types";
import {NamedDirective} from "~types/vue";

import {codes, macSymbols, platform} from "./vars";

type DocumentWithInstance = Document & {_bienta: Bienta};

type Shortcut =
    | string
    | {
          keys: string;
          confirm?(): Promise<void>;
          tooltip?: boolean | {nowrap: boolean};
      };

interface ShortcutData {
    el: ElementWithTooltip;
    codes: string[];
    key: string;
    modifiers: Record<ModifierKey, boolean>;
    confirm?(): Promise<void>;
}

const directive: NamedDirective = {
    name: "shortcut",
    beforeMount,
    beforeUpdate,
    beforeUnmount,
};

export default directive;

let registered = false;
const shortcuts: Map<string, ShortcutData> = new Map();

function beforeMount(
    el: ElementWithTooltip,
    binding: DirectiveBinding<Shortcut>,
    vnode: VNode,
): void {
    const bienta = binding.instance?.$bienta ?? null;
    if (bienta === null) {
        return;
    }

    const keys = typeof binding.value === "string" ? binding.value : binding.value.keys;

    bienta.state.shortcut.map.set(keys, {
        help: labelFromElement(el),
        toogle: (state: boolean) =>
            state ? beforeMount(el, binding, vnode) : beforeUnmount(el, binding, vnode),
    });
    if (!bienta.state.shortcut.enable) {
        return;
    }

    if (!registered) {
        (document as DocumentWithInstance)._bienta = bienta;
        document.addEventListener("keydown", handleModifiers);
        document.addEventListener("keydown", handle);
        document.addEventListener("keyup", handleModifiers);
        registered = true;
    }

    el._binding = tooltipBinding(el, binding);
    el.dataset.shortcut = keys;

    let key: string | undefined;

    const modifiers: Record<ModifierKey, boolean> = {
        alt: false,
        control: false,
        shift: false,
        meta: false,
    };

    for (const value of splitValue(keys)) {
        if (isModifier(value)) {
            modifiers[value] = true;
        } else if (key) {
            throw new Error(`shortcut cannot contain multiple base keys: ${key} and ${value}`);
        } else {
            key = value;
        }
    }

    if (!key) {
        throw new Error("missing shortcut base key");
    }

    shortcuts.set(keys, {
        el,
        codes: codes[key] ?? [key],
        key,
        modifiers,
        confirm: typeof binding.value !== "string" ? binding.value.confirm : undefined,
    });

    // Automatically setup tooltip and add event listeners if associated directive isn't already
    // attached to the node
    if (!bienta.state.tooltip.mount) {
        ensureTooltipMount(binding, true);
    }

    if (vnode.dirs?.findIndex(dir => dir.dir === tooltip) === -1) {
        el._handler = handleTooltip.bind(el);
        el.addEventListener("pointerenter", el._handler);
        el.addEventListener("pointerleave", el._handler);
        el.addEventListener("pointerup", el._handler);
    }
}

function beforeUpdate(el: ElementWithTooltip, binding: DirectiveBinding<Shortcut>, vnode: VNode) {
    if (binding.oldValue && !deepEqual(binding.oldValue, binding.value)) {
        const bienta = binding.instance?.$bienta ?? null;
        if (bienta === null) {
            return;
        }

        bienta.state.shortcut.map.delete(
            typeof binding.oldValue === "string" ? binding.oldValue : binding.oldValue.keys,
        );

        bienta.state.shortcut.map.set(
            typeof binding.value === "string" ? binding.value : binding.value.keys,
            {
                help: labelFromElement(el),
                toogle: (state: boolean) =>
                    state ? beforeMount(el, binding, vnode) : beforeUnmount(el, binding, vnode),
            },
        );

        if (!bienta.state.shortcut.enable) {
            return;
        }

        el._binding = tooltipBinding(el, binding);
    }
}

function beforeUnmount(
    el: ElementWithTooltip,
    binding: DirectiveBinding<Shortcut>,
    vnode: VNode,
): void {
    delete (el as any)._binding; // eslint-disable-line @typescript-eslint/no-explicit-any
    delete el.dataset.shortcut;

    const keys = typeof binding.value === "string" ? binding.value : binding.value.keys;

    if (shortcuts.has(keys)) {
        shortcuts.delete(keys);

        // Stop listening for shortcuts if none registered
        if (shortcuts.size === 0) {
            delete (document as any)._bienta; // eslint-disable-line @typescript-eslint/no-explicit-any
            document.removeEventListener("keydown", handleModifiers);
            document.removeEventListener("keydown", handle);
            document.removeEventListener("keyup", handleModifiers);
            registered = false;
        }
    }

    // Remove automatically mount tooltip and associated event listeners if any
    if (!binding.instance?.$bienta.state.tooltip.mount) {
        ensureTooltipMount(binding, true);
    }

    if (vnode.dirs?.findIndex(dir => dir.dir === tooltip) === -1) {
        el.removeEventListener("pointerenter", el._handler);
        el.removeEventListener("pointerleave", el._handler);
        el.removeEventListener("pointerup", el._handler);
    }
}

async function handle(ev: KeyboardEvent): Promise<void> {
    // Skip handling when active input-like element or if only a modifier key has been pressed
    if (
        document.activeElement?.matches('input, select, textarea, [contenteditable="true"]') ||
        isModifier(ev.key)
    ) {
        return;
    }

    const shortcut = [...shortcuts.values()].find((shortcut: ShortcutData): boolean => {
        return (
            // Handle codes having modifiers (e.g. "alt+,")
            (shortcut.codes.includes(keyCode(ev.code)) &&
                ev.altKey === shortcut.modifiers.alt &&
                ev.ctrlKey === shortcut.modifiers.control &&
                ev.metaKey === shortcut.modifiers.meta &&
                ev.shiftKey === shortcut.modifiers.shift) ||
            // Handle simple modified codes (e.g. "?" with implicit Shift modifier)
            (ev.key === shortcut.key &&
                !shortcut.modifiers.alt &&
                !ev.altKey &&
                !shortcut.modifiers.control &&
                !ev.ctrlKey &&
                !shortcut.modifiers.meta &&
                !ev.metaKey &&
                !shortcut.modifiers.shift &&
                ev.shiftKey)
        );
    });

    if (shortcut) {
        let confirm = true;
        if (shortcut.confirm) {
            await shortcut.confirm().catch(() => (confirm = false));
        }

        if (confirm) {
            ev.preventDefault();
            shortcut.el.dispatchEvent(new CustomEvent("shortcut"));
        }
    }
}

function handleModifiers(ev: KeyboardEvent) {
    (document as DocumentWithInstance)._bienta.state.shortcut.modifiers =
        ev.type === "keydown"
            ? {alt: ev.altKey, control: ev.ctrlKey, meta: ev.metaKey, shift: ev.shiftKey}
            : {alt: false, control: false, meta: false, shift: false};
}

function isModifier(value: unknown): value is ModifierKey {
    return typeof value === "string"
        ? ["alt", "control", "meta", "shift"].includes(value.toLowerCase())
        : false;
}

function keyCode(key: string): string {
    let code: string = key;

    if (code.startsWith("Digit")) {
        code = code.slice(5);
    } else if (code.startsWith("Key")) {
        code = code.slice(3);
    }

    return code.toLowerCase();
}

function labelFromElement(el: HTMLElement): string | undefined {
    return el.dataset.label ?? el.getAttribute("aria-label") ?? undefined;
}

export function shortcutLabel(value: string[] | string): string {
    if (Array.isArray(value)) {
        value = value[0];
    } else if (typeof value !== "string") {
        throw new TypeError(`invalid shortcut value: "${value}"`);
    }

    return splitValue(value)
        .map(key => {
            switch (platform) {
                case "mac":
                    if (macSymbols[key]) {
                        return `${macSymbols[key]} `;
                    }
                    break;
                case "win":
                    if (key === "meta") {
                        return "Win";
                    }
                    break;
            }

            return key.charAt(0).toUpperCase() + key.slice(1);
        })
        .join(platform === "mac" ? "" : " + ")
        .trimEnd();
}

function splitValue(value: string): string[] {
    return value === "+" ? ["+"] : value.split("+");
}

function tooltipBinding(
    el: ElementWithTooltip,
    binding: DirectiveBinding<Shortcut>,
): DirectiveBinding {
    return {
        instance: binding.instance,
        value:
            typeof binding.value === "string" || (binding.value.tooltip ?? true)
                ? labelFromElement(el)
                : undefined,
        oldValue: null,
        modifiers:
            typeof binding.value === "object" && typeof binding.value.tooltip === "object"
                ? {nowrap: binding.value.tooltip.nowrap}
                : {},
        dir: binding.dir,
    };
}
