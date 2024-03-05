---
order: 3
title: Focus
description: Easily manage focus within the page
graph_image: https://alpinejs.dev/social_focus.jpg
---

> Notice: This Plugin was previously called "Trap". Trap's functionality has been absorbed into this plugin along with additional functionality. You can swap Trap for Focus without any breaking changes.

# Focus Plugin

Alpine's Focus plugin allows you to manage focus on a page.

> This plugin internally makes heavy use of the open source tool: [Tabbable](https://github.com/focus-trap/tabbable). Big thanks to that team for providing a much needed solution to this problem.

<a name="installation"></a>
## Installation

You can use this plugin by either including it from a `<script>` tag or installing it via NPM:

### Via CDN

You can include the CDN build of this plugin as a `<script>` tag, just make sure to include it BEFORE Alpine's core JS file.

```alpine
<!-- Alpine Plugins -->
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/focus@3.x.x/dist/cdn.min.js"></script>

<!-- Alpine Core -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Via NPM

You can install Focus from NPM for use inside your bundle like so:

```shell
npm install @alpinejs/focus
```

Then initialize it from your bundle:

```js
import Alpine from 'alpinejs'
import focus from '@alpinejs/focus'

Alpine.plugin(focus)

...
```

<a name="x-trap"></a>
## x-trap

Focus offers a dedicated API for trapping focus within an element: the `x-trap` directive.

`x-trap` accepts a JS expression. If the result of that expression is true, then the focus will be trapped inside that element until the expression becomes false, then at that point, focus will be returned to where it was previously.

For example:

```alpine
<div x-data="{ open: false }">
    <button @click="open = true">Open Dialog</button>

    <span x-show="open" x-trap="open">
        <p>...</p>

        <input type="text" placeholder="Some input...">

        <input type="text" placeholder="Some other input...">

        <button @click="open = false">Close Dialog</button>
    </span>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <div :class="open && 'opacity-50'">
        <button x-on:click="open = true">Open Dialog</button>
    </div>

    <div x-show="open" x-trap="open" class="mt-4 space-y-4 p-4 border bg-yellow-100" @keyup.escape.window="open = false">
        <strong>
            <div>Focus is now "trapped" inside this dialog, meaning you can only click/focus elements within this yellow dialog. If you press tab repeatedly, the focus will stay within this dialog.</div>
        </strong>

        <div>
            <input type="text" placeholder="Some input...">
        </div>

        <div>
            <input type="text" placeholder="Some other input...">
        </div>

        <div>
            <button @click="open = false">Close Dialog</button>
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="nesting"></a>
### Nesting dialogs

Sometimes you may want to nest one dialog inside another. `x-trap` makes this trivial and handles it automatically.

`x-trap` keeps track of newly "trapped" elements and stores the last actively focused element. Once the element is "untrapped" then the focus will be returned to where it was originally.

This mechanism is recursive, so you can trap focus within an already trapped element infinite times, then "untrap" each element successively.

Here is nesting in action:

```alpine
<div x-data="{ open: false }">
    <button @click="open = true">Open Dialog</button>

    <span x-show="open" x-trap="open">

        ...

        <div x-data="{ open: false }">
            <button @click="open = true">Open Nested Dialog</button>

            <span x-show="open" x-trap="open">

                ...

                <button @click="open = false">Close Nested Dialog</button>
            </span>
        </div>

        <button @click="open = false">Close Dialog</button>
    </span>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <div :class="open && 'opacity-50'">
        <button x-on:click="open = true">Open Dialog</button>
    </div>

    <div x-show="open" x-trap="open" class="mt-4 space-y-4 p-4 border bg-yellow-100" @keyup.escape.window="open = false">
        <div>
            <input type="text" placeholder="Some input...">
        </div>

        <div>
            <input type="text" placeholder="Some other input...">
        </div>

        <div x-data="{ open: false }">
            <div :class="open && 'opacity-50'">
                <button x-on:click="open = true">Open Nested Dialog</button>
            </div>

            <div x-show="open" x-trap="open" class="mt-4 space-y-4 p-4 border border-gray-500 bg-yellow-200" @keyup.escape.window="open = false">
                <strong>
                    <div>Focus is now "trapped" inside this nested dialog. You cannot focus anything inside the outer dialog while this is open. If you close this dialog, focus will be returned to the last known active element.</div>
                </strong>

                <div>
                    <input type="text" placeholder="Some input...">
                </div>

                <div>
                    <input type="text" placeholder="Some other input...">
                </div>

                <div>
                    <button @click="open = false">Close Nested Dialog</button>
                </div>
            </div>
        </div>

        <div>
            <button @click="open = false">Close Dialog</button>
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="modifiers"></a>
### Modifiers

<a name="inert"></a>
#### .inert

When building things like dialogs/modals, it's recommended to hide all the other elements on the page from screen readers when trapping focus.

By adding `.inert` to `x-trap`, when focus is trapped, all other elements on the page will receive `aria-hidden="true"` attributes, and when focus trapping is disabled, those attributes will also be removed.

```alpine
<!-- When `open` is `false`: -->
<body x-data="{ open: false }">
    <div x-trap.inert="open" ...>
        ...
    </div>

    <div>
        ...
    </div>
</body>

<!-- When `open` is `true`: -->
<body x-data="{ open: true }">
    <div x-trap.inert="open" ...>
        ...
    </div>

    <div aria-hidden="true">
        ...
    </div>
</body>
```

<a name="noscroll"></a>
#### .noscroll

When building dialogs/modals with Alpine, it's recommended that you disable scrolling for the surrounding content when the dialog is open.

`x-trap` allows you to do this automatically with the `.noscroll` modifiers.

By adding `.noscroll`, Alpine will remove the scrollbar from the page and block users from scrolling down the page while a dialog is open.

For example:

```alpine
<div x-data="{ open: false }">
    <button>Open Dialog</button>

    <div x-show="open" x-trap.noscroll="open">
        Dialog Contents

        <button @click="open = false">Close Dialog</button>
    </div>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ open: false }">
        <button @click="open = true">Open Dialog</button>

        <div x-show="open" x-trap.noscroll="open" class="border mt-4 p-4">
            <div class="mb-4 text-bold">Dialog Contents</div>

            <p class="mb-4 text-gray-600 text-sm">Notice how you can no longer scroll on this page while this dialog is open.</p>

            <button class="mt-4" @click="open = false">Close Dialog</button>
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="noreturn"></a>
#### .noreturn

