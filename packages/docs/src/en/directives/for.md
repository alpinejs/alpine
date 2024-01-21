---
order: 8
title: for
---

# x-for

Alpine's `x-for` directive allows you to create DOM elements by iterating through a list. Here's a simple example of using it to create a list of colors based on an array.

```alpine
<ul x-data="{ colors: ['Red', 'Orange', 'Yellow'] }">
    <template x-for="color in colors">
        <li x-text="color"></li>
    </template>
</ul>
```

<!-- START_VERBATIM -->
<div class="demo">
    <ul x-data="{ colors: ['Red', 'Orange', 'Yellow'] }">
        <template x-for="color in colors">
            <li x-text="color"></li>
        </template>
    </ul>
</div>
<!-- END_VERBATIM -->

You may also pass objects to `x-for`.

```alpine
<ul x-data="{ car: { make: 'Jeep', model: 'Grand Cherokee', color: 'Black' } }">
    <template x-for="(value, index) in car">
        <li>
            <span x-text="index"></span>: <span x-text="value"></span>
        </li>
    </template>
</ul>
```

<!-- START_VERBATIM -->
<div class="demo">
    <ul x-data="{ car: { make: 'Jeep', model: 'Grand Cherokee', color: 'Black' } }">
        <template x-for="(value, index) in car">
            <li>
                <span x-text="index"></span>: <span x-text="value"></span>
            </li>
        </template>
    </ul>
</div>
<!-- END_VERBATIM -->

There are two rules worth noting about `x-for`:

>`x-for` MUST be declared on a `<template>` element
> That `<template>` element MUST contain only one root element

<a name="keys"></a>
## Keys

It is important to specify unique keys for each `x-for` iteration if you are going to be re-ordering items. Without dynamic keys, Alpine may have a hard time keeping track of what re-orders and will cause odd side-effects.

```alpine
<ul x-data="{ colors: [
    { id: 1, label: 'Red' },
    { id: 2, label: 'Orange' },
    { id: 3, label: 'Yellow' },
]}">
    <template x-for="color in colors" :key="color.id">
        <li x-text="color.label"></li>
    </template>
</ul>
```

Now if the colors are added, removed, re-ordered, or their "id"s change, Alpine will preserve or destroy the iterated `<li>`elements accordingly.

<a name="accessing-indexes"></a>
## Accessing indexes

If you need to access the index of each item in the iteration, you can do so using the `([item], [index]) in [items]` syntax like so:

```alpine
<ul x-data="{ colors: ['Red', 'Orange', 'Yellow'] }">
    <template x-for="(color, index) in colors">
        <li>
            <span x-text="index + ': '"></span>
            <span x-text="color"></span>
        </li>
    </template>
</ul>
```

You can also access the index inside a dynamic `:key` expression.

```alpine
<template x-for="(color, index) in colors" :key="index">
```

<a name="iterating-over-a-range"></a>
## Iterating over a range

If you need to simply loop `n` number of times, rather than iterate through an array, Alpine offers a short syntax.

```alpine
<ul>
    <template x-for="i in 10">
        <li x-text="i"></li>
    </template>
</ul>
```

`i` in this case can be named anything you like.

<a name="contents-of-a-template"></a>
## Contents of a `<template>`

As mentioned above, an `<template>` tag must contain only one root element.

For example, the following code will not work:

```alpine
<template x-for="color in colors">
    <span>The next color is </span><span x-text="color">
</template>
```

but this code will work:
```alpine
<template x-for="color in colors">
    <p>
        <span>The next color is </span><span x-text="color">
    </p>
</template>
```
