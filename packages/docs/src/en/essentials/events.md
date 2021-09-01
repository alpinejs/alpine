---
order: 4
title: Events
---

# Events

Alpine makes it simple to listen for browser events and react to them.

<a name="listening-for-simple-events"></a>
## Listening for simple events

By using `x-on`, you can listen for browser events that are dispatched on or within an element.

Here's a basic example of listening for a click on a button:

```alpine
<button x-on:click="console.log('clicked')">...</button>
```

As an alternative, you can use the event shorthand syntax if you prefer: `@`. Here's the same example as before, but using the shorthand syntax (which we'll be using from now on):

```alpine
<button @click="...">...</button>
```

In addition to `click`, you can listen for any browser event by name. For example: `@mouseenter`, `@keyup`, etc... are all valid syntax.

<a name="listening-for-specific-keys"></a>
## Listening for specific keys

Let's say you wanted to listen for the `enter` key to be pressed inside an `<input>` element. Alpine makes this easy by adding the `.enter` like so:

```alpine
<input @keyup.enter="...">
```

You can even combine key modifiers to listen for key combinations like pressing `enter` while holding `shift`:

```alpine
<input @keyup.shift.enter="...">
```

<a name="preventing-default"></a>
## Preventing default

When reacting to browser events, it is often necessary to "prevent default" (prevent the default behavior of the browser event).

For example, if you want to listen for a form submission but prevent the browser from submitting a form request, you can use `.prevent`:

```alpine
<form @submit.prevent="...">...</form>
```

You can also apply `.stop` to achieve the equivalent of `event.stopPropagation()`.

<a name="accessing-the-event-object"></a>
## Accessing the event object

Sometimes you may want to access the native browser event object inside your own code. To make this easy, Alpine automatically injects an `$event` magic variable:

```alpine
<button @click="$event.target.remove()">Remove Me</button>
```

<a name="dispatching-custom-events"></a>
## Dispatching custom events

In addition to listening for browser events, you can dispatch them as well. This is extremely useful for communicating with other Alpine components or triggering events in tools outside of Alpine itself.

Alpine exposes a magic helper called `$dispatch` for this:

```alpine
<div @foo="console.log('foo was dispatched')">
    <button @click="$dispatch('foo')"></button>
</div>
```

As you can see, when the button is clicked, Alpine will dispatch a browser event called "foo", and our `@foo` listener on the `<div>` will pick it up and react to it.

<a name="listening-for-events-on-window"></a>
## Listening for events on window

Because of the nature of events in the browser, it is sometimes useful to listen to events on the top-level window object.

This allows you to communicate across components completely like the following example:


```alpine
<div x-data>
    <button @click="$dispatch('foo')"></button>
</div>

<div x-data @foo.window="console.log('foo was dispatched')">...</div>
```

In the above example, if we click the button in the first component, Alpine will dispatch the "foo" event. Because of the way events work in the browser, they "bubble" up through parent elements all the way to the top-level "window".

Now, because in our second component we are listening for "foo" on the window (with `.window`), when the button is clicked, this listener will pick it up and log the "foo was dispatched" message.

[→ Read more about x-on](/directives/on)
