---
order: 6
prefix: $
title: nextTick
---

# $nextTick

`$nextTick` is a magic property that allows you to only execute a given expression AFTER Alpine has made its reactive DOM updates. This is useful for times you want to interact with the DOM state AFTER it's reflected any data updates you've made.

```alpine
<div x-data="{ title: 'Hello' }">
    <button
        @click="
            title = 'Hello World!';
            $nextTick(() => { console.log($el.innerText) });
        "
        x-text="title"
    ></button>
</div>
```

In the above example, rather than logging "Hello" to the console, "Hello World!" will be logged because `$nextTick` was used to wait until Alpine was finished updating the DOM.

<a name="promises"></a>

## Promises

`$nextTick` returns a promise, allowing the use of `$nextTick` to pause an async function until after pending dom updates. When used like this, `$nextTick` also does not require an argument to be passed.

```alpine
<div x-data="{ title: 'Hello' }">
    <button
        @click="
            title = 'Hello World!';
            await $nextTick();
            console.log($el.innerText);
        "
        x-text="title"
    ></button>
</div>
```
