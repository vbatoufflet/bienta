# Pagination

<b-flex class="preview" direction="column" gap="2rem">
    <b-pagination v-model="page" :pages="2" />
    <b-pagination v-model="page" :pages="5" />
    <b-pagination v-model="page" :pages="10" />
</b-flex>

```html
<b-pagination v-model="page" :pages="2" />
<b-pagination v-model="page" :pages="5" />
<b-pagination v-model="page" :pages="10" />
```

## Properties

| Name      | Type     | Default | Description                                |
|-----------|----------|---------|--------------------------------------------|
| adjacency | `number` | `1`     | Pages adjacency.                           |
| label     | `string` |         | Component label.                           |
| pages     | `number` |         | Total number of pages. **[required]**      |
| v-model   | `number` |         | Two-way value data binding. **[required]** |

<script setup>
import {ref} from "vue";

const page = ref(1);
</script>
