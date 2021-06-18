---
order: 11
title: effect
---

# `x-effect`

`x-effect` adalah direktif yang berguna untuk mengevaluasi ulang ekspresi ketika salah satu dependensinya berubah. Anda dapat menganggapnya sebagai pengamat di mana Anda tidak perlu menentukan properti apa yang akan ditonton, itu akan menonton semua properti yang digunakan di dalamnya.

Jika definisi ini membingungkan Anda, tidak apa-apa.  Lebih baik dijelaskan melalui contoh:

```html
<div x-data="{ label: 'Hello' }" x-effect="console.log(label)">
    <button @click="label += ' World!'">Change Message</button>
</div>
```

Saat komponen ini dimuat, ekspresi `x-effect` akan dijalankan dan "Halo" akan masuk ke konsol.

Karena Alpine tahu tentang referensi properti apa pun yang terkandung dalam `x-effect`, ketika tombol diklik dan `label` diubah", efeknya akan dipicu kembali dan "Hello World!" akan masuk ke konsol.
