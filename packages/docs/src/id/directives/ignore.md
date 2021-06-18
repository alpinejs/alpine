---
order: 11
title: ignore
---

# `x-ignore`

Secara default, Alpine akan merayapi dan menginisialisasi seluruh pohon DOM dari elemen yang berisi `x-init` atau `x-data`.

Jika karena alasan tertentu, Anda tidak ingin Alpine menyentuh bagian tertentu dari HTML Anda, Anda dapat mencegahnya menggunakan `x-ignore`.

```html
<div x-data="{ label: 'From Alpine' }">
    <div x-ignore>
        <span x-text="label"></span>
    </div>
</div>
```

Dalam contoh di atas, tag `<span>` tidak akan berisi "From Alpine" karena kami memberi tahu Alpine untuk mengabaikan konten `div` sepenuhnya.
