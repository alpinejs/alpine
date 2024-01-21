---
order: 3
title: Extending
---

# Extending

Alpine has a very open codebase that allows for extension in a number of ways. In fact, every available directive and magic in Alpine itself uses these exact APIs. In theory you could rebuild all of Alpine's functionality using them yourself.

<a name="lifecycle-concerns"></a>
## Lifecycle concerns
Before we dive into each individual API, let's first talk about where in your codebase you should consume these APIs.

Because these APIs have an impact on how Alpine initializes the page, they must be registered AFTER Alpine is downloaded and available on the page, but BEFORE it has initialized the page itself.

There are two different techniques depending on if you are importing Alpine into a bundle, or including it directly via a `<script>` tag. Let's look at them both:

<a name="via-script-tag"></a>
### Via a script tag

If you are including Alpine via a script tag, you will need to register any custom extension code inside an `alpine:init` event listener.

Here's an example:

```alpine
<html>
    <script src="/js/alpine.js" defer></script>

    <div x-data x-foo></div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.directive('foo', ...)
        })
    </script>
</html>
```

If you want to extract your extension code into an external file, you will need to make sure that file's `<script>` tag is located BEFORE Alpine's like so:

```alpine
<html>
    <script src="/js/foo.js" defer></script>
    <script src="/js/alpine.js" defer></script>

    <div x-data x-foo></div>
</html>
```

<a name="via-npm"></a>
### Via an NPM module

If you imported Alpine into a bundle, you have to make sure you are registering any extension code IN BETWEEN when you import the `Alpine` global object, and when you initialize Alpine by calling `Alpine.start()`. For example:

```js
import Alpine from 'alpinejs'

Alpine.directive('foo', ...)

window.Alpine = Alpine
window.Alpine.start()
```

Now that we know where to use these extension APIs, let's look more closely at how to use each one:

<a name="custom-directives"></a>
## Custom directives

Alpine allows you to register your own custom directives using the `Alpine.directive()` API.

<a name="method-signature"></a>
### Method Signature

```js
Alpine.directive('[name]', (el, { value, modifiers, expression }, { Alpine, effect, cleanup }) => {})
```

&nbsp; | &nbsp;
---|---
name | The name of the directive. The name "foo" for example would be consumed as `x-foo`
el | The DOM element the directive is added to
value | If provided, the part of the directive after a colon. Ex: `'bar'` in `x-foo:bar`
modifiers | An array of dot-separated trailing additions to the directive. Ex: `['baz', 'lob']` from `x-foo.baz.lob`
expression | The attribute value portion of the directive. Ex: `law` from `x-foo="law"`
Alpine | The Alpine global object
effect | A function to create reactive effects that will auto-cleanup after this directive is removed from the DOM
cleanup | A function you can pass bespoke callbacks to that will run when this directive is removed from the DOM

<a name="simple-example"></a>
### Simple Example

Here's an example of a simple directive we're going to create called: `x-uppercase`:

```js
Alpine.directive('uppercase', el => {
    el.textContent = el.textContent.toUpperCase()
})
```
```alpine
<div x-data>
    <span x-uppercase>Hello World!</span>
</div>
```

<a name="evaluating-expressions"></a>
### Evaluating expressions

When registering a custom directive, you may want to evaluate a user-supplied JavaScript expression:

For example, let's say you wanted to create a custom directive as a shortcut to `console.log()`. Something like:

```alpine
<div x-data="{ message: 'Hello World!' }">
    <div x-log="message"></div>
</div>
```

You need to retrieve the actual value of `message` by evaluating it as a JavaScript expression with the `x-data` scope.

Fortunately, Alpine exposes its system for evaluating JavaScript expressions with an `evaluate()` API. Here's an example:

```js
Alpine.directive('log', (el, { expression }, { evaluate }) => {
    // expression === 'message'

    console.log(
        evaluate(expression)
    )
})
```

Now, when Alpine initializes the `<div x-log...>`, it will retrieve the expression passed into the directive ("message" in this case), and evaluate it in the context of the current element's Alpine component scope.

