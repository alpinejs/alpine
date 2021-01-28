# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true)](https://alpinejs.codewithhugo.com/chat/)

Alpine.js offers you the reactive and declarative nature of big frameworks like Vue or React at a much lower cost.

You get to keep your DOM, and sprinkle in behavior as you see fit.

Think of it like [Tailwind](https://tailwindcss.com/) for JavaScript.

> Note: This tool's syntax is almost entirely borrowed from [Vue](https://vuejs.org/) (and by extension [Angular](https://angularjs.org/)). I am forever grateful for the gift they are to the web.

## Translated documentation

| Language | Link for documentation |
| --- | --- |
| Arabic | [**التوثيق باللغة العربية**](./README.ar.md) |
| Chinese Traditional | [**繁體中文說明文件**](./README.zh-TW.md) |
| German | [**Dokumentation in Deutsch**](./README.de.md) |
| Indonesian | [**Dokumentasi Bahasa Indonesia**](./README.id.md) |
| Japanese | [**日本語ドキュメント**](./README.ja.md) |
| Portuguese | [**Documentação em Português**](./README.pt.md) |
| Russian | [**Документация на русском**](./README.ru.md) |
| Spanish | [**Documentación en Español**](./README.es.md) |
| Turkish | [**Türkçe Dokümantasyon**](./README.tr.md) |
| Français | [**Documentation en Français**](./README.fr.md) |
| Korean | [**한국어 문서**](./README.ko.md) |

## Install

**From CDN:** Add the following script to the end of your `<head>` section.
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
```

That's it. It will initialize itself.

For production environments, it's recommended to pin a specific version number in the link to avoid unexpected breakage from newer versions.
For example, to use version `2.8.0` (latest):
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.0/dist/alpine.min.js" defer></script>
```

**From npm:** Install the package from npm.
```js
npm i alpinejs
```

Include it in your script.
```js
import 'alpinejs'
```

**For IE11 support** Use the following scripts instead.
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
```

The pattern above is the [module/nomodule pattern](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/) that will result in the modern bundle automatically loaded on modern browsers, and the IE11 bundle loaded automatically on IE11 and other legacy browsers.

## Use

*Dropdown/Modal*
```html
<div x-data="{ open: false }">
    <button @click="open = true">Open Dropdown</button>

    <ul
        x-show="open"
        @click.away="open = false"
    >
        Dropdown Body
    </ul>
</div>
```

*Tabs*
```html
<div x-data="{ tab: 'foo' }">
    <button :class="{ 'active': tab === 'foo' }" @click="tab = 'foo'">Foo</button>
    <button :class="{ 'active': tab === 'bar' }" @click="tab = 'bar'">Bar</button>

    <div x-show="tab === 'foo'">Tab Foo</div>
    <div x-show="tab === 'bar'">Tab Bar</div>
</div>
```

You can even use it for non-trivial things:
*Pre-fetching a dropdown's HTML content on hover.*
```html
<div x-data="{ open: false }">
    <button
        @mouseenter.once="
            fetch('/dropdown-partial.html')
                .then(response => response.text())
                .then(html => { $refs.dropdown.innerHTML = html })
        "
        @click="open = true"
    >Show Dropdown</button>

    <div x-ref="dropdown" x-show="open" @click.away="open = false">
        Loading Spinner...
    </div>
</div>
```

## Learn

There are 14 directives available to you:

| Directive | Description |
| --- | --- |
| [`x-data`](#x-data) | Declares a new component scope. |
| [`x-init`](#x-init) | Runs an expression when a component is initialized. |
| [`x-show`](#x-show) | Toggles `display: none;` on the element depending on expression (true or false). |
| [`x-bind`](#x-bind) | Sets the value of an attribute to the result of a JS expression. |
| [`x-on`](#x-on) | Attaches an event listener to the element. Executes JS expression when emitted. |
| [`x-model`](#x-model) | Adds "two-way data binding" to an element. Keeps input element in sync with component data. |
| [`x-text`](#x-text) | Works similarly to `x-bind`, but will update the `innerText` of an element. |
| [`x-html`](#x-html) | Works similarly to `x-bind`, but will update the `innerHTML` of an element. |
| [`x-ref`](#x-ref) | Convenient way to retrieve raw DOM elements out of your component. |
| [`x-if`](#x-if) | Remove an element completely from the DOM. Needs to be used on a `<template>` tag. |
| [`x-for`](#x-for) | Create new DOM nodes for each item in an array. Needs to be used on a `<template>` tag. |
| [`x-transition`](#x-transition) | Directives for applying classes to various stages of an element's transition. |
| [`x-spread`](#x-spread) | Allows you to bind an object of Alpine directives to an element for better reusability. |
| [`x-cloak`](#x-cloak) | This attribute is removed when Alpine initializes. Useful for hiding pre-initialized DOM. |

And 6 magic properties:

| Magic Properties | Description |
| --- | --- |
| [`$el`](#el) |  Retrieve the root component DOM node. |
| [`$refs`](#refs) | Retrieve DOM elements marked with `x-ref` inside the component. |
| [`$event`](#event) | Retrieve the native browser "Event" object within an event listener.  |
| [`$dispatch`](#dispatch) | Create a `CustomEvent` and dispatch it using `.dispatchEvent()` internally. |
| [`$nextTick`](#nexttick) | Execute a given expression AFTER Alpine has made its reactive DOM updates. |
| [`$watch`](#watch) | Will fire a provided callback when a component property you "watched" gets changed. |


## Sponsors

<img width="33%" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" alt="Tailwind CSS">

**Want your logo here? [DM on Twitter](https://twitter.com/calebporzio)**

## Community Projects

* [AlpineJS Weekly Newsletter](https://alpinejs.codewithhugo.com/newsletter/)
* [Spruce (State Management)](https://github.com/ryangjchandler/spruce)
* [Turbolinks Adapter](https://github.com/SimoTod/alpine-turbolinks-adapter)
* [Alpine Magic Helpers](https://github.com/KevinBatdorf/alpine-magic-helpers)
* [Awesome Alpine](https://github.com/ryangjchandler/awesome-alpine)

### Directives

---

### `x-data`

**Example:** `<div x-data="{ foo: 'bar' }">...</div>`

**Structure:** `<div x-data="[object literal]">...</div>`

`x-data` declares a new component scope. It tells the framework to initialize a new component with the following data object.

Think of it like the `data` property of a Vue component.

**Extract Component Logic**

You can extract data (and behavior) into reusable functions:

```html
<div x-data="dropdown()">
    <button x-on:click="open">Open</button>

    <div x-show="isOpen()" x-on:click.away="close">
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

> **For bundler users**, note that Alpine.js accesses functions that are in the global scope (`window`), you'll need to explicitly assign your functions to `window` in order to use them with `x-data` for example `window.dropdown = function () {}` (this is because with Webpack, Rollup, Parcel etc. `function`'s you define will default to the module's scope not `window`).


You can also mix-in multiple data objects using object destructuring:

```html
<div x-data="{...dropdown(), ...tabs()}">
```

---

### `x-init`
**Example:** `<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`

**Structure:** `<div x-data="..." x-init="[expression]"></div>`

`x-init` runs an expression when a component is initialized.

If you wish to run code AFTER Alpine has made its initial updates to the DOM (something like a `mounted()` hook in VueJS), you can return a callback from `x-init`, and it will be run after:

`x-init="() => { // we have access to the post-dom-initialization state here // }"`

---

### `x-show`
**Example:** `<div x-show="open"></div>`

**Structure:** `<div x-show="[expression]"></div>`

`x-show` toggles the `display: none;` style on the element depending if the expression resolves to `true` or `false`.

**x-show.transition**

`x-show.transition` is a convenience API for making your `x-show`s more pleasant using CSS transitions.

```html
<div x-show.transition="open">
    These contents will be transitioned in and out.
</div>
```

| Directive | Description |
| --- | --- |
| `x-show.transition` | A simultaneous fade and scale. (opacity, scale: 0.95, timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), duration-in: 150ms, duration-out: 75ms)
| `x-show.transition.in` | Only transition in. |
| `x-show.transition.out` | Only transition out. |
| `x-show.transition.opacity` | Only use the fade. |
| `x-show.transition.scale` | Only use the scale. |
| `x-show.transition.scale.75` | Customize the CSS scale transform `transform: scale(.75)`. |
| `x-show.transition.duration.200ms` | Sets the "in" transition to 200ms. The out will be set to half that (100ms). |
| `x-show.transition.origin.top.right` | Customize the CSS transform origin `transform-origin: top right`. |
| `x-show.transition.in.duration.200ms.out.duration.50ms` | Different durations for "in" and "out". |

