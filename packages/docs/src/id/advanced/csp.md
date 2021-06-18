---
order: 5
title: CSP
---

# CSP (Kebijakan Keamanan Konten)

Agar Alpine dapat mengeksekusi string biasa dari atribut HTML sebagai ekspresi JavaScript, misalnya `x-on:click="console.log()"`, Alpine harus bergantung pada utilitas yang melanggar kebijakan keamanan konten "eval tidak aman".

> Di bawah tenda, Alpine sebenarnya tidak menggunakan eval() itu sendiri karena lambat dan bermasalah. Alih-alih menggunakan deklarasi Fungsi, yang jauh lebih baik, tetapi masih melanggar "eval tidak aman".

Untuk mengakomodasi lingkungan di mana CSP ini diperlukan, Alpine menawarkan versi alternatif yang tidak melanggar "eval tidak aman", tetapi memiliki sintaks yang lebih ketat.

<a name="installation"></a>
## Instalasi

Like all Alpine extensions, you can include this either via `<script>` tag or module import:

<a name="script-tag"></a>
### Tag Script

```html
<html>
    <script src="alpinejs/alpinejs-csp/cdn.js" defer></script>
</html>
```

<a name="module-import"></a>
### Impor Modul

```js
import Alpine from '@alpinejs/csp'

window.Alpine = Alpine
window.Alpine.start()
```

<a name="restrictions"></a>
## Pembatasan

Karena Alpine tidak dapat lagi menafsirkan string sebagai JavaScript biasa, ia harus mengurai dan membuat fungsi JavaScript darinya secara manual.

Karena keterbatasan ini, Anda harus menggunakan `Alpine.data` untuk mendaftarkan objek `x-data` Anda, dan harus mereferensikan properti dan metode darinya hanya dengan kunci.

Misalnya, komponen sebaris seperti ini tidak akan berfungsi.

```html
<!-- Bad -->
<div x-data="{ count: 1 }">
    <button @click="count++">Increment</button>

    <span x-text="count"></span>
</div>
```

Namun, memecah ekspresi menjadi API eksternal, berikut ini valid dibangun dengan CSP:

```html
<!-- Good -->
<div x-data="counter">
    <button @click="increment">Increment</button>

    <span x-text="count"></span>
</div>
```
```js
Alpine.data('counter', () => ({
    count: 1,

    increment() { this.count++ }
}))
```
