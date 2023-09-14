---
order: 5
title: CSP
---

# CSP (Content-Security Policy)

In order for Alpine to be able to execute plain strings from HTML attributes as JavaScript expressions, for example `x-on:click="console.log()"`, it needs to rely on utilities that violate the "unsafe-eval" content security policy.

> Under the hood, Alpine doesn't actually use eval() itself because it's slow and problematic. Instead it uses Function declarations, which are much better, but still violate "unsafe-eval".

In order to accommodate environments where this CSP is necessary, Alpine will offer an alternate build that doesn't violate "unsafe-eval", but has a more restrictive syntax.

<a name="installation"></a>
## Installation

The CSP build hasn’t been officially released yet. In the meantime, you may build it from source. To do this, clone the [`alpinejs/alpine`](https://github.com/alpinejs/alpine) repository and run:

```shell
npm install
npm run build
```

This will generate a `/packages/csp/dist/` directory with the built files. After copying the appropriate file into your project, you can include it either via `<script>` tag or module import:

<a name="script-tag"></a>
### Script tag

```alpine
<html>
    <script src="/path/to/cdn.js" defer></script>
</html>
```

<a name="module-import"></a>
### Module import

```js
import Alpine from './path/to/module.esm.js'

window.Alpine = Alpine
window.Alpine.start()
```

<a name="restrictions"></a>
## Restrictions

Since Alpine can no longer interpret strings as plain JavaScript, it has to parse and construct JavaScript functions from them manually.

Due to this limitation, you must use `Alpine.data` to register your `x-data` objects, and must reference properties and methods from it by key only.

For example, an inline component like this will not work.

```alpine
<!-- Bad -->
<div x-data="{ count: 1 }">
    <button @click="count++">Increment</button>

    <span x-text="count"></span>
</div>
```

However, breaking out the expressions into external APIs, the following is valid with the CSP build:

```alpine
<!-- Good -->
<div x-data="counter">
    <button @click="increment">Increment</button>

    <span x-text="count"></span>
</div>
```
```js
Alpine.data('counter', () => ({
    count: 1,

    increment() { this.count++ }
}))
```
