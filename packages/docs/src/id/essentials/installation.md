---
order: 1
title: Installation
---

# Instalasi

Ada 2 cara untuk memasukkan Alpine ke dalam proyek Anda:

* Menyertakannya dari tag `<script>`
* Mengimpornya sebagai modul

Keduanya benar-benar valid. Itu semua tergantung pada kebutuhan proyek dan selera pengembang.

<a name="from-a-script-tag"></a>
## Dari tag skrip

Sejauh ini, ini adalah cara paling sederhana untuk memulai dengan Alpine. Sertakan tag `<script>` berikut di kepala halaman HTML Anda.

```html
<html>
  <head>
    ...

    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
  </head>
  ...
</html>
```

> Jangan lupa atribut "defer" di tag `<script>`.

Perhatikan `@3.x.x` di tautan CDN yang disediakan. Ini akan menarik versi terbaru dari Alpine versi 3. Untuk stabilitas dalam produksi, disarankan agar Anda melakukan hardcode versi terbaru di tautan CDN.

```html
<script defer src="https://unpkg.com/alpinejs@3.0.6/dist/cdn.min.js"></script>
```

Itu dia! Alpine sekarang tersedia untuk digunakan di dalam halaman Anda.

<a name="as-a-module"></a>
## Sebagai modul

Jika Anda lebih suka pendekatan yang lebih kuat, Anda dapat menginstal Alpine melalui NPM dan mengimpornya ke dalam bundel.

Jalankan perintah berikut untuk menginstalnya.

```bash
npm install alpinejs
```

Sekarang impor Alpine ke dalam bundel Anda dan inisialisasi seperti ini:

```js
import Alpine from 'alpinejs'

window.Alpine = Alpine

Alpine.start()
```

> Butir.Alpine = alpine` bit adalah opsional, tapi bagus untuk memiliki kebebasan dan fleksibilitas.Seperti saat berjemur dengan Alpine dari devtools misalnya.