Sometimes you may not want focus to be returned to where it was previously. Consider a dropdown that's triggered upon focusing an input, returning focus to the input on close will just trigger the dropdown to open again.

`x-trap` allows you to disable this behavior with the `.noreturn` modifier.

By adding `.noreturn`, Alpine will not return focus upon x-trap evaluating to false.

For example:

```alpine
<div x-data="{ open: false }" x-trap.noreturn="open">
    <input type="search" placeholder="search for something" />

    <div x-show="open">
        Search results

        <button @click="open = false">Close</button>
    </div>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div
        x-data="{ open: false }"
        x-trap.noreturn="open"
        @click.outside="open = false"
        @keyup.escape.prevent.stop="open = false"
    >
        <input type="search" placeholder="search for something"
            @focus="open = true"
            @keyup.escape.prevent="$el.blur()"
        />

        <div x-show="open">
            <div class="mb-4 text-bold">Search results</div>

            <p class="mb-4 text-gray-600 text-sm">Notice when closing this dropdown, focus is not returned to the input.</p>

            <button class="mt-4" @click="open = false">Close Dialog</button>
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="noautofocus"></a>
#### .noautofocus

By default, when `x-trap` traps focus within an element, it focuses the first focussable element within that element. This is a sensible default, however there are times where you may want to disable this behavior and not automatically focus any elements when `x-trap` engages.

By adding `.noautofocus`, Alpine will not automatically focus any elements when trapping focus.

<a name="focus-magic"></a>
## $focus

This plugin offers many smaller utilities for managing focus within a page. These utilities are exposed via the `$focus` magic.

| Property | Description |
| ---       | --- |
| `focus(el)`   | Focus the passed element (handling annoyances internally: using nextTick, etc.) |
| `focusable(el)`   | Detect whether or not an element is focusable |
| `focusables()`   | Get all "focusable" elements within the current element |
| `focused()`   | Get the currently focused element on the page |
| `lastFocused()`   | Get the last focused element on the page |
| `within(el)`   | Specify an element to scope the `$focus` magic to (the current element by default) |
| `first()`   | Focus the first focusable element |
| `last()`   | Focus the last focusable element |
| `next()`   | Focus the next focusable element |
| `previous()`   | Focus the previous focusable element |
| `noscroll()`   | Prevent scrolling to the element about to be focused |
| `wrap()`   | When retrieving "next" or "previous" use "wrap around" (ex. returning the first element if getting the "next" element of the last element) |
| `getFirst()`   | Retrieve the first focusable element |
| `getLast()`   | Retrieve the last focusable element |
| `getNext()`   | Retrieve the next focusable element |
| `getPrevious()`   | Retrieve the previous focusable element |

Let's walk through a few examples of these utilities in use. The example below allows the user to control focus within the group of buttons using the arrow keys. You can test this by clicking on a button, then using the arrow keys to move focus around:

```alpine
<div
    @keydown.right="$focus.next()"
    @keydown.left="$focus.previous()"
