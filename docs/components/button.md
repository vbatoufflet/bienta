# Button

## Basic

<b-flex align="center" class="preview" gap="1rem">
    <b-button>Button</b-button>
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-button disabled>Button</b-button>
    <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
</b-flex>

```html
<b-button>Button</b-button>

<b-button disabled>Button</b-button>
```

## Badge

<b-flex align="center" class="preview" gap="1rem">
    <b-button badge="42">Messages</b-button>
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-button badge="42" disabled>Messages</b-button>
    <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
</b-flex>

```html
<b-button badge="42">Messages</b-button>

<b-button badge="42" disabled>Messages</b-button>
```

## Icon

<b-flex align="center" class="preview" gap="1rem">
    <b-button icon-name="cat" />
    <b-button icon-name="save">Save</b-button>
    <b-button icon-badge="42" icon-name="envelope">Messages</b-button>
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-button disabled icon-name="cat" />
    <b-button disabled icon-name="save">Save</b-button>
    <b-button disabled icon-badge="42" icon-name="envelope">Messages</b-button>
    <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
</b-flex>

```html
<b-button icon-name="cat" />
<b-button icon-name="save">Save</b-button>
<b-button icon-badge="42" icon-name="envelope">Messages</b-button>

<b-button disabled icon-name="cat" />
<b-button disabled icon-name="save">Save</b-button>
<b-button disabled icon-badge="42" icon-name="envelope">Messages</b-button>
```

## Colored

<b-flex align="center" class="preview" gap="1rem" wrap="wrap">
    <b-button color="primary">Primary</b-button>
    <b-button color="success">Success</b-button>
    <b-button color="warning">Warning</b-button>
    <b-button color="danger">Danger</b-button>
</b-flex>
<b-flex align="center" class="preview" gap="1rem" wrap="wrap">
    <b-button disabled color="primary">Primary</b-button>
    <b-button disabled color="success">Success</b-button>
    <b-button disabled color="warning">Warning</b-button>
    <b-button disabled color="danger">Danger</b-button>
    <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
</b-flex>

```html
<b-button color="primary">Primary</b-button>
<b-button color="success">Success</b-button>
<b-button color="warning">Warning</b-button>
<b-button color="danger">Danger</b-button>

<b-button disabled color="primary">Primary</b-button>
<b-button disabled color="success">Success</b-button>
<b-button disabled color="warning">Warning</b-button>
<b-button disabled color="danger">Danger</b-button>
```

## Dropdown

<b-flex align="center" class="preview" gap="1rem">
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
            <b-input v-model="input" />
            <b-checkbox v-model="checkbox" type="toggle">Check me</b-checkbox>
            <b-separator orientation="horizontal" />
            <b-button>Item 1</b-button>
            <b-separator orientation="horizontal" />
            <b-button>Item 2</b-button>
            <b-button>Item 3</b-button>
        </template>
    </b-button>
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
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

```html
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
        <b-input v-model="input" />
        <b-checkbox v-model="checkbox" type="toggle">Check me</b-checkbox>
        <b-separator orientation="horizontal" />
        <b-button>Item 1</b-button>
        <b-separator orientation="horizontal" />
        <b-button>Item 2</b-button>
        <b-button>Item 3</b-button>
    </template>
</b-button>

<b-button disabled>
    <template #dropdown>[…]</template>
</b-button>
<b-button disabled>
    Menu
    <template #dropdown>[…]</template>
</b-button>
<b-button disabled icon-name="cat">
    <template #dropdown>[…]</template>
</b-button>
```

## Properties

| Name            | Type                                                                                  | Default         | Description                                                       |
|-----------------|---------------------------------------------------------------------------------------|-----------------|-------------------------------------------------------------------|
| badge           | `number` or `string`                                                                  |                 | Badge content.                                                    |
| badge-color     | `"danger"`, `"info"`, `"success"` or `"warning"`                                      |                 | Badge color.                                                      |
| color           | `"danger"`, `"info"`, `"success"` or `"warning"`                                      |                 | Button color.                                                     |
| controls        | `string`                                                                              |                 | Value to set `aria-controls` property to.                         |
| disabled        | `boolean`                                                                             | `false`         | Disable state flag.                                               |
| dropdown-anchor | `"bottom-left"`, `"bottom-right"`, `"left"`, `"right"`, `"top-left"` or `"top-right"` | `"bottom-left"` | Dropdown menu anchor.                                             |
| dropdown-icon   | `string`                                                                              |                 | Dropdown icon override.                                           |
| href            | `string`                                                                              |                 | Value to set `href` property to.                                  |
| icon-name       | `string`                                                                              |                 | Icon name.                                                        |
| icon-badge      | `number` or `string`                                                                  |                 | Icon badge content.                                               |
| icon-pack       | `boolean`                                                                             |                 | Icon flip flag.                                                   |
| label           | `string`                                                                              |                 | Component label.                                                  |
| target          | `string`                                                                              |                 | Value to set the anchor element `target` property to.             |
| to              | `string` or `Location`                                                                |                 | Value to set the `to` property to (used by `<router-link>` tags). |
| tabindex        | `number`                                                                              |                 | Value to set the anchor element `tabindex` property to.           |
| type            | `"button"`, `"reset"` or `"submit"`                                                   | `"button"`      | Button type.                                                      |

<script setup>
import {ref} from "vue";

const input = ref("");
const checkbox = ref(false);
</script>
