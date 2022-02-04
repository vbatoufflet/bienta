# Label

## Basic

<b-flex align="center" class="preview" gap="1rem">
    <b-label>Label</b-label>
</b-flex>

```html
<b-label>Label</b-label>
```

## Icon

<b-flex align="center" class="preview" gap="1rem">
    <b-label icon-name="dragon">Dragons</b-label>
</b-flex>

```html
<b-label icon-name="dragon">Dragons</b-label>
```

## Badge

<b-flex align="center" class="preview" gap="2rem">
    <b-label badge="!">Dragons</b-label>
    <b-label icon-name="dragon" icon-badge="!">Dragons</b-label>
</b-flex>

```html
<b-label badge="!">Dragons</b-label>
<b-label icon-name="dragon" icon-badge="!">Dragons</b-label>
```

## Properties

| Name       | Type                             | Default              | Description         |
|------------|----------------------------------|----------------------|---------------------|
| badge      | `number` or `string`             |                      | Badge content.      |
| icon-badge | `number` or `string`             |                      | Icon badge content. |
| icon-name  | `string`                         |                      | Icon name.          |
| icon-pack  | `"font-awesome"` or `"material"` | _Value from options_ | Icon pack name.     |
