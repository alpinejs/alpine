---
order: 7
title: html
---

# x-html

`x-html` sets the "innerHTML" property of an element to the result of a given expression.

> ⚠️ Only use on trusted content and never on user-provided content. ⚠️
> Dynamically rendering HTML from third parties can easily lead to XSS vulnerabilities.

Here's a basic example of using `x-html` to display a user's username.

```alpine
<div x-data="{ username: '<strong>calebporzio</strong>' }">
    Username: <span x-html="username"></span>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ username: '<strong>calebporzio</strong>' }">
        Username: <span x-html="username"></span>
    </div>
</div>
<!-- END_VERBATIM -->

Now the `<span>` tag's inner HTML will be set to "<strong>calebporzio</strong>".

<a name="modifiers"></a>
## Modifiers

<a name="ignore-nullish"></a>
### .ignore-nullish

`.ignore-nullish` will ignore the value if it resolves to `null` or `undefined` and retain the currently set HTML.

```alpine
<section x-data="{ items: null }">
    <ul x-html.ignore-nullish="items">
        <li>
            <em>Not loaded yet...</em>
        </li>
    </ul>

    <button x-on:click="items = '<li>First item</li><li>Second item</li>'">Load Items</button>
</section>
```

In the above example, with the `.ignore-nullish`, when the page finished loading it will retain the "Not loaded yet" HTML. Clicking the button will then replace that HTML with the list items.