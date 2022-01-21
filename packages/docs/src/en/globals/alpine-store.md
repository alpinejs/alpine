---
order: 2
title: store()
---

# Alpine.store

Alpine offers global state management through the `Alpine.store()` API.

<a name="registering-a-store"></a>
## Registering A Store

You can either define an Alpine store inside of an `alpine:init` listener (in the case of including Alpine via a `<script>` tag), OR you can define it before manually calling `Alpine.start()` (in the case of importing Alpine into a build):

**From a script tag:**
```alpine
<script>
    document.addEventListener('alpine:init', () => {
        Alpine.store('darkMode', {
            on: false,

            toggle() {
                this.on = ! this.on
            }
        })
    })
</script>
```

**From a bundle:**
```js
import Alpine from 'alpinejs'

Alpine.store('darkMode', {
    on: false,

    toggle() {
        this.on = ! this.on
    }
})

Alpine.start()
```

<a name="accessing stores"></a>
## Accessing stores

You can access data from any store within Alpine expressions using the `$store` magic property:

```alpine
<div x-data :class="$store.darkMode.on && 'bg-black'">...</div>
```

You can also modify properties within the store and everything that depends on those properties will automatically react. For example:

```alpine
<button x-data @click="$store.darkMode.toggle()">Toggle Dark Mode</button>
```

Additionally, you can access a store externally using `Alpine.store()` by omitting the second parameter like so:

```alpine
<script>
    Alpine.store('darkMode').toggle()
</script>
```

<a name="initializing-stores"></a>
## Initializing stores

If you provide `init()` method in an Alpine store, it will be executed right after the store is registered. This is useful for initializing any state inside the store with sensible starting values.

```alpine
<script>
    document.addEventListener('alpine:init', () => {
        Alpine.store('darkMode', {
            init() {
                this.on = window.matchMedia('(prefers-color-scheme: dark)').matches
            },

            on: false,

            toggle() {
                this.on = ! this.on
            }
        })
    })
</script>
```

Notice the newly added `init()` method in the example above. With this addition, the `on` store variable will be set to the browser's color scheme preference before Alpine renders anything on the page.

<a name="single-value-stores"></a>
## Single-value stores

If you don't need an entire object for a store, you can set and use any kind of data as a store.

Here's the example from above but using it more simply as a boolean value:

```alpine
<button x-data @click="$store.darkMode = ! $store.darkMode">Toggle Dark Mode</button>

...

<div x-data :class="$store.darkMode && 'bg-black'">
    ...
</div>


<script>
    document.addEventListener('alpine:init', () => {
        Alpine.store('darkMode', false)
    })
</script>
```
