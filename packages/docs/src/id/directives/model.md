---
order: 7
title: model
---

# `x-model`

`x-model` memungkinkan Anda untuk mengikat nilai elemen input ke data Alpine.

Berikut adalah contoh sederhana penggunaan `x-model` untuk mengikat nilai bidang teks ke sepotong data di Alpine.

```html
<div x-data="{ message: '' }">
    <input type="text" x-model="message">

    <span x-text="message">
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ message: '' }">
        <input type="text" x-model="message" placeholder="Type message...">

        <div class="pt-4" x-text="message"></div>
    </div>
</div>
<!-- END_VERBATIM -->


Sekarang saat pengguna mengetik ke dalam bidang teks, `pesan` akan tercermin dalam tag `<span>`.

`x-model` terikat dua arah, artinya "set" dan "mendapatkan".  Selain mengubah data, jika data itu sendiri berubah, elemen tersebut akan mencerminkan perubahan tersebut.


Kita dapat menggunakan contoh yang sama seperti di atas tetapi kali ini, kita akan menambahkan tombol untuk mengubah nilai properti `message`.

```html
<div x-data="{ message: '' }">
    <input type="text" x-model="message">

    <button x-on:click="message = 'changed'">Change Message</button>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ message: '' }">
        <input type="text" x-model="message" placeholder="Type message...">

        <button x-on:click="message = 'changed'">Change Message</button>
    </div>
</div>
<!-- END_VERBATIM -->

Sekarang ketika `<button>` diklik, nilai elemen input akan langsung diperbarui menjadi "berubah".

`x-model` berfungsi dengan elemen input berikut:

* `<input type="text">`
* `<textarea>`
* `<input type="checkbox">`
* `<input type="radio">`
* `<select>`

<a name="text-inputs"></a>
## Input teks

```html
<input type="text" x-model="message">

<span x-text="message"></span>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ message: '' }">
        <input type="text" x-model="message" placeholder="Type message">

        <div class="pt-4" x-text="message"></div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="textarea-inputs"></a>
## Input area teks

```html
<textarea x-model="message"></textarea>

<span x-text="message"></span>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ message: '' }">
        <textarea x-model="message" placeholder="Type message"></textarea>

        <div class="pt-4" x-text="message"></div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="checkbox-inputs"></a>
## Input kotak centang

<a name="single-checkbox-with-boolean"></a>
### Kotak centang tunggal dengan boolean

```html
<input type="checkbox" id="checkbox" x-model="show">

<label for="checkbox" x-text="show"></label>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ open: '' }">
        <input type="checkbox" id="checkbox" x-model="open">

        <label for="checkbox" x-text="open"></label>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="multiple-checkboxes-bound-to-array"></a>
### Beberapa kotak centang terikat ke array

```html
<input type="checkbox" value="red" x-model="colors">
<input type="checkbox" value="orange" x-model="colors">
<input type="checkbox" value="yellow" x-model="colors">

Colors: <span x-text="colors"></span>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ colors: [] }">
        <input type="checkbox" value="red" x-model="colors">
        <input type="checkbox" value="orange" x-model="colors">
        <input type="checkbox" value="yellow" x-model="colors">

        <div class="pt-4">Colors: <span x-text="colors"></span></div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="radio-inputs"></a>
## Input radio

```html
<input type="radio" value="yes" x-model="answer">
<input type="radio" value="no" x-model="answer">

Answer: <span x-text="answer"></span>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ answer: '' }">
        <input type="radio" value="yes" x-model="answer">
        <input type="radio" value="no" x-model="answer">

        <div class="pt-4">Answer: <span x-text="answer"></span></div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="select-inputs"></a>
## Pilih input


<a name="single-select"></a>
### Pilihan tunggal

```html
<select x-model="color">
    <option>Red</option>
    <option>Orange</option>
    <option>Yellow</option>
</select>

