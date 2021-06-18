---
order: 1
prefix: $
title: el
---

# `$el`

`$el` adalah properti ajaib yang dapat digunakan untuk mengambil simpul DOM saat ini.

```html
<button @click="$el.innerHTML = 'Hello World!'">Replace me with "Hello World!"</button>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data>
        <button @click="$el.textContent = 'Hello World!'">Replace me with "Hello World!"</button>
    </div>
</div>
<!-- END_VERBATIM -->
