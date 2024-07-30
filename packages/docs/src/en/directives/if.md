---
order: 16
title: if
---

# x-if

`x-if` is used for toggling elements on the page, similarly to `x-show`, however it completely adds and removes the element it's applied to rather than just changing its CSS display property to "none".

Because of this difference in behavior, `x-if` should not be applied directly to the element, but instead to a `<template>` tag that encloses the element. This way, Alpine can keep a record of the element once it's removed from the page.

```alpine
<template x-if="open">
    <div>Contents...</div>
</template>
```

> Despite not being included in the above snippet, `x-if` cannot be used if no parent element has `x-data` defined. [→ Read more about `x-data`](/directives/data)

## Caveats

Unlike `x-show`, `x-if`, does NOT support transitioning toggles with `x-transition`.

`<template>` tags can only contain one root element.
