# Installation

Install the dependency:

```shell
npm install @batou.dev/bienta
```

Use the Vue plugin:

```typescript
import {createBienta} from "@batou.dev/bienta";
import {createApp} from "vue";

import app from "./app.vue";

createApp(app)
    .use(createBienta())
    .mount(document.body);
```

See <router-link to="/api">base options</router-link> for further
details on how to call `createBienta()`.
