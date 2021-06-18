---
order: 16
title: if
---

# `x-if`

`x-if` digunakan untuk beralih elemen pada halaman, mirip dengan `x-show`, namun ia menambahkan dan menghapus sepenuhnya elemen yang diterapkan, bukan hanya mengubah properti tampilan CSS menjadi "tersembunyi".

Karena perbedaan perilaku ini, `x-if` tidak boleh diterapkan langsung ke elemen, melainkan ke tag `<template>` yang menyelubungi elemen. Dengan cara ini, Alpine dapat menyimpan catatan elemen setelah dihapus dari halaman.

```html
<template x-if="open">
    <div>Contents...</div>
</template>
```

> Tidak seperti `x-show`, `x-if`, TIDAK mendukung peralihan transisi dengan `x-transition`.
