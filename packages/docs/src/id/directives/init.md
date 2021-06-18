---
order: 2
title: init
---

# `x-init`

Direktif `x-init` memungkinkan Anda untuk menghubungkan ke fase inisialisasi elemen apa pun di Alpine.

```html
<div x-init="console.log('I\'m being initialized!')"></div>
```

Dalam contoh di atas, "I\'m being initialized!" akan ditampilkan di konsol sebelum membuat pembaruan DOM lebih lanjut.

Pertimbangkan contoh lain di mana `x-init` digunakan untuk mengambil beberapa JSON dan menyimpannya di `x-data` sebelum komponen diproses.

```html
<div
    x-data="{ posts: [] }"
    x-init="posts = await (await fetch('/posts')).json()"
>...</div>
```

<a name="next-tick"></a>
## $nextTick

Terkadang, Anda ingin menunggu hingga Alpine selesai merender untuk mengeksekusi beberapa kode.

Ini akan menjadi sesuatu seperti `useEffect(..., [])` dalam reaksi, atau `mount` di Vue.

Dengan menggunakan sihir `$nextTick` internal Alpine, Anda dapat mewujudkannya.

```html
<div x-init="$nextTick(() => { ... })"></div>
```

<a name="standalone-x-init"></a>
## Standalone `x-init`

Anda dapat menambahkan `x-init` ke elemen apa pun di dalam atau di luar blok HTML `x-data`.  Sebagai contoh:

```html
<div x-data>
    <span x-init="console.log('I can initialize')"></span>
</div>

<span x-init="console.log('I can initialize too')"></span>
```

<a name="auto-evaluate-init-method"></a>
## Evaluasi otomatis metode init()

Jika objek `x-data` dari suatu komponen berisi metode `init()`, maka akan dipanggil secara otomatis.  Sebagai contoh:

```html
<div x-data="{
    init() {
        console.log('I am called automatically')
    }
}">
    ...
</div>
```

Hal ini juga berlaku untuk komponen yang didaftarkan menggunakan sintaks `Alpine.data()`.

```js
Alpine.data('dropdown', () => ({
    init() {
        console.log('I will get evaluated when initializing each "dropdown" component.')
    },
}))
```
