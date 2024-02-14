---
order: 2
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
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/intersect@3.x.x/dist/cdn.min.js"></script>

<!-- Alpine Core -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
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

The `:enter` suffix is an alias of `x-intersect`, and works the same way:

```alpine
<div x-intersect:enter="shown = true">...</div>
```

You may choose to use this for clarity when also using the `:leave` suffix.

<a name="x-intersect-leave"></a>
### x-intersect:leave

Appending `:leave` runs your expression when the element leaves the viewport.

```alpine
<div x-intersect:leave="shown = true">...</div>
```
> By default, this means the *whole element* is not in the viewport. Use `x-intersect:leave.full` to run your expression when only *parts of the element* are not in the viewport.

[→ Read more about the underlying `IntersectionObserver` API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

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

<a name="threshold"></a>
### .threshold

Allows you to control the `threshold` property of the underlying `IntersectionObserver`:

This value should be in the range of "0-100". A value of "0" means: trigger an "intersection" if ANY part of the element enters the viewport (the default behavior). While a value of "100" means: don't trigger an "intersection" unless the entire element has entered the viewport.

Any value in between is a percentage of those two extremes.

For example if you want to trigger an intersection after half of the element has entered the page, you can use `.threshold.50`:

```alpine
<div x-intersect.threshold.50="shown = true">...</div> // when 50% of the element is in the viewport
```

If you wanted to trigger only when 5% of the element has entered the viewport, you could use: `.threshold.05`, and so on and so forth.

<a name="margin"></a>
### .margin

Allows you to control the `rootMargin` property of the underlying `IntersectionObserver`.
This effectively tweaks the size of the viewport boundary. Positive values
expand the boundary beyond the viewport, and negative values shrink it inward. The values
work like CSS margin: one value for all sides; two values for top/bottom, left/right; or
four values for top, right, bottom, left. You can use `px` and `%` values, or use a bare number to
get a pixel value.

```alpine
<div x-intersect.margin.200px="loaded = true">...</div> // Load when the element is within 200px of the viewport
```

```alpine
<div x-intersect:leave.margin.10%.25px.25.25px="loaded = false">...</div> // Unload when the element gets within 10% of the top of the viewport, or within 25px of the other three edges
```

```alpine
<div x-intersect.margin.-100px="visible = true">...</div> // Mark as visible when element is more than 100 pixels into the viewport.
```
