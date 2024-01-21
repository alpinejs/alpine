---
order: 1
title: CSP
---

# CSP (Content-Security Policy) Build

In order for Alpine to be able to execute plain strings from HTML attributes as JavaScript expressions, for example `x-on:click="console.log()"`, it needs to rely on utilities that violate the "unsafe-eval" [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) that some applications may enforce for security purposes.

> Under the hood, Alpine doesn't actually use eval() itself because it's slow and problematic. Instead it uses Function declarations, which are much better, but still violate "unsafe-eval".

In order to accommodate environments where this CSP is necessary, Alpine offer's an alternate build that doesn't violate "unsafe-eval", but has a more restrictive syntax.

<a name="installation"></a>
## Installation

You can use this build by either including it from a `<script>` tag or installing it via NPM:

### Via CDN

You can include this build's CDN as a `<script>` tag just like you would normally with standard Alpine build:

```alpine
<!-- Alpine's CSP-friendly Core -->
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/csp@3.x.x/dist/cdn.min.js"></script>
```

### Via NPM

You can alternatively install this build from NPM for use inside your bundle like so:

```shell
npm install @alpinejs/csp
```

Then initialize it from your bundle:

```js
import Alpine from '@alpinejs/csp'

window.Alpine = Alpine

Alpine.start()
```

<a name="basic-example"></a>
## Basic Example

To provide a glimpse of how using the CSP build might feel, here is a copy-pastable HTML file with a working counter component using a common CSP setup:

```alpine
<html>
    <head>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'nonce-a23gbfz9e'">

        <script defer nonce="a23gbfz9e" src="https://cdn.jsdelivr.net/npm/@alpinejs/csp@3.x.x/dist/cdn.min.js"></script>
    </head>

    <body>
        <div x-data="counter">
            <button x-on:click="increment"></button>

            <span x-text="count"></span>
        </div>

        <script nonce="a23gbfz9e">
            document.addEventListener('alpine:init', () => {
                Alpine.data('counter', () => {
                    return {
                        count: 1,

                        increment() {
                            this.count++;
                        },
                    }
                })
            })
        </script>
    </body>
</html>
```

<a name="api-restrictions"></a>
## API Restrictions

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

    increment() {
        this.count++
    },
}))
```
