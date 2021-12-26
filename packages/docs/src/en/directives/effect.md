---
order: 11
title: effect
---

# x-effect

`x-effect` is a useful directive for re-evaluating an expression when one of its dependencies change. You can think of it as a watcher where you don't have to specify what property to watch, it will watch all properties used within it.

If this definition is confusing for you, that's ok. It's better explained through an example:

```alpine
<div x-data="{ label: 'Hello' }" x-effect="console.log(label)">
    <button @click="label += ' World!'">Change Message</button>
</div>
```

When this component is loaded, the `x-effect` expression will be run and "Hello" will be logged into the console.

Because Alpine knows about any property references contained within `x-effect`, when the button is clicked and `label` is changed, the effect will be re-triggered and "Hello World!" will be logged to the console.
