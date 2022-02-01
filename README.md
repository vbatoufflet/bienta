# Bienta

Bienta is an MIT licensed Vue.js 3 UI library providing custom components and
directives to build web applications.

## Features

* Style: default light and dark themes, along with custom colors theme support;
* Navigation: keyboard-accessible and touch-compatible components with optional
  keyboard shortcut bindings.

## Documentation

Check out the [online documentation](https://bienta.batou.dev). It serves as a
demo as well 🚀

## Getting started

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

## Note

⚠️ IMPORTANT: this library is at an early stage, thus breaking changes might
occur during its development.

## Links

* [Changelog](https://github.com/vbatoufflet/bienta/blob/master/CHANGELOG.md)
* [npm package](https://www.npmjs.com/package/@batou.dev/bienta)
