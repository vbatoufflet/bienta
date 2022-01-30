<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <b-search
        ref="searchComponent"
        :completion="searchCompletion"
        placeholder="Search for component"
        @select="(item: ComponentRecord) => gotoHash(`#${item.value}`)"
    >
        <template #default="item">
            <b-button
                aria-selected="false"
                :class="{active: item.active}"
                :data-item="item.index"
                role="option"
            >
                {{ item.value.label }}
            </b-button>
        </template>

        <template #empty>
            <b-label class="subtle">No matches</b-label>
        </template>
    </b-search>

    <b-toolbar app :clip="models.leftHeader ? 'left' : undefined">
        <b-button
            v-shortcut="'meta+b'"
            icon-name="bars"
            label="Toggle sidebar"
            @click="toggleSidebar"
        />
        <b-button :badge="version">Bienta</b-button>
        <b-spacer />
        <b-button
            v-shortcut="{keys: '/', tooltip: {nowrap: true}}"
            icon-name="search"
            label="Search for component"
            @click="searchComponent?.toggle(true)"
        />
    </b-toolbar>

    <b-sidebar v-if="sidebar">
        <b-label>Components</b-label>
        <b-button
            v-for="(label, key) in components"
            :key="key"
            :class="{active: hash === `#${key}`}"
            @click="gotoHash(`#${key}`)"
        >
            {{ label }}
        </b-button>
    </b-sidebar>

    <b-main>
        <b-toolbar clip="top">
            <b-button
                v-if="hash === '#shortcut'"
                :badge="$bienta.state.shortcut.enable ? 'Enabled' : 'Disabled'"
                :badge-color="$bienta.state.shortcut.enable ? 'success' : 'warning'"
                @click="$bienta.toggleShortcuts()"
            >
                Toggle shortcuts
            </b-button>
            <b-spacer />
            <b-checkbox v-model="models.leftHeader" type="toggle">Left header</b-checkbox>
            <b-checkbox
                v-model="models.darkMode"
                v-shortcut="{keys: 'alt+t', tooltip: {nowrap: true}}"
                label="Toggle theme"
                type="toggle"
            >
                Dark mode
            </b-checkbox>
        </b-toolbar>

        <h1>{{ components[hash.slice(1)] }}</h1>

        <template v-if="hash === '#badge'">
            <h2>Basic</h2>
            <b-flex align="center" gap="1rem">
                <b-badge>text</b-badge>
                <b-badge>42</b-badge>
            </b-flex>

            <h2>Typed</h2>
            <b-flex align="center" gap="1rem" wrap="wrap">
                <b-badge color="info">Info</b-badge>
                <b-badge color="success">Success</b-badge>
                <b-badge color="warning">Warning</b-badge>
                <b-badge color="danger">Danger</b-badge>
            </b-flex>

            <h2>Button</h2>
            <b-flex align="center" gap="1rem">
                <b-button badge="3">Messages</b-button>
                <b-button badge="3" icon-name="envelope">Messages</b-button>
                <b-button icon-badge="3" icon-name="envelope">Messages</b-button>
            </b-flex>

            <h2>Icon</h2>
            <b-icon badge="3" name="envelope" />
        </template>

        <template v-if="hash === '#button'">
            <h2>Basic</h2>
            <b-flex align="center" gap="1rem">
                <b-button>Button</b-button>
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-button disabled>Button</b-button>
                <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
            </b-flex>

            <h2>Icon</h2>
            <b-flex align="center" gap="1rem">
                <b-button v-tooltip="'Meow!'" icon-name="cat" />
                <b-button icon-name="save">Save</b-button>
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-button v-tooltip="'Meow!'" disabled icon-name="cat" />
                <b-button disabled icon-name="save">Save</b-button>
                <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
            </b-flex>

            <h2>Typed</h2>
            <b-flex align="center" gap="1rem" wrap="wrap">
                <b-button color="primary">Primary</b-button>
                <b-button color="success">Success</b-button>
                <b-button color="warning">Warning</b-button>
                <b-button color="danger">Danger</b-button>
            </b-flex>
            <b-flex align="center" gap="1rem" wrap="wrap">
                <b-button disabled color="primary">Primary</b-button>
                <b-button disabled color="success">Success</b-button>
                <b-button disabled color="warning">Warning</b-button>
                <b-button disabled color="danger">Danger</b-button>
                <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
            </b-flex>

            <h2>Dropdown</h2>
            <b-flex align="center" gap="1rem">
                <b-button>
                    <template #dropdown>
                        <b-button icon-name="cat">Item 1</b-button>
                        <b-separator orientation="horizontal" />
                        <b-button icon-name="">Item 2</b-button>
                        <b-button icon-name="">Item 3</b-button>
                    </template>
                </b-button>
                <b-button>
                    Menu
                    <template #dropdown>
                        <b-button>Item 1</b-button>
                        <b-separator orientation="horizontal" />
                        <b-button dropdown-anchor="left">
                            Item 2
                            <template #dropdown>
                                <b-button>Subitem 1</b-button>
                                <b-button>Subitem 2</b-button>
                            </template>
                        </b-button>
                        <b-button>Item 3</b-button>
                    </template>
                </b-button>
                <b-button icon-name="cat">
                    <template #dropdown>
                        <b-label>Label</b-label>
                        <b-input v-model="models.input" />
                        <b-checkbox v-model="models.checkbox" type="toggle">Check me</b-checkbox>
                        <b-separator orientation="horizontal" />
                        <b-button>Item 1</b-button>
                        <b-separator orientation="horizontal" />
                        <b-button>Item 2</b-button>
                        <b-button>Item 3</b-button>
                    </template>
                </b-button>
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-button disabled>
                    <template #dropdown></template>
                </b-button>
                <b-button disabled>
                    Menu
                    <template #dropdown></template>
                </b-button>
                <b-button disabled icon-name="cat">
                    <template #dropdown></template>
                </b-button>
                <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
            </b-flex>
        </template>

        <template v-else-if="hash === '#checkbox'">
            <h2>Basic</h2>
            <b-flex align="center" gap="1rem">
                <b-checkbox v-model="models.checkbox">Check me</b-checkbox>
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-checkbox v-model="models.checkbox" disabled>Check me</b-checkbox>
                <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
            </b-flex>

            <h2>Toggle</h2>
            <b-flex align="center" gap="1rem">
                <b-checkbox v-model="models.checkbox" type="toggle">Toggle me</b-checkbox>
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-checkbox v-model="models.checkbox" disabled type="toggle">Toggle me</b-checkbox>
                <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
            </b-flex>
        </template>

        <template v-else-if="hash === '#color'">
            <h2>Basic</h2>
            <b-flex align="center" gap="1rem">
                <b-color v-model="models.color" placeholder="Pick a color…" />
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-color v-model="models.color" placeholder="Pick a color…" readonly />
                <b-label class="subtle" icon-name="arrow-left">Read-only</b-label>
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-color v-model="models.color" disabled placeholder="Pick a color…" />
                <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
            </b-flex>

            <h2>Alpha</h2>
            <b-flex align="center" gap="1rem">
                <b-color v-model="models.colorAlpha" alpha placeholder="Pick a color…" />
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-color v-model="models.colorAlpha" alpha placeholder="Pick a color…" readonly />
                <b-label class="subtle" icon-name="arrow-left">Read-only</b-label>
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-color v-model="models.colorAlpha" alpha disabled placeholder="Pick a color…" />
                <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
            </b-flex>
        </template>

        <template v-else-if="hash === '#form'">
            <b-form>
                <b-flex direction="column" gap="1rem">
                    <b-taglist
                        v-model="models.tags"
                        icon-name="tags"
                        pattern="\w+(?:-\w+){0,}"
                        placeholder="Required tags"
                        required
                        separators=" ,"
                    />
                    <b-input
                        v-model="models.input"
                        icon-name="font"
                        placeholder="Required text"
                        required
                    />
                    <b-input
                        v-model="models.input"
                        icon-name="hashtag"
                        placeholder="Required number"
                        required
                        type="number"
                    />
                    <b-input
                        v-model="models.input"
                        icon-name="asterisk"
                        pattern="a+"
                        placeholder='Text matching "a+" pattern'
                    />
                    <b-select
                        v-model="models.input"
                        icon-name="calendar"
                        :options="weekdays"
                        placeholder="Required select"
                        required
                    />
                    <b-color v-model="models.input" placeholder="Required color" required />

                    <b-separator orientation="horizontal" />

                    <b-flex>
                        <b-button color="primary" type="submit">Submit</b-button>
                        <b-button type="reset">Reset</b-button>
                    </b-flex>
                </b-flex>
            </b-form>
        </template>

        <template v-else-if="hash === '#input'">
            <h2>Basic</h2>
            <b-flex align="center" gap="1rem">
                <b-input
                    v-model="models.input"
                    help="Some help here"
                    placeholder="A placeholder here"
                />
                <b-input v-model="models.inputNumber" icon-name="hashtag" type="number" />
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-input
                    v-model="models.input"
                    readonly
                    help="Some help here"
                    placeholder="A placeholder here"
                />
                <b-input v-model="models.inputNumber" readonly icon-name="hashtag" type="number" />
                <b-label class="subtle" icon-name="arrow-left">Read-only</b-label>
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-input
                    v-model="models.input"
                    disabled
                    help="Some help here"
                    placeholder="A placeholder here"
                />
                <b-input v-model="models.inputNumber" disabled icon-name="hashtag" type="number" />
                <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
            </b-flex>

            <h2>Completion</h2>
            <b-input
                v-model="models.completion"
                :completion="inputCompletion"
                icon-name="search"
                placeholder="Enter “t”"
                type="search"
            />

            <h2>Textarea</h2>
            <b-flex align="center" gap="1rem">
                <b-input
                    v-model="models.inputTextarea"
                    help="Some help here"
                    placeholder="A placeholder here"
                    type="textarea"
                />
                <b-input v-model="models.inputTextarea" icon-name="pencil" type="textarea" />
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-input
                    v-model="models.inputTextarea"
                    readonly
                    help="Some help here"
                    placeholder="A placeholder here"
                    type="textarea"
                />
                <b-input
                    v-model="models.inputTextarea"
                    readonly
                    icon-name="pencil"
                    type="textarea"
                />
                <b-label class="subtle" icon-name="arrow-left">Read-only</b-label>
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-input
                    v-model="models.inputTextarea"
                    disabled
                    help="Some help here"
                    placeholder="A placeholder here"
                    type="textarea"
                />
                <b-input
                    v-model="models.inputTextarea"
                    disabled
                    icon-name="pencil"
                    type="textarea"
                />
                <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
            </b-flex>
        </template>

        <template v-else-if="hash === '#icon'">
            <p>
                You can use any icon from
                <a href="https://fontawesome.com/icons">Font Awesome</a> or
                <a href="https://material.io/icons">Material</a> along with Bienta.
            </p>

            <h2>Font Awesome</h2>
            <b-icon name="cat" pack="font-awesome" />

            <h2>Material</h2>
            <b-icon name="tips_and_updates" pack="material" />
        </template>

        <template v-else-if="hash === '#label'">
            <h2>Basic</h2>
            <b-label>Label</b-label>

            <h2>Icon</h2>
            <b-label icon-name="dragon">Dragons</b-label>

            <h2>Badge</h2>
            <b-flex align="center" gap="2rem">
                <b-label badge="!">Dragons</b-label>
                <b-label icon-name="dragon" icon-badge="!">Dragons</b-label>
            </b-flex>
        </template>

        <template v-else-if="hash === '#markdown'">
            <b-markdown :content="'Sample text attributes _italic_, **bold** and `monospace`.'" />
        </template>

        <template v-else-if="hash === '#message'">
            <h2>Basic</h2>
            <b-message type="info">An info message</b-message>
            <b-message type="success">A success message</b-message>
            <b-message type="warning">A warning message</b-message>
            <b-message type="error">An error message</b-message>
            <b-message icon-name="cat">A custom message</b-message>

            <h2>Inline</h2>
            <b-flex align="center" gap="1rem">
                <b-message inline type="info">An info message</b-message>
                <b-message inline type="success">A success message</b-message>
                <b-message inline type="warning">A warning message</b-message>
                <b-message inline type="error">An error message</b-message>
                <b-message icon-name="cat" inline>A custom message</b-message>
            </b-flex>
        </template>

        <template v-else-if="hash === '#modal'">
            <b-button @click="openModal">Toss</b-button>
        </template>

        <template v-else-if="hash === '#pagination'">
            <b-flex direction="column" gap="2rem">
                <b-pagination v-model="models.page" :pages="2" />
                <b-pagination v-model="models.page" :pages="5" />
                <b-pagination v-model="models.page" :pages="10" />
            </b-flex>
        </template>

        <template v-else-if="hash === '#radio'">
            <b-radiogroup>
                <b-flex align="center" gap="1rem">
                    <b-radio v-model="models.radio" value="1">Value 1</b-radio>
                    <b-radio v-model="models.radio" value="2">Value 2</b-radio>
                    <b-radio v-model="models.radio" value="3">Value 3</b-radio>
                </b-flex>
            </b-radiogroup>
            <b-radiogroup>
                <b-flex align="center" gap="1rem">
                    <b-radio v-model="models.radio" disabled value="1">Value 1</b-radio>
                    <b-radio v-model="models.radio" disabled value="2">Value 2</b-radio>
                    <b-radio v-model="models.radio" disabled value="3">Value 3</b-radio>
                    <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
                </b-flex>
            </b-radiogroup>
        </template>

        <template v-else-if="hash === '#select'">
            <h2>Select</h2>
            <b-flex align="center" gap="1rem">
                <b-select
                    v-model="models.select"
                    icon-name="calendar"
                    :options="weekdays"
                    placeholder="Pick a day…"
                />
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-select
                    v-model="models.select"
                    disabled
                    icon-name="calendar"
                    :options="weekdays"
                    placeholder="Pick a day…"
                />
                <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
            </b-flex>

            <h2>Async options</h2>
            <b-flex align="center" gap="1rem">
                <b-select
                    v-model="models.select"
                    icon-name="calendar"
                    :options="asyncWeekdays"
                    placeholder="Pick a day…"
                />
            </b-flex>
        </template>

        <template v-else-if="hash === '#shortcut'">
            <b-list v-model="shortcuts">
                <template #default="item">
                    <b-flex align="center" gap="1rem">
                        <b-badge>{{ item.value[0] }}</b-badge>
                        <b-label>{{ item.value[1].help }}</b-label>
                    </b-flex>
                </template>
            </b-list>
        </template>

        <template v-else-if="hash === '#spinner'">
            <b-list v-model="spinnerSizes">
                <template #default="item">
                    <b-flex align="center">
                        <span class="spinner-size">{{ item.value ?? "default" }}</span>
                        <b-spinner :size="item.value" />
                    </b-flex>
                </template>
            </b-list>
        </template>

        <template v-else-if="hash === '#slider'">
            <h2>Basic</h2>
            <b-flex align="center" gap="1rem">
                <b-slider v-model="models.slider" />
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-slider v-model="models.slider" disabled />
                <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
            </b-flex>

            <h2>Range</h2>
            <b-flex align="center" gap="1rem">
                <b-slider v-model="models.range" />
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-slider v-model="models.range" disabled />
                <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
            </b-flex>
        </template>

        <template v-else-if="hash === '#tabs'">
            <b-tablist v-model="models.tab">
                <b-tabpanel icon-badge="3" icon-name="cat" label="Tab 1">Panel 1</b-tabpanel>
                <b-tabpanel label="Tab 2">Panel 2</b-tabpanel>
                <b-tabpanel disabled label="Tab 3">Panel 3</b-tabpanel>
            </b-tablist>
        </template>

        <template v-else-if="hash === '#taglist'">
            <h2>Basic</h2>
            <b-flex align="center" gap="1rem">
                <b-taglist
                    v-model="models.tags"
                    icon-name="tags"
                    pattern="\w+(?:-\w+){0,}"
                    placeholder="Enter tags"
                    separators=" ,"
                />
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-taglist
                    v-model="models.tags"
                    icon-name="tags"
                    pattern="\w+(?:-\w+){0,}"
                    placeholder="Enter tags"
                    readonly
                    separators=" ,"
                />
                <b-label class="subtle" icon-name="arrow-left">Read-only</b-label>
            </b-flex>
            <b-flex align="center" gap="1rem">
                <b-taglist
                    v-model="models.tags"
                    disabled
                    icon-name="tags"
                    pattern="\w+(?:-\w+){0,}"
                    placeholder="Enter tags"
                    separators=" ,"
                />
                <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
            </b-flex>
        </template>
    </b-main>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, watch} from "vue";

