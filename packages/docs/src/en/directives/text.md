---
order: 6
title: text
---

# x-text

`x-text` sets the text content of an element to the result of a given expression.

Here's a basic example of using `x-text` to display a user's username.

```alpine
<div x-data="{ username: 'calebporzio' }">
    Username: <strong x-text="username"></strong>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ username: 'calebporzio' }">
        Username: <strong x-text="username"></strong>
    </div>
</div>
<!-- END_VERBATIM -->

Now the `<strong>` tag's inner text content will be set to "calebporzio".

<a name="modifiers"></a>
## Modifiers

<a name="ignore-nullish"></a>
### .ignore-nullish

`.ignore-nullish` will ignore the value if it resolves to `null` or `undefined` and retain the currently set text.

```alpine
<section x-data="{ title: null }">
    <h1 x-text.ignore-nullish="title">Not loaded yet</h1>

    <button x-on:click="title = 'Loaded Title'">Load Title</button>
</section>
```

In the above example, with the `.ignore-nullish`, when the page finished loading it will retain the "Not loaded yet" text. Clicking the button will then replace that text with the title.