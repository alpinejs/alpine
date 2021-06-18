---
order: 1
title: Reaktivitas
---

# Reaktivitas

Alpine adalah "reaktif" dalam arti bahwa ketika Anda mengubah sepotong data, segala sesuatu yang bergantung pada data itu "bereaksi" secara otomatis terhadap perubahan itu.

Setiap sedikit reaktivitas yang terjadi di Alpine, terjadi karena dua fungsi reaktif yang sangat penting di inti Alpine: `Alpine.reactive()`, dan `Alpine.effect()`.

> Alpine menggunakan mesin reaktivitas VueJS untuk menyediakan fungsi-fungsi ini.
> [→ Baca lebih lanjut tentang @vue/reactivity](https://github.com/vuejs/vue-next/tree/master/packages/reactivity)

Memahami dua fungsi ini akan memberi Anda kekuatan super sebagai pengembang Alpine, tetapi juga sebagai pengembang web pada umumnya.

<a name="alpine-reactive"></a>
## Alpine.reactive()

Mari kita lihat dulu `Alpine.reactive()`. Fungsi ini menerima objek JavaScript sebagai parameternya dan mengembalikan versi "reaktif" dari objek tersebut. Sebagai contoh:

```js
let data = { count: 1 }

let reactiveData = Alpine.reactive(data)
```

Di bawah tenda, ketika `Alpine.reactive` menerima `data`, itu membungkusnya di dalam proxy JavaScript khusus.

Proxy adalah jenis objek khusus dalam JavaScript yang dapat mencegat panggilan "mendapatkan" dan "mengatur" ke objek JavaScript.

[→ Baca lebih lanjut tentang proxy JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

Pada nilai nominal, `reactiveData` harus berperilaku persis seperti `data`. Sebagai contoh:

```js
console.log(data.count) // 1
console.log(reactiveData.count) // 1

reactiveData.count = 2

console.log(data.count) // 2
console.log(reactiveData.count) // 2
```

Apa yang Anda lihat di sini adalah karena `reactiveData` adalah pembungkus tipis di sekitar `data`, setiap upaya untuk mendapatkan atau menyetel properti akan berperilaku persis seperti jika Anda berinteraksi dengan `data` secara langsung.

Perbedaan utama di sini adalah bahwa setiap kali Anda memodifikasi atau mengambil (mendapatkan atau menyetel) nilai dari `reactiveData`, Alpine menyadarinya dan dapat mengeksekusi logika lain yang bergantung pada data ini.

`Alpine.reactive` hanyalah bagian pertama dari cerita.  `Alpine.effect` adalah bagian lainnya, mari kita gali.

<a name="alpine-effect"></a><a name="alpine-effect"></a>
## Alpine.effect()

`Alpine.effect` menerima satu fungsi callback. Segera setelah `Alpine.effect` dipanggil, ia akan menjalankan fungsi yang disediakan, tetapi secara aktif mencari interaksi apa pun dengan data reaktif. Jika mendeteksi interaksi (get atau set dari proxy reaktif yang disebutkan di atas), ia akan melacaknya dan memastikan untuk menjalankan kembali panggilan balik jika ada perubahan data reaktif di masa mendatang. Sebagai contoh:

```js
let data = Alpine.reactive({ count: 1 })

Alpine.effect(() => {
    console.log(data.count)
})
```

Saat kode ini pertama kali dijalankan, "1" akan masuk ke konsol.  Setiap kali `data.count` berubah, nilainya akan dicatat kembali ke konsol.

Ini adalah mekanisme yang membuka semua reaktivitas di inti Alpine.

Untuk menghubungkan titik-titik lebih jauh, mari kita lihat contoh komponen "penghitung" sederhana tanpa menggunakan sintaks Alpine sama sekali, hanya menggunakan `Alpine.reactive` dan `Alpine.effect`:

```html
<button>Increment</button>

Count: <span></span>
```
```js
let button = document.querySelector('button')
let span = document.querySelector('span')

let data = Alpine.reactive({ count: 1 })

Alpine.effect(() => {
    span.textContent = data.count
})

button.addEventListener('click', () => {
    data.count = data.count + 1
})
```

<!-- START_VERBATIM -->
<div x-data="{ count: 1 }" class="demo">
    <button @click="count++">Increment</button>

    <div>Count: <span x-text="count"></span></div>
</div>
<!-- END_VERBATIM -->

Seperti yang Anda lihat, Anda dapat membuat data apa pun menjadi reaktif, dan Anda juga dapat membungkus fungsionalitas apa pun dalam file `Alpine.effect`.

Kombinasi ini membuka paradigma pemrograman yang sangat kuat untuk pengembangan web. Berlari liar dan bebas.
