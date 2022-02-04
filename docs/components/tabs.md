# Tabs

<b-flex align="center" class="preview" gap="1rem">
    <b-tablist v-model="tab">
        <b-tabpanel icon-badge="3" icon-name="cat" label="Tab 1">Panel 1</b-tabpanel>
        <b-tabpanel label="Tab 2">Panel 2</b-tabpanel>
        <b-tabpanel disabled label="Tab 3">Panel 3</b-tabpanel>
    </b-tablist>
</b-flex>

```html
<b-tablist v-model="tab">
    <b-tabpanel icon-badge="3" icon-name="cat" label="Tab 1">Panel 1</b-tabpanel>
    <b-tabpanel label="Tab 2">Panel 2</b-tabpanel>
    <b-tabpanel disabled label="Tab 3">Panel 3</b-tabpanel>
</b-tablist>
```

## Properties

### Tablist

| Name    | Type     | Default | Description                 |
|---------|----------|---------|-----------------------------|
| v-model | `number` | `0`     | Two-way value data binding. |

### Tabpanel

| Name       | Type                 | Default | Description                     |
|------------|----------------------|---------|---------------------------------|
| badge      | `number` or `string` |         | Badge content.                  |
| disabled   | `boolean`            | `false` | Disable state flag.             |
| icon-name  | `string`             |         | Icon name.                      |
| icon-badge | `number` or `string` |         | Icon badge content.             |
| icon-pack  | `boolean`            |         | Icon flip flag.                 |
| label      | `string`             |         | Component label. **[required]** |

<script setup>
import {ref} from "vue";

const tab = ref(0);
</script>
