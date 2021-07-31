---
order: 3
prefix: $
title: store
---

# `$store`

You can use `$store` to conveniently access global Alpine stores registered using [`Alpine.store(...)`](#). For example:

```html
<button x-data @click="$store.darkMode.toggle()">Toggle Dark Mode</button>

...

<div x-data :class="$store.darkMode.on && 'bg-black'">
    ...
</div>


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

Given that we've registered the `darkMode` store and set `on` to "false", when the `<button>` is pressed, `on` will be "true" and the background color of the page will change to black.

If you provide `init()` method in an Alpine store, it will be executed right after the store is registered.

```html
<script>
    document.addEventListener('alpine:init', () => {
        Alpine.store('preference', {
            tabSize: null,
            newline: null,
            load: false,

            init() {
                fetch('/url/to/get/preference')
                .then((resp) => resp.json())
                .then((preference) => {
                    this.tabSize = preference.tabSize
                    this.newline = preference.newline
                    this.load = true
                })
            }
        })
    })
</script>
```

<a name="single-value-stores"></a>
## Single-value stores

If you don't need an entire object for a store, you can set and use any kind of data as a store.

Here's the example from above but using it more simply as a boolean value:

```html
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
