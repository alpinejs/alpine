---
order: 11
title: ref
---

# `x-ref`

`x-ref` in combination with `$refs` is a useful utility for easily accessing DOM elements directly. It's most useful as a replacement for APIs like `getElementById` and `querySelector`.

```html
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

**Note:** If using `x-ref` in combination with a standalone `x-init` directive, note that `x-init` creates a new component scope, so any `$refs` created outside of this scope will not be accessible on the DOM tag containing a standalone `x-init` attribute, nor will any of its children.
