---
order: 2
title: Extending
---

# Memperluas

Alpine memiliki basis kode yang sangat terbuka yang memungkinkan ekstensi dalam beberapa cara. Faktanya, setiap direktif dan keajaiban yang tersedia di Alpine sendiri menggunakan API yang tepat ini. Secara teori, Anda dapat membangun kembali semua fungsi Alpine dengan menggunakannya sendiri.

<a name="lifecycle-concerns"></a>
## Kekhawatiran siklus hidup
Sebelum kita menyelami masing-masing API, pertama-tama mari kita bicara tentang di mana dalam basis kode Anda, Anda harus menggunakan API ini.

Karena API ini berdampak pada cara Alpine menginisialisasi halaman, mereka harus didaftarkan SETELAH Alpine diunduh dan tersedia di halaman, tetapi SEBELUM menginisialisasi halaman itu sendiri.

Ada dua teknik berbeda tergantung pada apakah Anda mengimpor Alpine ke dalam bundel, atau menyertakannya secara langsung melalui tag `<script>`. Mari kita lihat keduanya:

<a name="via-script-tag"></a>
### Melalui tag skrip

Jika Anda menyertakan Alpine melalui tag skrip, Anda harus mendaftarkan kode ekstensi khusus apa pun di dalam event listener `alpine:initializing`.

Berikut ini contohnya:

```html
<html>
    <script src="/js/alpine.js" defer></script>

    <div x-data x-foo></div>

    <script>
        document.addEventListener('alpine:initializing', () => {
            Alpine.directive('foo', ...)
        })
    </script>
</html>
```

Jika Anda ingin mengekstrak kode ekstensi Anda ke dalam file eksternal, Anda harus memastikan bahwa tag `<script>` file tersebut terletak SEBELUM Alpine seperti:

```html
<html>
    <script src="/js/foo.js" defer></script>
    <script src="/js/alpine.js" defer></script>

    <div x-data x-foo></div>
</html>
```

<a name="via-npm"></a>
### Melalui modul NPM

Jika Anda mengimpor Alpine ke dalam bundel, Anda harus memastikan bahwa Anda mendaftarkan kode ekstensi DI ANTARA saat Anda mengimpor objek global `Alpine`, dan saat Anda menginisialisasi Alpine dengan memanggil `Alpine.start()`.  Sebagai contoh:

```js
import Alpine from 'alpinejs'

Alpine.directive('foo', ...)

window.Alpine = Alpine
window.Alpine.start()
```

Sekarang setelah kita tahu di mana harus menggunakan API ekstensi ini, mari kita lihat lebih dekat cara menggunakannya masing-masing:

<a name="custom-directives"></a>
## Direktif khusus

Alpine memungkinkan Anda untuk mendaftarkan arahan kustom Anda sendiri menggunakan `Alpine.directive()` API.

<a name="method-signature"></a>
### Metode Signature

```js
Alpine.directive('[name]', (el, { value, modifiers, expression }, { Alpine, effect, cleanup }) => {})
```

&nbsp; | &nbsp;
---|---
name | Nama direktif. Nama "foo" misalnya akan digunakan sebagai `x-foo`
el | Elemen DOM arahan ditambahkan ke
value | Jika disediakan, bagian dari direktif setelah titik dua. Contoh: `'bar'` di `x-foo:bar`
modifiers | Array tambahan trailing yang dipisahkan titik ke direktif. Contoh: `['baz', 'lob']` dari `x-foo.baz.lob`
expression | Bagian nilai atribut dari direktif. Contoh: `law` dari `x-foo="law"`
Alpine | Objek global Alpine
effect | Fungsi untuk membuat efek reaktif yang akan dibersihkan secara otomatis setelah arahan ini dihapus dari DOM
cleanup | Fungsi yang dapat Anda lewati panggilan balik yang dipesan lebih dahulu yang akan dijalankan saat arahan ini dihapus dari DOM

<a name="simple-example"></a>
### Contoh Sederhana

