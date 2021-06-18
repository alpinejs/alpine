---
order: 6
title: text
---

# `x-text`

`x-text` mengatur konten teks dari suatu elemen ke hasil ekspresi yang diberikan.

Berikut adalah contoh dasar penggunaan `x-text` untuk menampilkan nama pengguna pengguna.

```html
<div x-data="{ username: 'calebporzio' }">
    Username: <strong x-text="username"></strong>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ username: 'calebporzio' }">
        Username: <strong x-text="username"></strong>
    </div>
</div>
<!-- END_VERBATIM -->

Sekarang konten teks dalam tag `<strong>` akan disetel ke "calebporzio".
