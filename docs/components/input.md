# Input

## Basic

<b-flex align="center" class="preview" gap="1rem">
    <b-input
        v-model="input"
        help="Some help here"
        placeholder="A placeholder here"
    />
    <b-input v-model="number" icon-name="hashtag" type="number" />
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-input
        v-model="input"
        readonly
        help="Some help here"
        placeholder="A placeholder here"
    />
    <b-input v-model="number" readonly icon-name="hashtag" type="number" />
    <b-label class="subtle" icon-name="arrow-left">Read-only</b-label>
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-input
        v-model="input"
        disabled
        help="Some help here"
        placeholder="A placeholder here"
    />
    <b-input v-model="number" disabled icon-name="hashtag" type="number" />
    <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
</b-flex>

```html
<b-input v-model="input" help="Some help here" placeholder="A placeholder here" />
<b-input v-model="number" icon-name="hashtag" type="number" />

<b-input v-model="input" readonly help="Some help here" placeholder="A placeholder here" />
<b-input v-model="number" readonly icon-name="hashtag" type="number" />

<b-input v-model="input" disabled help="Some help here" placeholder="A placeholder here" />
<b-input v-model="number" disabled icon-name="hashtag" type="number" />
```

## Completion

<b-flex align="center" class="preview" gap="1rem">
    <b-input
        v-model="completion"
        :completion="inputCompletion"
        icon-name="search"
        placeholder="Enter “t”"
        type="search"
    />
</b-flex>

```html
<b-input v-model="completion" :completion="inputCompletion" icon-name="search" placeholder="Enter “t”" type="search" />
```

## Textarea

<b-flex align="center" class="preview" gap="1rem">
    <b-input
        v-model="textarea"
        help="Some help here"
        placeholder="A placeholder here"
        type="textarea"
    />
    <b-input v-model="textarea" icon-name="pencil" type="textarea" />
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-input
        v-model="textarea"
        readonly
        help="Some help here"
        placeholder="A placeholder here"
        type="textarea"
    />
    <b-input
        v-model="textarea"
        readonly
        icon-name="pencil"
        type="textarea"
    />
    <b-label class="subtle" icon-name="arrow-left">Read-only</b-label>
</b-flex>
<b-flex align="center" class="preview" gap="1rem">
    <b-input
        v-model="textarea"
        disabled
        help="Some help here"
        placeholder="A placeholder here"
        type="textarea"
    />
    <b-input
        v-model="textarea"
        disabled
        icon-name="pencil"
        type="textarea"
    />
    <b-label class="subtle" icon-name="arrow-left">Disabled</b-label>
</b-flex>

```html
<b-input v-model="textarea" help="Some help here" placeholder="A placeholder here" type="textarea" />
<b-input v-model="textarea" icon-name="pencil" type="textarea" />

<b-input v-model="textarea" readonly help="Some help here" placeholder="A placeholder here" type="textarea" />
<b-input v-model="textarea" readonly icon-name="pencil" type="textarea" />

<b-input v-model="textarea" disabled help="Some help here" placeholder="A placeholder here" type="textarea" />
<b-input v-model="textarea" disabled icon-name="pencil" type="textarea" />
```

## Properties

| Name            | Type                             | Default              | Description                                             |
|-----------------|----------------------------------|----------------------|---------------------------------------------------------|
| autocomplete    | `string`                         |                      | Auto-completion mode (see [autocomplete][0]).           |
| completion      | `function`                       |                      | Auto-completion handler function.                       |
| custom-validity | `function`                       |                      | Custom constraint validation function.                  |
| disabled        | `boolean`                        | `false`              | Disable state flag.                                     |
| help            | `string`                         |                      | Tooltip help message.                                   |
| icon-badge      | `number` or `string`             |                      | Icon badge content.                                     |
| icon-name       | `string`                         |                      | Icon name.                                              |
| icon-pack       | `"font-awesome"` or `"material"` | _Value from options_ | Icon pack name.                                         |
| label           | `string`                         |                      | Component label.                                        |
| max             | `number`                         | `100`                | Maximum value.                                          |
| min             | `number`                         | `0`                  | Minimum value.                                          |
| options         | `array` or `function`            |                      | Select option entries.                                  |
| pattern         | `string`                         |                      | Regular expression value validation (see [pattern][1]). |
| placeholder     | `string`                         |                      | Placeholder text.                                       |
| required        | `boolean`                        | `false`              | Required state flag.                                    |
| step            | `number`                         | `1`                  | Increment/Decrement step value.                         |
| v-model         | `number` or `string`             |                      | Two-way value data binding. **[required]**              |

<script setup>
import {ref} from "vue";

const locale = new Intl.DateTimeFormat("en", {weekday: "long"});
const weekdays = [...new Array(7).keys()].map(i => locale.format(new Date(1970, 0, i + 5)));

const completion = ref("");
const input = ref("");
const number = ref(42);
const textarea = ref("");

const inputCompletion = (value) => {
    return Promise.resolve(weekdays.filter(v => v.toLowerCase().includes(value.toLowerCase())));
};
</script>

[0]: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
[1]: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern
