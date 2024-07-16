---
order: 9
title: Sort
description: Easily re-order elements by dragging them with your mouse
graph_image: https://alpinejs.dev/social_sort.jpg
---

# Sort Plugin

Alpine's Sort plugin allows you to easily re-order elements by dragging them with your mouse.

This functionality is useful for things like Kanban boards, to-do lists, sortable table columns, etc.

The drag functionality used in this plugin is provided by the [SortableJS](https://github.com/SortableJS/Sortable) project.

<a name="installation"></a>
## Installation

You can use this plugin by either including it from a `<script>` tag or installing it via NPM:

### Via CDN

You can include the CDN build of this plugin as a `<script>` tag; just make sure to include it BEFORE Alpine's core JS file.

```alpine
<!-- Alpine Plugins -->
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/sort@3.x.x/dist/cdn.min.js"></script>

<!-- Alpine Core -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Via NPM

You can install Sort from NPM for use inside your bundle like so:

```shell
npm install @alpinejs/sort
```

Then initialize it from your bundle:

```js
import Alpine from 'alpinejs'
import sort from '@alpinejs/sort'

Alpine.plugin(sort)

...
```

<a name="basic-usage"></a>
## Basic usage

The primary API for using this plugin is the `x-sort` directive. By adding `x-sort` to an element, its children containing `x-sort:item` become sortable—meaning you can drag them around with your mouse, and they will change positions.

```alpine
<ul x-sort>
    <li x-sort:item>foo</li>
    <li x-sort:item>bar</li>
    <li x-sort:item>baz</li>
</ul>
```

<!-- START_VERBATIM -->
<div x-data>
    <ul x-sort>
        <li x-sort:item class="cursor-pointer">foo</li>
        <li x-sort:item class="cursor-pointer">bar</li>
        <li x-sort:item class="cursor-pointer">baz</li>
    </ul>
</div>
<!-- END_VERBATIM -->

<a name="sort-handlers"></a>
## Sort handlers

You can react to sorting changes by passing a handler function to `x-sort` and adding keys to each item using `x-sort:item`. Here is an example of a simple handler function that shows an alert dialog with the changed item's key and its new position:

```alpine
<ul x-sort="alert($item + ' - ' + $position)">
    <li x-sort:item="1">foo</li>
    <li x-sort:item="2">bar</li>
    <li x-sort:item="3">baz</li>
</ul>
```

<!-- START_VERBATIM -->
<div x-data>
    <ul x-sort="alert($item + ' - ' + $position)">
        <li x-sort:item="1" class="cursor-pointer">foo</li>
        <li x-sort:item="2" class="cursor-pointer">bar</li>
        <li x-sort:item="3" class="cursor-pointer">baz</li>
    </ul>
</div>
<!-- END_VERBATIM -->

The `x-sort` handler will be called every time the sort order of the items change. The `$item` magic will contain the key of the sorted element (derived from `x-sort:item`), and `$position` will contain the new position of the item (starting at index `0`).

You can also pass a handler function to `x-sort` and that function will receive the `item` and `position` as the first and second parameter:

```alpine
<div x-data="{ handle: (item, position) => { ... } }">
    <ul x-sort="handle">
        <li x-sort:item="1">foo</li>
        <li x-sort:item="2">bar</li>
        <li x-sort:item="3">baz</li>
    </ul>
</div>
```

Handler functions are often used to persist the new order of items in the database so that the sorting order of a list is preserved between page refreshes.

<a name="sorting-groups"></a>
## Sorting groups

This plugin allows you to drag items from one `x-sort` sortable list into another one by adding a matching `x-sort:group` value to both lists:

```alpine
<div>
    <ul x-sort x-sort:group="todos">
        <li x-sort:item="1">foo</li>
        <li x-sort:item="2">bar</li>
        <li x-sort:item="3">baz</li>
    </ul>

    <ol x-sort x-sort:group="todos">
        <li x-sort:item="4">foo</li>
        <li x-sort:item="5">bar</li>
        <li x-sort:item="6">baz</li>
    </ol>
</div>
```

Because both sortable lists above use the same group name (`todos`), you can drag items from one list onto another.

> When using sort handlers like `x-sort="handle"` and dragging an item from one group to another, only the destination list's handler will be called with the key and new position.

<a name="drag-handles"></a>
## Drag handles

By default, each `x-sort:item` element is draggable by clicking and dragging anywhere within it. However, you may want to designate a smaller, more specific element as the "drag handle" so that the rest of the element can be interacted with like normal, and only the handle will respond to mouse dragging:

```alpine
<ul x-sort>
    <li x-sort:item>
        <span x-sort:handle> - </span>foo
    </li>

    <li x-sort:item>
        <span x-sort:handle> - </span>bar
    </li>

    <li x-sort:item>
        <span x-sort:handle> - </span>baz
    </li>
</ul>
```

<!-- START_VERBATIM -->
<div x-data>
    <ul x-sort>
        <li x-sort:item>
            <span x-sort:handle class="cursor-pointer"> - </span>foo
        </li>
        <li x-sort:item>
            <span x-sort:handle class="cursor-pointer"> - </span>bar
        </li>
        <li x-sort:item>
            <span x-sort:handle class="cursor-pointer"> - </span>baz
        </li>
    </ul>
</div>
<!-- END_VERBATIM -->

As you can see in the above example, the hyphen "-" is draggable, but the item text ("foo") is not.

<a name="ghost-elements"></a>
## Ghost elements

When a user drags an item, the element will follow their mouse to appear as though they are physically dragging the element.

By default, a "hole" (empty space) will be left in the original element's place during the drag.

If you would like to show a "ghost" of the original element in its place instead of an empty space, you can add the `.ghost` modifier to `x-sort`:

```alpine
<ul x-sort.ghost>
    <li x-sort:item>foo</li>
    <li x-sort:item>bar</li>
    <li x-sort:item>baz</li>
</ul>
```

<!-- START_VERBATIM -->
<div x-data>
    <ul x-sort.ghost>
        <li x-sort:item class="cursor-pointer">foo</li>
        <li x-sort:item class="cursor-pointer">bar</li>
        <li x-sort:item class="cursor-pointer">baz</li>
    </ul>
</div>
<!-- END_VERBATIM -->

<a name="ghost-styling"></a>
### Styling the ghost element

By default, the "ghost" element has a `.sortable-ghost` CSS class attached to it while the original element is being dragged.

This makes it easy to add any custom styling you would like:

```alpine
<style>
.sortable-ghost {
    opacity: .5 !important;
}
</style>

<ul x-sort.ghost>
    <li x-sort:item>foo</li>
    <li x-sort:item>bar</li>
    <li x-sort:item>baz</li>
</ul>
```

<!-- START_VERBATIM -->
<div x-data>
    <ul x-sort.ghost x-sort:config="{ ghostClass: 'opacity-50' }">
        <li x-sort:item class="cursor-pointer">foo</li>
        <li x-sort:item class="cursor-pointer">bar</li>
        <li x-sort:item class="cursor-pointer">baz</li>
    </ul>
</div>
<!-- END_VERBATIM -->

<a name="sorting-class"></a>
## Sorting class on body

While an element is being dragged around, Alpine will automatically add a `.sorting` class to the `<body>` element of the page.

This is useful for styling any element on the page conditionally using only CSS.

For example you could have a warning that only displays while a user is sorting items:

```html
<div id="sort-warning">
    Page functionality is limited while sorting
</div>
```

To show this only while sorting, you can use the `body.sorting` CSS selector:

```css
#sort-warning {
    display: none;
}

