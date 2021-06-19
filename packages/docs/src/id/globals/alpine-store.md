---
order: 2
title: store()
---

# `Alpine.store`

Alpine menawarkan manajemen status global melalui `Alpine.store()` API.

<a name="registering-a-store"></a>
## Mendaftarkan Toko

Anda dapat mendefinisikan penyimpanan Alpine di dalam listener `alpine:initializing` (dalam hal menyertakan Alpine melalui tag `<script>`), ATAU Anda dapat mendefinisikannya sebelum memanggil `Alpine.start()` secara manual (dalam  kasus mengimpor Alpine ke dalam build):

**Dari tag skrip:**
```html
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

**Dari bundel:**
```js
import Alpine from 'alpinejs'

Alpine.store('darkMode', {
    on: false,

    toggle() {
        this.on = ! this.on
    }
})

Alpine.start()
```

<a name="accessing stores"></a>
## Mengakses toko

Anda dapat mengakses data dari penyimpanan mana pun dalam ekspresi Alpine menggunakan properti ajaib `$store`:

```html
<div x-data :class="$store.darkMode.on && 'bg-black'">...</div>
```

Anda juga dapat memodifikasi properti di dalam toko dan semua yang bergantung pada properti tersebut akan bereaksi secara otomatis. Sebagai contoh:

```html
<button x-data @click="$store.darkMode.toggle()">Toggle Dark Mode</button>
```

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
