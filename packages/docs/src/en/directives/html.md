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
