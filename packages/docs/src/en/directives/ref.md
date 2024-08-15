---
order: 11
title: ref
---

# x-ref

`x-ref` in combination with `$refs` is a useful utility for easily accessing DOM elements directly. It's most useful as a replacement for APIs like `getElementById` and `querySelector`.

```alpine
<button @click="$refs.text.remove()">Remove Text</button>

<span x-ref="text">Hello 👋</span>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data>
        <button @click="$refs.text.remove()">Remove Text</button>

        <div class="pt-4" x-ref="text">Hello 👋</div>
    </div>
</div>
<!-- END_VERBATIM -->

> Despite not being included in the above snippet, `x-ref` cannot be used if no parent element has `x-data` defined. [→ Read more about `x-data`](/directives/data)
