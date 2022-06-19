---
order: 3
title: Tabs
description: ...
graph_image: https://alpinejs.dev/social_tabs.jpg
---

# Tabs

Building a tabs component with Alpine might appear as simple as putting `x-show` on an various element styled as tabs. Unfortunately, much more goes into building robust, accessible tabs such as:

* Cycle through tabs with arrow keys
* Making only the active tab button focusable
* Proper accessibility attributes

...

## A Basic Example

```alpine
<div x-tabs>
    <div x-tabs:list>
        <button x-tabs:tab>Tab #1</button>
        <button x-tabs:tab>Tab #2</button>
        <button x-tabs:tab>Tab #3</button>
    </div>

    <div x-tabs:panels>
        <div x-tabs:panel>Tab Panel #1</div>
        <div x-tabs:panel>Tab Panel #2</div>
        <div x-tabs:panel>Tab Panel #3</div>
    </div>
</div>
```

<!-- START_VERBATIM -->
<div x-data class="demo">
<div x-tabs>
    <div x-tabs:list>
        <button x-tabs:tab>Tab #1</button>
        <button x-tabs:tab>Tab #2</button>
        <button x-tabs:tab>Tab #3</button>
    </div>

    <div x-tabs:panels>
        <div x-tabs:panel>Tab Panel #1</div>
        <div x-tabs:panel>Tab Panel #2</div>
        <div x-tabs:panel>Tab Panel #3</div>
    </div>
</div>
</div>
<!-- END_VERBATIM -->

## Directives

* x-tabs
* x-tabs:list
* x-tabs:tab
* x-tabs:panels
* x-tabs:panel

## Magics

* $tab
* $tabPanel

## Props

* manual
* defaultIndex
* selectedIndex
* onChange
* vertical
* disabled

## Accessibility Notes

## Keyboard Shortcuts

