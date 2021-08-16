---
order: 3
title: Trap
description: Easily trap page focus within an element (modals, dialogues, etc...)
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
    <button @click="open = true">Open Dialogue</button>

    <span x-show="open" x-trap="open">
        <p>...</p>

        <input type="text" placeholder="Some input...">

        <input type="text" placeholder="Some other input...">

        <button @click="open = false">Close Dialogue</button>
    </span>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false}" class="demo">
    <div :class="open && 'opacity-50'">
        <button x-on:click="open = true">Open Dialogue</button>
    </div>

    <div x-show="open" x-trap="open" class="mt-4 space-y-4 p-4 border bg-yellow-100" @keyup.escape.window="open = false">
        <strong>
            <div>Focus is now "trapped" inside this dialogue, meaning you can only click/focus elements within this yellow dialogue. If you press tab repeatedly, the focus will stay within this dialogue, but also be allowed to cycle to the browser's URL bar.</div>
        </strong>

        <div>
            <input type="text" placeholder="Some input...">
        </div>

        <div>
            <input type="text" placeholder="Some other input...">
        </div>

        <div>
            <button @click="open = false">Close Dialogue</button>
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="nesting"></a>
## Nesting dialogues

Sometimes you may want to nest one dialogue inside another. `x-trap` makes this trivial and handles it automatically.

`x-trap` keeps track of newly "trapped" elements and stores the last actively focused element. Once the element is "untrapped" then the focus will be returned to where it was originally.

This mechanism is recursive, so you can trap focus within an already trapped element infinite times, then "untrap" each element successively.

Here is nesting in action:

```html
<div x-data="{ open: false}">
    <button @click="open = true">Open Dialogue</button>

    <span x-show="open" x-trap="open">

        ...

        <div x-data="{ open: false}">
            <button @click="open = true">Open Nested Dialogue</button>

            <span x-show="open" x-trap="open">

                ...

                <button @click="open = false">Close Nested Dialogue</button>
            </span>
        </div>

        <button @click="open = false">Close Dialogue</button>
    </span>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false}" class="demo">
    <div :class="open && 'opacity-50'">
        <button x-on:click="open = true">Open Dialogue</button>
    </div>

    <div x-show="open" x-trap="open" class="mt-4 space-y-4 p-4 border bg-yellow-100" @keyup.escape.window="open = false">
        <div>
            <input type="text" placeholder="Some input...">
        </div>

        <div>
            <input type="text" placeholder="Some other input...">
        </div>

        <div x-data="{ open: false}">
            <div :class="open && 'opacity-50'">
                <button x-on:click="open = true">Open Nested Dialogue</button>
            </div>

            <div x-show="open" x-trap="open" class="mt-4 space-y-4 p-4 border border-gray-500 bg-yellow-200" @keyup.escape.window="open = false">
                <strong>
                    <div>Focus is now "trapped" inside this nested dialogue. You cannot focus anything inside the outer dialogue while this is open. If you close this dialogue, focus will be returned to the last known active element.</div>
                </strong>

                <div>
                    <input type="text" placeholder="Some input...">
                </div>

                <div>
                    <input type="text" placeholder="Some other input...">
                </div>

                <div>
                    <button @click="open = false">Close Nested Dialogue</button>
                </div>
            </div>
        </div>

        <div>
            <button @click="open = false">Close Dialogue</button>
        </div>
    </div>
</div>
<!-- END_VERBATIM -->
