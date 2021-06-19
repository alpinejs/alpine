---
order: 5
title: Lifecycle
---

# Lingkaran kehidupan

Alpine memiliki beberapa teknik berbeda untuk menghubungkan ke berbagai bagian siklus hidupnya. Mari kita membahas yang paling berguna untuk membiasakan diri dengan:

<a name="element-initialization"></a>
## Inisialisasi elemen

Kait siklus hidup lain yang sangat berguna di Alpine adalah direktif `x-init`.

`x-init` dapat ditambahkan ke elemen apa pun di halaman dan akan mengeksekusi JavaScript apa pun yang Anda panggil di dalamnya saat Alpine mulai menginisialisasi elemen tersebut.

```html
<button x-init="console.log('Im initing')">
```

Selain direktif, Alpine akan secara otomatis memanggil metode `init()` yang disimpan pada objek data. Sebagai contoh:

```js
Alpine.data('dropdown', () => ({
    init() {
        // I get called before the element using this data initializes.
    }
}))
```

<a name="after-a-state-change"></a>
## Setelah perubahan status

Alpine memungkinkan Anda untuk mengeksekusi kode ketika sepotong data (status) berubah. Ia menawarkan dua API berbeda untuk tugas seperti itu: `$watch` dan `x-effect`.

<a name="watch"></a>
### `$watch`

```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
```

Seperti yang Anda lihat di atas, `$watch` memungkinkan Anda menghubungkan perubahan data menggunakan kunci notasi titik. Ketika potongan data itu berubah, Alpine akan memanggil panggilan balik yang diteruskan dan memberikannya nilai baru.  bersama dengan nilai lama sebelum perubahan.

[→ Baca lebih lanjut tentang $watch](/magics/watch)

<a name="x-effect"></a>
### `x-effect`

`x-effect` menggunakan mekanisme yang sama seperti `$watch` tetapi memiliki penggunaan yang sangat berbeda.

Alih-alih menentukan kunci data mana yang ingin Anda tonton, `x-effect` akan memanggil kode yang disediakan dan dengan cerdas mencari data Alpine yang digunakan di dalamnya. Sekarang ketika salah satu bagian dari data tersebut berubah, ekspresi `x-effect` akan dijalankan kembali.

Berikut sedikit kode yang sama dari contoh `$watch` yang ditulis ulang menggunakan `x-effect`:

```html
<div x-data="{ open: false }" x-effect="console.log(open)">
```

Sekarang, ekspresi ini akan segera dipanggil, dan dipanggil kembali setiap kali `open` diperbarui.

Dua perbedaan perilaku utama dengan pendekatan ini adalah:

1. Kode yang diberikan akan langsung dijalankan DAN ketika data berubah (`$watch` "lazy" -- tidak akan berjalan sampai data pertama berubah)
2. Tidak ada pengetahuan tentang nilai sebelumnya.  (Panggilan balik yang diberikan ke `$watch` menerima nilai baru DAN yang lama)

[→ Baca lebih lanjut tentang x-effect](/directives/effect)

<a name="alpine-initialization"></a>
## Inisialisasi Alpine

<a name="alpine-initializing"></a>
### `Alpine.initializing`

Memastikan sedikit kode dijalankan setelah Alpine dimuat, tetapi SEBELUM menginisialisasi sendiri pada halaman adalah tugas yang diperlukan.

Kait ini memungkinkan Anda untuk mendaftarkan data khusus, direktif, keajaiban, dll. sebelum Alpine melakukan tugasnya di halaman.

Anda dapat menghubungkan ke titik ini dalam siklus hidup dengan mendengarkan acara yang dikirim oleh Alpine yang disebut: `alpine:initializing`

```js
document.addEventListener('alpine:initializing', () => {
    Alpine.data(...)
})
```

<a name="alpine-initialized"></a>
### `Alpine.initialized`

Alpine juga menawarkan pengait yang dapat Anda gunakan untuk mengeksekusi kode Setelah selesai melakukan inisialisasi yang disebut `alpine:initialized`:

```js
document.addEventListener('alpine:initialized', () => {
    //
})
```
