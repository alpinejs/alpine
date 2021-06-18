---
order: 10
title: transition
---

# `x-transition`

Alpine menyediakan utilitas transisi yang kuat di luar kotak.  Dengan beberapa arahan `x-transition`, Anda dapat membuat transisi yang mulus antara saat elemen ditampilkan atau disembunyikan.

Ada dua cara utama untuk menangani transisi di Alpine:

* [Pembantu Transisi]()
* [Menerapkan Kelas CSS]()

<a name="the-transition-helper"></a>
## Pembantu Transisi

Cara termudah untuk mencapai transisi menggunakan Alpine adalah dengan menambahkan `x-transition` ke elemen dengan `x-show` atau `x-if` di atasnya. Sebagai contoh:

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle</button>

    <span x-show="open" x-transition>
        Hello 👋
    </span>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ open: false }">
        <button @click="open = ! open">Toggle</button>

        <span x-show="open" x-transition>
            Hello 👋
        </span>
    </div>
</div>
<!-- END_VERBATIM -->

Seperti yang Anda lihat, secara default, `x-transition` menerapkan default transisi yang menyenangkan untuk memudarkan dan menskalakan elemen yang terbuka.

Anda dapat mengganti default ini dengan pengubah yang dilampirkan ke `x-transition`. Mari kita lihat itu.

<a name="customizing-duration"></a>
### Menyesuaikan durasi

Anda dapat mengonfigurasi durasi yang Anda inginkan untuk transisi dengan pengubah `.duration`:

```html
<div ... x-transition.duration.500ms>
```

`<div>` di atas akan bertransisi selama 500 milidetik saat masuk, dan 250 milidetik saat keluar.

Perbedaan durasi ini umumnya diinginkan default. Jika Anda ingin menyesuaikan durasi khusus untuk masuk dan keluar, Anda dapat melakukannya seperti:

```html
<div ...
    x-transition:enter.duration.500ms
    x-transition:leave.duration.400ms
>
```

<a name="customizing-delay"></a>
### Menyesuaikan penundaan

Anda dapat menunda transisi menggunakan pengubah `.delay` seperti:

```html
<div ... x-transition.delay.50ms>
```

Contoh di atas akan menunda transisi dan keluar masuk elemen sebesar 50 milidetik.

<a name="customizing-opacity"></a>
### Menyesuaikan opasitas

Secara default, `x-transition` Alpine menerapkan transisi skala dan opasitas untuk mencapai efek "pudar".

Jika Anda hanya ingin menerapkan transisi opacity (tanpa skala), Anda dapat melakukannya seperti ini:

```html
<div ... x-transition.opacity>
```

<a name="customizing-scale"></a>
### Menyesuaikan skala

Mirip dengan pengubah `.opacity`, Anda dapat mengonfigurasi `x-transition` ke HANYA skala (dan bukan opacity transisi juga) seperti:

```html
<div ... x-transition.scale>
```

Pengubah `.scale` juga menawarkan kemampuan untuk mengonfigurasi nilai skalanya DAN nilai asalnya:

```html
<div ... x-transition.scale.80>
```

Cuplikan di atas akan menskalakan elemen ke atas dan ke bawah sebesar 80%.

Sekali lagi, Anda dapat menyesuaikan nilai ini secara terpisah untuk transisi masuk dan keluar seperti:

```html
<div ...
    x-transition:enter.scale.80
    x-transition:leave.scale.90
>
```

Untuk menyesuaikan asal transisi skala, Anda dapat menggunakan pengubah `.origin`:

```html
<div ... x-transition.scale.origin.top>
```

Sekarang skala akan diterapkan menggunakan bagian atas elemen sebagai asal, bukan pusat secara default.

Seperti yang mungkin sudah Anda duga, nilai yang mungkin untuk penyesuaian ini adalah: `top`, `bottom`, `left`, dan `right`.

Jika mau, Anda juga dapat menggabungkan dua nilai asal. Misalnya, jika Anda ingin asal skala menjadi "kanan atas", Anda dapat menggunakan: `.origin.top.right` sebagai pengubah.


<a name="applying-css-classes"></a>
## Menerapkan kelas CSS

Untuk kontrol langsung atas apa yang masuk ke transisi Anda, Anda dapat menerapkan kelas CSS pada berbagai tahap transisi.

> Contoh berikut menggunakan kelas utilitas [TailwindCSS](https://tailwindcss.com/docs/transition-property).

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle</button>

    <div
        x-show="open"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0 transform scale-90"
        x-transition:enter-end="opacity-100 transform scale-100"
        x-transition:leave="transition ease-in duration-300"
        x-transition:leave-start="opacity-100 transform scale-100"
        x-transition:leave-end="opacity-0 transform scale-90"
    >Hello 👋</div>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ open: false }">
    <button @click="open = ! open">Toggle</button>

    <div
        x-show="open"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0 transform scale-90"
        x-transition:enter-end="opacity-100 transform scale-100"
        x-transition:leave="transition ease-in duration-300"
        x-transition:leave-start="opacity-100 transform scale-100"
        x-transition:leave-end="opacity-0 transform scale-90"
    >Hello 👋</div>
</div>
</div>
<!-- END_VERBATIM -->

| Direktif      | Deskripsi |
| ---            | --- |
| `:enter`       | Diterapkan selama seluruh fase masuk. |
| `:enter-start` | Ditambahkan sebelum elemen dimasukkan, dihapus satu frame setelah elemen dimasukkan. |
| `:enter-end`   | Menambahkan satu frame setelah elemen dimasukkan (pada saat yang sama `enter-start` dihapus), dihapus saat transisi/animasi selesai.
| `:leave`       | Diterapkan selama seluruh fase meninggalkan. |
| `:leave-start` | Ditambahkan segera ketika transisi keluar dipicu, dihapus setelah satu frame. |
| `:leave-end`   | Menambahkan satu frame setelah transisi keluar dipicu (pada saat yang sama `leave-start` dihapus), dihapus saat transisi/animasi selesai.
