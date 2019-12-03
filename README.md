# Project X

Project X offers you the reactive and declarative nature of big frameworks like Vue or React at a much lower cost.

You get to keep your DOM, and sprinkle in behavior as you see fit.

Think of it like [Tailwind](https://tailwindcss.com/) for JavaScript.

> Note: This tool's syntax is almost entirely borrowed from [Vue.js](https://vuejs.org/). I am forever grateful for the gift that it is to the web.

## Install
Add the following script to the end of your `<head>` section.
```html
<script src="https://cdn.jsdelivr.net/gh/calebporzio/project-x@v0.3.0/dist/project-x.min.js" defer></script>
```

## Use

> These examples use the `.hidden` class from Tailwind. If you aren't using tailwind, just add `.hidden { display: none; }` to your stylesheet.

*Dropdown/Modal*
```html
<div x-data="{ open: false }">
    <button x-on:click="open = true">Open Dropdown</button>

    <ul
        class="hidden"
        x-bind:class="{ 'hidden': ! open }"
        x-on:click.away="open = false"
    >
        Dropdown Body
    </ul>
</div>
```

*Tabs*
```html
<div x-data="{ tab: 'foo' }">
    <button x-bind:class="{ 'active': tab === 'foo' }" x-on:click="tab = 'foo'">Foo</button>
    <button x-bind:class="{ 'active': tab === 'bar' }" x-on:click="tab = 'bar'">Bar</button>

    <div class="hidden" x-bind:class="{ 'hidden': tab !== 'foo' }">Tab Foo</div>
    <div class="hidden" x-bind:class="{ 'hidden': tab !== 'bar' }">Tab Bar</div>
</div>
```

## Learn

There are 7 directives available to you:

| Directive
| --- |
| `x-data` |
| `x-bind` |
| `x-on` |
| `x-model` |
| `x-text` |
| `x-ref` |
| `x-cloak` |

Here's how they each work:

---

### `x-data`

**Example:** `<div x-data="{ foo: 'bar' }">...</div>`

**Structure:** `<div x-data="[JSON data object]">...</div>`

`x-data` declares a new component scope. It tells the framework to initialize a new component with the following data object.

Think of it like the `data` property of a Vue component.

---

### `x-bind`
**Example:** `<input x-bind:type="inputType">`

**Structure:** `<input x-bind:[attribute]="[expression]">`

`x-bind` sets the value of an attribute to the result of a JavaScript expression. The expression has access to all the keys of the component's data object, and will update every-time it's data is updated.

> Note: attribute bindings ONLY update when their dependancies update. The framework is smart enough to observe data changes and detect which bindings care about them.

**`x-bind` for class attributes**

`x-bind` behaves a little differently when binding to the `class` attribute.

For classes, you pass in an object who's keys are class names, and values are boolean expressions to determine if those class names are applied or not.

For example:
`<div x-bind:class="{ 'hidden': foo }"></div>`

In this example, the "hidden" class will only be applied when the value of the `foo` data attribute is `true`.

---

### `x-on`

**Example:** `<button x-on:click="foo = 'bar'"></button>`

**Structure:** `<button x-on:[event]="[expression]"></button>`

`x-on` attaches an event listener to the element it's declared on. When that event is emitted, the JavaScript expression set as it's value is executed.

If any data is modified in the expression, other element attributes "bound" to this data, will be updated.

**`.away` modifier**

**Example:** `<div x-on:click.away="showModal = false"></div>`

When the `.away` modifier is present, the event handler will only be executed when the event originates from a source other than itself, or its children.

This is useful for hiding dropdowns and modals when a user clicks away from them.

**`.prevent` modifier**
**Example:** `<input type="checkbox" x-on:click.prevent>`

Adding `.prevent` to an event listener will call `preventDefault` on the triggered event. In the above example, this means the checkbox wouldn't actually get checked when a user clicks on it.

**`.stop` modifier**
**Example:** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

Adding `.stop` to an event listener will call `stopPropagation` on the triggered event. In the above example, this means the "click" event won't bubble from the button to the outer `<div>`. Or in other words, when a user clicks the button, `foo` won't be set to `'bar'`.

---

### `x-model`
**Example:** `<input type="text" x-model="foo">`

**Structure:** `<input type="text" x-model="[data item]">`

`x-model` adds "two-way data binding" to an element. In other words, the value of the input element will be kept in sync with the value of the data item of the component.

> Note: `x-model` is smart enough to detect changes on text inputs, checkboxes, radio buttons, textareas, selects, and multiple selects. It should behave [how Vue would](https://vuejs.org/v2/guide/forms.html) in those scenarios.

---

### `x-text`
**Example:** `<span x-text="foo"></span>`

**Structure:** `<span x-text="[expression]"`

`x-text` works similarly to `x-bind`, except instead of updating the value of an attribute, it will update the `innerText` of an element.

---

### `x-ref`
**Example:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**Structure:** `<div x-ref="[ref name]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`

`x-ref` provides a convenient way to retrieve raw DOM elements out of your component. By setting an `x-ref` attribute on an element, you are making it available to all event handlers inside an object called `$refs`.

This is a helpful alternative to setting ids and using `document.querySelector` all over the place.

---

### `x-cloak`
**Example:** `<div x-data="{}" x-cloak></div>`

`x-cloak` attributes are removed from elements when Project-X initializes. This is useful for hiding pre-initialized DOM. It's typical to add the following global style for this to work:

```html
<style>
    [x-cloak] { display: none; }
</style>
```
