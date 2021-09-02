---
order: 4
title: watch
---

# `$watch`

You can "watch" a component property using the `$watch` magic method. For example:

```alpine
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```

In the above example, when the button is pressed and `open` is changed, the provided callback will fire and `console.log` the new value:

You can watch deeply nested properties using "dot" notation

```alpine
<div x-data="{ foo: { bar: 'baz' }}" x-init="$watch('foo.bar', value => console.log(value))">
    <button @click="foo.bar = 'bob'">Toggle Open</button>
</div>
```

When the `<button>` is pressed, `foo.bar` will be set to "bob", and "bob" will be logged to the console.

<a name="getting-the-old-value"></a>
### Getting the "old" value

`$watch` keeps track of the previous value of the property being watched, You can access it using the optional second argument to the callback like so:

```alpine
<div x-data="{ open: false }" x-init="$watch('open', (value, oldValue) => console.log(value, oldValue))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```
