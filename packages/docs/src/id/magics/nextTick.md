---
order: 6
prefix: $
title: nextTick
---

# `$nextTick`

`$nextTick` adalah properti ajaib yang memungkinkan Anda hanya mengeksekusi ekspresi tertentu SETELAH Alpine membuat pembaruan DOM reaktifnya. Ini berguna untuk saat Anda ingin berinteraksi dengan status DOM SETELAH itu mencerminkan pembaruan data apa pun yang Anda buat.

```html
<div x-data="{ title: 'Hello' }">
    <button
        @click="
            title = 'Hello World!';
            $nextTick(() => { console.log($el.innerText) });
        "
        x-text="title"
    ></button>
</div>
```

Dalam contoh di atas, alih-alih memasukkan "Halo" ke konsol, "Halo Dunia!"  akan dicatat karena `$nextTick` digunakan untuk menunggu hingga Alpine selesai memperbarui DOM.
