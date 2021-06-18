---
order: 4
title: bind
---

# `x-bind`

`x-bind` memungkinkan Anda menyetel atribut HTML pada elemen berdasarkan hasil ekspresi JavaScript.

Misalnya, berikut adalah komponen tempat kita akan menggunakan `x-bind` untuk menyetel nilai placeholder dari sebuah input.

```html
<div x-data="{ placeholder: 'Type here...' }">
  <input type="text" x-bind:placeholder="placeholder">
</div>
```

<a name="shorthand-syntax"></a>
## Sintaks singkatan

Jika `x-bind:` terlalu bertele-tele sesuai keinginan Anda, Anda dapat menggunakan singkatan: `:`. Misalnya, ini adalah elemen input yang sama seperti di atas, tetapi difaktorkan ulang untuk menggunakan sintaks singkatan.

```html
<input type="text" :placeholder="placeholder">
```

<a name="binding-classes"></a>
## Kelas mengikat

`x-bind` paling sering berguna untuk menyetel kelas tertentu pada elemen berdasarkan status Alpine Anda.

Berikut adalah contoh sederhana dari sakelar tarik-turun sederhana, tetapi alih-alih menggunakan `x-show`, kami akan menggunakan kelas "tersembunyi" untuk mengalihkan elemen.

```html
<div x-data="{ open: false }">
  <button x-on:click="open = ! open">Toggle Dropdown</button>

  <div :class="open ? '' : 'hidden'">
    Dropdown Contents...
  </div>
</div>
```

Sekarang, ketika `open` adalah `false`, kelas "tersembunyi" akan ditambahkan ke dropdown.

<a name="shorthand-conditionals"></a>
### Persyaratan singkatan

Dalam kasus seperti ini, jika Anda lebih suka sintaks yang kurang verbose, Anda dapat menggunakan evaluasi hubung singkat JavaScript daripada persyaratan standar:

```html
<div :class="show ? '' : 'hidden'">
<!-- Is equivalant to: -->
<div :class="show || 'hidden'">
```

Kebalikannya juga tersedia untuk Anda.  Misalkan alih-alih `buka`, kita menggunakan variabel dengan nilai yang berlawanan: `tertutup`.

```html
<div :class="closed ? 'hidden' : ''">
<!-- Is equivalant to: -->
<div :class="closed && 'hidden'">
```

<a name="class-object-syntax"></a>
### Sintaks objek kelas

Alpine menawarkan sintaks tambahan untuk beralih kelas jika Anda mau.  Dengan melewatkan objek JavaScript di mana kelas adalah kunci dan boolean adalah nilainya, Alpine akan mengetahui kelas mana yang akan diterapkan dan mana yang harus dihapus.  Sebagai contoh:

```html
<div :class="{ 'hidden': ! show }">
```

Teknik ini menawarkan keuntungan unik untuk metode lain.  Saat menggunakan sintaks objek, Alpine TIDAK akan mempertahankan kelas asli yang diterapkan ke atribut `class` elemen.

Misalnya, jika Anda ingin menerapkan kelas "tersembunyi" ke elemen sebelum Alpine dimuat, DAN menggunakan Alpine untuk mengubah keberadaannya, Anda hanya dapat mencapai perilaku itu menggunakan sintaks objek:

```html
<div class="hidden" :class="{ 'hidden': ! show }">
```

Jika itu membingungkan Anda, mari gali lebih dalam tentang bagaimana Alpine menangani `x-bind:class` secara berbeda dari atribut lainnya.

<a name="special-behavior"></a>
### Perilaku khusus

`x-bind:class` berperilaku berbeda dari atribut lain di bawah tenda.

Perhatikan kasus berikut.

```html
<div class="opacity-50" :class="hide && 'hidden'">
```

Jika "class" adalah atribut lain, pengikatan `:class` akan menimpa atribut kelas yang ada, menyebabkan `opacity-50` ditimpa oleh `hidden` atau `''`.

Namun, Alpine memperlakukan binding `class` secara berbeda.  Cukup pintar untuk mempertahankan kelas yang ada pada suatu elemen.

Misalnya, jika `sembunyikan` benar, contoh di atas akan menghasilkan elemen DOM berikut:

```html
<div class="opacity-50 hidden">
```

Jika `sembunyikan` salah, elemen DOM akan terlihat seperti:

```html
<div class="opacity-50">
```

Perilaku ini seharusnya tidak terlihat dan intuitif bagi sebagian besar pengguna, tetapi perlu disebutkan secara eksplisit untuk pengembang yang bertanya atau kasus khusus apa pun yang mungkin muncul.

<a name="binding-styles"></a>
## Gaya mengikat

Mirip dengan sintaks khusus untuk mengikat kelas dengan objek JavaScript, Alpine juga menawarkan sintaks berbasis objek untuk mengikat atribut `style`.

Sama seperti objek kelas, sintaks ini sepenuhnya opsional.  Gunakan hanya jika itu memberi Anda beberapa keuntungan.

```html
<div :style="{ color: 'red', display: 'flex' }">

<!-- Will render: -->
<div style="color: red; display: flex;" ...>
```

Salah satu keuntungan dari pendekatan ini adalah dapat memadukannya dengan gaya yang ada pada suatu elemen:

```html
<div style="padding: 1rem;" :style="{ color: 'red', display: 'flex' }">

<!-- Will render: -->
<div style="padding: 1rem; color: red; display: flex;" ...>
```

Dan seperti kebanyakan ekspresi di Alpine, Anda selalu dapat menggunakan hasil ekspresi JavaScript sebagai referensi:

```html
<div x-data="{ styles: { color: 'red', display: 'flex' }}">
    <div :style="styles">
</div>

<!-- Will render: -->
<div ...>
    <div style="color: red; display: flex;" ...>
</div>
```

<a name="bind-directives"></a>
## Mengikat Arahan Alpine Secara Langsung

`x-bind` memungkinkan Anda untuk mengikat objek dengan properti berbeda ke elemen.

Kunci objek adalah arahan (dapat berupa arahan apa pun termasuk pengubah), dan nilainya adalah panggilan balik untuk dievaluasi oleh Alpine.

```html
<div x-data="dropdown()">
    <button x-bind="trigger">Open Dropdown</button>

    <span x-bind="dialogue">Dropdown Contents</span>
</div>

<script>
    document.addEventListener('alpine:initializing', () => {
        Alpine.data('dropdown', () => ({
            open: false,

            trigger: {
                ['@click']() {
                    this.open = true
                },
            },

            dialogue: {
                ['x-show']() {
                    return this.open
                },
                ['@click.outside']() {
                    this.open = false
                },
            },
        }))
    })
</script>
```

Ada beberapa peringatan untuk penggunaan `x-bind` ini:

> Ketika direktif yang "terikat" atau "diterapkan" adalah `x-for`, Anda harus mengembalikan string ekspresi normal dari panggilan balik. Misalnya: `['x-for']() { return 'item in items' }`
