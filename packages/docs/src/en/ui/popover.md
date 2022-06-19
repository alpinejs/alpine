---
order: 2
title: Popover
description: ...
graph_image: https://alpinejs.dev/social_popover.jpg
---

# Popover (Dropdown)

Building a popover with Alpine might appear as simple as putting `x-show` on an element styled as a dropdown. Unfortunately, much more goes into building a robust, accessible dropdown such as:

* Close on escape
* Close when you click outside the dropdown
* Close the dropdown when focus leaves it
* Disable scrolling the background when modal is active
* Support tabbing between popovers in a group
* Adding proper ARIA attributes

...

## A Basic Example

```alpine
<div x-popover>
    <button x-popover:button>Open Dropdown</button>

    <div x-popover:panel>
        <a href="#">Link #1</a>
        <a href="#">Link #2</a>
        <a href="#">Link #3</a>
    </div>
</div>
```

<!-- START_VERBATIM -->
<div x-data class="demo">
<div x-popover>
    <button x-popover:button>Open Dropdown</button>

    <div x-popover:panel>
        <a href="#">Link #1</a>
        <a href="#">Link #2</a>
        <a href="#">Link #3</a>
    </div>
</div>
</div>
<!-- END_VERBATIM -->

## Directives

* x-popover
* x-popover:overlay
* x-popover:panel
* x-popover:title
* x-popover:description

## Magics

* $popover

## Props

* open
* @close
* focus
* static

## Accessibility Notes

## Keyboard Shortcuts