import {useBienta} from "~src/inject";
import {CompletionItem, SearchPublicInstance} from "~types";

import modal from "./modal.vue";

interface ComponentRecord {
    label: string;
    value: string;
}

/* global VERSION */
const version = VERSION;

const components: Record<string, string> = {
    badge: "Badge",
    button: "Button",
    checkbox: "Checkbox",
    color: "Color",
    form: "Form",
    icon: "Icon",
    input: "Input",
    label: "Label",
    markdown: "Markdown",
    message: "Message",
    modal: "Modal",
    pagination: "Pagination",
    radio: "Radio",
    select: "Select",
    shortcut: "Shortcut",
    slider: "Slider",
    spinner: "Spinner",
    tabs: "Tabs",
    taglist: "Tag list",
};

const locale = new Intl.DateTimeFormat("en", {weekday: "long"});
const spinnerSizes = [16, 24, 32, undefined];
const weekdays = [...new Array(7).keys()].map(i => locale.format(new Date(1970, 0, i + 5)));

const bienta = useBienta();

const hash = ref("");

const models = ref({
    checkbox: false,
    checkbox2: [],
    color: "#f9a825",
    colorAlpha: "#c6282880",
    completion: "",
    darkMode: matchMedia("(prefers-color-scheme: dark)").matches,
    input: "",
    inputNumber: 42,
    inputTextarea: "This is a sample text!",
    leftHeader: false,
    page: 1,
    radio: "1",
    range: [42, 100],
    select: locale.format(),
    slider: 42,
    tab: 0,
    tags: [
        "first",
        "second",
        "third",
        "fourth",
        "fifth",
        "sixth",
        "seventh",
        "eighth",
        "ninth",
        "tenth",
    ],
});

