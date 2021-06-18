---
order: 3
title: show
---

# `x-show`

`x-show` adalah salah satu direktif yang paling berguna dan kuat di Alpine. Ini menyediakan cara ekspresif untuk menampilkan dan menyembunyikan elemen DOM.

Berikut adalah contoh komponen dropdown sederhana menggunakan `x-show`.

```html
<div x-data="{ open: false }">
    <button x-on:click="open = ! open">Toggle Dropdown</button>

    <div x-show="open">
        Dropdown Contents...
    </div>
</div>
```

Ketika tombol "Toggle Dropdown" diklik, dropdown akan ditampilkan dan disembunyikan.

> Jika status "default" dari `x-show` pada pemuatan halaman adalah "false", Anda mungkin ingin menggunakan `x-cloak` pada halaman untuk menghindari "page flicker" (Efek yang terjadi saat browser merender konten sebelum Alpine selesai menginisialisasi dan menyembunyikannya.) Anda dapat mempelajari lebih lanjut tentang `x-cloak` dalam dokumentasinya.

<a name="with-transitions"></a>
## Dengan transisi

Jika Anda ingin menerapkan transisi yang mulus ke perilaku `x-show`, Anda dapat menggunakannya bersama dengan `x-transition`. Anda dapat mempelajari lebih lanjut tentang direktif tersebut [di sini](/directives/transition), tetapi berikut adalah contoh singkat dari komponen yang sama seperti di atas, hanya dengan transisi yang diterapkan.

```html
<div x-data="{ open: false }">
    <button x-on:click="open = ! open">Toggle Dropdown</button>

    <div x-show="open" x-transition>
        Dropdown Contents...
    </div>
</div>
```
