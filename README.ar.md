# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true)](https://alpinejs.codewithhugo.com/chat/)

توفر لك Alpine.js بنية تفاعلية (تصريحية) مثل أُطر العمل الشهيرة كـ Vue و React بكُلفة وجهد أقل بكثير.

يمكنك الإحتفاظ بـ DOM والاستمرار في استخدامه، وإضافة الدّوال والوظائف له عند الحاجة.

يشبه إلى حد ما [Tailwind](https://tailwindcss.com/) ولكن في الجافاسكربت.

> ملاحظة: نشير إلى أن بُنية Alpine.js شبية جداً إلى [Vue](https://vuejs.org/) (أو [Angular](https://angularjs.org/)). أنا ممتن لهذه الأُطر بما قدموه في تطوير الويب.

## التوثيق بلغات أخرى

| Language | Link for documentation |
| --- | --- |
| Arabic | [**التوثيق باللغة العربية**](./README.ar.md) |
| Chinese Traditional | [**繁體中文說明文件**](./README.zh-TW.md) |
| German | [**Dokumentation in Deutsch**](./README.de.md) |
| Indonesian | [**Dokumentasi Bahasa Indonesia**](./README.id.md) |
| Japanese | [**日本語ドキュメント**](./README.ja.md) |
| Portuguese | [**Documentação em Português**](./README.pt.md) |
| Russian | [**Документация на русском**](./README.ru.md) |
| Spanish | [**Documentación en Español**](./README.es.md) |
| Turkish | [**Türkçe Dokümantasyon**](./README.tr.md) |
| Français | [**Documentation en Français**](./README.fr.md) |

## التركيب

**باستعمال CDN:** أضف السطر البرمجي التالي في نهاية `<head>`. 

```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
```

سيقوم Alpine.js بتهيئة نفسه، سهلة أليس كذلك!

في بيئات التطوير، نوصي باستعمال إصدار محدّد كما في الرابط، لتجنب حدوث مشاكل غير متوقعة أو تصادمها مع الإصدارات الحديثة. على سبيل المثال، لإستخدام الإصدار الأخير (2.8.0) يمكنك كتابة:

```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.0/dist/alpine.min.js" defer></script>
```

**باستعمال NPM:** قم بتنصيب الحزمة من NPM.

```js
npm i alpinejs
```

قم باستدعائها وتضمينها في مشروعك.
```js
import 'alpinejs'
```

**لدعم نسخة المتصفّح IE11** يرجى استعمال السُطور البرمجية التالية بدلاً عن السابق.

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
```

لو تُلاحظ في السطور أعلاه كتبنا [module/nomodule pattern](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/) ، تسمح هذه الأنماط للمتصفحات الحديث تحميل مجموعة الوحدات بشكل تلقائي، بينما ستقوم IE11 والمتصفحات القديمة الأخرى تحميل وحدات IE11 تلقائياً. 

## طريقة الاستخدام

القائمة المنسدلة (Dropdown) والنوافذ (Modal)
```html
<div x-data="{ open: false }">
    <button @click="open = true">فتح القائمة</button>

    <ul
        x-show="open"
        @click.away="open = false"
    >
        محتوى القائمة
    </ul>
</div>
```

*علامات التبويب (Tabs)*

```html
<div x-data="{ tab: 'foo' }">
    <button :class="{ 'active': tab === 'foo' }" @click="tab = 'foo'">Foo</button>
    <button :class="{ 'active': tab === 'bar' }" @click="tab = 'bar'">Bar</button>

    <div x-show="tab === 'foo'">النافذة Foo</div>
    <div x-show="tab === 'bar'">النافذة Bar</div>
</div>
```

يمكنك أيضاً استخدامه في أماكن أخرى: 

*التحضير المُسبق (Pre-fetching) لمُحتوى HTML.*

```html
<div x-data="{ open: false }">
    <button
        @mouseenter.once="
            fetch('/dropdown-partial.html')
                .then(response => response.text())
                .then(html => { $refs.dropdown.innerHTML = html })
        "
        @click="open = true"
    >إظهار القائمة</button>

    <div x-ref="dropdown" x-show="open" @click.away="open = false">
        جارٍ التحميل ...
    </div>
</div>
```

## الشرح

هناك إجمالي 14 موجّهاً مُتاحا:

| الموجّه | الوصف |
| --: | --: |
| [`x-data`](#x-data) | إعلان أو تعريف حقل (Scope) جديد للمكوّن. |
| [`x-init`](#x-init) | ينفّذ تعليمات برمجية عند تشغيل إحدى المكوّنات. |
| [`x-show`](#x-show) | إظهار أو إزالة العناصر بناء على التعبيرات المنطقية `display: none;` صحيحة أو خاطئة. |
| [`x-bind`](#x-bind) | يضبط قيمة السّمة (attribute) على حسب نتائج تعليمات الجافاسكربت. |
| [`x-on`](#x-on) | يربط المُنصِت للأحداث (event listener) بالعنصر، يتم تنفيذ تعليمات الجافاسكربت عند التفاعل معه. |
| [`x-model`](#x-model) | يضيف اتصال للبيانات ثنائي الإتجاه "two-way data binding" حيث أن القيم الذي يُدخلها المستخدم تتم مزامنتها مع قيمة بيانات العنصر للمكوّن. |
| [`x-text`](#x-text) | يعمل بشكل مشابه لـ `x-bind`، ولكنه يقوم بتحديث النص المضمن `innerText` داخل العنصر. |
| [`x-html`](#x-html) | يعمل بشكل مشابه لـ `x-bind`، ولكنه يقوم بتحديث النص المضمن `innerText` داخل العنصر. |
| [`x-ref`](#x-ref) | طريقة بسيطة لإسترجاع عنصر داخل DOM موجود خارج المكوّن الخاص بك. |
| [`x-if`](#x-if) | إزالة عنصر تماماً من DOM. يجب استخدامه داخل وَسم `<template>` |
| [`x-for`](#x-for) | ينشئ فروع DOM جديدة لكل عنصر من عناصر المصفوفة. يجب استخدامه داخل وَسم `<template>` |
| [`x-transition`](#x-transition) | توجيه لعمل تأثيرات إنتقالية في مراحل مختلفة على الأصناف (Classes) |
| [`x-spread`](#x-spread) | يسمح لك بربط الكائنات التي تحتوي على توجيهات Alpine بالعناصر، لتحسين إمكانية إعادة استخدامه بشكل أفضل. |
| [`x-cloak`](#x-cloak) | تتم إزالة هذه السمة عند تهيئة Alpine. مفيد لإخفاء DOM المُهيأ مسبقًا. |

و 6 خصائص سحرية:

| الخصائص السحرية | الوصف |
| --: | --: |
| [`$el`](#el) | ترجع فرع DOM الخاص بالمكوّن الأساسي (root component). |
| [`$refs`](#refs) | يسترجع عناصر DOM المميّزة بـ `x-ref` داخل المكوّن. |
| [`$event`](#event) | يرجع كائن الحدث "Event"  الأصلي داخل المُتنصت لأحداث المستخدم. |
| [`$dispatch`](#dispatch) | ينشئ حدثاً مخصصا `CustomEvent` ويرسله داخلياً باستخدام `.dispatchEvent()`. |
| [`$nextTick`](#nexttick) | بعد معالجة Alpine لتحديث DOM يتم تنفيذ تعليمات برمجية. |
| [`$watch`](#watch) | يقوم باستدعاء callback تم تحديده مسبقاً عندما يتم تعديل خاصية المُراقب "watched" |


## الرعاة

<img width="33%" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" alt="Tailwind CSS">

**هل تريد عرض شعارك هنا؟ [راسلني على تويتر](https://twitter.com/calebporzio)**

## مشاريع المجتمع

* [AlpineJS Weekly Newsletter](https://alpinejs.codewithhugo.com/newsletter/)
* [Spruce (State Management)](https://github.com/ryangjchandler/spruce)
* [Turbolinks Adapter](https://github.com/SimoTod/alpine-turbolinks-adapter)
* [Alpine Magic Helpers](https://github.com/KevinBatdorf/alpine-magic-helpers)
* [Awesome Alpine](https://github.com/ryangjchandler/awesome-alpine)

### الموجّهات

---

### `x-data`

**المثال:** `<div x-data="{ foo: 'bar' }">...</div>`

**البُنية:** `<div x-data="[object literal]">...</div>`

تعرّف `x-data` حقل/نطاق جديد للمكوّن، يخبر Alpine بتهيئة المكوّن الجديد  بكائن البيانات المعرّف والمحدّد مسبقاً.

مشابه لخاصية `data` بالمكونّات في إطار Vue.

**استخراج التعابير المنطقية للمكوّن**

يمكنك من استخراج مصدر البيانات والتعاملات ذات الصّلة إلى دوال قابلة لإعادة الاستخدام. 

```html
<div x-data="dropdown()">
    <button x-on:click="open">فتح</button>

    <div x-show="isOpen()" x-on:click.away="close">
        // القائمة المنسدلة
    </div>
</div>

<script>
    function dropdown() {
        return {
            show: false,
            open() { this.show = true },
            close() { this.show = false },
            isOpen() { return this.show === true },
        }
    }
</script>
```

> لمستخدمي مجمّع الوحدات (bundler): يرجى ملاحظة أن الدوال التي يصل إليها Alpine.js في النطاق العام (window). فلاستخدام x-data يجب أن تصرّحها إلى `window`. على سبيل المثال `window.dropdown = function () {}` (لأنه في Webpack ،Rollup ،Parcel وما إلى ذلك، الدّوال التي تكتبتها تكون بشكل إفتراضي ضِمن نطاق الوحدة "module" وليس في نطاق الصفحة `window`).


يمكنك أيضاً دمج عدة كائنات متعددة معاً باستخدام محلّل الكائنات (object destructuring).

```html
<div x-data="{...dropdown(), ...tabs()}">
```

---

### `x-init`
**المثال:** `<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`

**البُنية:** `<div x-data="..." x-init="[expression]"></div>`

ينفّذ `x-init` تعليمات برمجية عند تشغيل وتهيئة إحدى المكوّنات.

إذا أردت تنفيذ التعليمات البرمجية بعد أن يجري Alpine تحديثه على DOM (مُماثل لـ `mounted()` في Vue.js) يمكنك إرجاع callback من `x-init` وسيتم تشغيله بعدها:

`x-init="() => { // يمكننا الوصول إلى DOM بعد تهيئته // }"`

---

### `x-show`
**المثال:** `<div x-show="open"></div>`

**البُنية:** `<div x-show="[expression]"></div>`

تمكّننا `x-show` من إظهار أو إزالة العناصر بناء على التعبيرات المنطقية `display: none;` صحيحة أو خاطئة.

**x-show.transition**

`x-show.transition` عبارة عن واجهة "API" يمكنها تحسين `x-show` وجعله أكثر جمالية باستخدام تأثيرات CSS transitions.

```html
<div x-show.transition="open">
    يتم عمل تأثير بصري بالظهور "in" و الإختفاء "out"
</div>
```

| التوجيهات | الوصف |
| ---: | ---: |
| `x-show.transition` | يتلاشى ويتقلص بمرور الوقت (opacity, scale: 0.95, timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), duration-in: 150ms, duration-out: 75ms). |
| `x-show.transition.in` | تأثير انتقالي "in" فقط. |
| `x-show.transition.out` | تأثير خارجي "out" فقط. |
| `x-show.transition.opacity` | تأثير التلاشي فقط. |
| `x-show.transition.scale` | تأثير على الحجم فقط. |
| `x-show.transition.scale.75` | ضبط قيمة الحجم `transform: scale(.75)`. |
| `x-show.transition.duration.200ms` | يضبط قيمة الانتقال الأولي "in" إلى 200 مللي ثانية. تأخذ قيمة الانتقال النهائي "out" نصف القيمة المحددة (في هذه الحالة 100 مللي ثانية). |
| `x-show.transition.origin.top.right` | تنسيق التحولات CSS transform الأصلية `transform-origin: top right` |
| `x-show.transition.in.duration.200ms.out.duration.50ms` | تأثيرات على فترات مختلفة "in" و "out". |


> ملاحظة: يمكنك دمج جميع التاثيرات مع بعضها البعض (على الرغم من أنها غريبة ربما): `x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale.95`

> ملاحظة: سينتظر `x-show` إلى حين أن تنتهني جميع التأثيرات، إذا كنت تريد تجاهلها، أضف المعدّل `.immediate`
```html
<div x-show.immediate="open">
    <div x-show.transition="open">
</div>
```
---

### `x-bind`

> ملاحظة: يمكنك اختصار الكتابة باستعمال النقطتين ":" كـ `:type="..."`

**المثال:** `<input x-bind:type="inputType">`

**البُنية:** `<input x-bind:[attribute]="[expression]">`

يضبط قيمة السّمة (attribute) على حسب نتائج تعليمات الجافاسكربت. ويمكن لهذه التعليمات أن تصل الى جميع بيانات المكوّن. ويتم تحديثه في كل مرة يتم فيها تحديث بياناته.

> ملاحظة: يتم تحديث ارتباطات السمات (binding) فقط إذا تم تحديث قيّمها. يكتشف Alpine تلقائيًا هذه القيم والتحديثات ثم يحسّنها.

**استخدام `x-bind` لـ class attributes**

يتصرف `x-bind` بشكل مختلف قليلاً عند تحديد الصنف (class attribute).

بالنسبة للأصناف (classes) قم بتمرير كائن يكون مفتاحه هو إسم الفئة، وقيم هذه الأزواج عبارة عن تعبيرات منطقية تحدّد ما إذا كان يتم تطبيق الصنف على العنصر أم لا.

كمثال:
`<div x-bind:class="{ 'hidden': foo }"></div>`

في هذا المثال يتم تطبيق الصنف "hidden" فقط عندما تكون قيمة foo صحيحة `true`.

**`x-bind` للسمات المنطقية (boolean attributes)**

يدعم `x-bind` المتغيرات بالإضافة إلى تعبيرات الجافاسكربت في حالة إذا كانت تُرجع قيمة منطقية صحيحة أو خاطئة (`true` أو `false`).

كمثال:
```html
<!-- العبارة: -->
<button x-bind:disabled="myVar">إضغطني</button>

<!-- إذا myVar == true: -->
<button disabled="disabled">إضغطني</button>

<!-- في حال myVar == false:  -->
<button>Click me</button>
```

هنا تتم إضافة السمة `disabled` أو إزالتها بناءً على قيمة المتغيّر `myVar`.

تدعم كذلك Alpine سمات منطقية مختلفة  HTML specification كـ:  `disabled`,`readonly`,`required`,`checked`,`hidden`,`selected`,`open` وغيرها.

المُعدّل .camel
مثال: <svg x-bind:view-box.camel="viewBox">

يقوم المعدّل بضبط وربط حالة الأحرف بصيغة camel case لإسم السمة. في المثال أعلاه، تم ربط قيمة viewBox بِسِمة viewBox (بدلاً من view-box).

---

### `x-on`

> ملاحظة: يمكنك اختصار الكتابة باستعمال النقطتين ":" كـ `@click="..."`

**المثال:** `<button x-on:click="foo = 'bar'"></button>`

**البُنية:** `<button x-on:[event]="[expression]"></button>`

يقوم x-on بإرفاق المُنصت للأحداث (event listener). عندما يتم حدث (event) من قِبل المستخدم يتم تنفيذ تعليمات الجافاسكربت المحددة.

يتم تحديث السِمات الأخرى للعنصر المرتبطة بمصدر البيانات هذا بمجرد تعديل البيانات الموجودة في التعليمات البرمجية.

> ملاحظة: اختياريًا، يمكن أيضًا تحديد اسم دالة JavaScript.

**المثال:** `<button x-on:click="myFunction"></button>`

هذه تكافئ: `<button x-on:click="myFunction($event)"></button>`

**المُعدّل `keydown` **

**المثال:** `<input type="text" x-on:keydown.escape="open = false">`

يمكنك الإستجابة لأحداث معينة ينقر عليها المستخدم في لوحة المفاتيح باستخدام المعدّلات `x-on:keydown`. يرجى ملاحظة أن هذا المُعدّل يستخدم صيغة kebab-case لتسمية قيم `Event.key`.

أمثلة: `enter`, `escape`, `arrow-up`, `arrow-down`

> يمكننا كذلك الإستجابة أزرار لوحة المفاتيح الأساسية كـ `x-on:keydown.cmd.enter="foo"`

**المُعدّل `.away`**

**المثال:** `<div x-on:click.away="showModal = false"></div>`

لا يتم تنفيذ تعبير Event Handler إلا إذا لم يتم تشغيل الحدث بواسطة العنصر نفسه (أو مكوناته الفرعية).

هذا مفيد لإخفاء القوائم المنسدلة والنوافذ عندما ينقر المستخدم في مكان آخر.

**المُعدّل `.prevent`**
**المثال:** `<input type="checkbox" x-on:click.prevent>`

تؤدي إضافة `.prevent` إلى مستمع الحدث إلى استدعاء منع `preventDefault` في الحدث الذي سيتم تنفيذه. في المثال أعلاه، هذا يعني أن مربع الاختيار لن يتم تحديده بالفعل عندما ينقر المستخدم عليه.

**المُعدّل`.stop`**
**المثال::** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

إضافة `.stop` إلى المتصنّت للأحداث يستدعي `stopPropagation.` في المثال أعلاه،  يعني أن الحدث "click" لن ينتقل إلى  `<div>` الخارجي. بمعنى آخر، عندما ينقر المستخدم على الزر، لا يتم تعريف `foo` على أنه `bar`.

**المُعدّل `.self`**
**المثال:** `<div x-on:click.self="foo = 'bar'"><button></button></div>`

إضافة .self إلى المتصنّت للأحداث إلى تشغيل الحدث فقط إذا كان `$event.target` و نفسه العنصر. في المثال أعلاه، يعني أنه عند النقر على الزر "button" لن يتم تشغيل الحدث

**المُعدّل `.window`**
**المثال:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

إضافة `.window` إلى مستمع الأحداث، سيقوم بتثبيت المتصنّت للأحداث على نافذة المتصفّح كله `window` بدلاً من DOM الذي قمت بتصريحه أو تحديده. هذا مفيد لك في حال أردت ضبط أحد المكوّنات وتغييرها على حسب حجم (أبعاد) المتصفّح. في المثال أعلاه سيتم إغلاق النافذة أو القائمة المنسدلة إذا تجاوزت أبعاد المتصفح 768 بكسل، خلاف ذلك نُبقيه على حالته.

>ملاحظة: يمكنك أيضًا استخدام معدّل `.document` لإرفاق المتصنّت بدلا من `window`.

**المُعدّل `.once`**
**المثال:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

تعني إضافة المعدّل `.once` إلى المتصنّت للحدث أن المنصت (listener) يعمل مرة واحدة فقط. هذا مفيد للمهام التي تريد القيام بها مرة واحدة فقط، مثل الجلب الجزئي لشفرات HTML أو ما شابه.

**المُعدّل `.passive` **
**المثال:** `<button x-on:mousedown.passive="interactive = true"></button>`

إذا أضفنا `.passive` إلى المتصنّت للحدث، فإن هذا الرمز المميز سيعطل وظيفة `preventDefault()` ولن تعمل على أي حدث يتم تنفيذه. يمكن أن يساعدك أحياناً في تحسين أداء التمرير (scroll) على الأجهزة التي تعمل باللمس.

**المُعدّل `.debounce`**
**المثال:** `<input x-on:input.debounce="fetchSomething()">`

يتيح لك تحديد `.debounce` وقت تنفيذ الأحداث، لن يعمل معالج الأحداث (event handler) فقط إذا مرت فترة زمنية معينة منذ آخر حدث، عندما يكون المعالج جاهزاً للتنفيذ سيتم تنفيذ آخر استدعاء للمعالج.

مهلة الإنتظار "wait" الإفتراضية هي 250 مللي ثانية.

إذا أردت تخصيص مهلة الإنتظار يمكنك استخدام الطريقة التالية:

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

**المُعدّل `.camel`**
**المثال:** `<input x-on:event-name.camel="doSomething()">`

يقوم المتصنّت للأحداث بالإنصات إلى الأحداث التي تحمل حالة أحرف بصيغة camelCase. في هذا المثال سيتم تنفيذها للعناصر التي تحمل اسم `eventName`.

---

### `x-model`
**المثال:** `<input type="text" x-model="foo">`

**البُنية:** `<input type="text" x-model="[data item]">`

يضيف `x-model` ربط بيانات ثنائي الإتجاه "two-way data binding" (أي أن ربط البيانات يكون في كلا الطرفين). بمعنى آخر، أن قيمة العنصر تتم مزامنتها مع قيمة بيانات عنصر للمكوّن.

> يكتشف `x-model` تلقائياً التغييرات التي تطرأ على العناصر التالية:  text inputs ،checkboxes ،radio buttons ،textareas ،selects ،multiple selects.
> يمكنك فهم كيف يعمل ذلك في الخفاء في "سيناريوهات" إطار عمل [how Vue would](https://vuejs.org/v2/guide/forms.html).

**المُعدّل `.number`**
**المثال:** `<input x-model.number="age">`

يقوم `.number` بتحويل القيمة المدخلة عبر `<input>` إلى رقم. في حال تعذّر تحليل القيمة المدخلة أنه رقم فعلاً سيُرجع القيمة الأصلية المدخلة.

**المُعدّل `.debounce`**
**المثال:** `<input x-model.debounce="search">`

يتيح لك تحديد `.debounce` وقت تنفيذ الأحداث، لن يعمل معالج الأحداث (event handler) فقط إذا مرت فترة زمنية معينة منذ آخر حدث، عندما يكون المعالج جاهزاً للتنفيذ سيتم تنفيذ آخر استدعاء للمعالج.

مهلة الإنتظار "wait" الإفتراضية هي 250 مللي ثانية.

إذا أردت تخصيص مهلة الإنتظار يمكنك استخدام الطريقة التالية:

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

---

### `x-text`
**المثال:** `<span x-text="foo"></span>`

**البُنية:** `<span x-text="[expression]"`

يعمل بشكل مشابه لـ `x-bind`، ولكنه يقوم بتحديث النص المضمن `innerText` داخل العنصر.  

---

### `x-html`
**المثال:** `<span x-html="foo"></span>`

**البُنية:** `<span x-html="[expression]"`

يعمل بشكل مشابه لـ `x-bind`، ولكنه يقوم بتحديث شفرة HTML المضمنة  `innerText` داخل العنصر. 

> :warning: **في هذه الحالة نوصي بكتابة محتوى (شفرات نظيفة) ولا تسمح بمُدخلات المُستخدم (user-provided)** :warning:
>
> يمكن أن يؤدي عرض HTML على المتصفّح من جهات خارجية أن توقع موقعك بثغرات [XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting).

---

### `x-ref`
**المثال:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**البُنية:** `<div x-ref="[ref name]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`

توفر `x-ref` طريقة مفيدة لجلب عناصر DOM خارج المكون الخاص بك، عندما تقوم بتعيين `x-ref` للعنصر، سيكون متاحاً لجميع معالجات الأحداث داخل الكائن عن طريق استدعاء `$refs`. 

بديل مفيد  في حال كان يجب استخدام الأمر `document.querySelector` في كثير من الأحيان للإشارة إلى العناصر.

> يمكنك أيضا عمل ربط القيم المتغيّرة (الديناميكية) بـ `<span :x-ref="item.id"></span>` .

---

### `x-if`
**المثال:** `<template x-if="true"><div>Some Element</div></template>`

**البُنية:** `<template x-if="[expression]"><div>Some Element</div></template>`

إذا كانت وظيفة `x-show` (كما شرحناها سابقاً) غير كافية، فيمكن استخدام `x-if` بدلاً من ذلك لإزالة عنصر بالكامل من DOM.

نظرًا لأن Alpine لا يحتوي على DOM افتراضي، يجب استخدام `x-if` مع الوسم `<template></template>`. بحيث يسمح لـ Alpine  البقاء مستقرًا والوصول إلى DOM الحقيقي.

> ملاحظة: عند استخدام `x-if`، يجب أن يكون هناك عنصر جذر واحد (element root) على الأقل داخل `<template></template>`

> ملاحظة: عند استخدام template في svg، ستحتاج إلى إضافة [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) الذي يجب تنفيذه قبل تهيئة Alpine.js. 

---

### `x-for`
**المثال:**

```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

> ملاحظة: هذا `:key` مفتاح اختياري ، ومع ذلك، نوصى به وبشدة.

يُعدّ `x-for` مناسباً للحالات التي يلزم فيها انشاء عقدة DOM جديدة لكل عنصر داخل المصفوفة. مشابه لـ `v-for` في Vue، ولكن الإختلاف الوحيد هو أنه يجب وضعه في وسم `template` بدلاً من عنصر DOM عادي.

إذا كنت ترغب في الوصول إلى الفهرس الحالي (current index) للتكرار، فاستخدم الصيغة التالية:

```html
<template x-for="(item, index) in items" :key="index">
    <!-- يمكنك أيضًا الرجوع إلى "index" داخل التكرار إذا لزم الأمر. -->
    <div x-text="index"></div>
</template>
```

إذا كنت ترغب في الوصول إلى تكرار مصفوفة كائن (array object)، فاستخدم الصيغة التالية:

```html
<template x-for="(item, index, collection) in items" :key="index">
    <!-- يمكنك أيضًا الرجوع إلى "collection" في التكرار متى احتجت إلى ذلك. -->
    <!-- العنصر الحالي. -->
    <div x-text="item"></div>
    <!--نفس العنصر المذكور أعلاه. -->
    <div x-text="collection[index]"></div>
    <!-- لعنصر السابق. -->
    <div x-text="collection[index - 1]"></div>
</template>
```

> ملاحظة: عند استخدام `x-for`، يجب أن يكون هناك عنصر جذر واحد (element root) على الأقل داخل `template`.

> ملاحظة: عند استخدام template في svg، ستحتاج إلى إضافة [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) الذي يجب تنفيذه قبل تهيئة Alpine.js. 

#### تداخل `x-for`
يمكنك عمل حلقات تكرار داخل حلقات x-for ولكن يجب أن نلّف (wrap) كل دورة في عنصر. مثلا:

```html
<template x-for="item in items">
    <div>
        <template x-for="subItem in item.subItems">
            <div x-text="subItem"></div>
        </template>
    </div>
</template>
```

#### التكرار داخل مجال:

يدعم Alpine صيغة `i in n`، حيث يمثّل n عدداً صحيحاً مما يسمح لك بعمل تكرار على مجال معين من العناصر.

```html
<template x-for="i in 10">
    <span x-text="i"></span>
</template>
```

---

### `x-transition`
**المثال:**

```html
<div
    x-show="open"
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0 transform scale-90"
    x-transition:enter-end="opacity-100 transform scale-100"
    x-transition:leave="transition ease-in duration-300"
    x-transition:leave-start="opacity-100 transform scale-100"
    x-transition:leave-end="opacity-0 transform scale-90"
>...</div>
```

```html
<template x-if="open">
    <div
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0 transform scale-90"
        x-transition:enter-end="opacity-100 transform scale-100"
        x-transition:leave="transition ease-in duration-300"
        x-transition:leave-start="opacity-100 transform scale-100"
        x-transition:leave-end="opacity-0 transform scale-90"
    >...</div>
</template>
```

> المثال أعلاه يستخدم تنسيقات [Tailwind CSS](https://tailwindcss.com/)

يوفر Alpine ستة تأثيرات إنتقالية مختلفة لتطبيق الفئات (Classes) على مراحل مختلفة من انتقال العنصر، بين الحالات "hidden" و "shown". تعمل هذه التوجيهات مع كل من x-show و x-if.

تعمل هذه تمامًا مثل توجيهات التأثير بـ VueJS، باستثناء أن لها أسماء مختلفة وأكثر منطقية:

| التوجيه | الوصف |
| ---: | ---: |
| `:enter` | يتم تطبيقه طوال مرحلة الدخول. |
| `:enter-start` | تتم إضافته قبل إدراج العنصر وإزالة الإطار (frame) بعد إدراج العنصر. |
| `:enter-end` | تمت إضافة إطار (frame) واحد بعد إدراج العنصر (في نفس الوقت تتم إزالة `enter-start`) ، تتم إزالته عند انتهاء التأثير/التحريك. |
| `:leave` | تُطبق طوال مرحلة الخروج. |
| `:leave-start` | يُضاف مباشرة عند بدء انتهاء التأثير، وإزالته بعد إطار واحد. |
| `:leave-end` | تمت إضافة إطار بعد تشغيل "انتهاء التأثير" (في نفس الوقت الذي تتم فيه إزالة `leave-start`) ، وتتم إزالته عند انتهاء التأثير/التحريك. |

---

### `x-spread`
**المثال:**

```html
<div x-data="dropdown()">
    <button x-spread="trigger">فتح القائمة المنسدلة</button>

    <span x-spread="dialogue">محتوى القائمة</span>
</div>

<script>
    function dropdown() {
        return {
            open: false,
            trigger: {
                ['@click']() {
                    this.open = true
                },
            },
            dialogue: {
                ['x-show']() {
                    return this.open
                },
                ['@click.away']() {
                    this.open = false
                },
            }
        }
    }
</script>
```

يتيح `x-spread` نقل ربط الكائنات التي تحتوي على توجيهات Alpine لعنصر ما، إلى كائن يمكن إعادة استخدامه.

مفاتيح الكائن (object keys) عبارة عن توجيهات (يمكن أن يكون أي توجيهات بما في ذلك المُعدّلات) والقيم عبرة عن عمليات callback يتم تنفيذ قيمها بواسطة Alpine.

> ملاحظة: هناك بعض الأشياء التي يجب مراعاتها في `x-spread`:
> - الحالة الخاصة الوحيدة لـ spread هي استخدامه مع `x-for`. عند تطبيقه على التوجيه `x-for`، يجب إرجاع تعليمات نصيّة (string) عادية بواسطة callback.  كمثال `['x-for']() { return 'item in items' }`
> - `x-data` و  `x-init` لا يمكن إستخدامهما داخل كائن "spread".

---

### `x-cloak`
**المثال:** `<div x-data="{}" x-cloak></div>`

تتم إزالة سمة `x-cloak` من العنصر أثناء تهيئة Alpine. يساعد هذا في إخفاء DOM المهيأ مسبقاً. لكي يعمل هذا عليك بإضافة التعليمات التالية:

```html
<style>
    [x-cloak] { display: none; }
</style>
```

### الخصائص السحرية

> باستثناء $el، **لا يمكن استخدام الخصائص السحرية ضمن x-data** في حال المكوّن لم تتم تهيئته بعد.

---

### `$el`
**المثال:**

```html
<div x-data>
    <button @click="$el.innerHTML = 'foo'">استبدلني بـ "foo"</button>
</div>
```

`$el` خاصية سحرية للوصول إلى فرع DOM الأساسي.

### `$refs`
**المثال:**

```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

يسترجع عناصر DOM المميّزة بـ `x-ref` داخل المكوّن، مفيدًا عندما تحتاج عناصر DOM إلى التعديل يدويًا.

---

### `$event`
**المثال:**

```html
<input x-on:input="alert($event.target.value)">
```

يرجع كائن الحدث "Event"  الأصلي داخل المُتنصت لأحداث المستخدم.

> ملاحظة: خاصية $event متاحة فقط في تعليمات DOM.

إذا أردت تمرير $event داخل دوال الجافاسكربت فيمكنك تمريرها مباشرة.

`<button x-on:click="myFunction($event)"></button>`

---

### `$dispatch`
**المثال:**

```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
    <!--عند النقر عليه، يقوم console.log بطباعة "bar" -->
</div>
```

`$dispatch`هي طريقة مختصرة لإنشاء أحداث مخصصة `CustomEvent` وإرسالها داخلياً باستخدام `.dispatchEvent()` هناك العديد من حالات الاستخدام التي يكون فيها إرسال البيانات بين المكونات من خلال أحداث يحددها المستخدم خيارًا جيداً. هنا يمكنك العثور على [مزيد من المعلومات](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) حول نظام CustomEvent الأساسي في المتصفحات.

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')">
        <!-- عندما يتم النقر فوق الزر `x-model` يتلقط حدث "input" الناشئ ويقوم بتحديث foo إلى"baz ". -->
    </span>
</div>
```

**ملاحظة حول انتشار الحدث** (**Event Propagation**)

إذا كنت ترغب في توقيف الأحداث التي يتم تشغيلها بواسطة عقد HTML داخل نفس التسلسل الهرمي المتداخل (يعني `div` داخل `div` وهكذا)، فيجب عليك استخدام المُعدِّل `.window`.

مثال:

```html
<div x-data>
    <span @custom-event="console.log($event.detail.foo)"></span>
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
<div>
```

> ملاحظة: المثال أعلاه لن يعمل بشكل جيّد. لأنه إذا تم تشغيل الحدث المخصص، فسيتم انتشاره "تشغيله" في العناصر الرئيسية المشتركة بـ div.

**Dispatching to Components**

يمكن أيضًا استخدام الطريقة الموضحة أعلاه لتمكين الاتصال بين المكونات:

**مثال:**

```html
<div x-data @custom-event.window="console.log($event.detail)"></div>

<button x-data @click="$dispatch('custom-event', 'Hello World!')">
<!--عندما تنقر سيطبع console.log "Hello World!". -->
```

يمكنك أيضا استخدام `$dispatch()` لبدء تحديث البيانات من روابط `x-model`. على سبيل المثال:

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')">
        <!-- بعد النقر على عنصر `<button>` ، سيعترض `x-model` حدث "input" ويحدّث foo بـ "bar" -->
    </span>
</div>
```
> ملاحظ: خاصية $dispatch متاحة فقط ضمن تعليمات DOM.

إذا أردت تمرير $dispatch داخل دوال الجافاسكربت فيمكنك تمريرها مباشرة.

`<button x-on:click="myFunction($dispatch)"></button>`

---

### `$nextTick`
**المثال:**

```html
<div x-data="{ fruit: 'apple' }">
    <button
        x-on:click="
            fruit = 'pear';
            $nextTick(() => { console.log($event.target.innerText) });
        "
        x-text="fruit"
    ></button>
</div>
```

`$nextTick` هي خاصية تعني أن التعليمات لا يتم تنفيذها إلا بعد أن يقوم Alpine بتنفيذ تحديثات DOM التفاعلية. هذا مفيد إذا كنت لا تريد التفاعل مع DOM حتى يتم إجراء جميع تحديثات للبيانات.

---

### `$watch`
**المثال:**

```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```

تمكّنك `$watch` في المثال أعلاه أنه عند الضغط فوق الزر "button" ويتم تفعليه `open`، يقوم callback بتنفيذ `console.log` وطباعة القيمة الجديدة.

## الحماية
إذا وجدت ثغرة أمنية، يُرجى إرسال بريد إلكتروني إلى: [calebporzio@gmail.com]().

يعتمد Alpine على `function` لتنفيذ خصائصه. على الرغم من كونها أنها أكثرَ أماناً من `eval()` إلا أن هذه الممارسة مازالت محظورة في بعض البيئات المقيّدة مثل Google Chrome App باستخدام سياسة أمان المحتوى المقيد ([CSP](https://csp.withgoogle.com/docs/strict-csp.html)).

إذا كنت تستخدم Alpine في بيئة بها بيانات حساسة وتحتاج إلى [CSP](https://csp.withgoogle.com/docs/strict-csp.html)، فأنت بحاجة إلى تضمين التقييم غير الآمن `unsafe-eval` في سياستك. يساعد في وضع سياسات قوية على حماية المستخدمين عند استخدام المعلومات الشخصية والمالية.

نظرًا لأن السياسة تنطبق على جميع البرامج النصية في صفحتك، فمن المهم أن تتم مراجعة المكتبات الخارجية الأخرى المضمنة في موقعك بعناية للتأكد من أنها جديرة لإستعمالها وآمنة ولن تقدم أي ثغرة أمنية XSS أو (Cross Site Scripting vulnerability)  عبر الموقع سواء باستخدام وظيفة `eval()` أو التلاعب بـ DOM لإدخال تعليمات برمجية ضارة في صفحتك.

## الرخصة

حقوق النشر محفوظة  © 2019-2020 لـ Caleb Porzio والمساهمين.

مرخص بموجب ترخيص MIT، راجع [LICENSE.md](LICENSE.md) للحصول على التفاصيل.