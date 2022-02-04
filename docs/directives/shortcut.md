# Shortcut

The `v-shortcut` directive attaches a keyboard shortcut to the element.

```html
<b-button v-shortcut="'/'" icon-name="search" label="Search document" @click="search()" />

<!-- or -->

<b-button
    v-shortcut="{keys: 'alt+q', confirm: confirmLogout, tooltip: false}"
    label="Logout"
    @click="logout()" />
```

## Options

| Modifier         | Type                  | Default | Description                                                                                                             |
|------------------|-----------------------|---------|-------------------------------------------------------------------------------------------------------------------------|
| `keys`           | `string`              |         | Shortcut keys composed of any modifier keys (`alt`, `control`, `meta` or `shift`) and a single base key. **[required]** |
| `confirm`        | `function`            |         | Function returning a promise or whether or not the action should be confirmed.                                          |
| `tooltip`        | `boolean` or `object` | `true`  | Flag for automatic hint about the shortcut within a tooltip.                                                            |
| `tooltip.nowrap` | `boolean`             | `false` | Content wrap prevention flag.                                                                                           |
