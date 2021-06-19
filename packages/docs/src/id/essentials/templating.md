---
order: 3
title: Templating
---

# Pembuatan template

Alpine menawarkan beberapa arahan yang berguna untuk memanipulasi DOM pada halaman web.

Mari kita membahas beberapa arahan templating dasar di sini, tetapi pastikan untuk melihat melalui arahan yang tersedia di sidebar untuk daftar lengkap.

<a name="text-content"></a>
## Konten teks

Alpine memudahkan untuk mengontrol konten teks elemen dengan direktif `x-text`.

```html
<div x-data="{ title: 'Start Here' }">
    <h1 x-text="title"></h1>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ title: 'Start Here' }" class="demo">
    <strong x-text="title"></strong>
</div>
<!-- END_VERBATIM -->

Sekarang, Alpine akan menyetel konten teks `<h1>` dengan nilai `title` ("Start Here").  Saat `title` berubah, demikian juga konten `<h1>`.

Seperti semua direktif di Alpine, Anda dapat menggunakan ekspresi JavaScript apa pun yang Anda suka. Sebagai contoh:

```html
<span x-text="1 + 2"></span>
```

<!-- START_VERBATIM -->
<div class="demo" x-data>
    <span x-text="1 + 2"></span>
</div>
<!-- END_VERBATIM -->

`<span>` sekarang akan berisi jumlah "1" dan "2".

[→ Baca lebih lanjut tentang `x-text`](/directives/text)

<a name="toggling-elements"></a>
## Beralih elemen

Toggling elemen adalah kebutuhan umum di halaman web dan aplikasi. Dropdown, modals, dialog, "show-more", dll... semuanya adalah contoh yang bagus.

Alpine menawarkan direktif `x-show` dan `x-if` untuk beralih elemen pada halaman.

<a name="x-show"></a>
### `x-show`

Berikut adalah komponen sakelar sederhana menggunakan `x-show`.

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Expand</button>

    <div x-show="open">
        Content...
    </div>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <button @click="open = ! open" :aria-pressed="open">Expand</button>

    <div x-show="open">
        Content...
    </div>
</div>
<!-- END_VERBATIM -->

Sekarang seluruh `<div>` yang berisi konten akan ditampilkan dan disembunyikan berdasarkan nilai `open`.

Di bawah pengambil, Alpine menambahkan properti CSS `display: none;` ke elemen saat seharusnya disembunyikan.

[→ Baca lebih lanjut tentang `x-show`](/directives/show)

Ini berfungsi dengan baik untuk sebagian besar kasus, tetapi terkadang Anda mungkin ingin menambahkan dan menghapus elemen sepenuhnya dari DOM sepenuhnya. Inilah gunanya `x-if`.

<a name="x-if"></a>
### `x-if`

Ini adalah sakelar yang sama dari sebelumnya, tetapi kali ini menggunakan `x-if` alih-alih `x-show`.

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Expand</button>

    <template x-if="open">
        <div>
            Content...
        </div>
    </template>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <button @click="open = ! open" :aria-pressed="open">Expand</button>

    <template x-if="open">
        <div>
            Content...
        </div>
    </template>
</div>
<!-- END_VERBATIM -->

Perhatikan bahwa `x-if` harus dideklarasikan pada tag `<template>`. Ini agar Alpine dapat memanfaatkan perilaku browser yang ada dari elemen `<template>` dan menggunakannya sebagai sumber target `<div>` yang akan ditambahkan dan dihapus dari halaman.

Jika `open` bernilai true, Alpine akan menambahkan `<div>` ke tag `<template>`, dan menghapusnya jika `open` salah.

[→ Baca lebih lanjut tentang `x-if`](/directives/if)

<a name="toggling-with-transitions"></a>
## Beralih dengan transisi

Alpine mempermudah transisi antara status "ditampilkan" dan "tersembunyi" dengan lancar menggunakan direktif `x-transition`.

> `x-transition` hanya berfungsi dengan `x-show`, tidak dengan `x-if`.

Ini, sekali lagi, contoh sakelar sederhana, tetapi kali ini dengan transisi yang diterapkan:

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Expands</button>

    <div x-show="open" x-transition>
        Content...
    </div>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <button @click="open = ! open">Expands</button>

    <div class="flex">
        <div x-show="open" x-transition style="will-change: transform;">
            Content...
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

Mari kita perbesar bagian template yang berhubungan dengan transisi:

```html
<div x-show="open" x-transition>
```

`x-transition` dengan sendirinya akan menerapkan transisi default yang masuk akal (fade dan scale) ke sakelar.

Ada dua cara untuk menyesuaikan transisi ini:

* Pembantu transisi
* Transisi kelas CSS.

Mari kita lihat masing-masing pendekatan ini:

<a name="transition-helpers"></a>
### Pembantu transisi

Katakanlah Anda ingin membuat durasi transisi lebih lama, Anda dapat menentukannya secara manual menggunakan pengubah `.duration` seperti:

```html
<div x-show="open" x-transition.duration.500ms>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <button @click="open = ! open">Expands</button>

    <div class="flex">
        <div x-show="open" x-transition.duration.500ms style="will-change: transform;">
            Content...
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