Berikut adalah contoh direktif sederhana yang akan kita buat bernama: `x-uppercase`:

```js
Alpine.directive('uppercase', el => {
    el.textContent = el.textContent.toUpperCase()
})
```
```html
<div x-data>
    <span x-uppercase>Hello World!</span>
</div>
```

<a name="evaluating-expressions"></a>
### Mengevaluasi ekspresi

Saat mendaftarkan arahan khusus, Anda mungkin ingin mengevaluasi ekspresi JavaScript yang disediakan pengguna:

Misalnya, Anda ingin membuat direktif khusus sebagai pintasan ke `console.log()`. Sesuatu seperti:

```html
<div x-data="{ message: 'Hello World!' }">
    <div x-log="message"></div>
</div>
```

Anda perlu mengambil nilai sebenarnya dari `message` dengan mengevaluasinya sebagai ekspresi JavaScript dengan cakupan `x-data`.

Untungnya, Alpine mengekspos sistemnya untuk mengevaluasi ekspresi JavaScript dengan API `evaluate()`.  Berikut ini contohnya:

```js
Alpine.directive('log', (el, { expression }, { evaluate }) => {
    // expression === 'message'

    console.log(
        evaluate(expression)
    )
})
```

Sekarang, ketika Alpine menginisialisasi `<div x-log...>`, ia akan mengambil ekspresi yang diteruskan ke direktif ("pesan" dalam kasus ini), dan mengevaluasinya dalam konteks cakupan komponen Alpine elemen saat ini.

<a name="introducing-reactivity"></a>
### Memperkenalkan reaktivitas

Berdasarkan contoh `x-log` dari sebelumnya, katakanlah kita ingin `x-log` mencatat nilai `message` dan juga mencatatnya jika nilainya berubah.

Diberikan template berikut:

```html
<div x-data="{ message: 'Hello World!' }">
    <div x-log="message"></div>

    <button @click="message = 'yolo'">Change</button>
</div>
```

Kami ingin "Halo Dunia!" untuk login pada awalnya, maka kita ingin "yolo" untuk login setelah menekan tombol `<button>`.

Kita dapat menyesuaikan implementasi `x-log` dan memperkenalkan dua API baru untuk mencapai ini: `evaluateLater()` dan `effect()`:

```js
Alpine.directive('log', (el, { expression }, { evaluateLater, effect }) => {
    let getThingToLog = evaluateLater(expression)

    effect(() => {
        getThingToLog(thingToLog => {
            console.log(thingToLog)
        })
    })
})
```

Mari kita telusuri kode di atas, baris demi baris.

```js
let getThingToLog = evaluateLater(expression)
```

Di sini, daripada langsung mengevaluasi `message` dan mengambil hasilnya, kita akan mengubah ekspresi string ("message") menjadi fungsi JavaScript aktual yang dapat kita jalankan kapan saja. Jika Anda akan mengevaluasi ekspresi JavaScript lebih dari sekali, sangat disarankan untuk membuat fungsi JavaScript terlebih dahulu dan menggunakannya daripada memanggil `evaluate()` secara langsung. Alasannya adalah bahwa proses untuk menafsirkan string biasa sebagai fungsi JavaScript mahal dan harus dihindari jika tidak diperlukan.

```js
effect(() => {
    ...
})
```

Dengan meneruskan callback ke `effect()`, kami memberi tahu Alpine untuk segera menjalankan callback, lalu melacak semua dependensi yang digunakannya (properti `x-data` seperti `message` dalam kasus kami). Sekarang segera setelah salah satu dependensi berubah, panggilan balik ini akan dijalankan kembali.  Ini memberi kita "reaktivitas" kita.

Anda mungkin mengenali fungsi ini dari `x-effect`.  Ini adalah mekanisme yang sama di bawah pengambil.

