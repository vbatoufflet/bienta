# Color

## Basic

<b-flex align="center" class="preview" gap="1rem">
    <b-color v-model="basic" placeholder="Pick a color…" />
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-color v-model="basic" placeholder="Pick a color…" readonly />
    <b-label class="subtle" icon-name="arrow-left">Read-only</b-label>
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-color v-model="basic" disabled placeholder="Pick a color…" />
    <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
</b-flex>

```html
<b-color v-model="color" placeholder="Pick a color…" />
<b-color v-model="color" placeholder="Pick a color…" readonly />
<b-color v-model="color" disabled placeholder="Pick a color…" />
```

## Alpha

<b-flex align="center" class="preview" gap="1rem">
    <b-color v-model="alpha" alpha placeholder="Pick a color…" />
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-color v-model="alpha" alpha placeholder="Pick a color…" readonly />
    <b-label class="subtle" icon-name="arrow-left">Read-only</b-label>
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-color v-model="alpha" alpha disabled placeholder="Pick a color…" />
    <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
</b-flex>

```html
<b-color v-model="color" alpha placeholder="Pick a color…" />
<b-color v-model="color" alpha placeholder="Pick a color…" readonly />
<b-color v-model="color" alpha disabled placeholder="Pick a color…" />
```

## Properties

| Name        | Type                   | Default   | Description                                |
|-------------|------------------------|-----------|--------------------------------------------|
| alpha       | `boolean`              | `false`   | Alpha channel flag.                        |
| case        | `"lower"` or `"upper"` | `"lower"` | Value letter case.                         |
| disabled    | `boolean`              | `false`   | Disable state flag.                        |
| help        | `string`               |           | Tooltip help message.                      |
| label       | `string`               |           | Component label.                           |
| placeholder | `string`               |           | Placeholder text.                          |
| readonly    | `boolean`              | `false`   | Read-only state flag.                      |
| required    | `boolean`              | `false`   | Required state flag.                       |
| v-model     | `string`               |           | Two-way value data binding. **[required]** |

<script setup>
import {ref} from "vue";

const basic = ref("#f9a825");
const alpha = ref("#c6282880");
</script>
