---
order: 2
title: State
---

# Status

Status (data JavaScript yang dipantau Alpine untuk perubahan) adalah inti dari semua yang Anda lakukan di Alpine. Anda dapat memberikan data lokal ke sepotong HTML, atau membuatnya tersedia secara global untuk digunakan di mana saja pada halaman menggunakan `x-data` atau `Alpine.store()` masing-masing.

<a name="local-state-x-data"></a>
## Status lokal

Alpine memungkinkan Anda untuk mendeklarasikan status blok HTML dalam satu atribut `x-data` tanpa harus meninggalkan markup Anda.

Berikut ini contoh dasarnya:

```html
<div x-data="{ open: false }">
    ...
</div>
```

Sekarang sintaks Alpine lainnya pada atau di dalam elemen ini akan dapat mengakses `open`. Dan seperti yang Anda duga, ketika `buka` berubah karena alasan apa pun, semua yang bergantung padanya akan bereaksi secara otomatis.

[→ Baca lebih lanjut tentang `x-data`](/directives/data)

<a name="nesting-data"></a>
### Data bersarang

Data dapat disarangkan di Alpine. Misalnya, jika Anda memiliki dua elemen dengan data Alpine terlampir (satu di dalam yang lain), Anda dapat mengakses data induk dari dalam elemen anak.

```html
<div x-data="{ open: false }">
    <div x-data="{ label: 'Content:' }">
        <span x-text="label"></span>
        <span x-show="open"></span>
    </div>
</div>
```

Ini mirip dengan pelingkupan dalam JavaScript itu sendiri (kode dalam suatu fungsi dapat mengakses variabel yang dideklarasikan di luar fungsi itu.)

Seperti yang mungkin sudah Anda duga, jika anak memiliki properti data yang cocok dengan nama properti induk, properti anak akan didahulukan.

<a name="single-element-data"></a>
### Data elemen tunggal

Meskipun ini mungkin tampak jelas bagi sebagian orang, perlu disebutkan bahwa data Alpine dapat digunakan dalam elemen yang sama. Sebagai contoh:

```html
<button x-data="{ label: 'Click Here' }" x-text="label"></button>
```

<a name="data-less-alpine"></a>
### Alpine tanpa data

Terkadang Anda mungkin ingin menggunakan fungsionalitas Alpine, tetapi tidak memerlukan data reaktif apa pun. Dalam kasus ini, Anda dapat memilih untuk tidak meneruskan ekspresi ke `x-data` sepenuhnya. Sebagai contoh:

```html
<button x-data @click="alert('I\'ve been clicked!')">Click Me</button>
```

<a name="re-usable-data"></a>
### Data yang dapat digunakan kembali

Saat menggunakan Alpine, Anda mungkin perlu menggunakan kembali sebagian data dan/atau template yang sesuai.

Jika Anda menggunakan kerangka kerja backend seperti Rails atau Laravel, Alpine pertama-tama merekomendasikan agar Anda mengekstrak seluruh blok HTML menjadi sebagian atau menyertakan template.

Jika karena alasan tertentu yang tidak ideal untuk Anda atau Anda tidak berada di lingkungan templating back-end, Alpine memungkinkan Anda untuk mendaftar secara global dan menggunakan kembali bagian data dari suatu komponen menggunakan `Alpine.data(...)  `.

```js
Alpine.data('dropdown', () => ({
    open: false,

    toggle() {
        this.open = ! this.open
    }
}))
```

Sekarang setelah Anda mendaftarkan data "dropdown", Anda dapat menggunakannya di dalam markup Anda di banyak tempat yang Anda suka:

```html
<div x-data="dropdown">
    <button @click="toggle">Expand</button>

    <span x-show="open">Content...</span>
</div>

<div x-data="dropdown">
    <button @click="toggle">Expand</button>

    <span x-show="open">Some Other Content...</span>
</div>
```

[→ Baca lebih lanjut tentang menggunakan `Alpine.data()`](/globals/alpine-data)

<a name="global-state"></a>
## Status Global

Jika Anda ingin membuat beberapa data tersedia untuk setiap komponen di halaman, Anda dapat melakukannya menggunakan fitur "global store" Alpine.

Anda dapat mendaftarkan toko menggunakan `Alpine.store(...)`, dan mereferensikannya dengan metode ajaib `$store()`.

Mari kita lihat contoh sederhana.  Pertama kita akan mendaftarkan toko secara global:

```js
Alpine.store('tabs', {
    current: 'first',

    items: ['first', 'second', 'third'],
})
```

Sekarang kami dapat mengakses atau mengubah datanya dari mana saja di halaman kami:

```html
<div x-data>
    <template x-for="tab in $store.tabs.items">
        ...
    </template>
</div>

<div x-data>
    <button @click="$store.tabs.current = 'first'">First Tab</button>
    <button @click="$store.tabs.current = 'second'">Second Tab</button>
    <button @click="$store.tabs.current = 'third'">Third Tab</button>
</div>
```

[→ Baca lebih lanjut tentang `Alpine.store()`](/globals/alpine-store)
