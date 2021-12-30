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

For example, in the following snippet, `width` will be update each time the element is resized

```alpine
<div x-data="{ width: 0 }" x-resize="width = $el.getBoundingClientRect().width">
    Element width : <span x-text="width"></span>
</div>
```


<a name="x-resize-debounce"></a>
### x-resize-debounce

Sometimes it is useful to "debounce" an event handler so that it is only called after a certain period of inactivity (250 milliseconds by default).

```alpine
<div x-data={width: 0} x-resize.debounce="width = $el.getBoundingClientRect().width">...</div>
```

If you wish to lengthen or shorten the debounce time, you can do so by trailing a duration after the `.debounce` modifier like so:

```alpine
<div x-data={width: 0} x-resize.debounce.500ms="width = $el.getBoundingClientRect().width">...</div>
```

Now, the `width` will only be update after 500 milliseconds after last resize event.

Note : if you want to detect the window resize (not only the element), you can use the following code :


```alpine
<div x-data={width: 0} @resize.window.debounce.500ms="width = $el.getBoundingClientRect().width">...</div>
```