Color: <span x-text="color"></span>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ color: '' }">
        <select x-model="color">
            <option>Red</option>
            <option>Orange</option>
            <option>Yellow</option>
        </select>

        <div class="pt-4">Color: <span x-text="color"></span></div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="single-select-with-placeholder"></a>
### Pilihan tunggal dengan placeholder

```html
<select x-model="color">
    <option value="" disabled>Select A Color</option>
    <option>Red</option>
    <option>Orange</option>
    <option>Yellow</option>
</select>

Color: <span x-text="color"></span>
```


<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ color: '' }">
        <select x-model="color">
            <option value="" disabled>Select A Color</option>
            <option>Red</option>
            <option>Orange</option>
            <option>Yellow</option>
        </select>

        <div class="pt-4">Color: <span x-text="color"></span></div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="multiple-select"></a>
### Pilihan ganda

```html
<select x-model="color" multiple>
    <option>Red</option>
    <option>Orange</option>
    <option>Yellow</option>
</select>

Colors: <span x-text="color"></span>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ color: '' }">
        <select x-model="color" multiple>
            <option>Red</option>
            <option>Orange</option>
            <option>Yellow</option>
        </select>

        <div class="pt-4">Color: <span x-text="color"></span></div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="dynamically-populated-select-options"></a>
### Pilihan yang diisi secara dinamis

```html
<select x-model="color">
    <template x-for="color in ['Red', 'Orange', 'Yellow']">
        <option x-text="color"></option>
    </template>
</select>

Color: <span x-text="color"></span>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ color: '' }">
        <select x-model="color">
            <template x-for="color in ['Red', 'Orange', 'Yellow']">
                <option x-text="color"></option>
            </template>
        </select>

        <div class="pt-4">Color: <span x-text="color"></span></div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="modifiers"></a>
## Pengubah

<a name="lazy"></a>
### `.lazy`

Pada input teks, secara default, `x-model` memperbarui properti pada setiap penekanan tombol.  Dengan menambahkan pengubah `.lazy`, Anda dapat memaksa input `x-model` untuk hanya memperbarui properti saat pengguna berfokus jauh dari elemen input.

Ini berguna untuk hal-hal seperti validasi formulir waktu-nyata di mana Anda mungkin tidak ingin menampilkan kesalahan validasi input sampai pengguna "tab" menjauh dari suatu bidang.

```html
<input type="text" x-model.lazy="username">
<span x-show="username.length > 20">The username is too long.</span>
```

<a name="number"></a>
### `.number`

Secara default, semua data yang disimpan dalam properti melalui `x-model` disimpan sebagai string.  Untuk memaksa Alpine menyimpan nilai sebagai nomor JavaScript, tambahkan pengubah `.number`.

```html
<input type="text" x-model.number="age">
<span x-text="typeof age"></span>
```

<a name="debounce"></a>
### `.debounce`

Dengan menambahkan `.debounce` ke `x-model`, Anda dapat dengan mudah melakukan debounce pembaruan input terikat.

Ini berguna untuk hal-hal seperti input pencarian waktu nyata yang mengambil data baru dari server setiap kali properti pencarian berubah.

```html
<input type="text" x-model.debounce="search">
```

Waktu debounce default adalah 250 milidetik, Anda dapat dengan mudah menyesuaikan ini dengan menambahkan pengubah waktu seperti itu.

```html
<input type="text" x-model.debounce.500ms="search">
```

<a name="throttle"></a>
### `.throttle`

Serupa dengan `.debounce` Anda dapat membatasi pembaruan properti yang dipicu oleh `x-model` hanya untuk memperbarui pada interval tertentu.

<input type="text" x-model.throttle="search">

Interval throttle default adalah 250 milidetik, Anda dapat dengan mudah menyesuaikan ini dengan menambahkan pengubah waktu seperti itu.

```html
<input type="text" x-model.throttle.500ms="search">
```
