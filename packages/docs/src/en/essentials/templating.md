---
order: 3
title: Templating
---

# Templating

Alpine offers a handful of useful directives for manipulating the DOM on a web page.

Let's cover a few of the basic templating directives here, but be sure to look through the available directives in the sidebar for an exhaustive list.

<a name="text-content"></a>
## Text content

Alpine makes it easy to control the text content of an element with the `x-text` directive.

```alpine
<div x-data="{ title: 'Start Here' }">
    <h1 x-text="title"></h1>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ title: 'Start Here' }" class="demo">
    <strong x-text="title"></strong>
</div>
<!-- END_VERBATIM -->

Now, Alpine will set the text content of the `<h1>` with the value of `title` ("Start Here"). When `title` changes, so will the contents of `<h1>`.

Like all directives in Alpine, you can use any JavaScript expression you like. For example:

```alpine
<span x-text="1 + 2"></span>
```

<!-- START_VERBATIM -->
<div class="demo" x-data>
    <span x-text="1 + 2"></span>
</div>
<!-- END_VERBATIM -->

The `<span>` will now contain the sum of "1" and "2".

[→ Read more about `x-text`](/directives/text)

<a name="toggling-elements"></a>
## Toggling elements

Toggling elements is a common need in web pages and applications. Dropdowns, modals, dialogues, "show-more"s, etc... are all good examples.

Alpine offers the `x-show` and `x-if` directives for toggling elements on a page.

<a name="x-show"></a>
### `x-show`

Here's a simple toggle component using `x-show`.

```alpine
<div x-data="{ open: false }">
    <button @click="open = ! open">Expand</button>

    <div x-show="open">
        Content...
    </div>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <button @click="open = ! open" :aria-pressed="open">Expand</button>

    <div x-show="open">
        Content...
    </div>
</div>
<!-- END_VERBATIM -->

Now the entire `<div>` containing the contents will be shown and hidden based on the value of `open`.

Under the hood, Alpine adds the CSS property `display: none;` to the element when it should be hidden.

[→ Read more about `x-show`](/directives/show)

This works well for most cases, but sometimes you may want to completely add and remove the element from the DOM entirely. This is what `x-if` is for.

<a name="x-if"></a>
### `x-if`

Here is the same toggle from before, but this time using `x-if` instead of `x-show`.

```alpine
<div x-data="{ open: false }">
    <button @click="open = ! open">Expand</button>

    <template x-if="open">
        <div>
            Content...
        </div>
    </template>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <button @click="open = ! open" :aria-pressed="open">Expand</button>

    <template x-if="open">
        <div>
            Content...
        </div>
    </template>
</div>
<!-- END_VERBATIM -->

Notice that `x-if` must be declared on a `<template>` tag. This is so that Alpine can leverage the existing browser behavior of the `<template>` element and use it as the source of the target `<div>` to be added and removed from the page.

When `open` is true, Alpine will append the `<div>` to the `<template>` tag, and remove it when `open` is false.

[→ Read more about `x-if`](/directives/if)

<a name="toggling-with-transitions"></a>
## Toggling with transitions

Alpine makes it simple to smoothly transition between "shown" and "hidden" states using the `x-transition` directive.

> `x-transition` only works with `x-show`, not with `x-if`.

Here is, again, the simple toggle example, but this time with transitions applied:

```alpine
<div x-data="{ open: false }">
    <button @click="open = ! open">Expands</button>

    <div x-show="open" x-transition>
        Content...
    </div>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <button @click="open = ! open">Expands</button>

    <div class="flex">
        <div x-show="open" x-transition style="will-change: transform;">
            Content...
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

Let's zoom in on the portion of the template dealing with transitions:

```alpine
<div x-show="open" x-transition>
```

`x-transition` by itself will apply sensible default transitions (fade and scale) to the toggle.

There are two ways to customize these transitions:

* Transition helpers
* Transition CSS classes.

Let's take a look at each of these approaches:

<a name="transition-helpers"></a>
### Transition helpers

Let's say you wanted to make the duration of the transition longer, you can manually specify that using the `.duration` modifier like so:

```alpine
<div x-show="open" x-transition.duration.500ms>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <button @click="open = ! open">Expands</button>

    <div class="flex">
        <div x-show="open" x-transition.duration.500ms style="will-change: transform;">
            Content...
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

Now the transition will last 500 milliseconds.

If you want to specify different values for in and out transitions, you can use `x-transition:enter` and `x-transition:leave`:

```alpine
<div
    x-show="open"
    x-transition:enter.duration.500ms
    x-transition:leave.duration.1000ms
