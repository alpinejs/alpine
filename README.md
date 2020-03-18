# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)

Alpine.js offers you the reactive and declarative nature of big frameworks like Vue or React at a much lower cost.

You get to keep your DOM, and sprinkle in behavior as you see fit.

Think of it like [Tailwind](https://tailwindcss.com/) for JavaScript.

> Note: This tool's syntax is almost entirely borrowed from [Vue](https://vuejs.org/) (and by extension [Angular](https://angularjs.org/)). I am forever grateful for the gift they are to the web.

[**日本語ドキュメント**](./README.ja.md)

## Install

**From CDN:** Add the following script to the end of your `<head>` section.
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.js" defer></script>
```

That's it. It will initialize itself.

**From NPM:** Install the package from NPM.
```js
npm i alpinejs
```

Include it in your script.
```js
import 'alpinejs'
```

**For IE11 support** Use the following script instead.
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.js" defer></script>
```

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
*Pre-fetching a dropdown's HTML content on hover*
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

There are 13 directives available to you:

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
| [`x-for`](#x-for) |
| [`x-transition`](#x-transition) |
| [`x-cloak`](#x-cloak) |

And 6 magic properties:

| Magic Properties
| --- |
| [`$el`](#el) |
| [`$refs`](#refs) |
| [`$event`](#event) |
| [`$dispatch`](#dispatch) |
| [`$nextTick`](#nexttick) |
| [`$watch`](#watch) |

And a selection of events:

| Events
| --- |
| [`alpine:loaded`](#alpine-loaded) |
| [`alpine:mutated`](#alpine-mutated) |
| [`alpine:[key]-mutated`](#alpine-key-mutated) |
| [`alpine:updated`](#alpine-updated) |
| [`alpine:transition-start`](#alpine-transition-start) |
| [`alpine:transition-end`](#alpine-transition-end) |

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

`x-init="return () => { // we have access to the post-dom-initialization state here // }"`

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
| `x-show.transition` | A simultanious fade and scale. (opacity, scale: 0.95, timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), duration-in: 150ms, duration-out: 75ms)
| `x-show.transition.in` | Ony transition in. |
| `x-show.transition.out` | Ony transition out. |
| `x-show.transition.opacity` | Only use the fade. |
| `x-show.transition.scale` | Only use the scale. |
| `x-show.transition.scale.75` | Customize the CSS scale transform `transform: scale(.75)`. |
| `x-show.transition.duration.200ms` | Sets the "in" transition to 200ms. The out will be set to half that (100ms). |
| `x-show.transition.origin.top.right` | Customize the CSS transform origin `transform-origin: top right`. |
| `x-show.transition.in.duration.200ms.out.duration.50ms` | Different durations for "in" and "out". |

> Note: All of these transition modifiers can be used in conjunction with each other. This is possible (although rediculous lol): `x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale.95`

> Note: `x-show` will wait for any children to finish transitioning out. If you want to bypass this behavior, add the `.immediate` modifer:
```html
<div x-show.immediate="open">
    <div x-show.transition="open">
</div>
```
---

### `x-bind`

> Note: You are free to use the shorter ":" syntax: `:type="..."`

**Example:** `<input x-bind:type="inputType">`

**Structure:** `<input x-bind:[attribute]="[expression]">`

`x-bind` sets the value of an attribute to the result of a JavaScript expression. The expression has access to all the keys of the component's data object, and will update every-time its data is updated.

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

Boolean attributes are supported as per the [HTML specification](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute), for example `disabled`, `readonly`, `required`, `checked`, `hidden`, `selected`, `open` etc.

---

### `x-on`

> Note: You are free to use the shorter "@" syntax: `@click="..."`

**Example:** `<button x-on:click="foo = 'bar'"></button>`

**Structure:** `<button x-on:[event]="[expression]"></button>`

`x-on` attaches an event listener to the element it's declared on. When that event is emitted, the JavaScript expression set as its value is executed.

If any data is modified in the expression, other element attributes "bound" to this data, will be updated.

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

> Note: you can also bind dynamic values for x-ref: `<span :x-ref="item.id"></span>` if you need to.

---

### `x-if`
**Example:** `<template x-if="true"><div>Some Element</div></template>`

**Structure:** `<template x-if="[expression]"><div>Some Element</div></template>`

For cases where `x-show` isn't sufficient (`x-show` sets an element to `display: none` if it's false), `x-if` can be used to  actually remove an element completely from the DOM.

It's important that `x-if` is used on a `<template></template>` tag because Alpine doesn't use a virtual DOM. This implementation allows Alpine to stay rugged and use the real DOM to work its magic.

> Note: `x-if` must have a single element root inside the `<template></template>` tag.

---

### `x-for`
**Example:**
```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

`x-for` is available for cases when you want to create new DOM nodes for each item in an array. This should appear similar to `v-for` in Vue, with one exception of needing to exist on a `template` tag, and not a regular DOM element.

> Note: the `:key` binding is optional, but HIGHLY recommended.

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

### Magic Properties

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

---

### `$dispatch`
**Example:**
```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
    <!-- When clicked, will console.log "bar" -->
</div>
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

## v3 Roadmap
* Move from `x-ref` to `ref` for Vue parity

## License

Copyright © 2019-2020 Caleb Porzio and contributors

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