>
    <button>First</button>
    <button>Second</button>
    <button>Third</button>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
<div
    x-data
    @keydown.right="$focus.next()"
    @keydown.left="$focus.previous()"
>
    <button class="focus:outline-none focus:ring-2 focus:ring-cyan-400">First</button>
    <button class="focus:outline-none focus:ring-2 focus:ring-cyan-400">Second</button>
    <button class="focus:outline-none focus:ring-2 focus:ring-cyan-400">Third</button>
</div>
(Click a button, then use the arrow keys to move left and right)
</div>
<!-- END_VERBATIM -->

Notice how if the last button is focused, pressing "right arrow" won't do anything. Let's add the `.wrap()` method so that focus "wraps around":

```alpine
<div
    @keydown.right="$focus.wrap().next()"
    @keydown.left="$focus.wrap().previous()"
>
    <button>First</button>
    <button>Second</button>
    <button>Third</button>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
<div
    x-data
    @keydown.right="$focus.wrap().next()"
    @keydown.left="$focus.wrap().previous()"
>
    <button class="focus:outline-none focus:ring-2 focus:ring-cyan-400">First</button>
    <button class="focus:outline-none focus:ring-2 focus:ring-cyan-400">Second</button>
    <button class="focus:outline-none focus:ring-2 focus:ring-cyan-400">Third</button>
</div>
(Click a button, then use the arrow keys to move left and right)
</div>
<!-- END_VERBATIM -->

Now, let's add two buttons, one to focus the first element in the button group, and another focus the last element:

```alpine
<button @click="$focus.within($refs.buttons).first()">Focus "First"</button>
<button @click="$focus.within($refs.buttons).last()">Focus "Last"</button>

<div
    x-ref="buttons"
    @keydown.right="$focus.wrap().next()"
    @keydown.left="$focus.wrap().previous()"
>
    <button>First</button>
    <button>Second</button>
    <button>Third</button>
</div>
```

<!-- START_VERBATIM -->
<div class="demo" x-data>
<button @click="$focus.within($refs.buttons).first()">Focus "First"</button>
<button @click="$focus.within($refs.buttons).last()">Focus "Last"</button>

<hr class="mt-2 mb-2"/>

<div
    x-ref="buttons"
    @keydown.right="$focus.wrap().next()"
    @keydown.left="$focus.wrap().previous()"
>
    <button class="focus:outline-none focus:ring-2 focus:ring-cyan-400">First</button>
    <button class="focus:outline-none focus:ring-2 focus:ring-cyan-400">Second</button>
    <button class="focus:outline-none focus:ring-2 focus:ring-cyan-400">Third</button>
</div>
</div>
<!-- END_VERBATIM -->

Notice that we needed to add a `.within()` method for each button so that `$focus` knows to scope itself to a different element (the `div` wrapping the buttons).
