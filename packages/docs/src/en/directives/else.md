---
order: 18
title: else
---

# x-else

`x-else` is used in conjunction with `x-if` or `x-else-if` to handle the fallback or default case in conditional rendering. It allows you to specify what should be displayed when all preceding conditions are false.

Just like `x-if`, `x-else` should be applied to a <template> tag. This ensures that Alpine.js can properly manage the addition and removal of the element from the DOM.

```alpine
<template x-if="value === 'yes'">
    <div>Yes is selected</div>
</template>
<template x-else-if="value === 'no'">
    <div>No is selected</div>
</template>
<template x-else>
    <div>Neither yes nor no is selected</div>
</template>
```

> Place <template x-else> after one or more `x-if` or `x-else-if` blocks. It will render only when none of the preceding conditions are true.
> Unlike `x-show`, `x-else` also adds and removes elements from the DOM rather than toggling their visibility with CSS.
> Since `x-else` operates similarly to `x-if`, it does not support transitions with `x-transition`.
