---
order: 3
title: show
---

# x-show

`x-show` is one of the most useful and powerful directives in Alpine. It provides an expressive way to show and hide DOM elements.

Here's an example of a simple dropdown component using `x-show`.

```alpine
<div x-data="{ open: false }">
    <button x-on:click="open = ! open">Toggle Dropdown</button>

    <div x-show="open">
        Dropdown Contents...
    </div>
</div>
```

When the "Toggle Dropdown" button is clicked, the dropdown will show and hide accordingly.

> If the "default" state of an `x-show` on page load is "false", you may want to use `x-cloak` on the page to avoid "page flicker" (The effect that happens when the browser renders your content before Alpine is finished initializing and hiding it.) You can learn more about `x-cloak` in its documentation.

<a name="with-transitions"></a>
## With transitions

If you want to apply smooth transitions to the `x-show` behavior, you can use it in conjunction with `x-transition`. You can learn more about that directive [here](/directives/transition), but here's a quick example of the same component as above, just with transitions applied.

```alpine
<div x-data="{ open: false }">
    <button x-on:click="open = ! open">Toggle Dropdown</button>

    <div x-show="open" x-transition>
        Dropdown Contents...
    </div>
</div>
```

<a name="using-the-important-modifier"></a>
## Using the important modifier

Sometimes you need to apply a little more force to actually hide an element. In cases where a CSS selector applies the `display` property with the `!important` flag, it will take precedence over the inline style set by Alpine.

In these cases you may use the `.important` modifier to set the inline style to `display: none !important`.

```alpine
<div x-data="{ open: false }">
    <button x-on:click="open = ! open">Toggle Dropdown</button>

    <div x-show.important="open">
        Dropdown Contents...
    </div>
</div>
```