Sekarang transisi akan berlangsung 500 milidetik.

Jika Anda ingin menentukan nilai yang berbeda untuk transisi masuk dan keluar, Anda dapat menggunakan `x-transition:enter` dan `x-transition:leave`:

```html
<div
    x-show="open"
    x-transition:enter.duration.500ms
    x-transition:leave.duration.1000ms
>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <button @click="open = ! open">Expands</button>

    <div class="flex">
        <div x-show="open" x-transition:enter.duration.500ms x-transition:leave.duration.1000ms style="will-change: transform;">
            Content...
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

Selain itu, Anda dapat menambahkan `.opacity` atau `.scale` hanya untuk mentransisikan properti tersebut. Sebagai contoh:

```html
<div x-show="open" x-transition.opacity>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <button @click="open = ! open">Expands</button>

    <div class="flex">
        <div x-show="open" x-transition:enter.opacity.duration.500 x-transition:leave.opacity.duration.250>
            Content...
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

[→ Baca lebih lanjut tentang pembantu transisi](/directives/transition#the-transition-helper)

<a name="transition-classes"></a>
### Kelas transisi

Jika Anda memerlukan kontrol yang lebih halus atas transisi dalam aplikasi Anda, Anda dapat menerapkan kelas CSS tertentu pada fase transisi tertentu menggunakan sintaks berikut (contoh ini menggunakan [Tailwind CSS](https://tailwindcss.com/)):

```html
<div
    x-show="open"
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0 transform scale-90"
    x-transition:enter-end="opacity-100 transform scale-100"
    x-transition:leave="transition ease-in duration-300"
    x-transition:leave-start="opacity-100 transform scale-100"
    x-transition:leave-end="opacity-0 transform scale-90"
>...</div>
```

<!-- START_VERBATIM -->
<div x-data="{ open: false }" class="demo">
    <button @click="open = ! open">Expands</button>

    <div class="flex">
        <div
            x-show="open"
            x-transition:enter="transition ease-out duration-300"
            x-transition:enter-start="opacity-0 transform scale-90"
            x-transition:enter-end="opacity-100 transform scale-100"
            x-transition:leave="transition ease-in duration-300"
            x-transition:leave-start="opacity-100 transform scale-100"
            x-transition:leave-end="opacity-0 transform scale-90"
            style="will-change: transform"
        >
            Content...
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

[→ Baca lebih lanjut tentang kelas transisi](/directives/transition#applying-css-classes)

<a name="binding-attributes"></a>
## Mengikat atribut

Anda dapat menambahkan atribut HTML seperti `class`, `style`, `disabled`, dll... ke elemen di Alpine menggunakan direktif `x-bind`.

Berikut adalah contoh atribut `class` yang terikat secara dinamis:

```html
<button
    x-data="{ red: false }"
    x-bind:class="red ? 'bg-red' : ''"
    @click="red = ! red"
>
    Toggle Red
</button>
```

<!-- START_VERBATIM -->
<div class="demo">
    <button
        x-data="{ red: false }"
        x-bind:style="red && 'background: red'"
        @click="red = ! red"
    >
        Toggle Red
    </button>
</div>
<!-- END_VERBATIM -->


Sebagai pintasan, Anda dapat mengabaikan `x-bind` dan menggunakan sintaks `:` secara langsung:

```html
<button ... :class="red ? 'bg-red' : ''>"
```

Mengaktifkan dan menonaktifkan kelas berdasarkan data di dalam Alpine adalah kebutuhan umum. Berikut adalah contoh mengubah kelas menggunakan sintaks objek binding `class` Alpine: (Catatan: sintaks ini hanya tersedia untuk atribut `class`)

```html
<div x-data="{ open: true }">
    <span :class="{ 'hidden': ! open }">...</span>
</div>
```

Sekarang kelas `hidden` akan ditambahkan ke elemen jika `open` salah, dan dihapus jika `open` benar.

<a name="looping-elements"></a>
## Elemen Perulangan

Alpine memungkinkan untuk mengulang bagian template Anda berdasarkan data JavaScript menggunakan direktif `x-for`. Berikut adalah contoh sederhana:

```html
<div x-data="{ statuses: ['open', 'closed', 'archived'] }">
    <template x-for="status in statuses">
        <div x-text="status"></div>
    </template>
</div>
```

<!-- START_VERBATIM -->
<div x-data="{ statuses: ['open', 'closed', 'archived'] }" class="demo">
    <template x-for="status in statuses">
        <div x-text="status"></div>
    </template>
</div>
<!-- END_VERBATIM -->

Mirip dengan `x-if`, `x-for` harus diterapkan ke tag `<template>`.  Secara internal, Alpine akan menambahkan konten tag `<template>` untuk setiap iterasi dalam loop.

Seperti yang Anda lihat, variabel `status` baru tersedia dalam cakupan templat yang diulang.

[→ Baca lebih lanjut tentang `x-for`](/directives/for)
