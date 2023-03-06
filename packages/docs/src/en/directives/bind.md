---
order: 4
title: bind
---

# x-bind

`x-bind` allows you to set HTML attributes on elements based on the result of JavaScript expressions.

For example, here's a component where we will use `x-bind` to set the placeholder value of an input.

```alpine
<div x-data="{ placeholder: 'Type here...' }">
    <input type="text" x-bind:placeholder="placeholder">
</div>
```

<a name="shorthand-syntax"></a>
## Shorthand syntax

If `x-bind:` is too verbose for your liking, you can use the shorthand: `:`. For example, here is the same input element as above, but refactored to use the shorthand syntax.

```alpine
<input type="text" :placeholder="placeholder">
```

<a name="binding-classes"></a>
## Binding classes

`x-bind` is most often useful for setting specific classes on an element based on your Alpine state.

Here's a simple example of a simple dropdown toggle, but instead of using `x-show`, we'll use a "hidden" class to toggle an element.

```alpine
<div x-data="{ open: false }">
    <button x-on:click="open = ! open">Toggle Dropdown</button>

    <div :class="open ? '' : 'hidden'">
        Dropdown Contents...
    </div>
</div>
```

Now, when `open` is `false`, the "hidden" class will be added to the dropdown.

<a name="shorthand-conditionals"></a>
### Shorthand conditionals

In cases like these, if you prefer a less verbose syntax you can use JavaScript's short-circuit evaluation instead of standard conditionals:

```alpine
<div :class="show ? '' : 'hidden'">
<!-- Is equivalent to: -->
<div :class="show || 'hidden'">
```

The inverse is also available to you. Suppose instead of `open`, we use a variable with the opposite value: `closed`.

```alpine
<div :class="closed ? 'hidden' : ''">
<!-- Is equivalent to: -->
<div :class="closed && 'hidden'">
```

<a name="class-object-syntax"></a>
### Class object syntax

Alpine offers an additional syntax for toggling classes if you prefer. By passing a JavaScript object where the classes are the keys and booleans are the values, Alpine will know which classes to apply and which to remove. For example:

```alpine
<div :class="{ 'hidden': ! show }">
```

This technique offers a unique advantage to other methods. When using object-syntax, Alpine will NOT preserve original classes applied to an element's `class` attribute.

For example, if you wanted to apply the "hidden" class to an element before Alpine loads, AND use Alpine to toggle its existence you can only achieve that behavior using object-syntax:

```alpine
<div class="hidden" :class="{ 'hidden': ! show }">
```

In case that confused you, let's dig deeper into how Alpine handles `x-bind:class` differently than other attributes.

<a name="special-behavior"></a>
### Special behavior

`x-bind:class` behaves differently than other attributes under the hood.

Consider the following case.

```alpine
<div class="opacity-50" :class="hide && 'hidden'">
```

If "class" were any other attribute, the `:class` binding would overwrite any existing class attribute, causing `opacity-50` to be overwritten by either `hidden` or `''`.

However, Alpine treats `class` bindings differently. It's smart enough to preserve existing classes on an element.

For example, if `hide` is true, the above example will result in the following DOM element:

```alpine
<div class="opacity-50 hidden">
```

If `hide` is false, the DOM element will look like:

```alpine
<div class="opacity-50">
```

This behavior should be invisible and intuitive to most users, but it is worth mentioning explicitly for the inquiring developer or any special cases that might crop up.

<a name="binding-styles"></a>
## Binding styles

Similar to the special syntax for binding classes with JavaScript objects, Alpine also offers an object-based syntax for binding `style` attributes.

Just like the class objects, this syntax is entirely optional. Only use it if it affords you some advantage.

```alpine
<div :style="{ color: 'red', display: 'flex' }">

<!-- Will render: -->
<div style="color: red; display: flex;" ...>
```

Conditional inline styling is possible using expressions just like with x-bind:class. Short circuit operators can be used here as well by using a styles object as the second operand.
```alpine
<div x-bind:style="true && { color: 'red' }">

<!-- Will render: -->
<div style="color: red;">
```

One advantage of this approach is being able to mix it in with existing styles on an element:

```alpine
<div style="padding: 1rem;" :style="{ color: 'red', display: 'flex' }">

<!-- Will render: -->
<div style="padding: 1rem; color: red; display: flex;" ...>
```

And like most expressions in Alpine, you can always use the result of a JavaScript expression as the reference:

```alpine
<div x-data="{ styles: { color: 'red', display: 'flex' }}">
    <div :style="styles">
</div>

<!-- Will render: -->
<div ...>
    <div style="color: red; display: flex;" ...>
</div>
```

<a name="bind-directives"></a>
## Binding Alpine Directives Directly

`x-bind` allows you to bind an object of different directives and attributes to an element.

The object keys can be anything you would normally write as an attribute name in Alpine. This includes Alpine directives and modifiers, but also plain HTML attributes. The object values are either plain strings, or in the case of dynamic Alpine directives, callbacks to be evaluated by Alpine.

```alpine
<div x-data="dropdown()">
    <button x-bind="trigger">Open Dropdown</button>

    <span x-bind="dialogue">Dropdown Contents</span>
</div>

<script>
    document.addEventListener('alpine:init', () => {
        Alpine.data('dropdown', () => ({
            open: false,

            trigger: {
                ['x-ref']: 'trigger',
                ['@click']() {
                    this.open = true
                },
            },

            dialogue: {
                ['x-show']() {
                    return this.open
                },
                ['@click.outside']() {
                    this.open = false
                },
            },
        }))
    })
</script>
```

There are a couple of caveats to this usage of `x-bind`:

> When the directive being "bound" or "applied" is `x-for`, you should return a normal expression string from the callback. For example: `['x-for']() { return 'item in items' }`
