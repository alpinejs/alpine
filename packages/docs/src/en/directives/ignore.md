---
order: 11
title: ignore
---

# x-ignore

By default, Alpine will crawl and initialize the entire DOM tree of an element containing `x-init` or `x-data`.

If for some reason, you don't want Alpine to touch a specific section of your HTML, you can prevent it from doing so using `x-ignore`.

```alpine
<div x-data="{ label: 'From Alpine' }">
    <div x-ignore>
        <span x-text="label"></span>
    </div>
</div>
```

In the above example, the `<span>` tag will not contain "From Alpine" because we told Alpine to ignore the contents of the `div` completely.
