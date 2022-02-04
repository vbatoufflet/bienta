# Tag list

<b-flex align="center" class="preview" gap="1rem">
    <b-taglist
        v-model="tags"
        icon-name="tags"
        pattern="\w+(?:-\w+){0,}"
        placeholder="Enter tags"
        separators=" ,"
    />
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-taglist
        v-model="tags"
        icon-name="tags"
        pattern="\w+(?:-\w+){0,}"
        placeholder="Enter tags"
        readonly
        separators=" ,"
    />
    <b-label class="subtle" icon-name="arrow-left">Read-only</b-label>
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-taglist
        v-model="tags"
        disabled
        icon-name="tags"
        pattern="\w+(?:-\w+){0,}"
        placeholder="Enter tags"
        separators=" ,"
    />
    <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
</b-flex>

```html
<b-taglist v-model="tags" icon-name="tags" pattern="\w+(?:-\w+){0,}" placeholder="Enter tags" separators=" ," />

<b-taglist v-model="tags" icon-name="tags" pattern="\w+(?:-\w+){0,}" placeholder="Enter tags" readonly separators=" ," />

<b-taglist v-model="tags" disabled icon-name="tags" pattern="\w+(?:-\w+){0,}" placeholder="Enter tags" separators=" ," />
```

## Properties

| Name        | Type                             | Default              | Description                                |
|-------------|----------------------------------|----------------------|--------------------------------------------|
| disabled    | `boolean`                        | `false`              | Disable state flag.                        |
| help        | `string`                         |                      | Tooltip help message.                      |
| icon-badge  | `number` or `string`             |                      | Icon badge content.                        |
| icon-name   | `string`                         |                      | Icon name.                                 |
| icon-pack   | `"font-awesome"` or `"material"` | _Value from options_ | Icon pack name.                            |
| label       | `string`                         |                      | Component label.                           |
| placeholder | `string`                         |                      | Placeholder text.                          |
| readonly    | `boolean`                        | `false`              | Read-only state flag.                      |
| required    | `boolean`                        | `false`              | Required state flag.                       |
| separators  | `string`                         | `","`                | Tags separator characters list.            |
| v-model     | `string[]`                       |                      | Two-way value data binding. **[required]** |

<script setup>
import {ref} from "vue";

const tags = ref(["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"]);
</script>
