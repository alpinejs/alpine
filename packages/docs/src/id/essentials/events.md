---
order: 4
title: Events
---

# Peristiwa

Alpine memudahkan untuk mendengarkan peristiwa browser dan bereaksi terhadapnya.

<a name="listening-for-simple-events"></a>
## Mendengarkan peristiwa sederhana

Dengan menggunakan `x-on`, Anda dapat mendengarkan peristiwa browser yang dikirim pada atau di dalam elemen.

Berikut adalah contoh dasar mendengarkan klik pada tombol:

```html
<button x-on:click="console.log('clicked')">...</button>
```

Sebagai alternatif, Anda dapat menggunakan sintaks singkatan acara jika Anda lebih suka: `@`. Berikut adalah contoh yang sama seperti sebelumnya, tetapi menggunakan sintaks singkatan (yang akan kita gunakan mulai sekarang):

```html
<button @click="...">...</button>
```

Selain `klik`, Anda dapat mendengarkan acara browser apa pun berdasarkan nama. Misalnya: `@mouseenter`, `@keyup`, dll... semuanya merupakan sintaks yang valid.

<a name="listening-for-specific-keys"></a>
## Mendengarkan kunci tertentu

Katakanlah Anda ingin mendengarkan tombol `enter` ditekan di dalam elemen `<input>`. Alpine membuatnya mudah dengan menambahkan `.enter` seperti:

```html
<input @keyup.enter="...">
```

Anda bahkan dapat menggabungkan pengubah kunci untuk mendengarkan kombinasi tombol seperti menekan `enter` sambil menahan `shift`:

```html
<input @keyup.shift.enter="...">
```

<a name="preventing-default"></a>
## Mencegah default

Saat bereaksi terhadap acara browser, seringkali perlu untuk "mencegah default" (mencegah perilaku default dari acara browser).

Misalnya, jika Anda ingin mendengarkan pengiriman formulir tetapi mencegah browser mengirimkan permintaan formulir, Anda dapat menggunakan `.prevent`:

```html
<form @submit.prevent="...">...</form>
```

Anda juga dapat menerapkan `.stop` untuk mencapai yang setara dengan `event.stopPropagation()`.

<a name="accessing-the-event-object"></a>
## Mengakses objek peristiwa

Terkadang Anda mungkin ingin mengakses objek acara browser asli di dalam kode Anda sendiri.  Untuk mempermudah ini, Alpine secara otomatis menyuntikkan variabel ajaib `$event`:

```html
<button @click="$event.target.remove()">Remove Me</button>
```

<a name="dispatching-custom-events"></a>
## Mengirimkan peristiwa khusus

Selain mendengarkan acara browser, Anda juga dapat mengirimkannya. Ini sangat berguna untuk berkomunikasi dengan komponen Alpine lainnya atau memicu peristiwa di alat di luar Alpine itu sendiri.

Alpine mengekspos pembantu ajaib yang disebut `$dispatch` untuk ini:

```html
<div @foo="console.log('foo was dispatched')">
    <button @click="$dispatch('foo')"></button>
</div>
```

Seperti yang Anda lihat, ketika tombol diklik, Alpine akan mengirimkan acara browser yang disebut "foo", dan pendengar `@foo` kami di `<div>` akan mengambilnya dan bereaksi terhadapnya.

<a name="listening-for-events-on-window"></a>
## Mendengarkan peristiwa di jendela

Karena sifat acara di browser, terkadang berguna untuk mendengarkan acara di objek jendela tingkat atas.

Ini memungkinkan Anda untuk berkomunikasi di seluruh komponen sepenuhnya seperti contoh berikut:


```html
<div x-data>
    <button @click="$dispatch('foo')"></button>
</div>

<div x-data @foo.window="console.log('foo was dispatched')">...</div>
```

Pada contoh di atas, jika kita mengklik tombol di komponen pertama, Alpine akan mengirimkan event "foo". Karena cara kerja peristiwa di browser, peristiwa "bergelembung" melalui elemen induk sampai ke "jendela" tingkat atas.

Sekarang, karena dalam komponen kedua, kita mendengarkan "foo" di jendela (dengan `.window`), ketika tombol diklik, pendengar ini akan mengambilnya dan mencatat pesan "foo telah dikirim".

[→ Baca lebih lanjut tentang x-on](/directives/on)
