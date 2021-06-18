---
order: 4
title: watch
---

# `$watch`

Anda dapat "menonton" properti komponen menggunakan metode ajaib `$watch`.  Sebagai contoh:

```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```

Dalam contoh di atas, ketika tombol ditekan dan `open` diubah, callback yang diberikan akan diaktifkan dan `console.log` nilai baru:

Anda dapat menonton properti yang sangat bersarang menggunakan notasi "titik"

```html
<div x-data="{ foo: { bar: 'baz' }}" x-init="$watch('foo.bar', value => console.log(value))">
    <button @click="foo.bar = 'bob'">Toggle Open</button>
</div>
```

Saat `<button>` ditekan, `foo.bar` akan disetel ke "bob", dan "bob" akan masuk ke konsol.

<a name="getting-the-old-value"></a>
### Mendapatkan nilai "lama"

`$watch` melacak nilai sebelumnya dari properti yang sedang ditonton, Anda dapat mengaksesnya menggunakan argumen kedua opsional untuk panggilan balik seperti:

```html
<div x-data="{ open: false }" x-init="$watch('open', (value, oldValue) => console.log(value, oldValue))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```
