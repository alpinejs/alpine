---
order: 5
title: on
---

# `x-on`

`x-on` memungkinkan Anda menjalankan kode dengan mudah pada peristiwa DOM yang dikirim.

Berikut adalah contoh tombol sederhana yang menunjukkan peringatan saat diklik.

```html
<button x-on:click="alert('Hello World!')">Say Hi</button>
```

<a name="shorthand-syntax"></a>
## Sintaks singkatan

Jika `x-on:` terlalu bertele-tele untuk selera Anda, Anda dapat menggunakan sintaks singkatan: `@`.

Berikut adalah komponen yang sama seperti di atas, tetapi menggunakan sintaks steno sebagai gantinya:

```html
<button @click="alert('Hello World!')">Say Hi</button>
```

<a name="the-event-object"></a>
## Objek event

Jika Anda ingin mengakses objek acara JavaScript asli dari ekspresi Anda, Anda dapat menggunakan properti `$event` ajaib Alpine.

```html
<button @click="alert($event.target.getAttribute('message'))" message="Hello World">Say Hi</button>
```

Selain itu, Alpine juga meneruskan objek acara ke metode apa pun yang direferensikan tanpa tanda kurung.  Sebagai contoh:

```html
<button @click="handleClick">...</button>

<script>
    function handleClick(e) {
        // Now you can access the event object (e) directly
    }
</script>
```

<a name="keyboard-events"></a>
## Papan ketik event

Alpine memudahkan untuk mendengarkan acara `keydown` dan `keyup` pada tombol tertentu.

Berikut adalah contoh mendengarkan tombol `Enter` di dalam elemen input.

```html
<input type="text" @keyup.enter="alert('Submitted!')">
```

Anda juga dapat menghubungkan pengubah kunci ini untuk mencapai pendengar yang lebih kompleks.

Berikut adalah listener yang berjalan saat tombol `Shift` ditahan dan `Enter` ditekan, tetapi tidak saat `Enter` ditekan sendiri.

```html
<input type="text" @keyup.shift.enter="alert('Submitted!')">
```

Anda dapat langsung menggunakan nama kunci yang valid yang diekspos melalui [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) sebagai pengubah dengan mengubahnya menjadi kebab-case.

```html
<input type="text" @keyup.page-down="alert('Submitted!')">
```

Untuk referensi mudah, berikut adalah daftar kunci umum yang mungkin ingin Anda dengarkan.

| Modifier                   | Keyboard Key                |
| -------------------------- | --------------------------- |
| `.shift`                    | Shift                       |
| `.enter`                    | Enter                       |
| `.space`                    | Space                       |
| `.ctrl`                     | Ctrl                        |
| `.cmd`                      | Cmd                         |
| `.meta`                     | Cmd on Mac, Ctrl on Windows |
| `.alt`                      | Alt                         |
| `.up` `.down` `.left` `.right` | Up/Down/Left/Right arrows   |
| `.esc`                      | Escape                      |
| `.tab`                      | Tab                         |
| `.caps-lock`                | Caps Lock                   |

<a name="custom-events"></a>
## Event khusus

Pendengar acara Alpine adalah pembungkus untuk pendengar acara DOM asli. Oleh karena itu, mereka dapat mendengarkan acara DOM APA PUN, termasuk acara khusus.

Berikut adalah contoh komponen yang mengirimkan peristiwa DOM khusus dan mendengarkannya juga.

```html
<div x-data @foo="alert('Button Was Clicked!')">
	<button @click="$event.target.dispatchEvent(new CustomEvent('foo', { bubbles: true }))">...</button>
</div>
```

Saat tombol diklik, pendengar `@foo` akan dipanggil.

Karena `.dispatchEvent` API bertele-tele, Alpine menawarkan pembantu `$dispatch` untuk menyederhanakan banyak hal.

Berikut komponen yang sama yang ditulis ulang dengan properti ajaib `$dispatch`.

```html
<div x-data @foo="alert('Button Was Clicked!')">
  <button @click="$dispatch('foo')">...</button>
</div>
```

[→ Baca lebih lanjut tentang `$dispatch`](/magics/dispatch)

<a name="modifiers"></a>
## Pengubah

Alpine menawarkan sejumlah pengubah direktif untuk menyesuaikan perilaku pendengar acara Anda.

<a name="prevent"></a>
### .prevent

`.prevent` sama dengan memanggil `.preventDefault()` di dalam listener pada objek event browser.

```html
<form @submit.prevent="console.log('submitted')" action="/foo">
    <button>Submit</button>
</form>
```

Dalam contoh di atas, dengan `.prevent`, mengklik tombol TIDAK akan mengirimkan formulir ke titik akhir `/foo`. Sebagai gantinya, pendengar Alpine akan menanganinya dan "mencegah" acara agar tidak ditangani lebih jauh.

<a name="stop"></a>
### .stop

Mirip dengan `.prevent`, `.stop` setara dengan memanggil `.stopPropagation()` di dalam listener pada objek event browser.

```html
<div @click="console.log('I will not get logged')">
    <button @click.stop>Click Me</button>
</div>
```

Dalam contoh di atas, mengklik tombol TIDAK AKAN mencatat pesan.  Ini karena kami segera menghentikan penyebaran acara dan tidak mengizinkannya untuk "menggelembungkan" ke `<div>` dengan pendengar `@click` di atasnya.

<a name="outside"></a>
### .outside

`.outside` adalah pembantu kenyamanan untuk mendengarkan klik di luar elemen yang dilampirkan.  Berikut adalah contoh komponen dropdown sederhana untuk ditunjukkan:

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle</button>

    <div x-show="open" @click.outside="open = false">
        Contents...
    </div>
