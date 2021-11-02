---
order: 12
title: cloak
---

# x-cloak

Sometimes, when you're using AlpineJS for a part of your template, there is a "blip" where you might see your uninitialized template after the page loads, but before Alpine loads.

`x-cloak` addresses this scenario by hiding the element it's attached to until Alpine is fully loaded on the page.

For `x-cloak` to work however, you must add the following CSS to the page.

```css
[x-cloak] { display: none !important; }
```

Now, the following example will hide the `<span>` tag until Alpine has set its text content to the `message` property.

```alpine
<span x-cloak x-text="message"></span>
```

When Alpine loads on the page, it removes all `x-cloak` property from the element, which also removes the `display: none;` applied by CSS, therefore showing the element.

If you'd like to achieve this same behavior, but avoid having to include a global style, you can use the following cool, but admittedly odd trick:

```alpine
<template x-if="true">
    <span x-text="message"></span>
</template>
```

This will achieve the same goal as `x-cloak` by just leveraging the way `x-if` works.

Because `<template>` elements are "hidden" in browsers by default, you won't see the `<span>` until Alpine has had a chance to render the `x-if="true"` and show it.

Again, this solution is not for everyone, but it's worth mentioning for special cases.
