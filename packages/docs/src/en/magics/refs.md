---
order: 2
prefix: $
title: refs
---

# $refs

`$refs` is a magic property that can be used to retrieve DOM elements marked with `x-ref` inside the component. This is useful when you need to manually manipulate DOM elements. It's often used as a more succinct, scoped, alternative to `document.querySelector`.

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

Now, when the `<button>` is pressed, the `<span>` will be removed.