</div>
```

Pada contoh di atas, setelah menampilkan konten dropdown dengan mengklik tombol "Toggle", Anda dapat menutup dropdown dengan mengklik di mana saja pada halaman di luar konten.

Ini karena `.outside` mendengarkan klik yang TIDAK berasal dari elemen yang didaftarkannya.

> Perlu diperhatikan bahwa ekspresi `.outside` hanya akan dievaluasi ketika elemen yang didaftarkannya terlihat di halaman.  Jika tidak, akan ada kondisi balapan yang buruk di mana mengklik tombol "Toggle" juga akan mengaktifkan handler `@click.outside` saat tidak terlihat.

<a name="window"></a>
### .window

Saat pengubah `.window` hadir, Alpine akan mendaftarkan event listener pada objek `window` root pada halaman alih-alih elemen itu sendiri.

```html
<div @keyup.escape.window="...">...</div>
```

Cuplikan di atas akan mendengarkan tombol "escape" untuk ditekan DI MANA SAJA pada halaman.

Menambahkan `.window` ke pendengar sangat berguna untuk kasus semacam ini di mana sebagian kecil dari markup Anda berkaitan dengan peristiwa yang terjadi di seluruh halaman.

<a name="document"></a>
### .document

`.document` bekerja mirip dengan `.window` hanya saja ia mendaftarkan pendengar di `document` global, bukan `window` global.

<a name="once"></a>
### .once

Dengan menambahkan `.once` ke listener, Anda memastikan bahwa handler hanya dipanggil SEKALI.

```html
<button @click.once="console.log('I will only log once')">...</button>
```

<a name="debounce"></a>
### .debounce

Terkadang berguna untuk "me-debounce" event handler sehingga hanya dipanggil setelah periode tidak aktif tertentu (250 milidetik secara default).

Misalnya jika Anda memiliki bidang pencarian yang mengaktifkan permintaan jaringan saat pengguna mengetik ke dalamnya, menambahkan debounce akan mencegah permintaan jaringan diaktifkan pada setiap penekanan tombol tunggal.

```html
<input @input.debounce="fetchResults">
```

Sekarang, alih-alih memanggil `fetchResults` setelah setiap penekanan tombol, `fetchResults` hanya akan dipanggil setelah 250 milidetik tanpa penekanan tombol.

Jika Anda ingin memperpanjang atau mempersingkat waktu debounce, Anda dapat melakukannya dengan mengikuti durasi setelah pengubah `.debounce` seperti:

```html
<input @input.debounce.500ms="fetchResults">
```

Sekarang, `fetchResults` hanya akan dipanggil setelah 500 milidetik tidak aktif.

<a name="throttle"></a>
### .throttle

`.throttle` mirip dengan `.debounce` kecuali akan melepaskan panggilan handler setiap 250 milidetik alih-alih menundanya tanpa batas.

Ini berguna untuk kasus di mana mungkin ada pengaktifan peristiwa yang berulang dan berkepanjangan dan penggunaan `.debounce` tidak akan berfungsi karena Anda ingin tetap menangani peristiwa tersebut sesering mungkin.

Sebagai contoh:

```html
<div @scroll.window.throttle="handleScroll">...</div>
```

Contoh di atas adalah kasus penggunaan pelambatan yang bagus.  Tanpa `.throttle`, metode `handleScroll` akan diaktifkan ratusan kali saat pengguna menggulir halaman ke bawah.  Ini benar-benar dapat memperlambat situs.  Dengan menambahkan `.throttle`, kami memastikan bahwa `handleScroll` hanya dipanggil setiap 250 milidetik.

> Fakta Menyenangkan: Strategi yang tepat ini digunakan di situs dokumentasi ini untuk memperbarui bagian yang saat ini disorot di bilah sisi kanan.

<a name="self"></a>
### .self

Dengan menambahkan `.self` ke pendengar acara, Anda memastikan bahwa acara berasal dari elemen yang dideklarasikan, dan bukan dari elemen turunan.

```html
<button @click.self="handleClick">
    Click Me

    <img src="...">
</button>
```

Dalam contoh di atas, kita memiliki tag `<img>` di dalam tag `<button>`.  Biasanya, klik apa pun yang berasal dari elemen `<button>` (seperti pada `<img>` misalnya), akan diambil oleh listener `@click` pada tombol.

Namun, dalam kasus ini, karena kami telah menambahkan `.self`, hanya mengklik tombol itu sendiri akan memanggil `handleClick`.  Hanya klik yang berasal dari elemen `<img>` yang tidak akan ditangani.

<a name="camel"></a>
### .camel

```html
<div @custom-event.camel="handleCustomEvent">
    ...
</div>
```

Terkadang Anda mungkin ingin mendengarkan event camelCased seperti `customEvent` dalam contoh kita.  Karena camelCasing di dalam atribut HTML tidak didukung, menambahkan pengubah `.camel` diperlukan bagi Alpine untuk membuat camelCase nama peristiwa secara internal.

Dengan menambahkan `.camel` pada contoh di atas, Alpine sekarang mendengarkan `customEvent` alih-alih `custom-event`.

<a name="passive"></a>
### .passive

Browser mengoptimalkan pengguliran pada halaman menjadi cepat dan lancar bahkan ketika JavaScript sedang dieksekusi di halaman.  Namun, pendengar sentuh dan roda yang diterapkan dengan tidak benar dapat memblokir pengoptimalan ini dan menyebabkan kinerja situs yang buruk.

Jika Anda mendengarkan acara sentuh, penting untuk menambahkan `.pasif` ke pendengar Anda untuk tidak memblokir kinerja gulir.

```html
<div @touchstart.passive="...">...</div>
```

[→ Baca lebih lanjut tentang pendengar pasif](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners)
