---
order: 9
prefix: $
title: id
---

# $id

`$id` is a magic property that can be used to generate an element's ID and ensure that it won't conflict with other IDs of the same name on the same page.

This utility is extremely helpful when building re-usable components (presumably in a back-end template) that might occur multiple times on a page, and make use of ID attributes.

Things like input components, modals, listboxes, etc. will all benefit from this utility.

<a name="basic-usage"></a>
## Basic usage

Suppose you have two input elements on a page, and you want them to have a unique ID from each other, you can do the following:

```alpine
<input type="text" :id="$id('text-input')">
<!-- id="text-input-1" -->

<input type="text" :id="$id('text-input')">
<!-- id="text-input-2" -->
```

As you can see, `$id` takes in a string and spits out an appended suffix that is unique on the page.

<a name="groups-with-x-id"></a>
## Grouping with x-id

Now let's say you want to have those same two input elements, but this time you want `<label>` elements for each of them.

This presents a problem, you now need to be able to reference the same ID twice. One for the `<label>`'s `for` attribute, and the other for the `id` on the input.

Here is a way that you might think to accomplish this and is totally valid:

```alpine
<div x-data="{ id: $id('text-input') }">
    <label :for="id"> <!-- "text-input-1" -->
    <input type="text" :id="id"> <!-- "text-input-1" -->
</div>

<div x-data="{ id: $id('text-input') }">
    <label :for="id"> <!-- "text-input-2" -->
    <input type="text" :id="id"> <!-- "text-input-2" -->
</div>
```

This approach is fine, however, having to name and store the ID in your component scope feels cumbersome.

To accomplish this same task in a more flexible way, you can use Alpine's `x-id` directive to declare an "id scope" for a set of IDs:

```alpine
<div x-id="['text-input']">
    <label :for="$id('text-input')"> <!-- "text-input-1" -->
    <input type="text" :id="$id('text-input')"> <!-- "text-input-1" -->
</div>

<div x-id="['text-input']">
    <label :for="$id('text-input')"> <!-- "text-input-2" -->
    <input type="text" :id="$id('text-input')"> <!-- "text-input-2" -->
</div>
```

As you can see, `x-id` accepts an array of ID names. Now any usages of `$id()` within that scope, will all use the same ID. Think of them as "id groups".

<a name="nesting"></a>
## Nesting

As you might have intuited, you can freely nest these `x-id` groups, like so:

```alpine
<div x-id="['text-input']">
    <label :for="$id('text-input')"> <!-- "text-input-1" -->
    <input type="text" :id="$id('text-input')"> <!-- "text-input-1" -->

    <div x-id="['text-input']">
        <label :for="$id('text-input')"> <!-- "text-input-2" -->
        <input type="text" :id="$id('text-input')"> <!-- "text-input-2" -->
    </div>
</div>
```

<a name="keyed-ids"></a>
## Keyed IDs (For Looping)

Sometimes, it is helpful to specify an additional suffix on the end of an ID for the purpose of identifying it within a loop.

For this, `$id()` accepts an optional second parameter that will be added as a suffix on the end of the generated ID.

A common example of this need is something like a listbox component that uses the `aria-activedescendant` attribute to tell assistive technologies which element is "active" in the list:

```alpine
<ul
    x-id="['list-item']"
    :aria-activedescendant="$id('list-item', activeItem.id)"
>
    <template x-for="item in items" :key="item.id">
        <li :id="$id('list-item', item.id)">...</li>
    </template>
</ul>
```

This is an incomplete example of a listbox, but it should still be helpful to demonstrate a scenario where you might need each ID in a group to still be unique to the page, but also be keyed within a loop so that you can reference individual IDs within that group.
