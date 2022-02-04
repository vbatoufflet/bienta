# Flex

The `<b-flex>` component provides a quick access to [Flexible Box Layout][0].

```html
<b-flex align="center" direction="column" justify="center">
    […]
</b-flex>
```

## Properties

| Name      | Type                                                                              | Default    | Description                              |
|-----------|-----------------------------------------------------------------------------------|------------|------------------------------------------|
| align     | `"baseline"`, `"center"`, `"end"`, `"normal"`, `"start"` or `"stretch"`           | `"normal"` | Value of `align-items` CSS property.     |
| direction | `"column"`, `"column-reverse"`, `"row"` or `"row-reverse"`                        | `"row"`    | Value of `flex-direction` CSS property.  |
| gap       | `string`                                                                          |            | Value of `gap` CSS property.             |
| justify   | `"around"`, `"between"`, `"center"`, `"end"`, `"evenly"`, `"normal"` or `"start"` | `"normal"` | Value of `justify-content` CSS property. |
| wrap      | `"nowrap"`, `"wrap"` or `"wrap-reverse"`                                          | `"nowrap"` | Value of `flex-wrap` CSS property.       |

[0]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout
