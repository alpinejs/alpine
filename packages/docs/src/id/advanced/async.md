---
order: 4
title: Async
---

# Async

Alpine dibangun untuk mendukung fungsi asynchronous di sebagian besar tempat yang mendukung fungsi standar.

Contoh, katakanlah Anda memiliki fungsi sederhana yang disebut `getLabel()` yang Anda gunakan sebagai input ke direktif `x-text`:

```js
function getLabel() {
    return 'Hello World!'
}
```
```html
<span x-text="getLabel()"></span>
```

Karena `getLabel` sinkron, semuanya bekerja seperti yang diharapkan.

Sekarang mari kita berpura-pura bahwa `getLabel` membuat permintaan jaringan untuk mengambil label dan tidak dapat mengembalikannya secara instan (asynchronous). Dengan membuat `getLabel` fungsi async, Anda dapat memanggilnya dari Alpine menggunakan sintaks JavaScript `await`.

```js
async function getLabel() {
    let response = await fetch('/api/label')

    return await response.text()
}
```
```html
<span x-text="await getLabel()"></span>
```

Selain itu, jika Anda lebih suka memanggil metode di Alpine tanpa tanda kurung, Anda dapat mengabaikannya dan Alpine akan mendeteksi bahwa fungsi yang disediakan adalah async dan menanganinya sesuai dengan itu. Sebagai contoh:

```html
<span x-text="getLabel"></span>
```
