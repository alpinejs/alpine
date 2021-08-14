---
order: 3
title: Trap
description: Easily persist data across page loads using localStorage
graph_image: https://alpinejs.dev/social_trap.jpg
---

# Trap Plugin

Alpine's Trap plugin allows you to conditionally trap focus inside an element.

This is useful for modals and other dialogue elements.

<a name="installation"></a>
## Installation

You can use this plugin by either including it from a `<script>` tag or installing it via NPM:

### Via CDN

You can include the CDN build of this plugin as a `<script>` tag, just make sure to include it BEFORE Alpine's core JS file.

```html
<!-- Alpine Plugins -->
<script defer src="https://unpkg.com/@alpinejs/trap@3.x.x/dist/cdn.min.js"></script>

<!-- Alpine Core -->
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Via NPM

You can install Persist from NPM for use inside your bundle like so:

```bash
npm install @alpinejs/trap
```

Then initialize it from your bundle:

```js
import Alpine from 'alpinejs'
import trap from '@alpinejs/trap'

Alpine.plugin(trap)

...
```

<a name="x-trap"></a>
## x-trap

The primary API for using this plugin is the `x-trap` directive.

`x-trap` accepts a JS expression. If the result of that expression is true, then the focus will be trapped inside that element until the expression becomes false, then at that point, focus will be returned to where it was previously.

For example:

```html
<div x-data="{ open: false}">
    <button x-on:click="open = true">Open Dialogue</button>

    <span x-show="open" x-trap="open">
        <input type="text">

        <button>foo</button>
    </span>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false}" class="demo">
    <button x-on:click="open = true">Open Dialogue</button>

    <span x-show="open" x-trap="open">
        <input type="text">

        <button>foo</button>
    </span>
</div>
<!-- END_VERBATIM -->
