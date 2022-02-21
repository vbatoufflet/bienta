# List

The `<b-list>` component provides a base building-block for repeatable elements.

<b-list v-model="weekdays" v-model:selection="selection" :item-class="item => ({weekend: item === 'Saturday' || item === 'Sunday'})">
    <template #heading>
        Days
    </template>
    <template #default="item">
        {{ item.value }}
    </template>
</b-list>

```html
<b-list v-model="weekdays" v-model:selection="selection" :item-class="item => ({weekend: item === 'Saturday' || item === 'Sunday'})">
    <template #default="item">
        {{ item.value }}
    </template>
</b-list>
```

## Properties

| Name              | Type        | Default | Description                                |
|-------------------|-------------|---------|--------------------------------------------|
| item-class        | `function`  |         | Dynamic item class toggle function.        |
| v-model           | `unknown[]` |         | Two-way value data binding. **[required]** |
| v-model:selection | `unknown[]` |         | Two-way selection data binding.            |

<script setup>
import {ref} from "vue";

const locale = new Intl.DateTimeFormat("en", {weekday: "long"});
const weekdays = [...new Array(7).keys()].map(i => locale.format(new Date(1970, 0, i + 5)));

const selection = ref([]);
</script>

