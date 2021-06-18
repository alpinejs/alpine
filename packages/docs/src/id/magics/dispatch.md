---
order: 5
title: dispatch
---

# `$dispatch`

`$dispatch` adalah jalan pintas yang berguna untuk mengirimkan acara browser.

```html
<div @notify="alert('Hello World!')">
    <button @click="$dispatch('notify')">
        Notify
    </button>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data @notify="alert('Hello World!')">
        <button @click="$dispatch('notify')">
            Notify
        </button>
    </div>
</div>
<!-- END_VERBATIM -->

Anda juga dapat meneruskan data bersama dengan acara yang dikirim jika Anda mau.  Data ini akan dapat diakses sebagai properti `.detail` dari acara:

```html
<div @notify="alert($event.detail.message)">
    <button @click="$dispatch('notify', { message: 'Hello World!' })">
        Notify
    </button>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data @notify="alert($event.detail.message)">
        <button @click="$dispatch('notify', { message: 'Hello World!' })">Notify</button>
    </div>
</div>
<!-- END_VERBATIM -->


Di bawah tenda, `$dispatch` adalah pembungkus untuk API yang lebih verbose: `element.dispatchEvent(new CustomEvent(...))`

**Catatan tentang propagasi acara**

Perhatikan bahwa, karena [event bubbling](https://en.wikipedia.org/wiki/Event_bubbling), saat Anda perlu menangkap peristiwa yang dikirim dari node yang berada di bawah hierarki bersarang yang sama, Anda harus menggunakan pengubah [`.window`](https://github.com/alpinejs/alpine#x-on):

**Contoh:**

```html
<!-- 🚫 Won't work -->
<div x-data>
    <span @notify="..."></span>
    <button @click="$dispatch('notify')">
<div>

<!-- ✅ Will work (because of .window) -->
<div x-data>
    <span @notify.window="..."></span>
    <button @click="$dispatch('notify')">
<div>
```

> Contoh pertama tidak akan berfungsi karena ketika `custom-event` dikirim, itu akan menyebar ke nenek moyang yang sama, `div`, bukan saudaranya, `<span>`. Contoh kedua akan berfungsi karena saudara kandungnya mendengarkan `notify` di level `window`, yang nantinya akan dimunculkan oleh peristiwa kustom.

<a name="dispatching-to-components"></a>
## Pengiriman ke komponen lain

Anda juga dapat memanfaatkan teknik sebelumnya untuk membuat komponen Anda berbicara satu sama lain:

**Contoh:**

```html
<div
    x-data="{ title: 'Hello' }"
    @set-title.window="title = $event.detail"
>
    <h1 x-text="title"></h1>
</div>

<div x-data>
    <button @click="$dispatch('set-title', 'Hello World!')">...</button>
</div>
<!-- When clicked, the content of the h1 will set to "Hello World!". -->
```

<a name="dispatching-to-x-model"></a>
## Pengiriman ke x-model

Anda juga dapat menggunakan `$dispatch()` untuk memicu pembaruan data untuk data binding `x-model`.  Sebagai contoh:

```html
<div x-data="{ title: 'Hello' }">
    <span x-model="title">
        <button @click="$dispatch('input', 'Hello World!')">
        <!-- After the button is pressed, `x-model` will catch the bubbling "input" event, and update title. -->
    </span>
</div>
```

Ini membuka pintu untuk membuat komponen input khusus yang nilainya dapat diatur melalui `x-model`.
