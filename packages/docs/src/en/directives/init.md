---
order: 2
title: init
---

# x-init

The `x-init` directive allows you to hook into the initialization phase of any element in Alpine.

```alpine
<div x-init="console.log('I\'m being initialized!')"></div>
```

In the above example, "I\'m being initialized!" will be output in the console before it makes further DOM updates.

Consider another example where `x-init` is used to fetch some JSON and store it in `x-data` before the component is processed.

```alpine
<div
    x-data="{ posts: [] }"
    x-init="posts = await (await fetch('/posts')).json()"
>...</div>
```

<a name="next-tick"></a>
## $nextTick

Sometimes, you want to wait until after Alpine has completely finished rendering to execute some code.

This would be something like `useEffect(..., [])` in react, or `mount` in Vue.

By using Alpine's internal `$nextTick` magic, you can make this happen.

```alpine
<div x-init="$nextTick(() => { ... })"></div>
```

<a name="standalone-x-init"></a>
## Standalone `x-init`

You can add `x-init` to any elements inside or outside an `x-data` HTML block. For example:

```alpine
<div x-data>
    <span x-init="console.log('I can initialize')"></span>
</div>

<span x-init="console.log('I can initialize too')"></span>
```

<a name="auto-evaluate-init-method"></a>
## Auto-evaluate init() method

If the `x-data` object of a component contains an `init()` method, it will be called automatically. For example:

```alpine
<div x-data="{
    init() {
        console.log('I am called automatically')
    }
}">
    ...
</div>
```

This is also the case for components that were registered using the `Alpine.data()` syntax.

```js
Alpine.data('dropdown', () => ({
    init() {
        console.log('I will get evaluated when initializing each "dropdown" component.')
    },
}))
```

If you have both an `x-data` object containing an `init()` method and an `x-init` directive, the `x-data` method will be called before the directive.

```alpine
<div
    x-data="{
        init() {
            console.log('I am called first')
        }
    }"
    x-init="console.log('I am called second')"
    >
    ...
</div>
```
