---
order: 2
title: Persist
description: Easily persist data across page loads using localStorage
graph_image: https://alpinejs.dev/social_persist.jpg
---

# Persist Plugin

Alpine's Persist plugin allows you to persist Alpine state across page loads.

This is useful for persisting search filters, active tabs, and other features where users will be frustrated if their configuration is reset after refreshing or leaving and revisiting a page.

<a name="installation"></a>
## Installation

You can use this plugin by either including it from a `<script>` tag or installing it via NPM:

### Via CDN

You can include the CDN build of this plugin as a `<script>` tag, just make sure to include it BEFORE Alpine's core JS file.

```alpine
<!-- Alpine Plugins -->
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/persist@3.x.x/dist/cdn.min.js"></script>

<!-- Alpine Core -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Via NPM

You can install Persist from NPM for use inside your bundle like so:

```shell
npm install @alpinejs/persist
```

Then initialize it from your bundle:

```js
import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'

Alpine.plugin(persist)

...
```

<a name="magic-persist"></a>
## $persist

The primary API for using this plugin is the magic `$persist` method.

You can wrap any value inside `x-data` with `$persist` like below to persist its value across page loads:

```alpine
<div x-data="{ count: $persist(0) }">
    <button x-on:click="count++">Increment</button>

    <span x-text="count"></span>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ count: $persist(0) }">
        <button x-on:click="count++">Increment</button>
        <span x-text="count"></span>
    </div>
</div>
<!-- END_VERBATIM -->

In the above example, because we wrapped `0` in `$persist()`, Alpine will now intercept changes made to `count` and persist them across page loads.

You can try this for yourself by incrementing the "count" in the above example, then refreshing this page and observing that the "count" maintains its state and isn't reset to "0".

<a name="how-it-works"></a>
## How does it work?

If a value is wrapped in `$persist`, on initialization Alpine will register its own watcher for that value. Now everytime that value changes for any reason, Alpine will store the new value in [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

Now when a page is reloaded, Alpine will check localStorage (using the name of the property as the key) for a value. If it finds one, it will set the property value from localStorage immediately.

You can observe this behavior by opening your browser devtool's localStorage viewer:

<a href="https://developer.chrome.com/docs/devtools/storage/localstorage/"><img src="/img/persist_devtools.png" alt="Chrome devtools showing the localStorage view with count set to 0"></a>

You'll observe that by simply visiting this page, Alpine already set the value of "count" in localStorage. You'll also notice it prefixes the property name "count" with "_x_" as a way of namespacing these values so Alpine doesn't conflict with other tools using localStorage.

Now change the "count" in the following example and observe the changes made by Alpine to localStorage:

```alpine
<div x-data="{ count: $persist(0) }">
    <button x-on:click="count++">Increment</button>

    <span x-text="count"></span>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ count: $persist(0) }">
        <button x-on:click="count++">Increment</button>
        <span x-text="count"></span>
    </div>
</div>
<!-- END_VERBATIM -->

> `$persist` works with primitive values as well as with arrays and objects.
However, it is worth noting that localStorage must be cleared when the type of the variable changes.<br>
> Given the previous example, if we change count to a value of `$persist({ value: 0 })`, then localStorage must be cleared or the variable 'count' renamed.

<a name="custom-key"></a>
## Setting a custom key

By default, Alpine uses the property key that `$persist(...)` is being assigned to ("count" in the above examples).

Consider the scenario where you have multiple Alpine components across pages or even on the same page that all use "count" as the property key.

Alpine will have no way of differentiating between these components.

In these cases, you can set your own custom key for any persisted value using the `.as` modifier like so:


```alpine
<div x-data="{ count: $persist(0).as('other-count') }">
    <button x-on:click="count++">Increment</button>

    <span x-text="count"></span>
</div>
```

Now Alpine will store and retrieve the above "count" value using the key "other-count".

Here's a view of Chrome Devtools to see for yourself:

<img src="/img/persist_custom_key_devtools.png" alt="Chrome devtools showing the localStorage view with count set to 0">

<a name="custom-storage"></a>
## Using a custom storage

By default, data is saved to localStorage, it does not have an expiration time and it's kept even when the page is closed.

Consider the scenario where you want to clear the data once the user close the tab. In this case you can persist data to sessionStorage using the `.using` modifier like so:


```alpine
<div x-data="{ count: $persist(0).using(sessionStorage) }">
    <button x-on:click="count++">Increment</button>

    <span x-text="count"></span>
</div>
```

You can also define your custom storage object exposing a getItem function and a setItem function. For example, you can decide to use a session cookie as storage doing so:


```alpine
<script>
    window.cookieStorage = {
        getItem(key) {
            let cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].split("=");
                if (key == cookie[0].trim()) {
                    return decodeURIComponent(cookie[1]);
                }
            }
            return null;
        },
        setItem(key, value) {
            document.cookie = key+' = '+encodeURIComponent(value)
        }
    }
</script>

<div x-data="{ count: $persist(0).using(cookieStorage) }">
    <button x-on:click="count++">Increment</button>

    <span x-text="count"></span>
</div>
```

<a name="using-persist-with-alpine-data"></a>
## Using $persist with Alpine.data

If you want to use `$persist` with `Alpine.data`, you need to use a standard function instead of an arrow function so Alpine can bind a custom `this` context when it initially evaluates the component scope.

```js
Alpine.data('dropdown', function () {
    return {
        open: this.$persist(false)
    }
})
```

<a name="using-alpine-persist-global"></a>
## Using the Alpine.$persist global

`Alpine.$persist` is exposed globally so it can be used outside of `x-data` contexts. This is useful to persist data from other sources such as `Alpine.store`.

```js
Alpine.store('darkMode', {
    on: Alpine.$persist(true).as('darkMode_on')
});
```