>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <button @click="open = ! open">Expands</button>

    <div class="flex">
        <div x-show="open" x-transition:enter.duration.500ms x-transition:leave.duration.1000ms style="will-change: transform;">
            Content...
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

Additionally, you can add either `.opacity` or `.scale` to only transition that property. For example:

```alpine
<div x-show="open" x-transition.opacity>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <button @click="open = ! open">Expands</button>

    <div class="flex">
        <div x-show="open" x-transition:enter.opacity.duration.500 x-transition:leave.opacity.duration.250>
            Content...
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

[→ Read more about transition helpers](/directives/transition#the-transition-helper)

<a name="transition-classes"></a>
### Transition classes

If you need more fine-grained control over the transitions in your application, you can apply specific CSS classes at specific phases of the transition using the following syntax (this example uses [Tailwind CSS](https://tailwindcss.com/)):

```alpine
<div
    x-show="open"
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0 transform scale-90"
    x-transition:enter-end="opacity-100 transform scale-100"
    x-transition:leave="transition ease-in duration-300"
    x-transition:leave-start="opacity-100 transform scale-100"
    x-transition:leave-end="opacity-0 transform scale-90"
>...</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <button @click="open = ! open">Expands</button>

    <div class="flex">
        <div
            x-show="open"
            x-transition:enter="transition ease-out duration-300"
            x-transition:enter-start="opacity-0 transform scale-90"
            x-transition:enter-end="opacity-100 transform scale-100"
            x-transition:leave="transition ease-in duration-300"
            x-transition:leave-start="opacity-100 transform scale-100"
            x-transition:leave-end="opacity-0 transform scale-90"
            style="will-change: transform"
        >
            Content...
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

[→ Read more about transition classes](/directives/transition#applying-css-classes)

<a name="binding-attributes"></a>
## Binding attributes

You can add HTML attributes like `class`, `style`, `disabled`, etc... to elements in Alpine using the `x-bind` directive.

Here is an example of a dynamically bound `class` attribute:

```alpine
<button
    x-data="{ red: false }"
    x-bind:class="red ? 'bg-red' : ''"
    @click="red = ! red"
>
    Toggle Red
</button>
```

<!-- START_VERBATIM -->
<div class="demo">
    <button
        x-data="{ red: false }"
        x-bind:style="red && 'background: red'"
        @click="red = ! red"
    >
        Toggle Red
    </button>
</div>
<!-- END_VERBATIM -->


As a shortcut, you can leave out the `x-bind` and use the shorthand `:` syntax directly:

```alpine
<button ... :class="red ? 'bg-red' : ''">
```

Toggling classes on and off based on data inside Alpine is a common need. Here's an example of toggling a class using Alpine's `class` binding object syntax: (Note: this syntax is only available for `class` attributes)

```alpine
<div x-data="{ open: true }">
    <span :class="{ 'hidden': ! open }">...</span>
</div>
```

Now the `hidden` class will be added to the element if `open` is false, and removed if `open` is true.

<a name="looping-elements"></a>
## Looping elements

Alpine allows for iterating parts of your template based on JavaScript data using the `x-for` directive. Here is a simple example:

```alpine
<div x-data="{ statuses: ['open', 'closed', 'archived'] }">
    <template x-for="status in statuses">
        <div x-text="status"></div>
    </template>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ statuses: ['open', 'closed', 'archived'] }" class="demo">
    <template x-for="status in statuses">
        <div x-text="status"></div>
    </template>
</div>
<!-- END_VERBATIM -->

Similar to `x-if`, `x-for` must be applied to a `<template>` tag. Internally, Alpine will append the contents of `<template>` tag for every iteration in the loop.

As you can see the new `status` variable is available in the scope of the iterated templates.

[→ Read more about `x-for`](/directives/for)

<a name="inner-html"></a>
## Inner HTML

Alpine makes it easy to control the HTML content of an element with the `x-html` directive.

```alpine
<div x-data="{ title: '<h1>Start Here</h1>' }">
    <div x-html="title"></div>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ title: '<h1>Start Here</h1>' }" class="demo">
    <div x-html="title"></div>
</div>
<!-- END_VERBATIM -->

Now, Alpine will set the text content of the `<div>` with the element `<h1>Start Here</h1>`. When `title` changes, so will the contents of `<h1>`.

> ⚠️ Only use on trusted content and never on user-provided content. ⚠️
> Dynamically rendering HTML from third parties can easily lead to XSS vulnerabilities.

[→ Read more about `x-html`](/directives/html)
