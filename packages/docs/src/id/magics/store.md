---
order: 3
prefix: $
title: store
---

# `$store`

Anda dapat menggunakan `$store` untuk mengakses toko Alpine global yang terdaftar menggunakan [`Alpine.store(...)`](#).  Sebagai contoh:

```html
<button x-data @click="$store.darkMode.toggle()">Toggle Dark Mode</button>

...

<div x-data :class="$store.darkMode.on && 'bg-black'">
    ...
</div>


<script>
    document.addEventListener('alpine:initializing', () => {
        Alpine.store('darkMode', {
            on: false,

            toggle() {
                this.on = ! this.on
            }
        })
    })
</script>
```

Mengingat bahwa kita telah mendaftarkan penyimpanan `darkMode` dan menyetel `on` ke "false", ketika `<button>` ditekan, `on` akan menjadi "true" dan warna latar belakang halaman akan berubah menjadi hitam  .

<a name="single-value-stores"></a>
## Toko bernilai tunggal

Jika Anda tidak memerlukan seluruh objek untuk penyimpanan, Anda dapat mengatur dan menggunakan jenis data apa pun sebagai penyimpanan.

Berikut contoh dari atas tetapi menggunakannya lebih sederhana sebagai nilai boolean:

```html
<button x-data @click="$store.darkMode = ! $store.darkMode">Toggle Dark Mode</button>

...

<div x-data :class="$store.darkMode && 'bg-black'">
    ...
</div>


<script>
    document.addEventListener('alpine:initializing', () => {
        Alpine.store('darkMode', false)
    })
</script>
```
