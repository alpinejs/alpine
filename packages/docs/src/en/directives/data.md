---
order: 1
title: data
---

# x-data

Everything in Alpine starts with the `x-data` directive.

`x-data` defines a chunk of HTML as an Alpine component and provides the reactive data for that component to reference.

Here's an example of a contrived dropdown component:

```alpine
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle Content</button>

    <div x-show="open">
        Content...
    </div>
</div>
```

Don't worry about the other directives in this example (`@click` and `x-show`), we'll get to those in a bit. For now, let's focus on `x-data`.

<a name="scope"></a>
## Scope

Properties defined in an `x-data` directive are available to all element children. Even ones inside other, nested `x-data` components.

For example:

```alpine
<div x-data="{ foo: 'bar' }">
    <span x-text="foo"><!-- Will output: "bar" --></span>

    <div x-data="{ bar: 'baz' }">
        <span x-text="foo"><!-- Will output: "bar" --></span>

        <div x-data="{ foo: 'bob' }">
            <span x-text="foo"><!-- Will output: "bob" --></span>
        </div>
    </div>
</div>
```

<a name="methods"></a>
## Methods

Because `x-data` is evaluated as a normal JavaScript object, in addition to state, you can store methods and even getters.

For example, let's extract the "Toggle Content" behavior into a method on  `x-data`.

```alpine
<div x-data="{ open: false, toggle() { this.open = ! this.open } }">
    <button @click="toggle()">Toggle Content</button>

    <div x-show="open">
        Content...
    </div>
</div>
```

Notice the added `toggle() { this.open = ! this.open }` method on `x-data`. This method can now be called from anywhere inside the component.

You'll also notice the usage of `this.` to access state on the object itself. This is because Alpine evaluates this data object like any standard JavaScript object with a `this` context.

If you prefer, you can leave the calling parenthesis off of the `toggle` method completely. For example:

```alpine
<!-- Before -->
<button @click="toggle()">...</button>

<!-- After -->
<button @click="toggle">...</button>
```

<a name="getters"></a>
## Getters

JavaScript [getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) are handy when the sole purpose of a method is to return data based on other state.

Think of them like "computed properties" (although, they are not cached like Vue's computed properties).

Let's refactor our component to use a getter called `isOpen` instead of accessing `open` directly.

```alpine
<div x-data="{
    open: false,
    get isOpen() { return this.open },
    toggle() { this.open = ! this.open },
}">
    <button @click="toggle()">Toggle Content</button>

    <div x-show="isOpen">
        Content...
    </div>
</div>
```

Notice the "Content" now depends on the `isOpen` getter instead of the `open` property directly.

In this case there is no tangible benefit. But in some cases, getters are helpful for providing a more expressive syntax in your components.

<a name="data-less-components"></a>
## Data-less components

Occasionally, you want to create an Alpine component, but you don't need any data.

In these cases, you can always pass in an empty object.

```alpine
<div x-data="{}">
```

However, if you wish, you can also eliminate the attribute value entirely if it looks better to you.

```alpine
<div x-data>
```

<a name="single-element-components"></a>
## Single-element components

Sometimes you may only have a single element inside your Alpine component, like the following:

```alpine
<div x-data="{ open: true }">
    <button @click="open = false" x-show="open">Hide Me</button>
</div>
```

In these cases, you can declare `x-data` directly on that single element:

```alpine
<button x-data="{ open: true }" @click="open = false" x-show="open">
    Hide Me
</button>
```

<a name="re-usable-data"></a>
## Re-usable Data

If you find yourself duplicating the contents of `x-data`, or you find the inline syntax verbose, you can extract the `x-data` object out to a dedicated component using `Alpine.data`.

Here's a quick example:

```alpine
<div x-data="dropdown">
    <button @click="toggle">Toggle Content</button>

    <div x-show="open">
        Content...
    </div>
</div>

<script>
    document.addEventListener('alpine:init', () => {
        Alpine.data('dropdown', () => ({
            open: false,

            toggle() {
                this.open = ! this.open
            },
        }))
    })
</script>
```

[→ Read more about `Alpine.data(...)`](/globals/alpine-data)
