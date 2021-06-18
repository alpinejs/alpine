---
order: 8
title: for
---

# `x-for`

Direktif `x-for` Alpine memungkinkan Anda membuat elemen DOM dengan mengulangi daftar. Berikut adalah contoh sederhana menggunakannya untuk membuat daftar warna berdasarkan array.

```html
<ul x-data="{ colors: ['Red', 'Orange', 'Yellow'] }">
    <template x-for="color in colors">
        <li x-text="color"></li>
    </template>
</ul>
```

<!-- START_VERBATIM -->
<div class="demo">
    <ul x-data="{ colors: ['Red', 'Orange', 'Yellow'] }">
        <template x-for="color in colors">
            <li x-text="color"></li>
        </template>
    </ul>
</div>
<!-- END_VERBATIM -->

Ada dua aturan yang perlu diperhatikan tentang `x-for`:

* `x-for` HARUS dideklarasikan pada elemen `<template>`
* Elemen `<template>` itu HARUS hanya memiliki satu elemen root

<a name="keys"></a>
## Kunci

Penting untuk menentukan kunci untuk setiap iterasi `x-for` jika Anda akan memesan ulang item. Tanpa kunci dinamis, Alpine mungkin kesulitan melacak apa yang dipesan ulang dan akan menyebabkan efek samping yang aneh.

```html
<ul x-data="{ colors: [
    { id: 1, label: 'Red' },
    { id: 2, label: 'Orange' },
    { id: 3, label: 'Yellow' },
]}">
    <template x-for="color in colors" :key="color.id">
        <li x-text="color.label"></li>
    </template>
</ul>
```

Sekarang jika warna ditambahkan, dihapus, diurutkan ulang, atau "id" mereka berubah, Alpine akan mempertahankan atau menghancurkan elemen `<li>` yang berulang sesuai dengan itu.

<a name="accessing-indexes"></a>
## Mengakses indeks

Jika Anda perlu mengakses indeks setiap item dalam iterasi, Anda dapat melakukannya menggunakan sintaks `([item], [index]) di [item]` seperti:

```html
<ul x-data="{ colors: ['Red', 'Orange', 'Yellow'] }">
    <template x-for="(color, index) in colors">
        <li>
            <span x-text="index + ': '"></span>
            <span x-text="color"></span>
        </li>
    </template>
</ul>
```

Anda juga dapat mengakses indeks di dalam ekspresi `:key` dinamis.

```html
<template x-for="(color, index) in colors" :key="index">
```

<a name="iterating-over-a-range"></a>
## Iterasi pada rentang

Jika Anda hanya perlu mengulang `n` beberapa kali, daripada mengulangi melalui array, Alpine menawarkan sintaks singkat.

```html
<ul>
    <template x-for="i in 10">
        <li x-text="i"></li>
    </template>
</ul>
```

`i` dalam hal ini dapat diberi nama apa pun yang Anda suka.
