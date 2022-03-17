---
order: 7
title: modelable
---

# x-modelable

`x-modelable` allows you to expose any Alpine property as the target of the `x-model` directive.

Here's a simple example of using `x-modelable` to expose a variable for binding with `x-model`.

```alpine
<div x-data="{ number: 5 }">
    <div x-data="{ count: 0 }" x-modelable="count" x-model="number">
        <button @click="count++">Increment</button>
    </div>

    Number: <span x-text="number"></span>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ number: 5 }">
        <div x-data="{ count: 0 }" x-modelable="count" x-model="number">
            <button @click="count++">Increment</button>
        </div>

        Number: <span x-text="number"></span>
    </div>
</div>
<!-- END_VERBATIM -->

As you can see the outer scope property "number" is now bound to the inner scope property "count".

Typically this feature would be used in conjunction with a backend templating framework like Laravel Blade. It's useful for abstracting away Alpine components into backend templates and exposing state to the outside through `x-model` as if it were a native input.

<a name="named-modelables"></a>
## Named modelables

Sometimes you may want to expose multiple properties to `x-model`, in these cases you can specify a name in the `x-modelable` and `x-model` directives as a way of degnating additional data bindings.

Here's the example from before, but we'll add another property that we want bound: the "max" value the counter can count up to:

```alpine
<div x-data="{ number: 5, limit: 10 }">
    <div
        x-data="{ count: 0, max: null }"
        x-modelable="count"
        x-model="number"
        x-modelable:max="max"
        x-model:max="limit"
    >
        <button @click="count = count === max ? count : count + 1">
            Increment
        </button>
    </div>

    Number: <span x-text="number"></span>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ number: 5, limit: 10 }">
        <div
            x-data="{ count: 0, max: null }"
            x-modelable="count"
            x-modelable:max="max"
            x-model="number"
            x-model:max="limit"
        >
            <button @click="count = count === max ? count : count + 1">
                Increment
            </button>
        </div>

        Number: <span x-text="number"></span>
    </div>
</div>
<!-- END_VERBATIM -->
