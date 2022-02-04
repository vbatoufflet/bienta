# Radio

<b-radiogroup class="preview">
    <b-flex align="center" gap="1rem">
        <b-radio v-model="radio" value="1">Value 1</b-radio>
        <b-radio v-model="radio" value="2">Value 2</b-radio>
        <b-radio v-model="radio" value="3">Value 3</b-radio>
    </b-flex>
</b-radiogroup>

<b-radiogroup class="preview">
    <b-flex align="center" gap="1rem">
        <b-radio v-model="radio" disabled value="1">Value 1</b-radio>
        <b-radio v-model="radio" disabled value="2">Value 2</b-radio>
        <b-radio v-model="radio" disabled value="3">Value 3</b-radio>
        <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
    </b-flex>
</b-radiogroup>

```html
<b-radiogroup>
    <b-radio v-model="radio" value="1">Value 1</b-radio>
    <b-radio v-model="radio" value="2">Value 2</b-radio>
    <b-radio v-model="radio" value="3">Value 3</b-radio>
</b-radiogroup>

<b-radiogroup>
    <b-radio v-model="radio" disabled value="1">Value 1</b-radio>
    <b-radio v-model="radio" disabled value="2">Value 2</b-radio>
    <b-radio v-model="radio" disabled value="3">Value 3</b-radio>
</b-radiogroup>
```

## Properties

| Name     | Type      | Default | Description                                |
|----------|-----------|---------|--------------------------------------------|
| disabled | `boolean` | `false` | Disable state flag.                        |
| v-model  | `any`     |         | Two-way value data binding. **[required]** |
| value    | `any`     | `false` | Value to associate the checkbox with.      |

<script setup>
import {ref} from "vue";

const radio = ref("");
</script>
