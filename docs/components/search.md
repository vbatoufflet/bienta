# Search

The `<b-search>` component wraps a `<b-input>` component of `search` type with
a Spotlight-like custom style.

```html
<b-search :completion="completion" placeholder="Quick find" @select="onSelect" />
```

## Properties

| Name        | Type                             | Default              | Description                       |
|-------------|----------------------------------|----------------------|-----------------------------------|
| completion  | `function`                       |                      | Auto-completion handler function. |
| icon-badge  | `number` or `string`             |                      | Icon badge content.               |
| icon-name   | `string`                         | `"search"`           | Icon name.                        |
| icon-pack   | `"font-awesome"` or `"material"` | _Value from options_ | Icon pack name.                   |
| label       | `string`                         |                      | Component label.                  |
| placeholder | `string`                         |                      | Placeholder text.                 |