const searchComponent = ref<SearchPublicInstance>();
const sidebar = ref(true);

const shortcuts = computed(() =>
    [...bienta.state.shortcut.map.entries()].sort((a, b) => a[0].localeCompare(b[0])),
);

const asyncWeekdays = (filter?: string) => {
    return new Promise(resolve =>
        setTimeout(
            () =>
                resolve(
                    filter
                        ? weekdays.filter(v => v.toLowerCase().includes(filter.toLowerCase()))
                        : weekdays,
                ),
            250,
        ),
    );
};

const gotoHash = (value: string) => {
    hash.value = value;
    location.hash = value;
};

const inputCompletion = (value: string): Promise<CompletionItem<string>[]> => {
    return Promise.resolve(weekdays.filter(v => v.toLowerCase().includes(value.toLowerCase())));
};

const openModal = () => {
    bienta.openModal(modal, {}).then(
        value => {
            alert(`fulfilled: ${value}`);
        },
        err => {
            alert(`rejected: ${err}`);
        },
    );
};

const searchCompletion = (value: string): Promise<CompletionItem<string>[]> => {
    value = value.toLowerCase();

    return Promise.resolve(
        Object.entries(components).reduce<ComponentRecord[]>((out, [key, label]) => {
            if (key.includes(value) || label.toLowerCase().includes(value)) {
                out.push({label, value: key});
            }
            return out;
        }, []),
    );
};

const toggleSidebar = () => {
    sidebar.value = !sidebar.value;
};

onMounted(() => {
    if (!location.hash) {
        gotoHash(`#${Object.keys(components)[0]}`);
        return;
    }

    hash.value = location.hash;

    window.addEventListener("hashchange", () => {
        hash.value = location.hash;
        if (document.scrollingElement) {
            document.scrollingElement.scrollTop = 0;
        }
    });
});

watch(
    () => models.value.darkMode,
    to => bienta.switchTheme(to ? "dark" : "light"),
);
</script>

<style lang="scss">
$fa-font-path: "../node_modules/@fortawesome/fontawesome-free/webfonts";
@import "../node_modules/@fortawesome/fontawesome-free/scss/fontawesome";
@import "../node_modules/@fortawesome/fontawesome-free/scss/solid";

@import "material-icons/iconfont/material-icons.css";

.b-flex + .b-flex {
    margin-top: 1rem;
}

.b-form {
    max-width: 25rem;
}

.spinner-size {
    flex-basis: 5rem;
}

.subtle {
    opacity: var(--disable-opacity);
}
</style>
