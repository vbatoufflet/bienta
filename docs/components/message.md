# Message

## Basic

<b-message type="info">An info message</b-message>
<b-message type="success">A success message</b-message>
<b-message type="warning">A warning message</b-message>
<b-message type="error">An error message</b-message>
<b-message icon-name="cat">A custom message</b-message>

```html
<b-message type="info">An info message</b-message>
<b-message type="success">A success message</b-message>
<b-message type="warning">A warning message</b-message>
<b-message type="error">An error message</b-message>
<b-message icon-name="cat">A custom message</b-message>
```

## Inline

<b-flex align="center" class="preview" gap="1rem">
    <b-message inline type="info">An info message</b-message>
    <b-message inline type="success">A success message</b-message>
    <b-message inline type="warning">A warning message</b-message>
    <b-message inline type="error">An error message</b-message>
    <b-message icon-name="cat" inline>A custom message</b-message>
</b-flex>

```html
<b-message inline type="info">An info message</b-message>
<b-message inline type="success">A success message</b-message>
<b-message inline type="warning">A warning message</b-message>
<b-message inline type="error">An error message</b-message>
<b-message icon-name="cat" inline>A custom message</b-message>
```

## Properties

| Name       | Type                                            | Default              | Description         |
|------------|-------------------------------------------------|----------------------|---------------------|
| icon-badge | `number` or `string`                            |                      | Icon badge content. |
| icon-name  | `string`                                        |                      | Icon name.          |
| icon-pack  | `"font-awesome"` or `"material"`                | _Value from options_ | Icon pack name.     |
| inline     | `boolean`                                       | `false`              | Inline mode flag.   |
| type       | `"error"`, `"info"`, `"success"` or `"warning"` |                      | Message type.       |
