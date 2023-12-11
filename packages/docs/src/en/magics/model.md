---
order: 10
prefix: $
title: model
---

# $model

`$model` is a magic property that can be used to interact with the closest `x-model` binding programmatically.

Typically this feature would be used in conjunction with a backend templating framework like Blade in Laravel. It's useful for abstracting away Alpine components into backend templates and exposing control to the outside scope through `x-model`.

## Using getters and setters

Here's a simple example of using `$model` to access and control the `count` property using `$model.get()` and `$model.set(...)`:

```alpine
<div x-data="{ count: 0 }">
    <div x-model="count">
        <button @click="$model.set($model.get() + 1)">Increment</button>

        Count: <span x-text="$model.get()"></span>
    </div>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ count: 0 }">
        <div x-model="count">
            <button @click="$model.set($model.get() + 1)">Increment</button>

            Count: <span x-text="$model.get()"></span>
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

As you can see, `$model.get()` and `$model.set()` can be used to programmatically control the `count` property bound using `x-model`.

### Setting values using a callback

If you prefer, `$model` offers an alternate syntax that allows you to pass a callback to `.set()` that receives the current value and returns the next value:

```alpine
<button @click="$model.set(count => count + 1)">Increment</button>
```

## Binding to x-data properties

Rather than manually controlling the `x-model` value using `$model.get()` and `$model.set()`, you can alternatively use `$model` as an entirely new value inside `x-data`.

For example:

```alpine
<div x-model="count">
    <div x-data="{ value: $model }">
        <button @click="value = value + 1">Increment</button>

        Count: <span x-text="value"></span>
    </div>
</div>
```

This way you can freely use and modify the newly defined property `value` property within the nested component and `.get()` and `.set()` will be called internally.

> You may run into errors when using `$model` within `x-data` on the same element as the `x-model` you are trying to reference. This is because `x-data` is evaluated by Alpine before `x-model` is. In these cases, you must either ensure `x-model` is on a parent element of `x-data`, or you are deffering evaluation with `this.$nextTick` (or a similar strategy).

### Passing fallback state to $model

In scenarios where you aren't sure if a parent `x-model` exists or you want to make `x-model` optional, you can pass initial state to `$model` as a function parameter.

The following example will use the provided fallback value as the state if no `x-model` is present:

```alpine
<div>
    <div x-data="{ value: $model(0) }">
        <button @click="value = value + 1">Increment</button>

        Count: <span x-text="value"></span>
    </div>
</div>
```

In the above example you can see that there is no `x-model` defined in the parent HTML heirarchy. When `$model(0)` is called, it will recognize this and instead pass through the initial state as a reactive value.

## Registering watchers

Although Alpine provides other methods to watch reactive values for changes, `$model.watch()` exposes a convenient way to register a watcher for the `x-model` property directly:

```alpine
<div x-model="count">
    <div x-init="
        $model.watch(count => {
            console.log('The new count is: ' + count)
        })
    "></div>
</div>
```

Now everytime `count` changes, the newest count value will be logged to the console.

> Watchers registered using `$watch` will be automatically destroyed when the element they are declared on is removed from the DOM.
