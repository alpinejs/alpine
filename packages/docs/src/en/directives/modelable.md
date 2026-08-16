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

> **Note:** `x-modelable` syncs values with a JSON clone (`JSON.parse(JSON.stringify(...))`). That only preserves JSON-serializable data: plain objects, arrays, strings, numbers, booleans, and `null`. Values such as `File`, `FileList`, `Map`, `Set`, `Date`, class instances, and DOM nodes are silently stripped or converted. For those, dispatch the value with [`$dispatch('input', value)`](/magics/dispatch#dispatching-to-x-model) instead — `x-model` picks up `event.detail` without cloning.
