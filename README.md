# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)

Alpine.js offers you the reactive and declarative nature of big frameworks like Vue or React at a much lower cost.

You get to keep your DOM, and sprinkle in behavior as you see fit.

Think of it like [Tailwind](https://tailwindcss.com/) for JavaScript.

> Note: This tool's syntax is almost entirely borrowed from [Vue](https://vuejs.org/) (and by extension [Angular](https://angularjs.org/)). I am forever grateful for the gift they are to the web.

## Install

**From CDN:** Add the following script to the end of your `<head>` section.
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v1.4.0/dist/alpine.js" defer></script>
```

That's it. It will initialize itself.

**From NPM:** Install the package from NPM.
```js
npm i alpinejs
```

Include it in your script.
```js
import Alpine from 'alpinejs'
```

For IE11, polyfills will need to be provided. Please load the following scripts before the Alpine script above.
```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=MutationObserver%2CArray.from%2CArray.prototype.forEach%2CMap%2CSet%2CArray.prototype.includes%2CString.prototype.includes%2CPromise%2CNodeList.prototype.forEach%2CObject.values%2CReflect%2CReflect.set"></script>

<script src="https://cdn.jsdelivr.net/npm/proxy-polyfill@0.3.0/proxy.min.js"></script>
```

## Use

*Dropdown/Modal*
```html
<div x-data="{ open: false }">
    <button x-on:click="open = true">Open Dropdown</button>

    <ul
        x-show="open"
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

    <div x-show="tab === 'foo'">Tab Foo</div>
    <div x-show="tab === 'bar'">Tab Bar</div>
</div>
```

You can even use it for non-trivial things:
*Pre-fetching a dropdown's HTML content on hover*
```html
<div x-data="{ open: false }">
    <button
        x-on:mouseenter.once="
            fetch('/dropdown-partial.html')
                .then(response => response.text())
                .then(html => { $refs.dropdown.innerHTML = html })
        "
        x-on:click="open = true"
    >Show Dropdown</button>

    <div x-ref="dropdown" x-show="open" x-on:click.away="open = false">
        Loading Spinner...
    </div>
</div>
```

## Learn

There are 12 directives available to you:

| Directive
| --- |
| [`x-data`](#x-data) |
| [`x-init`](#x-init) |
| [`x-show`](#x-show) |
| [`x-bind`](#x-bind) |
| [`x-on`](#x-on) |
| [`x-model`](#x-model) |
| [`x-text`](#x-text) |
| [`x-html`](#x-html) |
| [`x-ref`](#x-ref) |
| [`x-if`](#x-if) |
| [`x-transition`](#x-transition) |
| [`x-cloak`](#x-cloak) |

And 2 magic objects/functions:

| Magic Object/Functions
| --- |
| [`$refs`](#refs) |
| [`$nextTick`](#nexttick) |

### Directives

---

### `x-data`

**Example:** `<div x-data="{ foo: 'bar' }">...</div>`

**Structure:** `<div x-data="[JSON data object]">...</div>`

`x-data` declares a new component scope. It tells the framework to initialize a new component with the following data object.

Think of it like the `data` property of a Vue component.

**Extract Component Logic**

You can extract data (and behavior) into reusable functions:

```html
<div x-data="dropdown()">
    <button x-on:click="open()">Open</button>

    <div x-show="isOpen()" x-on:click.away="close()">
        // Dropdown
    </div>
</div>

<script>
    function dropdown() {
        return {
            show: false,
            open() { this.show = true },
            close() { this.show = false },
            isOpen() { return this.show === true },
        }
    }
</script>
```

You can also mix-in multiple data objects using object destructuring:

```html
<div x-data="{...dropdown(), ...tabs()}">
```

---

### `x-init`
**Example:** `<div x-data"{ foo: 'bar' }" x-init="foo = 'baz"></div>`

**Structure:** `<div x-data="..." x-init="[expression]"></div>`

`x-init` runs an expression (with the initial data object in scope) when a component is initialized.

---

### `x-show`
**Example:** `<div x-show="open"></div>`

**Structure:** `<div x-show="[expression]"></div>`

`x-show` toggles the `display: none;` style on the element depending if the expression resolves to `true` or `false`.

---

### `x-bind`
**Example:** `<input x-bind:type="inputType">`

**Structure:** `<input x-bind:[attribute]="[expression]">`

`x-bind` sets the value of an attribute to the result of a JavaScript expression. The expression has access to all the keys of the component's data object, and will update every-time it's data is updated.

> Note: attribute bindings ONLY update when their dependencies update. The framework is smart enough to observe data changes and detect which bindings care about them.

**`x-bind` for class attributes**

`x-bind` behaves a little differently when binding to the `class` attribute.

For classes, you pass in an object who's keys are class names, and values are boolean expressions to determine if those class names are applied or not.

For example:
`<div x-bind:class="{ 'hidden': foo }"></div>`

In this example, the "hidden" class will only be applied when the value of the `foo` data attribute is `true`.

**`x-bind` for boolean attributes**

`x-bind` supports boolean attributes in the same way that value attributes, using a variable as the condition or any JavaScript expression that resolves to `true` or `false`.

For example:
`<button x-bind:disabled="myVar">Click me</button>`

This will add or remove the `disabled` attribute when `myVar` is true or false respectively.

Most common boolean attributes are supported, like `readonly`, `required`, etc.

---

### `x-on`

**Example:** `<button x-on:click="foo = 'bar'"></button>`

**Structure:** `<button x-on:[event]="[expression]"></button>`

`x-on` attaches an event listener to the element it's declared on. When that event is emitted, the JavaScript expression set as it's value is executed.

If any data is modified in the expression, other element attributes "bound" to this data, will be updated.

**`keydown` modifiers**

**Example:** `<input type="text" x-on:keydown.escape="open = false">`

You can specify specific keys to listen for using keydown modifiers appended to the `x-on:keydown` directive. Note that the modifiers are kebab-cased versions of `Event.key` values.

Examples: `enter`, `escape`, `arrow-up`, `arrow-down`

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

**`.window` modifier**
**Example:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

Adding `.window` to an event listener will install the listener on the global window object instead of the DOM node on which it is declared. This is useful for when you want to modify component state when something changes with the window, like the resize event. In this example, when the window grows larger than 768 pixels wide, we will close the modal/dropdown, otherwise maintain the same state.

>Note: You can also use the `.document` modifier to attach listeners to `document` instead of `window`

**`.once` modifier**
**Example:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

Adding the `.once` modifier to an event listener will ensure that the listener will only be handled once. This is useful for things you only want to do once, like fetching HTML partials and such.

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

### `x-html`
**Example:** `<span x-html="foo"></span>`

**Structure:** `<span x-html="[expression]"`

`x-html` works similarly to `x-bind`, except instead of updating the value of an attribute, it will update the `innerHTML` of an element.

---

### `x-ref`
**Example:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**Structure:** `<div x-ref="[ref name]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`

`x-ref` provides a convenient way to retrieve raw DOM elements out of your component. By setting an `x-ref` attribute on an element, you are making it available to all event handlers inside an object called `$refs`.

This is a helpful alternative to setting ids and using `document.querySelector` all over the place.

---

### `x-if`
**Example:** `<template x-if="true"><div>Some Element</div></template>`

**Structure:** `<template x-if="[expression]"><div>Some Element</div></template>`

For cases where `x-show` isn't sufficient (`x-show` sets an element to `display: none` if it's false), `x-if` can be used to  actually remove an element completely from the DOM.

