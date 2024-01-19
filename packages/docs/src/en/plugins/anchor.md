---
order: 5
title: Anchor
description: Anchor an element's positioning to another element on the pageg
graph_image: https://alpinejs.dev/social_anchor.jpg
---

# Anchor Plugin

Alpine's Anchor plugin allows you easily anchor an element's positioning to another element on the page.

This functionality is useful when creating dropdown menus, popovers, dialogs, and tooltips with Alpine.

The "anchoring" functionality used in this plugin is provided by the [Floating UI](https://floating-ui.com/) project.

<a name="installation"></a>
## Installation

You can use this plugin by either including it from a `<script>` tag or installing it via NPM:

### Via CDN

You can include the CDN build of this plugin as a `<script>` tag, just make sure to include it BEFORE Alpine's core JS file.

```alpine
<!-- Alpine Plugins -->
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/anchor@3.x.x/dist/cdn.min.js"></script>

<!-- Alpine Core -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Via NPM

You can install Anchor from NPM for use inside your bundle like so:

```shell
npm install @alpinejs/anchor
```

Then initialize it from your bundle:

```js
import Alpine from 'alpinejs'
import anchor from '@alpinejs/anchor'

Alpine.plugin(anchor)

...
```

<a name="x-anchor"></a>
## x-anchor

The primary API for using this plugin is the `x-anchor` directive.

To use this plugin, add the `x-anchor` directive to any element and pass it a reference to the element you want to anchor it's position to (often a button on the page).

By default, `x-anchor` will set the the element's CSS to `position: absolute` and the appropriate `top` and `left` values. If the anchored element is normally displayed below the reference element but doesn't have room on the page, it's styling will be adjusted to render above the element.

For example, here's a simple dropdown anchored to the button that toggles it:

```alpine
<div x-data="{ open: false }">
    <button x-ref="button" @click="open = ! open">Toggle</button>

    <div x-show="open" x-anchor="$refs.button">
        Dropdown content
    </div>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo overflow-hidden">
    <div class="flex justify-center">
        <button x-ref="button" @click="open = ! open">Toggle</button>
    </div>

    <div x-show="open" x-anchor="$refs.button" class="bg-white rounded p-4 border shadow z-10">
        Dropdown content
    </div>
</div>
<!-- END_VERBATIM -->

<a name="positioning"></a>
## Positioning

`x-anchor` allows you to customize the positioning of the anchored element using the following modifiers:

* Bottom: `.bottom`, `.bottom-start`, `.bottom-end`
* Top: `.top`, `.top-start`, `.top-end`
* Left: `.left`, `.left-start`, `.left-end`
* Right: `.right`, `.right-start`, `.right-end`

Here is an example of using `.bottom-start` to position a dropdown below and to the right of the reference element:

```alpine
<div x-data="{ open: false }">
    <button x-ref="button" @click="open = ! open">Toggle</button>

    <div x-show="open" x-anchor.bottom-start="$refs.button">
        Dropdown content
    </div>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo overflow-hidden">
    <div class="flex justify-center">
        <button x-ref="button" @click="open = ! open">Toggle</button>
    </div>

    <div x-show="open" x-anchor.bottom-start="$refs.button" class="bg-white rounded p-4 border shadow z-10">
        Dropdown content
    </div>
</div>
<!-- END_VERBATIM -->

<a name="offset"></a>
## Offset

You can add an offset to your anchored element using the `.offset.[px value]` modifier like so:

```alpine
<div x-data="{ open: false }">
    <button x-ref="button" @click="open = ! open">Toggle</button>

    <div x-show="open" x-anchor.offset.10="$refs.button">
        Dropdown content
    </div>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo overflow-hidden">
    <div class="flex justify-center">
        <button x-ref="button" @click="open = ! open">Toggle</button>
    </div>

    <div x-show="open" x-anchor.offset.10="$refs.button" class="bg-white rounded p-4 border shadow z-10">
        Dropdown content
    </div>
</div>
<!-- END_VERBATIM -->

<a name="manual-styling"></a>
## Manual styling

By default, `x-anchor` applies the positioning styles to your element under the hood. If you'd prefer full control over styling, you can pass the `.no-style` modifer and use the `$anchor` magic to access the values inside another Alpine expression.

Below is an example of bypassing `x-anchor`'s internal styling and instead applying the styles yourself using `x-bind:style`:

```alpine
<div x-data="{ open: false }">
    <button x-ref="button" @click="open = ! open">Toggle</button>

    <div
        x-show="open"
        x-anchor.no-style="$refs.button"
        x-bind:style="{ position: 'absolute', top: $anchor.y+'px', left: $anchor.x+'px' }"
    >
        Dropdown content
    </div>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo overflow-hidden">
    <div class="flex justify-center">
        <button x-ref="button" @click="open = ! open">Toggle</button>
    </div>

    <div
        x-show="open"
        x-anchor.no-style="$refs.button"
        x-bind:style="{ position: 'absolute', top: $anchor.y+'px', left: $anchor.x+'px' }"
        class="bg-white rounded p-4 border shadow z-10"
    >
        Dropdown content
    </div>
</div>
<!-- END_VERBATIM -->

<a name="from-id"></a>
## Anchor to an ID

The examples thus far have all been anchoring to other elements using Alpine refs.

Because `x-anchor` accepts a reference to any DOM element, you can use utilities like `document.getElementById()` to anchor to an element by its `id` attribute:

```alpine
<div x-data="{ open: false }">
    <button id="trigger" @click="open = ! open">Toggle</button>

    <div x-show="open" x-anchor="document.getElementById('trigger')">
        Dropdown content
    </div>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo overflow-hidden">
    <div class="flex justify-center">
        <button class="trigger" @click="open = ! open">Toggle</button>
    </div>


    <div x-show="open" x-anchor="document.querySelector('.trigger')">
        Dropdown content
    </div>
</div>
<!-- END_VERBATIM -->

