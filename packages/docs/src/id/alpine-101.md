---
order: 1
title: Alpine 101
---

# Alpine 101

Buat file HTML kosong di suatu tempat di komputer Anda dengan nama seperti: `i-love-alpine.html`

Gunakan sebuah editor teks, isi file dengan konten ini:

```html
<html>
<head>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body>
    <h1 x-data="{ message: 'I ❤️ Alpine' }" x-text="message"></h1>
</body>
</html>
```

Buka file Anda di browser web, jika Anda melihat `I ❤️ Alpine`, Anda siap untuk bergemuruh!

Sekarang setelah Anda siap untuk bermain-main, mari kita lihat tiga contoh praktis sebagai dasar untuk mengajari Anda dasar-dasar Alpine. Pada akhir latihan ini, Anda harus lebih dari siap untuk mulai membangun rancangan sendiri. Mari kita mulai.

<!-- START_VERBATIM -->
<ul class="flex flex-col space-y-2 list-inside !list-decimal">
    <li><a href="#building-a-counter">Membangun penghitung</a></li>
    <li><a href="#building-a-dropdown">Membangun dropdown</a></li>
    <li><a href="#building-a-search-input">Membangun masukan pencarian</a></li>
</ul>
<!-- END_VERBATIM -->

<a name="building-a-counter"></a>
## Membangun penghitung

Mari kita mulai dengan komponen "penghitung" sederhana untuk mendemonstrasikan dasar-dasar keadaan dan mendengarkan peristiwa di Alpine, dua fitur inti.

Masukkan yang berikut ini ke dalam tag `<body>`:

```html
<div x-data="{ count: 0 }">
    <button x-on:click="count++">Increment</button>

    <span x-text="count"></span>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ count: 0 }">
        <button x-on:click="count++">Increment</button>
        <span x-text="count"></span>
    </div>
</div>
<!-- END_VERBATIM -->

Sekarang, Anda dapat melihat dengan 3 bit Alpine yang ditaburkan ke dalam HTML ini, kami telah membuat komponen "penghitung" interaktif.

Mari kita telusuri apa yang terjadi secara singkat:

<a name="declaring-data"></a>
### Mendeklarasikan data

```html
<div x-data="{ count: 0 }">
```

Segala sesuatu di Alpine dimulai dengan direktif `x-data`. Di dalam `x-data`, dalam JavaScript biasa, Anda mendeklarasikan objek data yang akan dilacak Alpine.

Setiap properti di dalam objek ini akan tersedia untuk direktif lain di dalam elemen HTML ini. Selain itu, ketika salah satu properti ini berubah, semua yang bergantung padanya juga akan berubah.

[→ Baca lebih lanjut tentang `x-data`](/directives/data)

Mari kita lihat `x-on` dan lihat bagaimana ia dapat mengakses dan memodifikasi properti `count` dari atas:

<a name="listening-for-events"></a>
### Mendengarkan event

```html
<button x-on:click="count++">Increment</button>
```

`x-on` adalah direktif yang dapat Anda gunakan untuk mendengarkan avent apa pun pada suatu elemen.  Kami sedang mendengarkan event `klik` dalam kasus ini, jadi event kami terlihat seperti `x-on:click`.

Anda dapat mendengarkan event lain seperti yang Anda bayangkan. Misalnya, mendengarkan event `mouseenter` akan terlihat seperti ini: `x-on:mouseenter`.

Ketika suatu `click` event terjadi, Alpine akan memanggil ekspresi JavaScript terkait, `count++` dalam kasus kami. Seperti yang Anda lihat, kami memiliki akses langsung ke data yang dideklarasikan dalam ekspresi `x-data`.

> Anda akan sering melihat `@` alih-alih `x-on`. Ini adalah sintaksis yang lebih pendek dan ramah yang disukai banyak orang. Mulai sekarang, dokumentasi ini kemungkinan akan menggunakan `@` alih-alih `x-on`.

[→ Baca lebih lanjut tentang `x-on`](/directives/on)

<a name="reacting-to-changes"></a>
### Reaksi terhadap perubahan

```html
<h1 x-text="count"></h1>
```

`x-text` adalah direktif Alpine yang dapat Anda gunakan untuk mengatur konten teks elemen ke hasil ekspresi JavaScript.

Dalam hal ini, kami memberi tahu Alpine untuk selalu memastikan bahwa konten tag `h1` ini mencerminkan nilai properti `count`.

Jika tidak jelas, `x-text`, seperti kebanyakan direktif menerima ekspresi JavaScript biasa sebagai argumen. Jadi misalnya, Anda bisa mengatur isinya ke: `x-text="count * 2"` dan konten teks dari `h1` sekarang akan selalu 2 kali nilai `count`.

[→ Baca lebih lanjut tentang `x-text`](/directives/text)

<a name="building-a-dropdown"></a>
## Membangun dropdown

Sekarang kita telah melihat beberapa fungsionalitas dasar, mari kita lanjutkan dan melihat direktif penting di Alpine: `x-show`, dengan membangun komponen "dropdown" yang dibuat.

Masukkan kode berikut ke dalam tag `<body>`:

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle</button>

    <div x-show="open" @click.outside="open = false">Contents...</div>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ open: false }">
        <button @click="open = ! open">Toggle</button>
        <div x-show="open" @click.outside="open = false">Contents...</div>
    </div>
</div>
<!-- END_VERBATIM -->

Jika Anda memuat komponen ini, Anda akan melihat bahwa "Contents..." disembunyikan secara default. Anda dapat beralih menampilkannya di halaman dengan mengklik tombol "Toggle".

Direktif `x-data` dan `x-on` seharusnya sudah familiar bagi Anda dari contoh sebelumnya, jadi kami akan melewatkan penjelasan tersebut.

<a name="toggling-elements"></a>
### Beralih elemen

```html
<div x-show="open" ...>Contents...</div>
```

`x-show` adalah direktif yang sangat kuat di Alpine yang dapat digunakan untuk menampilkan dan menyembunyikan blok HTML pada halaman berdasarkan hasil ekspresi JavaScript, dalam kasus kami: `open`.

[→ Baca lebih lanjut tentang `x-show`](/directives/show)

<a name="listening-for-a-click-outside"></a>
### Mendengarkan klik di luar

```html
<div ... @click.outside="open = false">Contents...</div>
```

Anda akan melihat sesuatu yang baru dalam contoh ini: `.outside`. Banyak direktif di Alpine menerima "pengubah" yang dirantai ke akhir arahan dan dipisahkan oleh titik.

Dalam hal ini, `.outside` memberi tahu Alpine untuk alih-alih mendengarkan klik DI DALAM `<div>`, untuk mendengarkan klik hanya jika itu terjadi di LUAR `<div>`.

Ini adalah pembantu kenyamanan yang dibangun di Alpine karena ini adalah kebutuhan umum dan menerapkannya dengan tangan menjengkelkan dan rumit.

[→ Baca lebih lanjut tentang `x-on` pengubah](/directives/on#modifiers)

<a name="building-a-search-input"></a>
## Membangun masukan pencarian

Sekarang mari kita membangun komponen yang lebih kompleks dan memperkenalkan beberapa direktif dan pola lainnya.

Masukkan kode berikut ke dalam tag `<body>`:

```html
<div
    x-data="{
        search: '',

        items: ['foo', 'bar', 'baz'],

        get filteredItems() {
            return this.items.filter(
                i => i.startsWith(this.search)
            )
        }
    }"
