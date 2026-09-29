---
order: 7
title: html
---

# x-html

`x-html` sets the "innerHTML" property of an element to the result of a given expression.

> ⚠️ Only use on trusted content and never on user-provided content. ⚠️
> Dynamically rendering HTML from third parties can easily lead to XSS vulnerabilities.
> If you need to render HTML that isn't fully trusted, take a look at the [HTML Safe plugin](/plugins/html-safe), which sanitizes content through a fixed tag and attribute allowlist. It's also the only option if you're on the [CSP build](/advanced/csp), which doesn't support `x-html` at all.

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
