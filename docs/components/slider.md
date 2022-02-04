# Slider

## Basic

<b-flex align="center" class="preview" gap="1rem">
    <b-slider v-model="slider" />
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-slider v-model="slider" disabled />
    <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
</b-flex>

```html
<b-slider v-model="slider" />

<b-slider v-model="slider" disabled />
```

## Range

<b-flex align="center" class="preview" gap="1rem">
    <b-slider v-model="range" />
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-slider v-model="range" disabled />
    <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
</b-flex>

```html
<b-slider v-model="range" />

<b-slider v-model="range" disabled />
```

## Properties

| Name           | Type                           | Default | Description                                |
|----------------|--------------------------------|---------|--------------------------------------------|
| disabled       | `boolean`                      | `false` | Disable state flag.                        |
| format-tooltip | `function`                     |         | Tooltip content format function.           |
| label          | `string`                       |         | Component label.                           |
| max            | `number`                       | `100`   | Maximum value.                             |
| min            | `number`                       | `0`     | Minimum value.                             |
| step           | `number`                       | `1`     | Increment/Decrement step value.            |
| v-model        | `number` or `[number, number]` |         | Two-way value data binding. **[required]** |

<script setup>
import {ref} from "vue";

const slider = ref(42);
const range = ref([42, 100]);
</script>
