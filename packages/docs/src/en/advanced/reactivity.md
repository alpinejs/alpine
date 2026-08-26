---
order: 2
title: Reactivity
---

# Reactivity

Alpine is "reactive" in the sense that when you change a piece of data, everything that depends on that data "reacts" automatically to that change.

Every bit of reactivity that takes place in Alpine, happens because of two very important reactive functions in Alpine's core: `Alpine.reactive()`, and `Alpine.effect()`.

> Alpine uses VueJS's reactivity engine under the hood to provide these functions.
> [→ Browse the @vue/reactivity source](https://github.com/vuejs/core/tree/main/packages/reactivity)

Understanding these two functions will give you super powers as an Alpine developer, but also just as a web developer in general.

<a name="alpine-reactive"></a>
## Alpine.reactive()

Let's first look at `Alpine.reactive()`. This function accepts a JavaScript object as its parameter and returns a "reactive" version of that object. For example:

```js
let data = { count: 1 }

let reactiveData = Alpine.reactive(data)
```

Under the hood, when `Alpine.reactive` receives `data`, it wraps it inside a custom JavaScript proxy.

A proxy is a special kind of object in JavaScript that can intercept "get" and "set" calls to a JavaScript object.

[→ Read more about JavaScript proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

At face value, `reactiveData` should behave exactly like `data`. For example:

```js
console.log(data.count) // 1
console.log(reactiveData.count) // 1

reactiveData.count = 2

console.log(data.count) // 2
console.log(reactiveData.count) // 2
```

What you see here is that because `reactiveData` is a thin wrapper around `data`, any attempts to get or set a property will behave exactly as if you had interacted with `data` directly.

The main difference here is that any time you modify or retrieve (get or set) a value from `reactiveData`, Alpine is aware of it and can execute any other logic that depends on this data.

`Alpine.reactive` is only the first half of the story. `Alpine.effect` is the other half, let's dig in.

<a name="alpine-effect"></a>
## Alpine.effect()

`Alpine.effect` accepts a single callback function. As soon as `Alpine.effect` is called, it runs the provided function and watches for reads from reactive data. Each reactive property read during that execution becomes a dependency. When one of those properties changes later, Alpine runs the callback again. For example:

```js
let data = Alpine.reactive({ count: 1 })

Alpine.effect(() => {
    console.log(data.count)
})
```

When this code is first run, "1" will be logged to the console. Any time `data.count` changes, its value will be logged to the console again.

This is the mechanism that unlocks all of the reactivity at the core of Alpine.

### How dependency tracking works

Dependency collection happens while the effect callback is running. Reading `data.count` inside the callback registers that property with the effect. Changing `data.count` later notifies the effect, which runs again and collects the dependencies used by that execution.

Reads made after the callback has returned, such as inside a `setTimeout` callback, are not automatically tracked by the original effect.

Alpine delegates this behavior to Vue's reactivity package. For a deeper explanation of the proxy, dependency-map, and `track`/`trigger` model, see [Vue's reactivity internals](https://frontendatlas.com/vue/trivia/vue-reactivity-system).

To connect the dots further, let's look at a simple "counter" component example without using Alpine syntax at all, only using `Alpine.reactive` and `Alpine.effect`:

```alpine
<button>Increment</button>

Count: <span></span>
```
```js
let button = document.querySelector('button')
let span = document.querySelector('span')

let data = Alpine.reactive({ count: 1 })

Alpine.effect(() => {
    span.textContent = data.count
})

button.addEventListener('click', () => {
    data.count = data.count + 1
})
```

<!-- START_VERBATIM -->
<div x-data="{ count: 1 }" class="demo">
    <button @click="count++">Increment</button>

    <div>Count: <span x-text="count"></span></div>
</div>
<!-- END_VERBATIM -->

As you can see, you can make any data reactive, and you can also wrap any functionality in `Alpine.effect`.

This combination unlocks an incredibly powerful programming paradigm for web development. Run wild and free.