<a name="introducing-reactivity"></a>
### Introducing reactivity

Building on the `x-log` example from before, let's say we wanted `x-log` to log the value of `message` and also log it if the value changes.

Given the following template:

```alpine
<div x-data="{ message: 'Hello World!' }">
    <div x-log="message"></div>

    <button @click="message = 'yolo'">Change</button>
</div>
```

We want "Hello World!" to be logged initially, then we want "yolo" to be logged after pressing the `<button>`.

We can adjust the implementation of `x-log` and introduce two new APIs to achieve this: `evaluateLater()` and `effect()`:

```js
Alpine.directive('log', (el, { expression }, { evaluateLater, effect }) => {
    let getThingToLog = evaluateLater(expression)

    effect(() => {
        getThingToLog(thingToLog => {
            console.log(thingToLog)
        })
    })
})
```

Let's walk through the above code, line by line.

```js
let getThingToLog = evaluateLater(expression)
```

Here, instead of immediately evaluating `message` and retrieving the result, we will convert the string expression ("message") into an actual JavaScript function that we can run at any time. If you're going to evaluate a JavaScript expression more than once, it is highly recommended to first generate a JavaScript function and use that rather than calling `evaluate()` directly. The reason being that the process to interpret a plain string as a JavaScript function is expensive and should be avoided when unnecessary.

```js
effect(() => {
    ...
})
```

By passing in a callback to `effect()`, we are telling Alpine to run the callback immediately, then track any dependencies it uses (`x-data` properties like `message` in our case). Now as soon as one of the dependencies changes, this callback will be re-run. This gives us our "reactivity".

You may recognize this functionality from `x-effect`. It is the same mechanism under the hood.

You may also notice that `Alpine.effect()` exists and wonder why we're not using it here. The reason is that the `effect` function provided via the method parameter has special functionality that cleans itself up when the directive is removed from the page for any reason.

For example, if for some reason the element with `x-log` on it got removed from the page, by using `effect()` instead of `Alpine.effect()` when the `message` property is changed, the value will no longer be logged to the console.

[→ Read more about reactivity in Alpine](/advanced/reactivity)

```js
getThingToLog(thingToLog => {
    console.log(thingToLog)
})
```

Now we will call `getThingToLog`, which if you recall is the actual JavaScript function version of the string expression: "message".

You might expect `getThingToCall()` to return the result right away, but instead Alpine requires you to pass in a callback to receive the result.

The reason for this is to support async expressions like `await getMessage()`. By passing in a "receiver" callback instead of getting the result immediately, you are allowing your directive to work with async expressions as well.

[→ Read more about async in Alpine](/advanced/async)

<a name="cleaning-up"></a>
### Cleaning Up

Let's say you needed to register an event listener from a custom directive. After that directive is removed from the page for any reason, you would want to remove the event listener as well.

Alpine makes this simple by providing you with a `cleanup` function when registering custom directives.

Here's an example:

```js
Alpine.directive('...', (el, {}, { cleanup }) => {
    let handler = () => {}

    window.addEventListener('click', handler)

    cleanup(() => {
        window.removeEventListener('click', handler)
    })

})
```

Now if the directive is removed from this element or the element is removed itself, the event listener will be removed as well.

<a name="custom-order"></a>
### Custom order

By default, any new directive will run after the majority of the standard ones (with the exception of `x-teleport`). This is usually acceptable but some times you might need to run your custom directive before another specific one.
This can be achieved by chaining the `.before() function to `Alpine.directive()` and specifying which directive needs to run after your custom one.

```js
Alpine.directive('foo', (el, { value, modifiers, expression }) => {
    Alpine.addScopeToNode(el, {foo: 'bar'})
}).before('bind')
```
```alpine
<div x-data>
    <span x-foo x-bind:foo="foo"></span>
