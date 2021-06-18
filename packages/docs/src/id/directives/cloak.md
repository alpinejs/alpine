---
order: 12
title: cloak
---

# `x-cloak`

Terkadang, saat Anda menggunakan AlpineJS untuk bagian dari template Anda, ada "blip" di mana Anda mungkin melihat template yang belum diinisialisasi setelah halaman dimuat, tetapi sebelum Alpine dimuat.

`x-cloak` menangani skenario ini dengan menyembunyikan elemen yang dilampirkannya hingga Alpine dimuat penuh di halaman.

Agar `x-cloak` berfungsi, Anda harus menambahkan CSS berikut ke halaman.

```css
[x-cloak] { display: none !important; }
```

Sekarang, contoh berikut akan menyembunyikan tag `<span>` hingga Alpine menyetel konten teksnya ke properti `message`.

```html
<span x-cloak x-text="message"></span>
```

Saat Alpine dimuat di halaman, ia menghapus semua properti `x-cloak` dari elemen, yang juga menghapus `display: none;` yang diterapkan oleh CSS, sehingga menampilkan elemen.

Jika Anda ingin mencapai perilaku yang sama, tetapi menghindari keharusan untuk memasukkan gaya global, Anda dapat menggunakan trik berikut yang keren, tetapi memang aneh:

```html
<template x-if="true">
    <span x-text="message"></span>
</template>
```

Ini akan mencapai tujuan yang sama dengan `x-cloak` hanya dengan memanfaatkan cara kerja `x-if`.

Karena elemen `<template>` "disembunyikan" di browser secara default, Anda tidak akan melihat `<span>` hingga Alpine memiliki kesempatan untuk merender `x-if="true"` dan menampilkannya.

Sekali lagi, solusi ini bukan untuk semua orang, tetapi perlu disebutkan untuk kasus-kasus khusus.
