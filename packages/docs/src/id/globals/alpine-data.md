---
order: 1
title: data()
---

# `Alpine.data`

`Alpine.data(...)` menyediakan cara untuk menggunakan kembali konteks `x-data` dalam aplikasi Anda.

Berikut adalah komponen `dropdown` yang dibuat-buat misalnya:

```html
<div x-data="dropdown">
    <button @click="toggle">...</button>

    <div x-show="open">...</div>
</div>

<script>
    document.addEventListener('alpine:initializing', () => {
        Alpine.data('dropdown', () => ({
            open: false,

            toggle() {
                this.open = ! this.open
            }
        }))
    })
</script>
```

Seperti yang Anda lihat, kami telah mengekstrak properti dan metode yang biasanya kami definisikan langsung di dalam `x-data` ke dalam objek komponen Alpine yang terpisah.

<a name="registering-from-a-bundle"></a>
## Mendaftar dari bundel

Jika Anda telah memilih untuk menggunakan langkah pembuatan untuk kode Alpine Anda, Anda harus mendaftarkan komponen Anda dengan cara berikut:

```js
import Alpine from `alpinejs`
import dropdown from './dropdown.js'

Alpine.data('dropdown', dropdown)

Alpine.start()
```

Ini mengasumsikan Anda memiliki file bernama `dropdown.js` dengan konten berikut:

```js
export default function () => ({
    open: false,

    toggle() {
        this.open = ! this.open
    }
})
```

<a name="init-functions"></a>
## Init fungsi

Jika komponen Anda berisi metode `init()`, Alpine akan secara otomatis menjalankannya sebelum merender komponen.  Sebagai contoh:

```js
Alpine.data('dropdown', () => ({
    init() {
        // This code will be executed before Alpine
        // initializes the rest of the component.
    }
}))
```

<a name="using-magic-properties"></a>
## Menggunakan properti ajaib

Jika Anda ingin mengakses metode atau properti ajaib dari objek komponen, Anda dapat melakukannya menggunakan konteks `this`:

```js
Alpine.data('dropdown', () => ({
    open: false,

    init() {
        this.$watch('open', () => {...})
    }
}))
```

<a name="encapsulating-directives-with-x-bind"></a>
## Enkapsulasi direktif dengan `x-bind`

Jika Anda ingin menggunakan kembali lebih dari sekadar objek data suatu komponen, Anda dapat merangkum seluruh arahan templat Alpine menggunakan `x-bind`.

Berikut ini adalah contoh mengekstrak detail templating dari komponen dropdown kami sebelumnya menggunakan `x-bind`:

```html
<div x-data="dropdown">
    <button x-bind="trigger"></button>

    <div x-bind="dialogue"></div>
</div>
```

```js
Alpine.data('dropdown', () => ({
    open: false,

    trigger: {
        ['@click']() {
            this.open = ! this.open
        },
    },

    dialogue: {
        ['x-show']() {
            return this.open
        },
    },
}))
```