Anda mungkin juga memperhatikan bahwa `Alpine.effect()` ada dan bertanya-tanya mengapa kami tidak menggunakannya di sini.  Alasannya adalah bahwa fungsi `efek` yang disediakan melalui parameter metode memiliki fungsi khusus yang membersihkan dirinya sendiri ketika arahan dihapus dari halaman karena alasan apa pun.

Misalnya, jika karena alasan tertentu elemen dengan `x-log` di dalamnya dihapus dari halaman, dengan menggunakan `effect()` alih-alih `Alpine.effect()` ketika properti `message` diubah, nilainya  tidak akan lagi masuk ke konsol.

[→ Baca lebih lanjut tentang reaktivitas di Alpine](/advanced/reactivity)

```js
getThingToLog(thingToLog => {
    console.log(thingToLog)
})
```

Sekarang kita akan memanggil `getThingToLog`, yang jika Anda ingat adalah versi fungsi JavaScript sebenarnya dari ekspresi string: "message".

Anda mungkin mengharapkan `getThingToCall()` untuk segera mengembalikan hasilnya, tetapi Alpine mengharuskan Anda untuk meneruskan panggilan balik untuk menerima hasilnya.

Alasannya adalah untuk mendukung ekspresi asinkron seperti `menunggu getMessage()`. Dengan meneruskan panggilan balik "penerima" alih-alih mendapatkan hasilnya dengan segera, Anda mengizinkan arahan Anda untuk bekerja dengan ekspresi async juga.

[→ Baca lebih lanjut tentang async di Alpine](/advanced/async)

<a name="cleaning-up"></a>
### Membersihkan

Katakanlah Anda perlu mendaftarkan pendengar acara dari arahan khusus. Setelah arahan itu dihapus dari halaman karena alasan apa pun, Anda juga ingin menghapus pendengar acara.

Alpine membuat ini sederhana dengan memberi Anda fungsi `cleanup` saat mendaftarkan arahan khusus.

Berikut ini contohnya:

```js
Alpine.directive('...', (el, {}, { cleanup }) => {
    let handler = () => {}

    window.addEventListener('click', handler)

    cleanup(() => {
        window.removeEventListener('click', handler)
    })

})
```

Sekarang jika arahan dihapus dari elemen ini atau elemen itu sendiri dihapus, pendengar acara juga akan dihapus.

<a name="custom-magics"></a>
## Keajaiban khusus

Alpine memungkinkan Anda untuk mendaftarkan "keajaiban" khusus (properti atau metode) menggunakan `Alpine.magic()`. Semua keajaiban yang Anda daftarkan akan tersedia untuk semua kode Alpine aplikasi Anda dengan awalan `$`.

<a name="method-signature"></a>
### Metode Signature

```js
Alpine.magic('[name]', (el, { Alpine }) => {})
```

&nbsp; | &nbsp;
---|---
name | Nama keajaibannya. Nama "foo" misalnya akan digunakan sebagai `$foo`
el | Elemen DOM yang memicu keajaiban
Alpine | Objek global Alpine

<a name="magic-properties"></a>
### Properti Ajaib

Berikut adalah contoh dasar pembantu ajaib "$now" untuk dengan mudah mendapatkan waktu saat ini dari mana saja di Alpine:

```js
Alpine.magic('now', () => {
    return (new Date).toLocaleTimeString()
})
```
```html
<span x-text="$now"></span>
```

Sekarang tag `<span>` akan berisi waktu saat ini, menyerupai sesuatu seperti "12:00:00 PM".

Seperti yang Anda lihat `$now` berperilaku seperti properti statis, tetapi sebenarnya adalah pengambil yang mengevaluasi setiap kali properti diakses.

Karena itu, Anda dapat menerapkan "fungsi" ajaib dengan mengembalikan fungsi dari pengambil.

<a name="magic-functions"></a>
### Fungsi Ajaib

Misalnya, jika kita ingin membuat fungsi ajaib `$clipboard()` yang menerima string untuk disalin ke clipboard, kita bisa mengimplementasikannya seperti ini:

```js
Alpine.magic('clipboard', () => {
    return subject => navigator.clipboard.writeText(subject)
})
```
```html
<button @click="$clipboard('hello world')">Copy "Hello World"</button>
```

Sekarang setelah mengakses `$clipboard` mengembalikan fungsi itu sendiri, kita dapat segera memanggilnya dan memberikan argumen seperti yang kita lihat di template dengan `$clipboard('hello world')`.

Anda dapat menggunakan sintaks yang lebih singkat (fungsi panah ganda) untuk mengembalikan fungsi dari suatu fungsi jika Anda lebih suka:

```js
Alpine.magic('clipboard', () => subject => {
    navigator.clipboard.writeText(subject)
})
```

<a name="writing-and-sharing-plugins"></a>
## Menulis dan berbagi plugin

Sekarang Anda akan melihat betapa mudah dan sederhananya untuk mendaftarkan arahan dan keajaiban kustom Anda sendiri di aplikasi Anda, tetapi bagaimana dengan berbagi fungsionalitas itu dengan orang lain melalui paket NPM atau semacamnya?

Anda dapat memulai dengan cepat dengan paket "plugin-blueprint" resmi Alpine. Ini semudah mengkloning repositori dan menjalankan `npm install && npm run build` untuk membuat plugin.

Jika tidak, mari kita buat plugin Alpine pura-pura dengan tangan yang disebut `Foo` yang mencakup directive (`x-foo`) dan magic (`$foo`).

Kami akan mulai memproduksi plugin ini untuk konsumsi sebagai tag `<script>` sederhana bersama Alpine, lalu kami akan menaikkannya ke modul untuk diimpor ke bundel:

<a name="script-include"></a>
### Skrip termasuk

Mari kita mulai secara terbalik dengan melihat bagaimana plugin kita akan dimasukkan ke dalam sebuah proyek:

```html
<html>
    <script src="/js/foo.js" defer></script>
    <script src="/js/alpine.js" defer></script>

    <div x-data x-init="$foo()">
        <span x-foo="'hello world'">
    </div>
</html>
```

Perhatikan bagaimana skrip kami disertakan SEBELUM Alpine itu sendiri. Ini penting, jika tidak, Alpine sudah diinisialisasi pada saat plugin kami dimuat.

Sekarang mari kita lihat isi `/js/foo.js`:

```js
document.addEventListener('alpine:initializing', () => {
    window.Alpine.directive('foo', ...)

    window.Alpine.magic('foo', ...)
})
```

Itu dia! Membuat plugin untuk dimasukkan melalui tag skrip sangat sederhana dengan Alpine.

<a name="bundle-module"></a>
### Modul bundel

Sekarang katakanlah Anda ingin membuat plugin yang dapat diinstal seseorang melalui NPM dan menyertakannya ke dalam bundel mereka.

Seperti contoh terakhir, kita akan membahasnya secara terbalik, dimulai dengan seperti apa tampilannya saat menggunakan plugin ini:

```js
import Alpine from 'alpinejs'

import foo from 'foo'
Alpine.plugin(foo)

window.Alpine = Alpine
window.Alpine.start()
```

Anda akan melihat API baru di sini: `Alpine.plugin()`. Ini adalah metode kenyamanan yang Alpine paparkan untuk mencegah konsumen plugin Anda harus mendaftarkan sendiri beberapa direktif dan keajaiban yang berbeda.

Sekarang mari kita lihat sumber plugin dan apa yang diekspor dari `foo`:

```js
export default function (Alpine) {
    Alpine.directive('foo', ...)
    Alpine.magic('foo', ...)
}
```

Anda akan melihat bahwa `Alpine.plugin` sangat sederhana.  Ia menerima panggilan balik dan segera memanggilnya sambil menyediakan global `Alpine` sebagai parameter untuk digunakan di dalamnya.

Kemudian Anda dapat melanjutkan untuk memperluas Alpine sesuka Anda.
