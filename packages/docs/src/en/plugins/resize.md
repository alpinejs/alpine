---
order: 6
title: Resize
description: An Alpine convenience wrapper for Resize Observer that allows you to easily react when an element is resized.

---

# Resize Plugin

Alpine's Resize plugin is a convenience wrapper for [Resize Observer](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) that allows you to easily react when an element is resized.

This is useful when you want to trigger js script depending of the size of an element.

<a name="installation"></a>
## Installation

You can use this plugin by either including it from a `<script>` tag or installing it via NPM:

### Via CDN

You can include the CDN build of this plugin as a `<script>` tag, just make sure to include it BEFORE Alpine's core JS file.

```alpine
<!-- Alpine Plugins -->
<script defer src="https://unpkg.com/@alpinejs/resize@3.x.x/dist/cdn.min.js"></script>

<!-- Alpine Core -->
<script defer src="https://unpkg.com/resize@3.x.x/dist/cdn.min.js"></script>
```

### Via NPM

You can install Resize from NPM for use inside your bundle like so:

```shell
npm install @alpinejs/resize
```

Then initialize it from your bundle:

```js
import Alpine from 'alpinejs'
import resize from '@alpinejs/resize'

Alpine.plugin(resize)

...
```

<a name="x-resize"></a>
## x-resize

The primary API for using this plugin is `x-resize`. You can add `x-resize` to any element within an Alpine component, and when that component is resized, the provided expression will execute.

For example, in the following snippet, `shown` will remain `false` until the element is scrolled into view. At that point, the expression will execute and `shown` will become `true`:

```alpine
<div x-data="{ width: 0 }" x-resize="width = $el.innerWidth">
    Element width <span x-html="width"></span>
</div>
```



<a name="x-resize-debounce"></a>
### x-resize:200

You can debounce the resize function execution, so the code below will be executed just one time, after 200ms

```alpine
<div x-resize:200="console.log($el.innerWidth)">...</div>
```

