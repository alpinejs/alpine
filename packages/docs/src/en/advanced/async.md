---
order: 4
title: Async
---

# Async

Alpine is built to support asynchronous functions in most places it supports standard ones.

For example, let's say you have a simple function called `getLabel()` that you use as the input to an `x-text` directive:

```js
function getLabel() {
    return 'Hello World!'
}
```
```alpine
<span x-text="getLabel()"></span>
```

Because `getLabel` is synchronous, everything works as expected.

Now let's pretend that `getLabel` makes a network request to retrieve the label and can't return one instantaneously (asynchronous). By making `getLabel` an async function, you can call it from Alpine using JavaScript's `await` syntax.

```js
async function getLabel() {
    let response = await fetch('/api/label')

    return await response.text()
}
```
```alpine
<span x-text="await getLabel()"></span>
```

Additionally, if you prefer calling methods in Alpine without the trailing parenthesis, you can leave them out and Alpine will detect that the provided function is async and handle it accordingly. For example:

```alpine
<span x-text="getLabel"></span>
```
