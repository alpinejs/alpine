---
order: 11
title: ref
---

# `x-ref`

`x-ref` dalam kombinasi dengan `$refs` adalah utilitas yang berguna untuk mengakses elemen DOM dengan mudah secara langsung. Ini paling berguna sebagai pengganti API seperti `getElementById` dan `querySelector`.

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