> Note: All of these transition modifiers can be used in conjunction with each other. This is possible (although ridiculous lol): `x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale.95`

> Note: `x-show` will wait for any children to finish transitioning out. If you want to bypass this behavior, add the `.immediate` modifier:
```html
<div x-show.immediate="open">
    <div x-show.transition="open">
</div>
```
---

### `x-bind`

> Note: You are free to use the shorter ":" syntax: `:type="..."`.

**Example:** `<input x-bind:type="inputType">`

**Structure:** `<input x-bind:[attribute]="[expression]">`

`x-bind` sets the value of an attribute to the result of a JavaScript expression. The expression has access to all the keys of the component's data object, and will update every-time its data is updated.

> Note: attribute bindings ONLY update when their dependencies update. The framework is smart enough to observe data changes and detect which bindings care about them.

**`x-bind` for class attributes**

`x-bind` behaves a little differently when binding to the `class` attribute.

For classes, you pass in an object whose keys are class names, and values are boolean expressions to determine if those class names are applied or not.

For example:
`<div x-bind:class="{ 'hidden': foo }"></div>`

In this example, the "hidden" class will only be applied when the value of the `foo` data attribute is `true`.

**`x-bind` for boolean attributes**

`x-bind` supports boolean attributes in the same way as value attributes, using a variable as the condition or any JavaScript expression that resolves to `true` or `false`.

