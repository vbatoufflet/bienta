# Select

## Basic

<b-flex align="center" class="preview" gap="1rem">
    <b-select
        v-model="select"
        icon-name="calendar"
        :options="weekdays"
        placeholder="Pick a day…"
    />
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-select
        v-model="select"
        disabled
        icon-name="calendar"
        :options="weekdays"
        placeholder="Pick a day…"
    />
    <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
</b-flex>

```html
<b-select v-model="select" icon-name="calendar" :options="weekdays" placeholder="Pick a day…" />

<b-select v-model="select" disabled icon-name="calendar" :options="weekdays" placeholder="Pick a day…" />
```

## Async options

<b-flex align="center" gap="1rem">
    <b-select
        v-model="select"
        icon-name="calendar"
        :options="asyncWeekdays"
        placeholder="Pick a day…"
    />
</b-flex>

```html
<b-select v-model="select" icon-name="calendar" :options="asyncWeekdays" placeholder="Pick a day…" />
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
| options     | `array` or `function`            |                      | Select option entries. **[required]**      |
| placeholder | `string`                         |                      | Placeholder text.                          |
| required    | `boolean`                        | `false`              | Required state flag.                       |
| v-model     | `any`                            |                      | Two-way value data binding. **[required]** |

<script setup>
import {ref} from "vue";

const locale = new Intl.DateTimeFormat("en", {weekday: "long"});
const weekdays = [...new Array(7).keys()].map(i => locale.format(new Date(1970, 0, i + 5)));

const select = ref(locale.format());

const asyncWeekdays = (filter) => {
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
</script>
