---
order: 10
prefix: $
title: model
---

# $model

`$model` is a magic property that can be used to interact with the closest `x-model` binding programmatically.

Here's a simple example of using `$model` to access and control the `count` property bound using `x-model`.

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

Typically this feature would be used in conjunction with a backend templating framework like Blade in Laravel. It's useful for abstracting away Alpine components into backend templates and exposing control to the outside scope through `x-model`.

## Using $model and x-model on the same element.

It's important to note that by default, `$model` can only be used within children of `x-model`, not on the `x-model` element itself.

For example, the following code won't work because `x-model` and `$model` are both used on the same element:

```alpine
<!-- The following code will throw an error... -->
<div x-data="{ count: 0 }">
    Count: <span x-model="count" x-text="$model.get()"></span>
</div>
```

To remedy this, ensure that `x-model` is declared on a parent element of `$model` in the HTML tree:

```alpine
<div x-data="{ count: 0 }" x-model="count">
    Count: <span x-text="$model.get()"></span>
</div>
```

Alternatively, you can use the `.self` modifier to reference the `x-model` directive declared on the same element:

```alpine
<div x-data="{ count: 0 }">
    Count: <span x-model="count" x-text="$model.self.get()"></span>
</div>
```

## Setting values using a callback

If you prefer, `$model` offers an alternate syntax that allows you to pass a callback to `.set()` that receives the current value and returns the next value:

```alpine
<div x-model="count">
    <button @click="$model.set(count => count + 1)">Increment</button>

    Count: <span x-text="$model.get()"></span>
</div>
```

## Registering watchers

Although Alpine provides other methods to watch reactive values for changes, `$model.watch()` exposes a convenient way to register a watcher for the `x-model` property directly:

```alpine
<div x-model="count">
    <button @click="$model.set(count => count + 1)">Increment</button>

    <div x-init="
        $model.watch(count => {
            console.log('The new count is: ' + count)
        })
    "></div>
</div>
```

Now everytime `count` changes, the newest count value will be logged to the console.

Watchers registered using `$watch` will be automatically destroyed when the element they are declared on is removed from the DOM.