For example:
```html
<!-- Given: -->
<button x-bind:disabled="myVar">Click me</button>

<!-- When myVar == true: -->
<button disabled="disabled">Click me</button>

<!-- When myVar == false: -->
<button>Click me</button>
```

This will add or remove the `disabled` attribute when `myVar` is true or false respectively.

Boolean attributes are supported as per the [HTML specification](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute), for example `disabled`, `readonly`, `required`, `checked`, `hidden`, `selected`, `open`, etc.

> Note: If you need a false state to show for your attribute, such as `aria-*`, chain `.toString()` to the value while binding to the attribute. For example: `:aria-expanded="isOpen.toString()"` would persist whether  `isOpen` was `true` or `false`.

**`.camel` modifier**
**Example:** `<svg x-bind:view-box.camel="viewBox">`

The `camel` modifier will bind to the camel case equivalent of the attribute name. In the example above, the value of `viewBox` will be bound the `viewBox` attribute as opposed to the `view-box` attribute.

---

### `x-on`

> Note: You are free to use the shorter "@" syntax: `@click="..."`.

**Example:** `<button x-on:click="foo = 'bar'"></button>`

**Structure:** `<button x-on:[event]="[expression]"></button>`

`x-on` attaches an event listener to the element it's declared on. When that event is emitted, the JavaScript expression set as its value is executed. You can use `x-on` with any event available for the element you're adding the directive on, for a full list of events, see [the Event reference on MDN](https://developer.mozilla.org/en-US/docs/Web/Events) for a list of possible values.

If any data is modified in the expression, other element attributes "bound" to this data, will be updated.

> Note: You can also specify a JavaScript function name.

**Example:** `<button x-on:click="myFunction"></button>`

This is equivalent to: `<button x-on:click="myFunction($event)"></button>`

**`keydown` modifiers**

**Example:** `<input type="text" x-on:keydown.escape="open = false">`

You can specify specific keys to listen for using keydown modifiers appended to the `x-on:keydown` directive. Note that the modifiers are kebab-cased versions of `Event.key` values.

Examples: `enter`, `escape`, `arrow-up`, `arrow-down`

> Note: You can also listen for system-modifier key combinations like: `x-on:keydown.cmd.enter="foo"`

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

**`.self` modifier**
**Example:** `<div x-on:click.self="foo = 'bar'"><button></button></div>`

Adding `.self` to an event listener will only trigger the handler if the `$event.target` is the element itself. In the above example, this means the "click" event that bubbles from the button to the outer `<div>` will **not** run the handler.

**`.window` modifier**
**Example:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

Adding `.window` to an event listener will install the listener on the global window object instead of the DOM node on which it is declared. This is useful for when you want to modify component state when something changes with the window, like the resize event. In this example, when the window grows larger than 768 pixels wide, we will close the modal/dropdown, otherwise maintain the same state.

>Note: You can also use the `.document` modifier to attach listeners to `document` instead of `window`

**`.once` modifier**
**Example:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

Adding the `.once` modifier to an event listener will ensure that the listener will only be handled once. This is useful for things you only want to do once, like fetching HTML partials and such.

**`.passive` modifier**
**Example:** `<button x-on:mousedown.passive="interactive = true"></button>`

Adding the `.passive` modifier to an event listener will make the listener a passive one, which means `preventDefault()` will not work on any events being processed, this can help, for example with scroll performance on touch devices.

**`.debounce` modifier**
**Example:** `<input x-on:input.debounce="fetchSomething()">`

The `debounce` modifier allows you to "debounce" an event handler. In other words, the event handler will NOT run until a certain amount of time has elapsed since the last event that fired. When the handler is ready to be called, the last handler call will execute.

The default debounce "wait" time is 250 milliseconds.

If you wish to customize this, you can specify a custom wait time like so:

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

**`.camel` modifier**
**Example:** `<input x-on:event-name.camel="doSomething()">`

The `camel` modifier will attach an event listener for the camel case equivalent event name. In the example above, the expression will be evaluated when the `eventName` event is fired on the element.

---

### `x-model`
**Example:** `<input type="text" x-model="foo">`

**Structure:** `<input type="text" x-model="[data item]">`

`x-model` adds "two-way data binding" to an element. In other words, the value of the input element will be kept in sync with the value of the data item of the component.

> Note: `x-model` is smart enough to detect changes on text inputs, checkboxes, radio buttons, textareas, selects, and multiple selects. It should behave [how Vue would](https://vuejs.org/v2/guide/forms.html) in those scenarios.

**`.number` modifier**
**Example:** `<input x-model.number="age">`

The `number` modifier will convert the input's value to a number. If the value cannot be parsed as a valid number, the original value is returned.

**`.debounce` modifier**
**Example:** `<input x-model.debounce="search">`

The `debounce` modifier allows you to add a "debounce" to a value update. In other words, the event handler will NOT run until a certain amount of time has elapsed since the last event that fired. When the handler is ready to be called, the last handler call will execute.

The default debounce "wait" time is 250 milliseconds.

If you wish to customize this, you can specifiy a custom wait time like so:

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

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

> :warning: **Only use on trusted content and never on user-provided content.** :warning:
>
> Dynamically rendering HTML from third parties can easily lead to [XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) vulnerabilities.

---

### `x-ref`
**Example:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**Structure:** `<div x-ref="[ref name]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`

`x-ref` provides a convenient way to retrieve raw DOM elements out of your component. By setting an `x-ref` attribute on an element, you are making it available to all event handlers inside an object called `$refs`.

This is a helpful alternative to setting ids and using `document.querySelector` all over the place.

> Note: you can also bind dynamic values for x-ref: `<span :x-ref="item.id"></span>` if you need to.

---

### `x-if`
**Example:** `<template x-if="true"><div>Some Element</div></template>`

**Structure:** `<template x-if="[expression]"><div>Some Element</div></template>`

For cases where `x-show` isn't sufficient (`x-show` sets an element to `display: none` if it's false), `x-if` can be used to  actually remove an element completely from the DOM.

It's important that `x-if` is used on a `<template></template>` tag because Alpine doesn't use a virtual DOM. This implementation allows Alpine to stay rugged and use the real DOM to work its magic.

> Note: `x-if` must have a single root element inside the `<template></template>` tag.

> Note: When using `template` in a `svg` tag, you need to add a [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) that should be run before Alpine.js is initialized.

---

### `x-for`
**Example:**
```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

> Note: the `:key` binding is optional, but HIGHLY recommended.

`x-for` is available for cases when you want to create new DOM nodes for each item in an array. This should appear similar to `v-for` in Vue, with one exception of needing to exist on a `template` tag, and not a regular DOM element.

If you want to access the current index of the iteration, use the following syntax:

```html
<template x-for="(item, index) in items" :key="index">
    <!-- You can also reference "index" inside the iteration if you need. -->
    <div x-text="index"></div>
</template>
```

If you want to access the array object (collection) of the iteration, use the following syntax:

```html
<template x-for="(item, index, collection) in items" :key="index">
    <!-- You can also reference "collection" inside the iteration if you need. -->
    <!-- Current item. -->
    <div x-text="item"></div>
    <!-- Same as above. -->
    <div x-text="collection[index]"></div>
    <!-- Previous item. -->
    <div x-text="collection[index - 1]"></div>
</template>
```

> Note: `x-for` must have a single root element inside of the `<template></template>` tag.

> Note: When using `template` in a `svg` tag, you need to add a [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) that should be run before Alpine.js is initialized.

#### Nesting `x-for`s
You can nest `x-for` loops, but you MUST wrap each loop in an element. For example:

```html
<template x-for="item in items">
    <div>
        <template x-for="subItem in item.subItems">
            <div x-text="subItem"></div>
        </template>
    </div>
</template>
```

#### Iterating over a range

Alpine supports the `i in n` syntax, where `n` is an integer, allowing you to iterate over a fixed range of elements.

```html
<template x-for="i in 10">
    <span x-text="i"></span>
</template>
```

---

### `x-transition`
**Example:**
```html
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

```html
<template x-if="open">
    <div
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0 transform scale-90"
        x-transition:enter-end="opacity-100 transform scale-100"
        x-transition:leave="transition ease-in duration-300"
        x-transition:leave-start="opacity-100 transform scale-100"
        x-transition:leave-end="opacity-0 transform scale-90"
    >...</div>
</template>
```

> The example above uses classes from [Tailwind CSS](https://tailwindcss.com).

Alpine offers 6 different transition directives for applying classes to various stages of an element's transition between "hidden" and "shown" states. These directives work both with `x-show` AND `x-if`.

These behave exactly like VueJS's transition directives, except they have different, more sensible names:

| Directive | Description |
| --- | --- |
| `:enter` | Applied during the entire entering phase. |
| `:enter-start` | Added before element is inserted, removed one frame after element is inserted. |
| `:enter-end` | Added one frame after element is inserted (at the same time `enter-start` is removed), removed when transition/animation finishes.
| `:leave` | Applied during the entire leaving phase. |
| `:leave-start` | Added immediately when a leaving transition is triggered, removed after one frame. |
| `:leave-end` | Added one frame after a leaving transition is triggered (at the same time `leave-start` is removed), removed when the transition/animation finishes.

---

### `x-spread`
**Example:**
```html
<div x-data="dropdown()">
    <button x-spread="trigger">Open Dropdown</button>

    <span x-spread="dialogue">Dropdown Contents</span>
</div>

<script>
    function dropdown() {
        return {
            open: false,
            trigger: {
                ['@click']() {
                    this.open = true
                },
            },
            dialogue: {
                ['x-show']() {
                    return this.open
                },
                ['@click.away']() {
                    this.open = false
                },
            }
        }
    }
</script>
```

`x-spread` allows you to extract an element's Alpine bindings into a reusable object.

The object keys are the directives (Can be any directive including modifiers), and the values are callbacks to be evaluated by Alpine.

> Note: There are a couple of caveats to x-spread:
> - When the directive being "spread" is `x-for`, you should return a normal expression string from the callback. For example: `['x-for']() { return 'item in items' }`.
> - `x-data` and `x-init` can't be used inside a "spread" object.

---

### `x-cloak`
**Example:** `<div x-data="{}" x-cloak></div>`

`x-cloak` attributes are removed from elements when Alpine initializes. This is useful for hiding pre-initialized DOM. It's typical to add the following global style for this to work:

```html
<style>
    [x-cloak] { display: none; }
</style>
```

### Magic Properties

> With the exception of `$el`, magic properties are **not available within `x-data`** as the component isn't initialized yet.

---

### `$el`
**Example:**
```html
<div x-data>
    <button @click="$el.innerHTML = 'foo'">Replace me with "foo"</button>
</div>
```

`$el` is a magic property that can be used to retrieve the root component DOM node.

### `$refs`
**Example:**
```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

`$refs` is a magic property that can be used to retrieve DOM elements marked with `x-ref` inside the component. This is useful when you need to manually manipulate DOM elements.

---

### `$event`
**Example:**
```html
<input x-on:input="alert($event.target.value)">
```

`$event` is a magic property that can be used within an event listener to retrieve the native browser "Event" object.

> Note: The $event property is only available in DOM expressions.

If you need to access $event inside of a JavaScript function you can pass it in directly:

`<button x-on:click="myFunction($event)"></button>`

---

### `$dispatch`
**Example:**
```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
    <!-- When clicked, will console.log "bar" -->
</div>
```

**Note on Event Propagation**

Notice that, because of [event bubbling](https://en.wikipedia.org/wiki/Event_bubbling), when you need to capture events dispatched from nodes that are under the same nesting hierarchy, you'll need to use the [`.window`](https://github.com/alpinejs/alpine#x-on) modifier:

**Example:**

```html
<div x-data>
    <span @custom-event="console.log($event.detail.foo)"></span>
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
<div>
```

> This won't work because when `custom-event` is dispatched, it'll propagate to its common ancestor, the `div`.

**Dispatching to Components**

You can also take advantage of the previous technique to make your components talk to each other:

**Example:**

```html
<div x-data @custom-event.window="console.log($event.detail)"></div>

<button x-data @click="$dispatch('custom-event', 'Hello World!')">
<!-- When clicked, will console.log "Hello World!". -->
```

`$dispatch` is a shortcut for creating a `CustomEvent` and dispatching it using `.dispatchEvent()` internally. There are lots of good use cases for passing data around and between components using custom events. [Read here](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) for more information on the underlying `CustomEvent` system in browsers.

You will notice that any data passed as the second parameter to `$dispatch('some-event', { some: 'data' })`, becomes available through the new events "detail" property: `$event.detail.some`. Attaching custom event data to the `.detail` property is standard practice for `CustomEvent`s in browsers. [Read here](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail) for more info.

You can also use `$dispatch()` to trigger data updates for `x-model` bindings. For example:

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')">
        <!-- After the button is clicked, `x-model` will catch the bubbling "input" event, and update foo to "baz". -->
    </span>
</div>
```

> Note: The $dispatch property is only available in DOM expressions.

If you need to access $dispatch inside of a JavaScript function you can pass it in directly:

`<button x-on:click="myFunction($dispatch)"></button>`

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
    ></button>
</div>
```

`$nextTick` is a magic property that allows you to only execute a given expression AFTER Alpine has made its reactive DOM updates. This is useful for times you want to interact with the DOM state AFTER it's reflected any data updates you've made.

---

### `$watch`
**Example:**
```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```

You can "watch" a component property with the `$watch` magic method. In the above example, when the button is clicked and `open` is changed, the provided callback will fire and `console.log` the new value.

## Security
If you find a security vulnerability, please send an email to [calebporzio@gmail.com]().

Alpine relies on a custom implementation using the `Function` object to evaluate its directives. Despite being more secure then `eval()`, its use is prohibited in some environments, such as Google Chrome App, using restrictive Content Security Policy (CSP).

If you use Alpine in a website dealing with sensitive data and requiring [CSP](https://csp.withgoogle.com/docs/strict-csp.html), you need to include `unsafe-eval` in your policy. A robust policy correctly configured will help protecting your users when using personal or financial data.

Since a policy applies to all scripts in your page, it's important that other external libraries included in the website are carefully reviewed to ensure that they are trustworthy and they won't introduce any Cross Site Scripting vulnerability either using the `eval()` function or manipulating the DOM to inject malicious code in your page.

## V3 Roadmap
* Move from `x-ref` to `ref` for Vue parity?
* Add `Alpine.directive()`
* Add `Alpine.component('foo', {...})` (With magic `__init()` method)
* Dispatch Alpine events for "loaded", "transition-start", etc... ([#299](https://github.com/alpinejs/alpine/pull/299)) ?
* Remove "object" (and array) syntax from `x-bind:class="{ 'foo': true }"` ([#236](https://github.com/alpinejs/alpine/pull/236) to add support for object syntax for the `style` attribute)
* Improve `x-for` mutation reactivity ([#165](https://github.com/alpinejs/alpine/pull/165))
* Add "deep watching" support in V3 ([#294](https://github.com/alpinejs/alpine/pull/294))
* Add `$el` shortcut
* Change `@click.away` to `@click.outside`?

## License

Copyright © 2019-2020 Caleb Porzio and contributors

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
