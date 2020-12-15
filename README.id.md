# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true)](https://alpinejs.codewithhugo.com/chat/)

Alpine.js menawarkan kepada Anda sifat reaktif dan deklaratif dari framework besar seperti Vue atau React dengan biaya yang jauh lebih rendah.

Anda bisa mempertahankan DOM Anda, dan taburkan dalam perilaku sesuai keinginan Anda.

Anggap saja seperti [Tailwind](https://tailwindcss.com/) untuk JavaScript.

> Catatan: Hampir seluruh sintaks dipinjam dari [Vue](https://vuejs.org/) (dan dengan ekstensi [Angular](https://angularjs.org/)). Saya selamanya berterima kasih atas hadiah mereka untuk web.

## Dokumentasi yang diterjemahkan

| Bahasa | Tautan untuk dokumentasi |
| --- | --- |
| Chinese Traditional | [**繁體中文說明文件**](./README.zh-TW.md) |
| Indonesian | [**Dokumentasi Bahasa Indonesia**](./README.id.md) |
| Japanese | [**日本語ドキュメント**](./README.ja.md) |
| Portuguese | [**Documentação em Português**](./README.pt.md) |
| Russian | [**Документация на русском**](./README.ru.md) |
| Spanish | [**Documentación en Español**](./README.es.md) |

## Instalasi

**Dari CDN:** Tambahkan skrip berikut ke akhir bagian `<head>` Anda.
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
```

Itu saja. Itu akan menginisialisasi dirinya sendiri.

Untuk lingkungan produksi, disarankan untuk memasang pin pada nomor versi tertentu di link untuk menghindari kerusakan yang tidak terduga dari versi yang lebih baru. Misalnya, untuk menggunakan versi `2.8.0` (terbaru):
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.0/dist/alpine.min.js" defer></script>
```

**Dari NPM:** Instal paket dari NPM.
```js
npm i alpinejs
```

Sertakan dalam skrip Anda.
```js
import 'alpinejs'
```

**Untuk dukungan IE11** Gunakan skrip berikut sebagai gantinya.
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
```

Pola di atas adalah pola modul / nomodule yang akan membuat bundel modern dimuat secara otomatis di browser modern, dan bundel IE11 dimuat secara otomatis di IE11 dan browser lama lainnya.

## Penggunaan

*Dropdown/Modal*
```html
<div x-data="{ open: false }">
    <button @click="open = true">Open Dropdown</button>

    <ul
        x-show="open"
        @click.away="open = false"
    >
        Dropdown Body
    </ul>
</div>
```

*Tabs*
```html
<div x-data="{ tab: 'foo' }">
    <button :class="{ 'active': tab === 'foo' }" @click="tab = 'foo'">Foo</button>
    <button :class="{ 'active': tab === 'bar' }" @click="tab = 'bar'">Bar</button>

    <div x-show="tab === 'foo'">Tab Foo</div>
    <div x-show="tab === 'bar'">Tab Bar</div>
</div>
```

Anda bahkan dapat menggunakannya untuk hal-hal yang tidak sepele: 
*Mengambil konten HTML dari dropdown terlebih dahulu saat mengarahkan kursor*
```html
<div x-data="{ open: false }">
    <button
        @mouseenter.once="
            fetch('/dropdown-partial.html')
                .then(response => response.text())
                .then(html => { $refs.dropdown.innerHTML = html })
        "
        @click="open = true"
    >Show Dropdown</button>

    <div x-ref="dropdown" x-show="open" @click.away="open = false">
        Loading Spinner...
    </div>
</div>
```

## Belajar

Ada 14 perintah yang tersedia untuk Anda:

| Perintah | Deskripsi |
| --- | --- |
| [`x-data`](#x-data) | Mendeklarasikan cakupan komponen baru. |
| [`x-init`](#x-init) | Menjalankan ekspresi saat komponen diinisialisasi. |
| [`x-show`](#x-show) | Merubah properti `display: none;` pada elemen tergantung pada ekspresi (true atau false). |
| [`x-bind`](#x-bind) | Menetapkan nilai atribut ke hasil ekspresi JS |
| [`x-on`](#x-on) | Melampirkan event listener ke elemen. Menjalankan ekspresi JS saat dipancarkan. |
| [`x-model`](#x-model) | Menambahkan "two-way data binding (pengikatan data dua arah)" ke sebuah elemen. Menjaga elemen masukan tetap sinkron dengan data komponen. |
| [`x-text`](#x-text) | Bekerja mirip dengan `x-bind`, tetapi akan memperbarui `innerText` dari sebuah elemen. |
| [`x-html`](#x-html) | Bekerja mirip dengan `x-bind`, tetapi akan memperbarui `innerHTML` dari sebuah elemen. |
| [`x-ref`](#x-ref) | Cara mudah untuk mengambil elemen DOM mentah dari komponen Anda. |
| [`x-if`](#x-if) | Hapus elemen sepenuhnya dari DOM. Harus digunakan pada tag `<template>`. |
| [`x-for`](#x-for) | Buat node DOM baru untuk setiap item dalam array. Harus digunakan pada tag `<template>`. |
| [`x-transition`](#x-transition) | Arahan untuk menerapkan kelas ke berbagai tahapan transisi elemen. |
| [`x-spread`](#x-spread) | Memungkinkan Anda mengikat objek arahan Alpine ke elemen agar dapat digunakan kembali dengan lebih baik. |
| [`x-cloak`](#x-cloak) | Atribut ini dihapus saat Alpine menginisialisasi. Berguna untuk menyembunyikan DOM yang sudah diinisialisasi. |

dan 6 properti-properti ajaib:

| Properti Ajaib | Deskripsi |
| --- | --- |
| [`$el`](#el) |  Ambil node DOM komponen akar. |
| [`$refs`](#refs) | Ambil elemen DOM yang ditandai dengan `x-ref` di dalam komponen. |
| [`$event`](#event) | Mengambil objek "Event" browser asli dalam event listener.  |
| [`$dispatch`](#dispatch) | Buat `CustomEvent` dan kirim menggunakan `.dispatchEvent()` secara internal. |
| [`$nextTick`](#nexttick) | Jalankan ekspresi tertentu SETELAH Alpine membuat pembaruan DOM reaktifnya. |
| [`$watch`](#watch) | Akan mengaktifkan callback yang diberikan saat properti komponen yang Anda "awasi" berubah. |


## Sponsor

<img width="33%" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" alt="Tailwind CSS">

**Ingin logo Anda di sini? [DM di Twitter](https://twitter.com/calebporzio)**

## Proyek Komunitas

* [AlpineJS Weekly Newsletter](https://alpinejs.codewithhugo.com/newsletter/)
* [Spruce (State Management)](https://github.com/ryangjchandler/spruce)
* [Turbolinks Adapter](https://github.com/SimoTod/alpine-turbolinks-adapter)
* [Alpine Magic Helpers](https://github.com/KevinBatdorf/alpine-magic-helpers)
* [Awesome Alpine](https://github.com/ryangjchandler/awesome-alpine)

### Perintah

---

### `x-data`

**Contoh:** `<div x-data="{ foo: 'bar' }">...</div>`

**Struktur:** `<div x-data="[object literal]">...</div>`

`x-data` mendeklarasikan cakupan komponen baru. Ini memberi tahu kerangka kerja untuk menginisialisasi komponen baru dengan objek data berikut.

Anggap saja seperti properti data dari komponen Vue.

**Ekstrak Logika Komponen**

Anda dapat mengekstrak data (dan perilaku) menjadi fungsi yang dapat digunakan kembali:

```html
<div x-data="dropdown()">
    <button x-on:click="open">Open</button>

    <div x-show="isOpen()" x-on:click.away="close">
        // Dropdown
    </div>
</div>

<script>
    function dropdown() {
        return {
            show: false,
            open() { this.show = true },
            close() { this.show = false },
            isOpen() { return this.show === true },
        }
    }
</script>
```

> **Untuk pengguna bundler**, perhatikan bahwa Alpine.js mengakses fungsi yang ada dalam cakupan global (`window`), Anda harus secara eksplisit menetapkan fungsi Anda ke `window` untuk menggunakannya dengan `x-data` misalnya `window.dropdown = function () {}` (ini karena dengan fungsi Webpack, Rollup, Parcel, dll. yang Anda tentukan akan secara default ke lingkup modul, bukan `window`).


Anda juga dapat mencampur beberapa objek data menggunakan penghancuran objek:

```html
<div x-data="{...dropdown(), ...tabs()}">
```

---

### `x-init`
**Contoh:** `<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`

**Struktur:** `<div x-data="..." x-init="[expression]"></div>`

`x-init` menjalankan ekspresi saat komponen diinisialisasi.

Jika Anda ingin menjalankan kode SETELAH Alpine telah melakukan pembaruan awal ke DOM (sesuatu seperti hook `mounted()` yang di VueJS), Anda dapat mengembalikan callback dari `x-init`, dan itu akan dijalankan setelah:

`x-init="() => { // kami memiliki akses ke status inisialisasi post-dom di sini // }"`

---

### `x-show`
**Contoh:** `<div x-show="open"></div>`

**Struktur:** `<div x-show="[expression]"></div>`

`x-show` mengubah gaya `display: none;` pada elemen tergantung apakah ekspresi ditetapkan ke `true` atau `false`.

**x-show.transition**

`x-show.transition` adalah API kenyamanan untuk membuat `x-show` Anda lebih menyenangkan menggunakan transisi CSS.

```html
<div x-show.transition="open">
    Konten ini akan ditransisikan masuk dan keluar.
</div>
```

| Perintah | Deskripsi |
| --- | --- |
| `x-show.transition` | Fade dan skala simultan. (opacity, scale: 0.95, timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), duration-in: 150ms, duration-out: 75ms)
| `x-show.transition.in` | Hanya transisi masuk. |
| `x-show.transition.out` | Hanya transisi keluar. |
| `x-show.transition.opacity` | Hanya menggunakan fade saja. |
| `x-show.transition.scale` | Hanya menggunakan timbangan saja. |
| `x-show.transition.scale.75` | Sesuaikan transformasi skala CSS `transform: scale(.75)`. |
| `x-show.transition.duration.200ms` | Menyetel transisi "masuk" ke 200ms. Transisi "keluar" akan disetel menjadi setengahnya (100ms). |
| `x-show.transition.origin.top.right` | Sesuaikan asal transformasi CSS `transform-origin: top right`. |
| `x-show.transition.in.duration.200ms.out.duration.50ms` | Durasi berbeda untuk "masuk" dan "keluar". |

> Catatan: Semua pengubah transisi ini dapat digunakan bersama satu sama lain. Ini mungkin (meskipun konyol lol): `x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale.95`

> Catatan: `x-show` akan menunggu setiap anak menyelesaikan transisi keluar. Jika Anda ingin mengabaikan perilaku ini, tambahkan modifer `.immediate`:
```html
<div x-show.immediate="open">
    <div x-show.transition="open">
</div>
```
---

### `x-bind`

> Catatan: Anda bebas menggunakan sintaks ":" yang lebih pendek: `:type = "..."`

**Contoh:** `<input x-bind:type="inputType">`

**Struktur:** `<input x-bind:[attribute]="[expression]">`

`x-bind` menyetel nilai atribut ke hasil ekspresi JavaScript. Ekspresi memiliki akses ke semua kunci objek data komponen, dan akan diperbarui setiap kali datanya diperbarui.

> Catatan: Binding atribut HANYA diperbarui ketika dependensinya diperbarui. Framework ini cukup pintar untuk mengamati perubahan data dan mendeteksi binding mana yang mempedulikannya.

**`x-bind` untuk atribut kelas**

`x-bind` berperilaku sedikit berbeda saat mengikat ke atribut class.

Untuk kelas, Anda meneruskan objek yang kuncinya adalah nama kelas, dan nilai adalah ekspresi boolean untuk menentukan apakah nama kelas tersebut diterapkan atau tidak.

Sebagai contoh:
`<div x-bind:class="{ 'hidden': foo }"></div>`

Dalam contoh ini, kelas "hidden" hanya akan diterapkan jika nilai atribut data `foo` adalah `true`.

**`x-bind` untuk atribut boolean**

`x-bind` mendukung atribut boolean dengan cara yang sama seperti atribut nilai, menggunakan variabel sebagai kondisi atau ekspresi JavaScript apa pun yang menghasilkan `true` atau `false`.

Sebagai contoh:
```html
<!-- Given: -->
<button x-bind:disabled="myVar">Click me</button>

<!-- When myVar == true: -->
<button disabled="disabled">Click me</button>

<!-- When myVar == false: -->
<button>Click me</button>
```

Ini akan menambah atau menghapus atribut `disabled` ketika `myVar` masing-masing bernilai `true` atau `false`.

Atribut Boolean didukung sesuai dengan [HTML spesifikasi](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute), sebagai contoh `disabled`, `readonly`, `required`, `checked`, `hidden`, `selected`, `open`, dll.

**pengubah `.camel`**

**Contoh:** `<svg x-bind:view-box.camel="viewBox">`

Pengubah `camel` akan mengikat kasus unta yang setara dengan nama atribut. Dalam contoh di atas, nilai `viewBox` akan terikat pada atribut `viewBox` sebagai lawan dari atribut `view-box`.

---

### `x-on`

> Catatan: Anda bebas menggunakan sintaks "@" yang lebih pendek: `@click="..."`

**Contoh:** `<button x-on:click="foo = 'bar'"></button>`

**Struktur:** `<button x-on:[event]="[expression]"></button>`

`x-on` melampirkan event listener ke elemen tempatnya dideklarasikan. Saat peristiwa itu dipancarkan, ekspresi JavaScript disetel sebagai nilainya dijalankan.

Jika ada data yang diubah dalam ekspresi, atribut elemen yang lain "bound" ke data ini, akan diperbarui.

> Catatan: Anda juga dapat menentukan nama fungsi JavaScript

**Contoh:** `<button x-on:click="myFunction"></button>`

Ini sama dengan: `<button x-on:click="myFunction($event)"></button>`

**pengubah `keydown`**

**Contoh:** `<input type="text" x-on:keydown.escape="open = false">`

Anda dapat menentukan kunci tertentu untuk didengarkan menggunakan pengubah keydown yang ditambahkan ke perintah `x-on: keydown`. Perhatikan bahwa pengubah adalah versi nilai `Event.key` berbasis kebab.

Contoh: `enter`, `escape`, `arrow-up`, `arrow-down`

> Catatan: Anda juga dapat mendengarkan kombinasi tombol pengubah sistem seperti: `x-on:keydown.cmd.enter="foo"`

**pengubah `.away`**

**Contoh:** `<div x-on:click.away="showModal = false"></div>`

Saat pengubah `.away` ada, pengendali kejadian hanya akan dijalankan ketika kejadian berasal dari sumber selain dirinya sendiri, atau turunannya.

Ini berguna untuk menyembunyikan dropdown dan modals saat pengguna mengkliknya.

**pengubah `.prevent`**

**Contoh:** `<input type="checkbox" x-on:click.prevent>`

Menambahkan `.prevent` ke pemroses acara akan memanggil `preventDefault` pada acara yang dipicu. Dalam contoh di atas, ini berarti kotak centang tidak akan benar-benar dicentang ketika pengguna mengkliknya.

**pengubah `.stop`**

**Contoh:** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

Menambahkan `.stop` ke event listener akan memanggil `stopPropagation` pada event yang dipicu. Dalam contoh di atas, ini berarti peristiwa "click" tidak akan menggelembung dari tombol ke luar `<div>`. Atau dengan kata lain, saat pengguna mengklik tombol, `foo` tidak akan disetel ke `'bar'`.

**pengubah `.self`**

**Contoh:** `<div x-on:click.self="foo = 'bar'"><button></button></div>`

Menambahkan `.self` ke pemroses acara hanya akan memicu penangan jika `$event.target` adalah elemen itu sendiri. Dalam contoh di atas, ini berarti peristiwa "klik" yang menggelembung dari tombol ke luar `<div>` **tidak akan** menjalankan penangan.

**pengubah `.window`**

**Contoh:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

Menambahkan `.window` ke event listener akan menginstal listener di objek global window, bukan di simpul DOM tempat ia dideklarasikan. Ini berguna ketika Anda ingin mengubah status komponen ketika sesuatu berubah dengan jendela, seperti acara pengubahan ukuran. Dalam contoh ini, ketika jendela tumbuh lebih besar dari lebar 768 piksel, kami akan menutup modal / dropdown, jika tidak, pertahankan status yang sama.

>Catatan: Anda juga bisa menggunakan pengubah `.document` untuk melampirkan listener ke `dokumen`, bukan `window`

**pengubah `.once`**

**Contoh:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

Menambahkan pengubah `.once` ke event listener akan memastikan bahwa listener hanya akan ditangani satu kali. Ini berguna untuk hal-hal yang hanya ingin Anda lakukan sekali, seperti mengambil sebagian HTML dan semacamnya.

**pengubah `.passive`**

**Contoh:** `<button x-on:mousedown.passive="interactive = true"></button>`

Menambahkan `.passive` modifier ke event listener akan membuat pemroses menjadi pasif, yang berarti `preventDefault()` tidak akan berfungsi pada acara apa pun yang sedang diproses, hal ini dapat membantu, misalnya dengan kinerja scroll pada perangkat sentuh.

**pengubah `.debounce`**

**Contoh:** `<input x-on:input.debounce="fetchSomething()">`

Pengubah `debounce` memungkinkan Anda untuk "melepaskan" pengendali event. Dengan kata lain, event handler TIDAK akan berjalan hingga waktu tertentu berlalu sejak event terakhir yang diaktifkan. Saat penangan siap dipanggil, pemanggilan penangan terakhir akan dijalankan.

Waktu "tunggu" debounce default adalah 250 milidetik.

Jika Anda ingin menyesuaikan ini, Anda dapat menentukan waktu tunggu khusus seperti:

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

**pengubah `.camel`**

**Contoh:** `<input x-on:event-name.camel="doSomething()">`

Pengubah `camel` akan melampirkan pendengar acara untuk nama acara yang setara dengan kasus unta. Dalam contoh di atas, ekspresi akan dievaluasi ketika event `eventName` diaktifkan pada elemen.

---

### `x-model`
**Contoh:** `<input type="text" x-model="foo">`

**Struktur:** `<input type="text" x-model="[data item]">`

`x-model` menambahkan "pengikatan data dua arah" ke elemen. Dengan kata lain, nilai elemen input akan tetap sinkron dengan nilai item data komponen.

> Catatan: `x-model` cukup pintar untuk mendeteksi perubahan pada input teks, kotak centang, tombol radio, textarea, pemilihan, dan beberapa pilihan. Ini harus berperilaku [seperti Vue](https://vuejs.org/v2/guide/forms.html) dalam skenario tersebut.

**pengubah `.number`**
**Contoh:** `<input x-model.number="age">`

Pengubah angka akan mengubah nilai input menjadi angka. Jika nilai tidak dapat diurai sebagai angka yang valid, nilai asli dikembalikan.

**pengubah `.debounce`**
**Contoh:** `<input x-model.debounce="search">`

Pengubah `debounce` memungkinkan Anda menambahkan "debounce" ke pembaruan nilai. Dengan kata lain, event handler TIDAK akan berjalan hingga waktu tertentu berlalu sejak event terakhir yang diaktifkan. Saat penangan siap dipanggil, pemanggilan penangan terakhir akan dijalankan.

Waktu "tunggu" debounce default adalah 250 milidetik.

Jika Anda ingin menyesuaikan ini, Anda dapat menentukan waktu tunggu khusus seperti:

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

---

### `x-text`
**Contoh:** `<span x-text="foo"></span>`

**Struktur:** `<span x-text="[expression]"`

`x-text` bekerja mirip dengan `x-bind`, kecuali memperbarui nilai atribut, itu akan memperbarui `innerText` dari sebuah elemen.

---

### `x-html`
**Contoh:** `<span x-html="foo"></span>`

**Struktur:** `<span x-html="[expression]"`

`x-html` bekerja mirip dengan `x-bind`, kecuali untuk memperbarui nilai atribut, itu akan memperbarui `innerHTML` dari sebuah elemen.

> :warning: **Hanya gunakan pada konten tepercaya dan jangan pernah pada konten yang disediakan pengguna.** :warning:
>
> Merender HTML secara dinamis dari pihak ketiga dapat dengan mudah menyebabkan kerentanan [XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting).

---

### `x-ref`
**Contoh:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**Struktur:** `<div x-ref="[ref name]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`

`x-ref` menyediakan cara mudah untuk mengambil elemen DOM mentah dari komponen Anda. Dengan menyetel atribut `x-ref` pada sebuah elemen, Anda membuatnya tersedia untuk semua penangan kejadian di dalam sebuah objek yang disebut `$refs`.

Ini adalah alternatif yang berguna untuk menyetel id dan menggunakan `document.querySelector` di semua tempat.

> Catatan: Anda juga dapat mengikat nilai dinamis untuk x-ref: `<span: x-ref = "item.id"> </span>` jika perlu.

---

### `x-if`
**Contoh:** `<template x-if="true"><div>Some Element</div></template>`

**Struktur:** `<template x-if="[expression]"><div>Some Element</div></template>`

Untuk kasus di mana `x-show` tidak cukup (`x-show` menyetel elemen ke `display: none` if false), `x-if` dapat digunakan untuk benar-benar menghapus elemen sepenuhnya dari DOM.

Penting bahwa `x-if` digunakan pada tag `<template></template>` karena Alpine tidak menggunakan DOM virtual. Implementasi ini memungkinkan Alpine untuk tetap bertahan dan menggunakan DOM asli untuk melakukan keajaibannya.

> Catatan: `x-if` harus memiliki root elemen tunggal di dalam tag `<template></template>`.

> Catatan: Saat menggunakan `template` di tag `svg`, Anda perlu menambahkan [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) yang harus dijalankan sebelum Alpine.js diinisialisasi.
---

### `x-for`
**Contoh:**
```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

> Catatan: pengikat `:key` bersifat opsional, tetapi SANGAT disarankan.

`x-for` tersedia untuk kasus ketika Anda ingin membuat simpul DOM baru untuk setiap item dalam larik. Ini akan tampak mirip dengan `v-for` di Vue, dengan satu pengecualian yaitu harus ada di tag `template`, dan bukan elemen DOM biasa.

Jika Anda ingin mengakses indeks iterasi saat ini, gunakan sintaks berikut:

```html
<template x-for="(item, index) in items" :key="index">
    <!-- You can also reference "index" inside the iteration if you need. -->
    <div x-text="index"></div>
</template>
```

Jika Anda ingin mengakses objek array (kumpulan) dari iterasi, gunakan sintaks berikut:

```html
<template x-for="(item, index, collection) in items" :key="index">
    <!-- You can also reference "collection" inside the iteration if you need. -->
    <!-- Current item. -->
    <div x-text="item"></div>
    <!-- Same as above. -->
    <div x-text="collection[index]"></div>
    <!-- Previous item. -->
    <div x-text="collection[index - 1]"></div>
</template>
```

> Catatan: `x-for` harus memiliki root elemen tunggal di dalam tag `<template></template>`.

> Catatan: Saat menggunakan `template` di tag `svg`, Anda perlu menambahkan [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) yang harus dijalankan sebelum Alpine.js diinisialisasi.

#### Nesting `x-for`s
Anda dapat melapisi pengulangan `x-for`, tetapi Anda HARUS membungkus setiap pengulangan dalam sebuah elemen. Sebagai contoh:

```html
<template x-for="item in items">
    <div>
        <template x-for="subItem in item.subItems">
            <div x-text="subItem"></div>
        </template>
    </div>
</template>
```

#### Iterasi dalam rentang tertentu

Alpine mendukung sintaks `i in n`, di mana `n` adalah bilangan bulat, memungkinkan Anda untuk melakukan iterasi pada rentang elemen yang tetap.

```html
<template x-for="i in 10">
    <span x-text="i"></span>
</template>
```

---

### `x-transition`
**Contoh:**
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

```html
<template x-if="open">
    <div
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0 transform scale-90"
        x-transition:enter-end="opacity-100 transform scale-100"
        x-transition:leave="transition ease-in duration-300"
        x-transition:leave-start="opacity-100 transform scale-100"
        x-transition:leave-end="opacity-0 transform scale-90"
    >...</div>
</template>
```

> Contoh di atas menggunakan kelas dari [Tailwind CSS](https://tailwindcss.com)

Alpine menawarkan 6 arahan transisi berbeda untuk menerapkan kelas ke berbagai tahap transisi elemen antara status "tersembunyi" dan "ditampilkan". Arahan ini bekerja dengan `x-show` DAN `x-if`.

Ini berperilaku persis seperti arahan transisi VueJs, kecuali mereka memiliki nama yang berbeda dan lebih masuk akal:

| Perintah | Deskripsi |
| --- | --- |
| `:enter` | Diterapkan selama seluruh fase masuk. |
| `:enter-start` | Ditambahkan sebelum elemen dimasukkan, dihapus satu bingkai setelah elemen dimasukkan. |
| `:enter-end` | Menambahkan satu bingkai setelah elemen dimasukkan (pada saat yang sama `enter-start` dihapus), dihapus ketika transisi / animasi selesai.
| `:leave` | Diterapkan selama seluruh fase keluar. |
| `:leave-start` | Ditambahkan segera ketika transisi keluar dipicu, dihapus setelah satu frame. |
| `:leave-end` | Ditambahkan satu frame setelah transisi keluar dipicu (pada saat yang sama `leave-start` dihapus), dihapus ketika transisi / animasi selesai.

---

### `x-spread`
**Contoh:**
```html
<div x-data="dropdown()">
    <button x-spread="trigger">Open Dropdown</button>

    <span x-spread="dialogue">Dropdown Contents</span>
</div>

<script>
    function dropdown() {
        return {
            open: false,
            trigger: {
                ['@click']() {
                    this.open = true
                },
            },
            dialogue: {
                ['x-show']() {
                    return this.open
                },
                ['@click.away']() {
                    this.open = false
                },
            }
        }
    }
</script>
```

`x-spread` memungkinkan Anda untuk mengekstrak binding Alpine sebuah elemen menjadi objek yang dapat digunakan kembali.

Kunci objek adalah arahan (Bisa berupa arahan apa pun termasuk pengubah), dan nilainya adalah callback untuk dievaluasi oleh Alpine.

> Catatan: Ada beberapa peringatan untuk x-spread:
> - Jika direktif yang menjadi "spread" adalah `x-for`, Anda harus mengembalikan string ekspresi normal dari callback. Misalnya: `['x-for'] () {return 'item in items'}`.
> - `x-data` dan `x-init` tidak dapat digunakan di dalam objek "spread"

---

### `x-cloak`
**Contoh:** `<div x-data="{}" x-cloak></div>`

`x-cloak` atribut dihapus dari elemen saat Alpine menginisialisasi. Ini berguna untuk menyembunyikan DOM yang telah diinisialisasi sebelumnya. Biasanya untuk menambahkan gaya global berikut agar ini berfungsi:

```html
<style>
    [x-cloak] { display: none; }
</style>
```

### Properti Ajaib

> Dengan pengecualian `$el`, properti ajaib tidak tersedia dalam `x-data` karena komponen belum diinisialisasi.

---

### `$el`
**Contoh:**
```html
<div x-data>
    <button @click="$el.innerHTML = 'foo'">Replace me with "foo"</button>
</div>
```

`$el` adalah properti ajaib yang bisa digunakan untuk mengambil simpul DOM komponen akar.

### `$refs`
**Contoh:**
```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

`$refs` adalah properti ajaib yang bisa digunakan untuk mengambil elemen DOM yang ditandai dengan `x-ref` di dalam komponen. Ini berguna saat Anda perlu memanipulasi elemen DOM secara manual.

---

### `$event`
**Contoh:**
```html
<input x-on:input="alert($event.target.value)">
```

`$event` adalah properti ajaib yang bisa digunakan dalam event listener untuk mengambil objek "Event" dari browser asli.

> Catatan: Properti $event hanya tersedia dalam ekspresi DOM.

If you need to access $event inside of a JavaScript function you can pass it in directly:

`<button x-on:click="myFunction($event)"></button>`

---

### `$dispatch`
**Contoh:**
```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
    <!-- When clicked, will console.log "bar" -->
</div>
```

**Catatan tentang Propagasi Peristiwa**

Perhatikan bahwa, karena [peristiwa menggelegak](https://en.wikipedia.org/wiki/Event_bubbling), saat Anda perlu merekam peristiwa yang dikirim dari node yang berada di bawah hierarki bersarang yang sama, Anda harus menggunakan pengubah [`.window`](https://github.com/alpinejs/alpine#x-on) :

**Contoh:**

```html
<div x-data>
    <span @custom-event="console.log($event.detail.foo)"></span>
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
<div>
```

> Ini tidak akan berfungsi karena saat `custom-event` dikirim, itu akan disebarkan ke leluhur yang sama, `div`.

**Pengiriman ke Komponen**

Anda juga dapat memanfaatkan teknik sebelumnya untuk membuat komponen Anda saling berhubungan:

**Contoh:**

```html
<div x-data @custom-event.window="console.log($event.detail)"></div>

<button x-data @click="$dispatch('custom-event', 'Hello World!')">
<!-- Saat diklik, akan console.log "Hello World!". -->
```

`$dispatch` adalah jalan pintas untuk membuat `CustomEvent` dan mengirimkannya menggunakan `.dispatchEvent()` secara internal. Ada banyak kasus penggunaan yang baik untuk meneruskan data di sekitar dan di antara komponen menggunakan peristiwa khusus. [Baca di sini](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) untuk informasi lebih lanjut tentang sistem `CustomEvent` yang mendasari di browser.

Anda akan melihat bahwa setiap data yang diteruskan sebagai parameter kedua ke `$dispatch('some-event', { some: 'data' })`, tersedia melalui properti "detail" event baru: $ event.detail.some. Melampirkan data peristiwa khusus ke properti .detail adalah praktik standar untuk `CustomEvents` di browser. [Baca di sini](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail) untuk info lebih lanjut.

Anda juga dapat menggunakan `$dispatch()` untuk memicu pembaruan data untuk binding `x-model`. Sebagai contoh:

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')">
        <!-- After the button is clicked, `x-model` will catch the bubbling "input" event, and update foo to "baz". -->
    </span>
</div>
```

> Catatan: Properti $dispatch hanya tersedia dalam ekspresi DOM.

Jika Anda perlu mengakses $dispatch di dalam fungsi JavaScript, Anda dapat mengirimkannya secara langsung:

`<button x-on:click="myFunction($dispatch)"></button>`

---

### `$nextTick`
**Contoh:**
```html
<div x-data="{ fruit: 'apple' }">
    <button
        x-on:click="
            fruit = 'pear';
            $nextTick(() => { console.log($event.target.innerText) });
        "
        x-text="fruit"
    ></button>
</div>
```

`$nextTick` adalah properti ajaib yang memungkinkan Anda untuk hanya mengeksekusi ekspresi tertentu SETELAH Alpine melakukan pembaruan DOM reaktifnya. Ini berguna pada saat Anda ingin berinteraksi dengan status DOM SETELAH itu tercermin setiap pembaruan data yang Anda buat.

---

### `$watch`
**Contoh:**
```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```

Anda bisa "menonton" properti komponen dengan metode ajaib $watch. Dalam contoh di atas, ketika tombol diklik dan `buka` diubah, callback yang disediakan akan aktif dan `console.log` nilai baru.

## Keamanan
Jika Anda menemukan kerentanan keamanan, silakan kirim email ke [calebporzio@gmail.com]()

Alpine mengandalkan implementasi kustom yang menggunakan objek Function untuk mengevaluasi arahannya. Meskipun lebih aman daripada `eval()`, penggunaannya dilarang di beberapa lingkungan, seperti Aplikasi Google Chrome, menggunakan Kebijakan Keamanan Konten yang membatasi.

Jika Anda menggunakan Alpine di situs web yang berurusan dengan data sensitif dan membutuhkan [CSP](https://csp.withgoogle.com/docs/strict-csp.html), Anda perlu menyertakan `unsafe-eval` dalam kebijakan Anda. Kebijakan kuat yang dikonfigurasi dengan benar akan membantu melindungi pengguna Anda saat menggunakan data pribadi atau keuangan.

Karena kebijakan berlaku untuk semua skrip di halaman Anda, penting agar pustaka eksternal lain yang termasuk dalam situs web ditinjau dengan cermat untuk memastikan bahwa mereka dapat dipercaya dan tidak akan menimbulkan kerentanan Cross Site Scripting baik menggunakan fungsi `eval()` atau memanipulasi DOM untuk memasukkan kode berbahaya ke halaman Anda.

## Tujuan selanjutnya di V3
* Pindah dari `x-ref` ke `ref` untuk paritas Vue?
* Menambahkan `Alpine.directive()`
* Menambahkan `Alpine.component('foo', {...})` (Dengan metode ajaib `__init()`)
* Mengirim peristiwa Alpine untuk "loaded", "transition-start", dll ... ([#299](https://github.com/alpinejs/alpine/pull/299)) ?
* Menghapus "object" (dan array) sintaks dari `x-bind:class="{ 'foo': true }"` ([#236](https://github.com/alpinejs/alpine/pull/236) untuk menambah dukungan untuk sintaks objek untuk atribut `style`)
* Memperbaiki `x-for` reaktivitas mutasi ([#165](https://github.com/alpinejs/alpine/pull/165))
* Menambahkan "deep watching" dukungan di V3 ([#294](https://github.com/alpinejs/alpine/pull/294))
* Menambahkan jalan pintas `$el`
* Perubahan `@click.away` ke `@click.outside`?

## Lisensi

hak cipta © 2019-2020 Caleb Porzio dan kontributor

Berlisensi di bawah lisensi MIT, lihat [LICENSE.md](LICENSE.md) untuk detailnya.
