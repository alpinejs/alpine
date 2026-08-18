---
order: 7
title: modelable
---

# x-modelable

`x-modelable` allows you to expose Alpine state as the target of the `x-model` directive.

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

## Supported values

`x-modelable` keeps its inner and outer state independent by cloning values as JSON. It is therefore intended for JSON-compatible state such as strings, numbers, booleans, `null`, arrays, and plain objects containing those values.

Browser objects and other state that cannot be represented as JSON won't cross this boundary intact. For example, a `File` loses properties such as its name, size, and type. The same limitation applies to values such as `FileList`, `Map`, `Set`, `Date`, class instances, and DOM nodes.

For a custom input that produces one of these values, omit `x-modelable` and [dispatch an `input` event](/magics/dispatch#dispatching-to-x-model) instead. `x-model` reads the value directly from the event without cloning it:

```alpine
<div x-data="{ files: [] }">
    <div x-model="files">
        <input
            type="file"
            multiple
            @change="$dispatch('input', Array.from($event.target.files))"
        >
    </div>

    <template x-for="file in files" :key="file.name">
        <p x-text="file.name"></p>
    </template>
</div>
```
