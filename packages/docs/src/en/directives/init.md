---
order: 2
title: init
---

# `x-init`

The `x-init` directive allows you to hook into the initialization phase of any element in Alpine.

```html
<div x-init="console.log('I\'m being initialized!')"></div>
```

In the above example, "I\'m being initialized!" will be output in the console before it makes further DOM updates.

Consider another example where `x-init` is used to fetch some JSON and store it in `x-data` before the component is processed.

```html
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

```html
<div x-init="$nextTick(() => { ... })"></div>
```

<a name="standalone-x-init"></a>
## Standalone `x-init`

You can add `x-init` to any elements inside or outside an `x-data` HTML block. For example:

```html
<div x-data>
    <span x-init="console.log('I can initialize')"></span>
</div>

<span x-init="console.log('I can initialize too')"></span>
```

**Note:** `x-init` creates a new component scope, so any `$refs` created outside of this scope will not be accessible on the DOM tag containing a standalone `x-init` directive, nor will any of its children.

<a name="auto-evaluate-init-method"></a>
## Auto-evaluate init() method

If the `x-data` object of a component contains an `init()` method, it will be called automatically. For example:

```html
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