body.sorting #sort-warning {
    display: block;
}
```

<a name="css-hover-bug"></a>
## CSS hover bug

Currently, there is a [bug in Chrome and Safari](https://issues.chromium.org/issues/41129937) (not Firefox) that causes issues with hover styles.

Consider HTML like the following, where each item in the list is styled differently based on a hover state (here we're using Tailwind's `.hover` class to conditionally add a border):

```html
<div x-sort>
    <div x-sort:item class="hover:border">foo</div>
    <div x-sort:item class="hover:border">bar</div>
    <div x-sort:item class="hover:border">baz</div>
</div>
```

If you drag one of the elements in the list below you will see that the hover effect will be errantly applied to any element in the original element's place:

<!-- START_VERBATIM -->
<div x-data>
    <ul x-sort class="flex flex-col items-start">
        <li x-sort:item class="hover:border border-black cursor-pointer">foo</li>
        <li x-sort:item class="hover:border border-black cursor-pointer">bar</li>
        <li x-sort:item class="hover:border border-black cursor-pointer">baz</li>
    </ul>
</div>
<!-- END_VERBATIM -->

To fix this, you can leverage the `.sorting` class applied to the body while sorting to limit the hover effect to only be applied while `.sorting` does NOT exist on `body`.

Here is how you can do this directly inline using Tailwind arbitrary variants:

```html
<div x-sort>
    <div x-sort:item class="[body:not(.sorting)_&]:hover:border">foo</div>
    <div x-sort:item class="[body:not(.sorting)_&]:hover:border">bar</div>
    <div x-sort:item class="[body:not(.sorting)_&]:hover:border">baz</div>
</div>
```

Now you can see below that the hover effect is only applied to the dragging element and not the others in the list.

<!-- START_VERBATIM -->
<div x-data>
    <ul x-sort class="flex flex-col items-start">
        <li x-sort:item class="[body:not(.sorting)_&]:hover:border border-black cursor-pointer">foo</li>
        <li x-sort:item class="[body:not(.sorting)_&]:hover:border border-black cursor-pointer">bar</li>
        <li x-sort:item class="[body:not(.sorting)_&]:hover:border border-black cursor-pointer">baz</li>
    </ul>
</div>
<!-- END_VERBATIM -->

<a name="custom-configuration"></a>
## Custom configuration

Alpine chooses sensible defaults for configuring [SortableJS](https://github.com/SortableJS/Sortable?tab=readme-ov-file#options) under the hood. However, you can add or override any of these options yourself using `x-sort:config`:

```alpine
<ul x-sort x-sort:config="{ animation: 0 }">
    <li x-sort:item>foo</li>
    <li x-sort:item>bar</li>
    <li x-sort:item>baz</li>
</ul>
```

<!-- START_VERBATIM -->
<div x-data>
    <ul x-sort x-sort:config="{ animation: 0 }">
        <li x-sort:item class="cursor-pointer">foo</li>
        <li x-sort:item class="cursor-pointer">bar</li>
        <li x-sort:item class="cursor-pointer">baz</li>
    </ul>
</div>
<!-- END_VERBATIM -->

> Any config options passed will overwrite Alpine defaults. In this case of `animation`, this is fine, however be aware that overwriting `handle`, `group`, `filter`, `onSort`, `onStart`, or `onEnd` may break functionality.

[View the full list of SortableJS configuration options here →](https://github.com/SortableJS/Sortable?tab=readme-ov-file#options)
