---
order: 2
prefix: $
title: refs
---

# `$refs`

`$refs` adalah properti ajaib yang dapat digunakan untuk mengambil elemen DOM yang ditandai dengan `x-ref` di dalam komponen. Ini berguna saat Anda perlu memanipulasi elemen DOM secara manual. Ini sering digunakan sebagai alternatif yang lebih ringkas, tercakup, untuk `document.querySelector`.

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

Sekarang, ketika `<button>` ditekan, `<span>` akan dihapus.
