---
order: 6
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

You can install Anchor from NPM for use inside your bundle like so:

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

The primary API for using this plugin is the `x-sort` directive. By adding `x-sort` to an element, its children become sortable—meaning you can drag them around with your mouse, and they will change positions.

```alpine
<ul x-sort>
    <li>foo</li>
    <li>bar</li>
    <li>baz</li>
</ul>
```

<!-- START_VERBATIM -->
<div x-data>
    <ul x-sort>
        <li>foo</li>
        <li>bar</li>
        <li>baz</li>
    </ul>
</div>
<!-- END_VERBATIM -->

<a name="sort-handlers"></a>
## Sort handlers

You can react to sorting changes by passing a handler function to `x-sort` and adding keys to each item using `x-sort:key`. Here is an example of a simple handler function that shows an alert dialog with the changed item's key and its new position:

```alpine
<ul x-sort="alert($key + ' - ' + $position)">
    <li x-sort:key="1">foo</li>
    <li x-sort:key="2">bar</li>
    <li x-sort:key="3">baz</li>
</ul>
```

<!-- START_VERBATIM -->
<div x-data>
    <ul x-sort="alert($key + ' - ' + $position)">
        <li x-sort:key="1">foo</li>
        <li x-sort:key="2">bar</li>
        <li x-sort:key="3">baz</li>
    </ul>
</div>
<!-- END_VERBATIM -->

The `x-sort` handler will be called every time the sort order of the items change. The `$key` magic will contain the key of the sorted element (derived from `x-sort:key`), and `$position` will contain the new position of the item (staring at index `0`).

You can also pass a handler function to `x-sort` and that function will receive the `key` and `position` as the first and second parameter:

```alpine
<div x-data="{ handle: (key, position) => { ... } }">
    <ul x-sort="handle">
        <li x-sort:key="1">foo</li>
        <li x-sort:key="2">bar</li>
        <li x-sort:key="3">baz</li>
    </ul>
</div>
```

Handler functions are often used to persist the new order of items in the database so that the sorting order of a list is preserved between page refreshes.

<a name="sorting-groups"></a>
## Sorting groups

This plugin allows you to drag items from one `x-sort` sortable list into another one by adding a matching `.group` modifier to both lists:

```alpine
<div>
    <ul x-sort.group.todos>
        <li x-sort:key="1">foo</li>
        <li x-sort:key="2">bar</li>
        <li x-sort:key="3">baz</li>
    </ul>

    <ol x-sort.group.todos>
        <li x-sort:key="1">foo</li>
        <li x-sort:key="2">bar</li>
        <li x-sort:key="3">baz</li>
    </ol>
</div>
```

Because both sortable lists above use the same group name (`todos`), you can drag items from one list onto another.

> When using sort handlers like `x-sort="handle"` and dragging an item from one group to another, only the destination lists handler will be called with the key and new position.

<a name="drag-handles"></a>
## Drag handles

By default, each child element of `x-sort` is draggable by clicking and dragging anywhere within it. However, you may want to designate a smaller, more specific element as the "drag handle" so that the rest of the element can be interacted with like normal, and only the handle will respond to mouse dragging:

```alpine
<ul x-sort>
    <li>
        <span x-sort:handle> - </span>foo
    </li>

    <li>
        <span x-sort:handle> - </span>bar
    </li>

    <li>
        <span x-sort:handle> - </span>baz
    </li>
</ul>
```

<!-- START_VERBATIM -->
<div x-data>
    <ul x-sort>
        <li>
            <span x-sort:handle> - </span>foo
        </li>
        <li>
            <span x-sort:handle> - </span>bar
        </li>
        <li>
            <span x-sort:handle> - </span>baz
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
    <li>foo</li>
    <li>bar</li>
    <li>baz</li>
</ul>
```

<!-- START_VERBATIM -->
<div x-data>
    <ul x-sort.ghost>
        <li>foo</li>
        <li>bar</li>
        <li>baz</li>
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
    <li>foo</li>
    <li>bar</li>
    <li>baz</li>
</ul>
```

<!-- START_VERBATIM -->
<div x-data>
    <ul x-sort.ghost x-sort:config="{ ghostClass: 'opacity-50' }">
        <li>foo</li>
        <li>bar</li>
        <li>baz</li>
    </ul>
</div>
<!-- END_VERBATIM -->

<a name="custom-configuration"></a>
## Custom configuration

Alpine chooses sensible defaults for configuring [SortableJS](https://github.com/SortableJS/Sortable?tab=readme-ov-file#options) under the hood. However, you can add or override any of these options yourself using `x-sort:config`:

```alpine
<ul x-sort x-sort:config="{ filter: '.no-drag' }">
    <li>foo</li>
    <li class="no-drag">bar (not dragable)</li>
    <li>baz</li>
</ul>
```

<!-- START_VERBATIM -->
<div x-data>
    <ul x-sort x-sort:config="{ filter: '.no-drag' }">
        <li>foo</li>
        <li class="no-drag">bar (not dragable)</li>
        <li>baz</li>
    </ul>
</div>
<!-- END_VERBATIM -->

[View the full list of SortableJS configuration options here →](https://github.com/SortableJS/Sortable?tab=readme-ov-file#options)