>
    <input x-model="search" placeholder="Search...">

    <ul>
        <template x-for="item in filteredItems" :key="item">
            <li x-text="item"></li>
        </template>
    </ul>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div
        x-data="{
            search: '',

            items: ['foo', 'bar', 'baz'],

            get filteredItems() {
                return this.items.filter(
                    i => i.startsWith(this.search)
                )
            }
        }"
    >
        <input x-model="search" placeholder="Search...">

        <ul class="pl-6 pt-2">
            <template x-for="item in filteredItems" :key="item">
                <li x-text="item"></li>
            </template>
        </ul>
    </div>
</div>
<!-- END_VERBATIM -->

Secara default, semua "item" (foo, bar, dan baz) akan ditampilkan di halaman, tetapi Anda dapat memfilternya dengan mengetik di input teks. Saat Anda mengetik, daftar item akan berubah untuk mencerminkan apa yang Anda cari.

Sekarang ada sedikit yang terjadi di sini, jadi mari kita lihat potongan ini sepotong demi sepotong.

<a name="multi-line-formatting"></a>
### Pemformatan multi baris

Hal pertama yang ingin saya tunjukkan adalah bahwa `x-data` sekarang ada lebih banyak hal yang terjadi di dalamnya daripada sebelumnya. Untuk membuatnya lebih mudah untuk menulis dan membaca, kami telah membaginya menjadi beberapa baris di HTML kami. Ini sepenuhnya opsional dan kami akan berbicara lebih banyak tentang bagaimana menghindari masalah ini bersama-sama, tetapi untuk saat ini, kami akan menyimpan semua JavaScript ini langsung di HTML.

<a name="binding-to-inputs"></a>
### Mengikat ke input

```html
<input x-model="search" placeholder="Search...">
```

Anda akan melihat direktif baru yang belum kita lihat: `x-model`.

`x-model` digunakan untuk "mengikat" nilai elemen input dengan properti data: "pencarian" dari `x-data="{ search: '', ... }"` dalam kasus kami.

