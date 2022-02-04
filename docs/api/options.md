# Options

Bienta library can be tweaked upon creation while calling `createBienta()` using the following options:

| Key                  | Type                             | Default                                | Description                                            |
|----------------------|----------------------------------|----------------------------------------|--------------------------------------------------------|
| iconPack             | `"font-awesome"` or `"material"` | `"font-awesome"`                       | Default icon pack to use within `<b-icon>` components. |
| persistState         | `boolean` or `object`            |                                        | State persistence flag (set to `false` to disable).    |
| persistState.key     | `string`                         | `"bienta"`                             | Key to persist state at in `Storage`.                  |
| persistState.storage | `Storage`                        | `window.localStorage`                  | `Storage` implementation to use to persist data.       |
| shortcuts            | `boolean`                        | `true`                                 | Keyboard shortcuts enable flag.                        |
| theme                | `"dark"` or `"light"`            | _Auto-detected from system preference_ | Name of the theme to apply.                            |
