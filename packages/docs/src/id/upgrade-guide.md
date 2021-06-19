---
order: 2
title: Upgrade From V2
---

# Tingkatkan dari V2

Memutakhirkan dari Alpine V2 ke V3 seharusnya tidak menimbulkan rasa sakit. Dalam banyak kasus, TIDAK ADA yang harus dilakukan pada basis kode Anda untuk menggunakan V3. Di bawah ini adalah daftar lengkap tentang perubahan dan penghentian yang melanggar dalam urutan menurun tentang seberapa besar kemungkinan pengguna akan terpengaruh olehnya:

> Perhatikan jika Anda menggunakan Laravel Livewire dan Alpine bersama-sama, untuk menggunakan V3 dari Alpine, Anda perlu meningkatkan ke Livewire v2.5.1 atau lebih tinggi.

<a name="breaking-changes"></a>
## Perubahan Terbaru
* [`$el` sekarang selalu menjadi elemen saat ini](#el-no-longer-root)
* [Secara otomatis mengevaluasi fungsi `init()` yang ditentukan pada objek data](#auto-init)
* [Perlu memanggil `Alpine.start()` setelah impor](#need-to-call-alpine-start)
* [`x-show.transition` sekarang `x-transition`](#removed-show-dot-transition)
* [`x-if` tidak lagi mendukung `x-transition`](#x-if-no-transitions)
* [`x-data` lingkup berjenjang](#x-data-scope)
* [`x-init` tidak lagi menerima pengembalian panggilan balik](#x-init-no-callback)
* [Mengembalikan `false` dari event handler tidak lagi secara implisit "preventDefault"s](#no-false-return-from-event-handlers)
* [`x-spread` sekarang `x-bind`](#x-spread-is-now-x-bind)
* [Gunakan peristiwa siklus hidup global sebagai ganti `Alpine.deferLoadingAlpine()`](#use-global-events-now)
* [IE11 tidak lagi didukung](#no-ie-11)
* [`x-html` telah dihapus](#no-x-html)

<a name="el-no-longer-root"></a>
### `$el` sekarang selalu menjadi elemen saat ini

`$el` sekarang selalu mewakili elemen tempat ekspresi dieksekusi, bukan elemen akar komponen. Ini akan menggantikan sebagian besar penggunaan `x-ref` dan dalam kasus di mana Anda masih ingin mengakses root suatu komponen, Anda dapat melakukannya menggunakan `x-ref`. Sebagai contoh:

```html
<!-- 🚫 Before -->
<div x-data>
    <button @click="console.log($el)"></button>
    <!-- In V2, $el would have been the <div>, now it's the <button> -->
</div>

<!-- ✅ After -->
<div x-data x-ref="root">
    <button @click="console.log($refs.root)"></button>
</div>
```

Untuk pengalaman peningkatan yang lebih lancar, Anda dapat secara opsional mengganti semua instance `$el` dengan keajaiban khusus yang disebut `$root`, lalu tambahkan kode berikut ke situs Anda untuk meniru perilaku:

```html
<script>
    document.addEventListener('alpine:initializing', () => {
        Alpine.magic('root', el => {
            let closestRootEl = (node) => {
                if (node.hasAttribute('x-data')) return node

                return closestRootEl(node.parentNode)
            }

            return closestRootEl(el)
        })
    })
</script>
```

[→ Baca lebih lanjut tentang $el di V3](/magics/el)

<a name="auto-init"></a>
### Secara otomatis mengevaluasi fungsi `init()` yang ditentukan pada objek data

Pola umum di V2 adalah secara manual memanggil `init()` (atau metode bernama serupa) pada objek `x-data`.

Di V3, Alpine akan secara otomatis memanggil metode `init()` pada objek data.

```html
<!-- 🚫 Before -->
<div x-data="foo()" x-init="init()"></div>

<!-- ✅ After -->
<div x-data="foo()"></div>

<script>
    function foo() {
        return {
            init() {
                //
            }
        }
    }
</script>
```

[→ Baca lebih lanjut tentang fungsi init evaluasi otomatis](/globals/alpine-data#init-functions)

<a name="need-to-call-alpine-start"></a>
### Perlu memanggil Alpine.start() setelah impor

Jika Anda mengimpor Alpine V2 dari NPM, Anda sekarang perlu memanggil `Alpine.start()` secara manual untuk V3. Ini tidak memengaruhi Anda jika Anda menggunakan file build Alpine atau CDN dari tag `<template>`.

```js
// 🚫 Before
import 'alpinejs'

// ✅ After
import Alpine from 'alpinejs'

window.Alpine = Alpine

Alpine.start()
```

[→ Baca lebih lanjut tentang menginisialisasi Alpine V3](/essentials/installation#as-a-module)

<a name="removed-show-dot-transition"></a>
### `x-show.transition` sekarang `x-transition`

Semua kemudahan yang disediakan oleh helper `x-show.transition...` masih tersedia, tetapi sekarang dari API yang lebih terpadu: `x-transition`:

```html
<!-- 🚫 Before -->
<div x-show.transition="open"></div>
<!-- ✅ After -->
<div x-show="open" x-transition></div>

<!-- 🚫 Before -->
<div x-show.transition.duration.500ms="open"></div>
<!-- ✅ After -->
<div x-show="open" x-transition.duration.500ms></div>

<!-- 🚫 Before -->
<div x-show.transition.in.duration.500ms.out.duration.750ms="open"></div>
<!-- ✅ After -->
<div
    x-show="open"
    x-transition:enter.duration.500ms
    x-transition:leave.duration.750ms
></div>
```

[→ Baca lebih lanjut tentang x-transition](/directives/transition)

<a name="x-if-no-transitions"></a>
### `x-if` tidak lagi mendukung `x-transition`

Kemampuan untuk mentransisikan elemen dan menambahkan sebelum/setelah dihapus dari DOM tidak lagi tersedia di Alpine.

Ini adalah fitur yang sangat sedikit orang yang tahu keberadaannya apalagi digunakan.

Karena sistem transisinya rumit, lebih masuk akal dari perspektif pemeliharaan untuk hanya mendukung elemen transisi dengan `x-show`.

```html
<!-- 🚫 Before -->
<template x-if.transition="open">
    <div>...</div>
</template>

<!-- ✅ After -->
<div x-show="open" x-transition>...</div>
```

[→ Baca lebih lanjut tentang x-if](/directives/if)

<a name="x-data-scope"></a>
### `x-data` lingkup berjenjang

Cakupan yang ditentukan dalam `x-data` kini tersedia untuk semua turunan kecuali ditimpa oleh ekspresi `x-data` bertingkat.

```html
<!-- 🚫 Before -->
<div x-data="{ foo: 'bar' }">
    <div x-data="{}">
        <!-- foo is undefined -->
    </div>
</div>

<!-- ✅ After -->
<div x-data="{ foo: 'bar' }">
    <div x-data="{}">
        <!-- foo is 'bar' -->
    </div>
</div>
```

[→ Baca lebih lanjut tentang pelingkupan x-data](/directives/data#scope)

<a name="x-init-no-callback"></a>
### `x-init` tidak lagi menerima pengembalian panggilan balik

Sebelum V3, jika `x-init` menerima nilai kembalian yaitu `typeof` "function", itu akan mengeksekusi callback setelah Alpine selesai menginisialisasi semua arahan lain di pohon. Sekarang, Anda harus memanggil `$nextTick()` secara manual untuk mencapai perilaku itu. `x-init` tidak lagi "mengembalikan nilai".

```html
<!-- 🚫 Before -->
<div x-data x-init="() => { ... }">...</div>

<!-- ✅ After -->
<div x-data x-init="$nextTick(() => { ... })">...</div>
```

[→ Baca lebih lanjut tentang $nextTick](/magics/next-tick)

<a name="no-false-return-from-event-handlers"></a>
### Mengembalikan `false` dari event handler tidak lagi secara implisit "preventDefault"s

Alpine V2 mengamati nilai kembalian `false` sebagai keinginan untuk menjalankan `preventDefault` pada acara tersebut.  Ini sesuai dengan perilaku standar pendengar inline asli: `<... oninput="someFunctionThatReturnsFalse()">`. Alpine V3 tidak lagi mendukung API ini.  (Kebanyakan orang tidak tahu itu ada dan karena itu adalah perilaku yang mengejutkan.

```html
<!-- 🚫 Before -->
<div x-data="{ blockInput() { return false } }">
    <input type="text" @input="blockInput()">
</div>

<!-- ✅ After -->
<div x-data="{ blockInput(e) { e.preventDefault() }">
    <input type="text" @input="blockInput($event)">
</div>
```

[→ Baca lebih lanjut tentang x-on](/directives/on)

<a name="x-spread-now-x-bind"></a>
### `x-spread` sekarang `x-bind`

Salah satu cerita Alpine untuk menggunakan kembali fungsionalitas adalah mengabstraksi arahan Alpine ke dalam objek dan menerapkannya ke elemen dengan `x-spread`. Perilaku ini masih sama, kecuali sekarang `x-bind` (tanpa atribut yang ditentukan) adalah API, bukan `x-spread`.

```html
<!-- 🚫 Before -->
<div x-data="dropdown()">
    <button x-spread="trigger">Toggle</button>

    <div x-spread="dialogue">...</div>
</div>

<!-- ✅ After -->
<div x-data="dropdown()">
    <button x-bind="trigger">Toggle</button>

    <div x-bind="dialogue">...</div>
</div>


<script>
    function dropdown() {
        return {
            open: false,

            trigger: {
                'x-on:click'() { this.open = ! this.open },
            },

            dialogue: {
                'x-show'() { return this.open },
                'x-bind:class'() { return 'foo bar' },
            },
        }
    }
</script>
```

[→ Baca lebih lanjut tentang direktif pengikatan menggunakan x-bind](/directives/bind#bind-directives)

<a name="use-global-events-now"></a>
### Gunakan peristiwa siklus hidup global alih-alih `Alpine.deferLoadingAlpine()`

```html
<!-- 🚫 Before -->
<script>
    window.deferLoadingAlpine = startAlpine => {
        // Will be executed before initializing Alpine.

        startAlpine()

        // Will be executed after initializing Alpine.
    }
</script>

<!-- ✅ After -->
<script>
    document.addEventListener('alpine:initializing', () => {
        // Will be executed before initializing Alpine.
    })

    document.addEventListener('alpine:initialized', () => {
        // Will be executed after initializing Alpine.
    })
</script>
```

[→ Baca lebih lanjut tentang peristiwa siklus hidup Alpine](/essentials/lifecycle#alpine-initialization)

<a name="no-ie-11"></a>
### IE11 tidak lagi didukung

Alpine tidak akan lagi secara resmi mendukung Internet Explorer 11. Jika Anda memerlukan dukungan untuk IE11, kami sarankan untuk tetap menggunakan Alpine V2.

<a name="no-x-html"></a>
### `x-html` telah dihapus

`x-html` adalah direktif yang jarang digunakan di Alpine V2. Dalam upaya untuk menjaga API tetap ramping hanya untuk fitur-fitur berharga, V3 menghapus arahan ini.

Namun, menggunakan API arahan kustom baru V3, mudah saja untuk memperkenalkan kembali fungsi ini menggunakan polyfill berikut:

```html
<!-- 🚫 Before -->
<div x-data="{ someHtml: '<h1>...</h1>' }">
    <div x-html="someHTML">
</div>

<!-- ✅ After -->
<!-- The above will now work with the following script added to the page: -->
<script>
    document.addEventListener('alpine:initializing', () => {
        Alpine.directive('html', (el, { expression }, { evaluateLater, effect }) => {
            let getHtml = evaluateLater(expression)

            effect(() => {
                getHtml(html => {
                    el.innerHTML = html
                })
            })
        })
    })
</script>
```

## API yang tidak digunakan lagi

2 API berikut akan tetap berfungsi di V3, tetapi dianggap tidak digunakan lagi dan kemungkinan akan dihapus di masa mendatang.

<a name="away-replace-with-outside"></a>
### Pengubah event listener `.away` harus diganti dengan `.outside`

```html
<!-- 🚫 Before -->
<div x-show="open" @click.away="open = false">
    ...
</div>

<!-- ✅ After -->
<div x-show="open" @click.outside="open = false">
    ...
</div>
```

<a name="alpine-data-instead-of-global-functions"></a>
### Lebih suka `Alpine.data()` daripada penyedia data fungsi Alpine global

```html
<!-- 🚫 Before -->
<div x-data="dropdown()">
    ...
</div>

<script>
    function dropdown() {
        return {
            ...
        }
    }
</script>

<!-- ✅ After -->
<div x-data="dropdown">
    ...
</div>

<script>
    document.addEventListener('alpine:initializing', () => {
        Alpine.data('dropdown', () => ({
            ...
        }))
    })
</script>
```
