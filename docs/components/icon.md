# Icon

You can use any icon from [Font Awesome](https://fontawesome.com/icons) or
[Material](https://material.io/icons) along with Bienta.

## Font Awesome

<b-flex align="center" class="preview" gap="1rem">
    <b-icon name="cat" pack="font-awesome" />
</b-flex>

```html
<b-icon name="cat" pack="font-awesome" />
```

## Material

<b-flex align="center" class="preview" gap="1rem">
    <b-icon name="tips_and_updates" pack="material" />
</b-flex>

```html
<b-icon name="tips_and_updates" pack="material" />
```

## Properties

| Name  | Type                             | Default              | Description               |
|-------|----------------------------------|----------------------|---------------------------|
| badge | `number` or `string`             |                      | Badge content.            |
| name  | `string`                         |                      | Icon name. **[required]** |
| pack  | `"font-awesome"` or `"material"` | _Value from options_ | Icon pack name.           |
