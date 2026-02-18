---
order: 17
title: else-if
---

# x-else-if

`x-else-if` is used alongside `x-if` and `x-else` to handle multiple conditional cases in a chain. It allows you to check additional conditions if the previous `x-if` condition evaluates to false.

Like `x-if` and `x-else`, `x-else-if` should be applied to a <template> tag. This ensures proper handling of the element's addition and removal in the DOM.

```alpine
<template x-if="status === 'loading'">
    <div>Loading...</div>
</template>
<template x-else-if="status === 'success'">
    <div>Data loaded successfully!</div>
</template>
<template x-else-if="status === 'error'">
    <div>There was an error loading the data.</div>
</template>
<template x-else>
    <div>No status available</div>
</template>
```

> Place <template x-else-if> after an `x-if` block or other `x-else-if` blocks. It will render only if the preceding conditions are false and the current condition is true.
> `x-else-if` adds and removes elements from the DOM, similar to `x-if`, rather than just toggling visibility with CSS.
> As with `x-if`, `x-else-if` does not support transitions using `x-transition`.