</div>
```
> Note, the directive name must be written without the `x-` prefix (or any other custom prefix you may use).

<a name="custom-magics"></a>
## Custom magics

Alpine allows you to register custom "magics" (properties or methods) using `Alpine.magic()`. Any magic you register will be available to all your application's Alpine code with the `$` prefix.

<a name="method-signature"></a>
### Method Signature

```js
Alpine.magic('[name]', (el, { Alpine }) => {})
```

&nbsp; | &nbsp;
---|---
name | The name of the magic. The name "foo" for example would be consumed as `$foo`
el | The DOM element the magic was triggered from
Alpine | The Alpine global object

<a name="magic-properties"></a>
### Magic Properties

Here's a basic example of a "$now" magic helper to easily get the current time from anywhere in Alpine:

```js
Alpine.magic('now', () => {
    return (new Date).toLocaleTimeString()
})
```
```alpine
<span x-text="$now"></span>
```

Now the `<span>` tag will contain the current time, resembling something like "12:00:00 PM".

As you can see `$now` behaves like a static property, but under the hood is actually a getter that evaluates every time the property is accessed.

Because of this, you can implement magic "functions" by returning a function from the getter.

<a name="magic-functions"></a>
### Magic Functions

For example, if we wanted to create a `$clipboard()` magic function that accepts a string to copy to clipboard, we could implement it like so:

```js
Alpine.magic('clipboard', () => {
    return subject => navigator.clipboard.writeText(subject)
})
```
```alpine
<button @click="$clipboard('hello world')">Copy "Hello World"</button>
```

Now that accessing `$clipboard` returns a function itself, we can immediately call it and pass it an argument like we see in the template with `$clipboard('hello world')`.

You can use the more brief syntax (a double arrow function) for returning a function from a function if you'd prefer:

```js
Alpine.magic('clipboard', () => subject => {
    navigator.clipboard.writeText(subject)
})
```

<a name="writing-and-sharing-plugins"></a>
## Writing and sharing plugins

By now you should see how friendly and simple it is to register your own custom directives and magics in your application, but what about sharing that functionality with others via an NPM package or something?

You can get started quickly with Alpine's official "plugin-blueprint" package. It's as simple as cloning the repository and running `npm install && npm run build` to get a plugin authored.

For demonstration purposes, let's create a pretend Alpine plugin from scratch called `Foo` that includes both a directive (`x-foo`) and a magic (`$foo`).

We'll start producing this plugin for consumption as a simple `<script>` tag alongside Alpine, then we'll level it up to a module for importing into a bundle:

<a name="script-include"></a>
### Script include

Let's start in reverse by looking at how our plugin will be included into a project:

```alpine
<html>
    <script src="/js/foo.js" defer></script>
    <script src="/js/alpine.js" defer></script>

    <div x-data x-init="$foo()">
        <span x-foo="'hello world'">
    </div>
</html>
```

Notice how our script is included BEFORE Alpine itself. This is important, otherwise, Alpine would have already been initialized by the time our plugin got loaded.

Now let's look inside of `/js/foo.js`'s contents:

```js
document.addEventListener('alpine:init', () => {
    window.Alpine.directive('foo', ...)

    window.Alpine.magic('foo', ...)
})
```

That's it! Authoring a plugin for inclusion via a script tag is extremely simple with Alpine.

<a name="bundle-module"></a>
### Bundle module

Now let's say you wanted to author a plugin that someone could install via NPM and include into their bundle.

Like the last example, we'll walk through this in reverse, starting with what it will look like to consume this plugin:

```js
import Alpine from 'alpinejs'

import foo from 'foo'
Alpine.plugin(foo)

window.Alpine = Alpine
window.Alpine.start()
```

You'll notice a new API here: `Alpine.plugin()`. This is a convenience method Alpine exposes to prevent consumers of your plugin from having to register multiple different directives and magics themselves.

Now let's look at the source of the plugin and what gets exported from `foo`:

```js
export default function (Alpine) {
    Alpine.directive('foo', ...)
    Alpine.magic('foo', ...)
}
```

You'll see that `Alpine.plugin` is incredibly simple. It accepts a callback and immediately invokes it while providing the `Alpine` global as a parameter for use inside of it.

Then you can go about extending Alpine as you please.
