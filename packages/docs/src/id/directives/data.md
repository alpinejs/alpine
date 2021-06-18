---
order: 1
title: data
---

# `x-data`

Segala sesuatu di Alpine dimulai dengan direktif `x-data`.

`x-data` mendefinisikan sepotong HTML sebagai komponen Alpine dan menyediakan data reaktif untuk referensi komponen tersebut.

Berikut adalah contoh komponen dropdown yang dibuat-buat:

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle Content</button>

    <div x-show="open">
        Content...
    </div>
</div>
```

Jangan khawatir tentang direktif lain dalam contoh ini (`@click` dan `x-show`), kita akan membahasnya sebentar lagi.  Untuk saat ini, mari kita fokus pada `x-data`.

<a name="scope"></a>
## Cakupan

Properti yang didefinisikan dalam direktif `x-data` tersedia untuk semua turunan elemen.  Bahkan yang ada di dalam komponen `x-data` lainnya yang bersarang.

Sebagai contoh:

```html
<div x-data="{ foo: 'bar' }">
    <span x-text="foo"><!-- Will output: "bar" --></span>

    <div x-data="{ bar: 'baz' }">
        <span x-text="foo"><!-- Will output: "bar" --></span>

        <div x-data="{ foo: 'bob' }">
            <span x-text="foo"><!-- Will output: "bob" --></span>
        </div>
    </div>
</div>
```

<a name="methods"></a>
## Metode

Karena `x-data` dievaluasi sebagai objek JavaScript normal, selain status, Anda dapat menyimpan metode dan bahkan getter.

Misalnya, mari kita ekstrak perilaku "Toggle Content" ke dalam metode di `x-data`.

```html
<div x-data="{ open: false, toggle() { this.open = ! this.open } }">
    <button @click="toggle()">Toggle Content</button>

    <div x-show="open">
        Content...
    </div>
</div>
```

Perhatikan penambahan `toggle() { this.open = !  this.open }` metode pada `x-data`. Metode ini sekarang dapat dipanggil dari mana saja di dalam komponen.

Anda juga akan melihat penggunaan `this.` untuk mengakses status pada objek itu sendiri. Ini karena Alpine mengevaluasi objek data ini seperti objek JavaScript standar dengan konteks `ini`.

Jika mau, Anda dapat mengabaikan tanda kurung pemanggil dari metode `toggle` sepenuhnya. Sebagai contoh:

```html
<!-- Before -->
<button @click="toggle()">...</button>

<!-- After -->
<button @click="toggle">...</button>
```

<a name="getters"></a>
## Getters

JavaScript [getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) berguna ketika satu-satunya tujuan metode adalah mengembalikan data berdasarkan status lain.

Pikirkan mereka seperti "properti yang dihitung" (walaupun, mereka tidak di-cache seperti properti yang dihitung dari Vue).

Mari kita refactor komponen kita untuk menggunakan getter yang disebut `isOpen` daripada mengakses `open` secara langsung.

```html
<div x-data="{
  open: false,
  get isOpen() { return this.open },
  toggle() { this.open = ! this.open },
}">
    <button @click="toggle()">Toggle Content</button>

    <div x-show="isOpen">
        Content...
    </div>
</div>
```

Perhatikan bahwa "Konten" sekarang bergantung pada pengambil `isOpen` alih-alih properti `open` secara langsung.

Dalam hal ini tidak ada manfaat nyata.  Namun dalam beberapa kasus, getter berguna untuk menyediakan sintaks yang lebih ekspresif dalam komponen Anda.

<a name="data-less-components"></a>
## Komponen tanpa data

Terkadang, Anda ingin membuat komponen Alpine, tetapi Anda tidak memerlukan data apa pun.

Dalam kasus ini, Anda selalu dapat memasukkan objek kosong.

```html
<div x-data="{}"...
```

Namun, jika diinginkan, Anda juga dapat menghilangkan nilai atribut seluruhnya jika terlihat lebih baik bagi Anda.

```html
<div x-data...
```

<a name="single-element-components"></a>
## Komponen elemen tunggal

Terkadang Anda mungkin hanya memiliki satu elemen di dalam komponen Alpine Anda, seperti berikut ini:

```html
<div x-data="{ open: true }">
    <button @click="open = false" x-show="open">Hide Me</button>
</div>
```

Dalam kasus ini, Anda dapat mendeklarasikan `x-data` secara langsung pada elemen tunggal tersebut:

```html
<button x-data="{ open: true }" @click="open = false" x-show="show">
    Hide Me
</button>
```

<a name="re-usable-data"></a>
## Data yang dapat digunakan kembali

Jika Anda mendapati diri Anda menduplikasi konten `x-data`, atau Anda menemukan sintaks sebaris verbose, Anda dapat mengekstrak objek `x-data` ke komponen khusus menggunakan `Alpine.data`.

Berikut ini contoh singkatnya:

```html
<div x-data="dropdown">
    <button @click="toggle">Toggle Content</button>

    <div x-show="open">
        Content...
    </div>
</div>

<script>
    document.addEventListener('alpine:initializing', () => {
        Alpine.data('dropdown', () => ({
            open: false,

            toggle() {
                this.open = ! this.open
            },
        }))
    })
</script>
```

[→ Baca lebih lanjut tentang `Alpine.data(...)`](/globals/alpine-data)