It's important that `x-if` is used on a `<template></template>` tag because Alpine doesn't use a virtual DOM. This implementation allows Alpine to stay rugged and use the real DOM to work it's magic.

> Note: `x-if` must have a single element root inside the `<template></template>` tag.

---

### `x-transition`
**Example:**
```html
<div
    x-show="open"
    x-transition:enter="ease-out transition-slow"
    x-transition:enter-start="opacity-0 scale-90"
    x-transition:enter-end="opacity-100 scale-100"
    x-transition:leave="ease-in transition-slow"
    x-transition:leave-start="opacity-100 scale-100"
    x-transition:leave-end="opacity-0 scale-90"
>...</div>
```

```html
<template x-if="open">
    <div
        x-transition:enter="ease-out transition-slow"
        x-transition:enter-start="opacity-0 scale-90"
        x-transition:enter-end="opacity-100 scale-100"
        x-transition:leave="ease-in transition-slow"
        x-transition:leave-start="opacity-100 scale-100"
        x-transition:leave-end="opacity-0 scale-90"
    >...</div>
</template>
```

Alpine offers 6 different transition directives for applying classes to various stages of an element's transition between "hidden" and "shown" states. These directives work both with `x-show` AND `x-if`.

These behave exactly like VueJs's transition directives, except they have different, more sensible names:

| Directive | Description |
| --- | --- |
| `:enter` | Applied during the entire entering phase. |
| `:enter-start` | Added before element is inserted, removed one frame after element is inserted. |
| `:enter-end` | Added one frame after element is inserted (at the same time `enter-start` is removed), removed when transition/animation finishes.
| `:leave` | Applied during the entire leaving phase. |
| `:leave-start` | Added immediately when a leaving transition is triggered, removed after one frame. |
| `:leave-end` | Added one frame after a leaving transition is triggered (at the same time `leave-start` is removed), removed when the transition/animation finishes.

---

### `x-cloak`
**Example:** `<div x-data="{}" x-cloak></div>`

`x-cloak` attributes are removed from elements when Alpine initializes. This is useful for hiding pre-initialized DOM. It's typical to add the following global style for this to work:

```html
<style>
    [x-cloak] { display: none; }
</style>
```

### Magic Objects/Functions

---

### `$refs`
**Example:**
```html
<span x-ref="foo">

<button x-on:click="$refs.foo.innerText = 'bar'">
```

`$refs` is a magic object that can be used to retreive DOM elements marked with `x-ref` inside the component. This is useful when you need to manually manipulate DOM elements.

---

### `$nextTick`
**Example:**
```html
<div x-data="{ fruit: 'apple' }">
    <button
        x-on:click="
            fruit = 'pear';
            $nextTick(() => { console.log($event.target.innerText) });
        "
        x-text="fruit"
    >
</div>
```

`$nextTick` is a magic function that allows you to only execute a given expression AFTER Alpine has made it's reactive DOM updates. This is useful for times you want to interact with the DOM state AFTER it's reflected any data updates you've made.