Ini berarti bahwa setiap kali nilai input berubah, nilai "pencarian" akan berubah untuk mencerminkan hal itu.

`x-model` mampu melakukan lebih dari contoh sederhana ini.

[→ Baca lebih lanjut tentang `x-model`](/directives/model)

<a name="computed-properties-using-getters"></a>
### Properti dihitung menggunakan getters

Bagian berikutnya yang ingin saya tarik perhatian Anda adalah `items` dan properti `filteredItems` dari direktif `x-data`.

```js
{
    ...
    items: ['foo', 'bar', 'baz'],

    get filteredItems() {
        return this.items.filter(
            i => i.startsWith(this.search)
        )
    }
}
```

Properti `items` harus jelas. Di sini kita mengatur nilai `items` ke array JavaScript dari 3 item berbeda (foo, bar, dan baz).

Bagian yang menarik dari cuplikan ini adalah properti `filteredItems`.

Dilambangkan dengan `get` awalan untuk properti ini, `filteredItems` adalah properti "pengambil" di objek ini. Ini berarti kita dapat mengakses `filteredItems` seolah-olah itu adalah properti normal di objek data kita, tetapi ketika kita melakukannya, JavaScript akan mengevaluasi fungsi yang disediakan di bawah tenda dan mengembalikan hasilnya.

Ini benar-benar dapat diterima untuk melupakan `get` dan hanya menjadikan ini metode yang dapat Anda panggil dari template, tetapi beberapa lebih suka sintaks pengambil yang lebih bagus.

[→ Baca lebih lanjut tentang JavaScript getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)

Sekarang mari kita lihat ke dalam `filteredItems` pengambil dan pastikan kita memahami apa yang terjadi di sana:

```js
return this.items.filter(
    i => i.startsWith(this.search)
)
```

Ini semua JavaScript biasa. Kami pertama-tama mendapatkan larik item (foo, bar, dan baz) dan memfilternya menggunakan panggilan balik yang disediakan: `i => i.startsWith(this.search)`.

Dengan meneruskan panggilan balik ini ke `filter`, kita memberi tahu JavaScript untuk hanya mengembalikan item yang dimulai dengan string: `this.search`, yang seperti yang kita lihat `x-model` akan selalu mencerminkan nilai input.

Anda mungkin memperhatikan bahwa sampai sekarang, kami tidak harus menggunakan `this.` properti referensi. Namun, karena kita bekerja langsung di dalam `x-data` objek, kita harus mereferensikan properti apa pun menggunakan `this.[property]` alih-alih hanya `[property]`.

Karena Alpine adalah kerangka kerja "reaktif". Setiap kali nilainya `this.search` berubah, bagian dari template yang digunakan `filteredItems` akan diperbarui secara otomatis.

<a name="looping-elements"></a>
### Elemen perulangan

Sekarang setelah kita memahami bagian data dari komponen kita, mari kita pahami apa yang terjadi di template yang memungkinkan kita untuk mengulang di halaman `filteredItems`.

```html
<ul>
    <template x-for="item in filteredItems">
        <li x-text="item"></li>
    </template>
</ul>
```

Hal pertama yang harus diperhatikan di sini adalah direktif `x-for`. Ekspresi `x-for` mengambil bentuk berikut: `[item] di [items]` dimana [items] adalah array data apa pun, dan [item] adalah nama variabel yang akan ditetapkan ke iterasi di dalam loop.

Perhatikan juga bahwa `x-for` dideklarasikan pada elemen `<template>` dan tidak langsung pada `<li>`. Ini adalah persyaratan untuk menggunakan `x-for`. Ini memungkinkan Alpine untuk memanfaatkan perilaku tag `<template>` yang ada di browser untuk keuntungannya.

Sekarang elemen apa pun di dalam tag `<template>` akan diulang untuk setiap item di dalam `filteredItems` dan semua ekspresi yang dievaluasi di dalam loop akan memiliki akses langsung ke variabel iterasi (`item` pada kasus ini).

[→ Baca lebih lanjut tentang `x-for`](/directives/for)

<a name="recap"></a>
## Rekap

Jika Anda telah sampai sejauh ini, Anda telah dihadapkan pada direktif berikut di Alpine:

* x-data
* x-on
* x-text
* x-show
* x-model
* x-for

Itu awal yang baik, namun, ada lebih banyak direktif untuk menenggelamkan gigi Anda. Cara terbaik untuk menyerap Alpine adalah dengan membaca dokumentasi ini. Tidak perlu menyisir setiap kata, tetapi jika Anda setidaknya melirik setiap halaman, Anda akan JAUH lebih efektif saat menggunakan Alpine.

Happy Coding!
