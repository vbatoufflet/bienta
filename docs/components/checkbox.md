# Checkbox

## Basic

<b-flex align="center" class="preview" gap="1rem">
    <b-checkbox v-model="checkbox">Check me</b-checkbox>
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-checkbox v-model="checkbox" disabled>Check me</b-checkbox>
    <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
</b-flex>

```html
<b-checkbox v-model="checkbox">Check me</b-checkbox>

<b-checkbox v-model="checkbox" disabled>Check me</b-checkbox>
```

<b-flex align="center" class="preview" gap="1rem">
    <b-checkbox v-model="checkbox" type="toggle">Toggle me</b-checkbox>
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-checkbox v-model="checkbox" disabled type="toggle">Toggle me</b-checkbox>
    <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
</b-flex>

```html
<b-checkbox v-model="checkbox" type="toggle">Toggle me</b-checkbox>

<b-checkbox v-model="checkbox" disabled type="toggle">Toggle me</b-checkbox>
```

## Properties

| Name     | Type                    | Default   | Description                                |
|----------|-------------------------|-----------|--------------------------------------------|
| disabled | `boolean`               | `false`   | Disable state flag.                        |
| label    | `string`                |           | Component label.                           |
| type     | `"check"` or `"toggle"` | `"check"` | Checkbox type.                             |
| v-model  | `boolean` or `array`    |           | Two-way value data binding. **[required]** |
| value    | `any`                   | `false`   | Value to associate the checkbox with.      |

<script setup>
import {ref} from "vue";

const checkbox = ref(false);
</script>
