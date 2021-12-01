---
order: 3
title: Trap
description: Easily trap page focus within an element (modals, dialogs, etc...)
graph_image: https://alpinejs.dev/social_trap.jpg
---

# Trap Plugin

Alpine's Trap plugin allows you to conditionally trap focus inside an element.

This is useful for modals and other dialog elements.

<a name="installation"></a>
## Installation

You can use this plugin by either including it from a `<script>` tag or installing it via NPM:

### Via CDN

You can include the CDN build of this plugin as a `<script>` tag, just make sure to include it BEFORE Alpine's core JS file.

```alpine
<!-- Alpine Plugins -->
<script defer src="https://unpkg.com/@alpinejs/trap@3.x.x/dist/cdn.min.js"></script>

<!-- Alpine Core -->
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Via NPM

You can install Trap from NPM for use inside your bundle like so:

```shell
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

```alpine
<div x-data="{ open: false }">
    <button @click="open = true">Open Dialog</button>

    <span x-show="open" x-trap="open">
        <p>...</p>

        <input type="text" placeholder="Some input...">

        <input type="text" placeholder="Some other input...">

        <button @click="open = false">Close Dialog</button>
    </span>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <div :class="open && 'opacity-50'">
        <button x-on:click="open = true">Open Dialog</button>
    </div>

    <div x-show="open" x-trap="open" class="mt-4 space-y-4 p-4 border bg-yellow-100" @keyup.escape.window="open = false">
        <strong>
            <div>Focus is now "trapped" inside this dialog, meaning you can only click/focus elements within this yellow dialog. If you press tab repeatedly, the focus will stay within this dialog.</div>
        </strong>

        <div>
            <input type="text" placeholder="Some input...">
        </div>

        <div>
            <input type="text" placeholder="Some other input...">
        </div>

        <div>
            <button @click="open = false">Close Dialog</button>
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="nesting"></a>
## Nesting dialogs

Sometimes you may want to nest one dialog inside another. `x-trap` makes this trivial and handles it automatically.

`x-trap` keeps track of newly "trapped" elements and stores the last actively focused element. Once the element is "untrapped" then the focus will be returned to where it was originally.

This mechanism is recursive, so you can trap focus within an already trapped element infinite times, then "untrap" each element successively.

Here is nesting in action:

```alpine
<div x-data="{ open: false }">
    <button @click="open = true">Open Dialog</button>

    <span x-show="open" x-trap="open">

        ...

        <div x-data="{ open: false }">
            <button @click="open = true">Open Nested Dialog</button>

            <span x-show="open" x-trap="open">

                ...

                <button @click="open = false">Close Nested Dialog</button>
            </span>
        </div>

        <button @click="open = false">Close Dialog</button>
    </span>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <div :class="open && 'opacity-50'">
        <button x-on:click="open = true">Open Dialog</button>
    </div>

    <div x-show="open" x-trap="open" class="mt-4 space-y-4 p-4 border bg-yellow-100" @keyup.escape.window="open = false">
        <div>
            <input type="text" placeholder="Some input...">
        </div>

        <div>
            <input type="text" placeholder="Some other input...">
        </div>

        <div x-data="{ open: false }">
            <div :class="open && 'opacity-50'">
                <button x-on:click="open = true">Open Nested Dialog</button>
            </div>

            <div x-show="open" x-trap="open" class="mt-4 space-y-4 p-4 border border-gray-500 bg-yellow-200" @keyup.escape.window="open = false">
                <strong>
                    <div>Focus is now "trapped" inside this nested dialog. You cannot focus anything inside the outer dialog while this is open. If you close this dialog, focus will be returned to the last known active element.</div>
                </strong>

                <div>
                    <input type="text" placeholder="Some input...">
                </div>

                <div>
                    <input type="text" placeholder="Some other input...">
                </div>

                <div>
                    <button @click="open = false">Close Nested Dialog</button>
                </div>
            </div>
        </div>

        <div>
            <button @click="open = false">Close Dialog</button>
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="modifiers"></a>
## Modifiers

<a name="inert"></a>
### .inert

When building things like dialogs/modals, it's recommended to hide all the other elements on the page from screenreaders when trapping focus.

By adding `.inert` to `x-trap`, when focus is trapped, all other elements on the page will receive `aria-hidden="true"` attributes, and when focus trapping is disabled, those attributes will also be removed.

```alpine
<!-- When `open` is `false`: -->
<body x-data="{ open: false }">
    <div x-trap.inert="open" ...>
        ...
    </div>

    <div>
        ...
    </div>
</body>

<!-- When `open` is `true`: -->
<body x-data="{ open: true }">
    <div x-trap.inert="open" ...>
        ...
    </div>

    <div aria-hidden="true">
        ...
    </div>
</body>
```

<a name="noscroll"></a>
### .noscroll

When building dialogs/modals with Alpine, it's recommended that you disable scrollling for the surrounding content when the dialog is open.

`x-trap` allows you to do this automatically with the `.noscroll` modifiers.

By adding `.noscroll`, Alpine will remove the scrollbar from the page and block users from scrolling down the page while a dialog is open.

For example:

```alpine
<div x-data="{ open: false }">
    <button>Open Dialog</button>

    <div x-show="open" x-trap.noscroll="open">
        Dialog Contents

        <button @click="open = false">Close Dialog</button>
    </div>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ open: false }">
        <button @click="open = true">Open Dialog</button>

        <div x-show="open" x-trap.noscroll="open" class="border mt-4 p-4">
            <div class="mb-4 text-bold">Dialog Contents</div>

            <p class="mb-4 text-gray-600 text-sm">Notice how you can no longer scroll on this page while this dialog is open.</p>

            <button class="mt-4" @click="open = false">Close Dialog</button>
        </div>
    </div>
</div>
<!-- END_VERBATIM -->
