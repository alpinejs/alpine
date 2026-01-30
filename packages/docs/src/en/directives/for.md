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

> 1. `x-for` MUST be declared on a `<template>` element;  
> 2. That `<template>` element MUST contain only one root element.

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

Now if the colors are added, removed, re-ordered, or their "id"s change, Alpine will preserve or destroy the iterated `<li>` elements accordingly.

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

> Despite not being included in the above snippet, `x-for` cannot be used if no parent element has `x-data` defined. [→ Read more about `x-data`](/directives/data)

<a name="contents-of-a-template"></a>
## Contents of a `<template>`

As mentioned above, an `<template>` tag must contain only one root element. For example, the following code will not work:

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

### Limitations in `<table>`

When using `x-for` to loop and generate `<td>`, `<th>`, and `<tr>` table elements inside `<table>`, take note that `<template>` must directly contains `<td>`, `<th>`, or `<tr>` as its only child element. If `<td>`, `<th>`, or `<tr>` is wrapped in another non-table element, the `<td>`, `<th>`, or `<tr>` elements will be removed from the template as it is viewed as illegal HTML syntax outside of `<table>`. [See this issue for more details.](https://github.com/alpinejs/alpine/discussions/935)

For example, the following code will only show the `<th>` row but not any `<td>`s as the direct child element of `x-for` `<template>` is a `<div>` element.

```alpine
<table x-data="the_data" border="1">
    <tr>
        <th>Color</th>
        <th>Index</th>
    </tr>
    <tr>
        <template x-for="(color, idx) in colors">
            <div>
                <td x-text="color"></td>
                <td x-text="idx"></td>
            </div>
        </template>
    </tr>
</table>
```

This also means that it is currently impossible to use `x-for` with multiple children `<td>`s to generate a flat element list, i.e. converting this code:

```alpine
<table x-data="the_data" border="1">
    <tr>
        <template x-for="(color, idx) in colors">
            <td x-text="color"></td>
            <td x-text="idx"></td>
        </template>
    </tr>
</table>
```

to this structure:

```html
<table border="1">
    <tr>
        <td>Red</td>
        <td>0</td>
        <td>Green</td>
        <td>1</td>
        <td>Blue</td>
        <td>2</td>
    </tr>
</table>
```

is currently impossible by using the HTML `<template>` element only.

To work around the limitation, use the following patterns:

1. Use `<td>`, `<th>`, or `<tr>` directly as the child element.

```alpine
<table x-data="the_data" border="1">
    <tr>
        <th>Color</th>
        <th>Index</th>
    </tr>
    <template x-for="(color, idx) in colors">
        <tr>
            <td x-text="color"></td>
            <td x-text="idx"></td>
        </tr>
    </template>
</table>
```

2. Use `<tbody>` as the direct child element of `x-for` `<template>` if the repeating elements to combine flat is `<tr>`. [See this discussion.](https://github.com/alpinejs/alpine/discussions/935)

```alpine
<table x-data="the_data" border="1">
    <tr>
        <th>Color</th>
        <th>Index</th>
    </tr>
    <template x-for="(color, idx) in colors">
        <tbody>
            <tr x-text="color"></td>
            <td x-text="idx"></td>
        </tr>
    </template>
</table>
```

3. Use `<div>` with CSS `display: contents` with parent CSS `display: table` to mimic table styling. [See this discussion.](https://github.com/alpinejs/alpine/discussions/3427)

```alpine
<style>
  .table {
    display: table;
    border: 1px solid black;
    border-collapse: collapse;
  }

  .row {
    display: table-row;
  }

  .cell {
    display: table-cell;
    border: 1px solid black;
    padding: 4px 8px;
  }
</style>

<div x-data="the_data" class="table">
    <div class="row">
        <template x-for="(color, idx) in colors" :key="idx">
            <div style="display: contents;">
                <div class="cell" x-text="color"></div>
                <div class="cell" x-text="idx"></div>
            </div>
        </template>
    </div>
</div>
```

4. Avoid `x-for`, instead use `x-html` with [`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) joined into a string with multiple children table elements. [→ Read more about `x-html`](/directives/html)

For example, to generate this structure:

```html
<table border="1">
    <tr>
        <td>Red</td>
        <td>0</td>
        <td>Green</td>
        <td>1</td>
        <td>Blue</td>
        <td>2</td>
    </tr>
</table>
```

You may use:
```alpine
<script>
    const the_data = {
        colors: ["Red", "Green", "Blue"]
    }
</script>
<table x-data="the_data" border="1">
    <tr x-html="colors.map((color, idx) => `<td>${color}</td><td>${idx}</td>`).join('')">
    </tr>
</table>
```
