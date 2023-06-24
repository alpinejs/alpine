---
order: 5
title: Lifecycle
---

# Lifecycle

Alpine has a handful of different techniques for hooking into different parts of its lifecycle. Let's go through the most useful ones to familiarize yourself with:

<a name="element-initialization"></a>
## Element initialization

Another extremely useful lifecycle hook in Alpine is the `x-init` directive.

`x-init` can be added to any element on a page and will execute any JavaScript you call inside it when Alpine begins initializing that element.

```alpine
<button x-init="console.log('Im initing')">
```

In addition to the directive, Alpine will automatically call any `init()` methods stored on a data object. For example:

```js
Alpine.data('dropdown', () => ({
    init() {
        // I get called before the element using this data initializes.
    }
}))
```

<a name="after-a-state-change"></a>
## After a state change

Alpine allows you to execute code when a piece of data (state) changes. It offers two different APIs for such a task: `$watch` and `x-effect`.

<a name="watch"></a>
### `$watch`

```alpine
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
```

As you can see above, `$watch` allows you to hook into data changes using a dot-notation key. When that piece of data changes, Alpine will call the passed callback and pass it the new value. along with the old value before the change.

[→ Read more about $watch](/magics/watch)

<a name="x-effect"></a>
### `x-effect`

`x-effect` uses the same mechanism under the hood as `$watch` but has very different usage.

Instead of specifying which data key you wish to watch, `x-effect` will call the provided code and intelligently look for any Alpine data used within it. Now when one of those pieces of data changes, the `x-effect` expression will be re-run.

Here's the same bit of code from the `$watch` example rewritten using `x-effect`:

```alpine
<div x-data="{ open: false }" x-effect="console.log(open)">
```

Now, this expression will be called right away, and re-called every time `open` is updated.

The two main behavioral differences with this approach are:

1. The provided code will be run right away AND when data changes (`$watch` is "lazy" -- won't run until the first data change)
2. No knowledge of the previous value. (The callback provided to `$watch` receives both the new value AND the old one)

[→ Read more about x-effect](/directives/effect)

<a name="alpine-initialization"></a>
## Alpine initialization

<a name="alpine-initializing"></a>
### `alpine:init`

Ensuring a bit of code executes after Alpine is loaded, but BEFORE it initializes itself on the page is a necessary task.

This hook allows you to register custom data, directives, magics, etc. before Alpine does its thing on a page.

You can hook into this point in the lifecycle by listening for an event that Alpine dispatches called: `alpine:init`

```js
document.addEventListener('alpine:init', () => {
    Alpine.data(...)
})
```

<a name="alpine-initialized"></a>
### `alpine:initialized`

Alpine also offers a hook that you can use to execute code AFTER it's done initializing called `alpine:initialized`:

```js
document.addEventListener('alpine:initialized', () => {
    //
})
```
