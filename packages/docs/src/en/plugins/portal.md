---
order: 6
title: Portal
description: Send Alpine templates to other parts of the DOM
graph_image: https://alpinejs.dev/social_portal.jpg
---

# Portal Plugin

Alpine's Portal plugin allows you to transport part of your Alpine template to another part of the DOM on the page entirely.

This is useful for things like modals (especially nesting them), where it's helpful to break out of the z-index of the current Alpine component.

> Note: this plugin is currently in beta while it is being tested in the public. Be warned that it may change before being officially released.

<a name="installation"></a>
## Installation

You can use this plugin by either including it from a `<script>` tag or installing it via NPM:

### Via CDN

You can include the CDN build of this plugin as a `<script>` tag, just make sure to include it BEFORE Alpine's core JS file.

```alpine
<!-- Alpine Plugins -->
<script defer src="https://unpkg.com/@alpinejs/portal@3.6.1-beta.0/dist/cdn.min.js"></script>

<!-- Alpine Core -->
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Via NPM

You can install Portal from NPM for use inside your bundle like so:

```shell
npm install @alpinejs/portal
```

Then initialize it from your bundle:

```js
import Alpine from 'alpinejs'
import portal from '@alpinejs/portal'

Alpine.plugin(portal)

...
```

<a name="usage"></a>
## Usage

Everytime you use a portal, you will need two different directives: `x-portal` and `x-portal-target`.

By attaching `x-portal` to a `<template>` element, you are telling Alpine to send that DOM content to another template element that has a matching `x-portal-target` on it.

Here's a contrived modal example using portals:

```alpine
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle Modal</button>

    <template x-portal="modals">
        <div x-show="open">
            Modal contents...
        </div>
    </template>

    <div class="py-4">Some other content placed AFTER the modal markup.</div>
</div>

<template x-portal-target="modals"></template>
```

<!-- START_VERBATIM -->
<div class="demo" x-ref="root">
    <div x-data="{ open: false }">
        <button @click="open = ! open">Toggle Modal</button>

        <template x-portal="modals1">
            <div x-show="open">
                Modal contents...
            </div>
        </template>

        <div class="py-4">Some other content...</div>
    </div>

    <template x-portal-target="modals1"></template>
</div>
<!-- END_VERBATIM -->

Notice how when toggling the modal, the actual modal contents show up AFTER the "Some other content..." element? This is because when Alpine is initializing, it sees `x-portal="modals"` and takes that markup out of the page waiting until it finds an element with `x-portal-target="modals"` to insert it into.

<a name="forwarding-events"></a>
## Forwarding events

Alpine tries it's best to make the experience of using portals seemless. Anything you would normally do in a template, you should be able to do inside a portal. Portal content can access the normal Alpine scope of the component as well as other features like `$refs`, `$root`, etc...

However, native DOM events have no concept of portals, so if, for example, you trigger a "click" event from inside a portal, that event will bubble up the DOM tree as it normally would ignoring the fact that it is within a portal.

To make this experience more seemless, you can "forward" events by simply registering event listeners on the portal's `<template>` element itself like so:

```alpine
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle Modal</button>

    <template x-portal="modals" @click="open = false">
        <div x-show="open">
            Modal contents...
            (click to close)
        </div>
    </template>
</div>

<template x-portal-target="modals"></template>
```

<!-- START_VERBATIM -->
<div class="demo" x-ref="root">
    <div x-data="{ open: false }">
        <button @click="open = ! open">Toggle Modal</button>

        <template x-portal="modals2" @click="open = false">
            <div x-show="open">
                Modal contents...<br>
                (click to close)
            </div>
        </template>
    </div>

    <template x-portal-target="modals2"></template>
</div>
<!-- END_VERBATIM -->

Notice how we are now able to listen for events dispatched from within the portal from outside the portal itself?

Alpine does this by looking for event listeners registered on `<template x-portal...` and stops those events from propogating past the `<template x-portal-target...` element. Then it creates a copy of that event and re-dispatches it from `<template x-portal`.

<a name="nesting-portals"></a>
## Nesting portals

Portals are especially helpful if you are trying to nest one modal within another. Alpine makes it simple to do so:

```alpine
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle Modal</button>

    <template x-portal="modals">
        <div x-show="open">
            Modal contents...
            
            <div x-data="{ open: false }">
                <button @click="open = ! open">Toggle Nested Modal</button>

                <template x-portal="modals">
                    <div x-show="open">
                        Nested modal contents...
                    </div>
                </template>
            </div>
        </div>
    </template>
</div>

<template x-portal-target="modals"></template>
```

<!-- START_VERBATIM -->
<div class="demo" x-ref="root">
    <div x-data="{ open: false }">
        <button @click="open = ! open">Toggle Modal</button>

        <template x-portal="modals3">
            <div x-show="open">
                <div class="py-4">Modal contents...</div>
                
                <div x-data="{ open: false }">
                    <button @click="open = ! open">Toggle Nested Modal</button>

                    <template x-portal="modals3">
                        <div class="pt-4" x-show="open">
                            Nested modal contents...
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </div>

    <template x-portal-target="modals3"></template>
</div>
<!-- END_VERBATIM -->

After toggling "on" both modals, they are authored as children, but will be rendered as sibling elements on the page, not within one another.

<a name="multiple-portals"></a>
## Handling multiple portals

Suppose you have multiple modals on a page, but a single `<template x-portal-target="modal">` element.

Alpine automatically appends extra elements with `x-portal="modals"` at the target. No need for any extra syntax:

```alpine
<template x-portal="modals">
    ...
</template>

<template x-portal="modals">
    ...
</template>

...

<template x-portal-target="modals"></template>
```

Now both of these modals will be rendered where `<template x-portal-target="modals">` lives.
