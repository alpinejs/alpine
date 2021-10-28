---
order: 1
title: Intersect
description: An Alpine convenience wrapper for Intersection Observer that allows you to easily react when an element enters the viewport.
graph_image: https://alpinejs.dev/social_intersect.jpg
---

# Intersect Plugin

Alpine's Intersect plugin is a convenience wrapper for [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) that allows you to easily react when an element enters the viewport.

This is useful for: lazy loading images and other content, triggering animations, infinite scrolling, logging "views" of content, etc.

<a name="installation"></a>
## Installation

You can use this plugin by either including it from a `<script>` tag or installing it via NPM:

### Via CDN

You can include the CDN build of this plugin as a `<script>` tag, just make sure to include it BEFORE Alpine's core JS file.

```alpine
<!-- Alpine Plugins -->
<script defer src="https://unpkg.com/@alpinejs/intersect@3.x.x/dist/cdn.min.js"></script>

<!-- Alpine Core -->
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Via NPM

You can install Intersect from NPM for use inside your bundle like so:

```shell
npm install @alpinejs/intersect
```

Then initialize it from your bundle:

```js
import Alpine from 'alpinejs'
import intersect from '@alpinejs/intersect'

Alpine.plugin(intersect)

...
```

<a name="x-intersect"></a>
## x-intersect

The primary API for using this plugin is `x-intersect`. You can add `x-intersect` to any element within an Alpine component, and when that component enters the viewport (is scrolled into view), the provided expression will execute.

For example, in the following snippet, `shown` will remain `false` until the element is scrolled into view. At that point, the expression will execute and `shown` will become `true`:

```alpine
<div x-data="{ shown: false }" x-intersect="shown = true">
    <div x-show="shown" x-transition>
        I'm in the viewport!
    </div>
</div>
```

<!-- START_VERBATIM -->
<div class="demo" style="height: 60px; overflow-y: scroll;" x-data x-ref="root">
    <a href="#" @click.prevent="$refs.root.scrollTo({ top: $refs.root.scrollHeight, behavior: 'smooth' })">Scroll Down 👇</a>
    <div style="height: 50vh"></div>
    <div x-data="{ shown: false }" x-intersect="shown = true" id="yoyo">
        <div x-show="shown" x-transition.duration.1000ms>
            I'm in the viewport!
        </div>
        <div x-show="! shown">&nbsp;</div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="x-intersect-enter"></a>
### x-intersect:enter

You can opt to only trigger x-intersect when the element ENTERS the viewport by adding the `:enter` suffix to `x-intersect` like so:

```alpine
<div x-intersect:enter="shown = true">...</div>
```

<a name="x-intersect-leave"></a>
### x-intersect:leave

Similarly, you can add `:leave` to only trigger x-intersect when the element LEAVES the viewport:

```alpine
<div x-intersect:leave="shown = true">...</div>
```

<a name="modifiers"></a>
## Modifiers

<a name="once"></a>
### .once

Sometimes it's useful to evaluate an expression only the first time an element enters the viewport and not subsequent times. For example when triggering "enter" animations. In these cases, you can add the `.once` modifier to `x-intersect` to achieve this.

```alpine
<div x-intersect.once="shown = true">...</div>
```

<a name="half"></a>
### .half

Evaluates the expression once the intersection threshold exceeds `0.5`. 

Useful for elements where it's important to show at least part of the element.

```alpine
<div x-intersect.half="shown = true">...</div> // when `0.5` of the element is in the viewport
```

<a name="full"></a>
### .full

Evaluates the expression once the intersection threshold exceeds `0.99`. 

Useful for elements where it's important to show the whole element.

```alpine
<div x-intersect.full="shown = true">...</div> // when `0.99` of the element is in the viewport
```
