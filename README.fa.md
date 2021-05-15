<div dir="rtl">
  
# Alpine.js - آلپاین‌جی‌اس

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true)](https://alpinejs.codewithhugo.com/chat/)

Alpine.js ماهیت واکنشی و اعلانی چهارچوب‌های بزرگی مانند Vue یا React را با هزینه‌ای بسیار کمتر به شما ارائه می‌دهد.

شما می‌توانید ضمن حفظ ساختار DOM، رفتارهای مورد نظرتان را به شکلی صلاح می‌دانید به برنامه‌تان اضافه کنید.

فکر کنید آلپاین برای جاوااسکریپت، همانند [Tailwind](https://tailwindcss.com/) است برای سی‌اس‌اس.

> نکته: قواعد گارشی و نحو این ابزار، تقریبا به صورت کامل از [Vue](https://vuejs.org/) ( و به طبع آن از [Angular](https://angularjs.org/) ) اقتباس شده است.
من تا ابد شکرگزار موهبت این دو چهارچوب برای دنیای وب خواهم بود.

## ترجمه‌های مستندات

| زبان | پیوند به مستندات |
| --- | --- |
| انگلیسی | [**Documentation In English**](./README.md) |
| عربی | [**التوثيق باللغة العربية**](./README.ar.md) |
| چینی ساده | [**简体中文文档**](./README.zh-CN.md) |
| چینی سنتی | [**繁體中文說明文件**](./README.zh-TW.md) |
| آلمانی | [**Dokumentation in Deutsch**](./README.de.md) |
| اندونزیایی | [**Dokumentasi Bahasa Indonesia**](./README.id.md) |
| ژاپنی | [**日本語ドキュメント**](./README.ja.md) |
| نروژی | [**Dokumentasjon på norsk**](./README.no.md) |
| پرتغالی | [**Documentação em Português**](./README.pt.md) |
| روسی | [**Документация на русском**](./README.ru.md) |
| اسپانیایی | [**Documentación en Español**](./README.es.md) |
| ترکی | [**Türkçe Dokümantasyon**](./README.tr.md) |
| فرانسوی | [**Documentation en Français**](./README.fr.md) |
| کره‌ای | [**한국어 문서**](./README.ko.md) |

## نصب

**از CDN :** اسکریپت زیر را به انتهای بخش `<head>` کد خود اضافه کنید.

<div dir="ltr">

```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
```

</div>

همین کافی است! خودش مقداردهی اولیه را انجام می‌دهد.

برای محیط تولید (Production Environment)، پیشنهاد می‌شود که عدد نگارش مورد نظر خود را به انتهای پیوند اضافه کنید تا جلوی خطاهای غیر منتظره از نگارش‌های جدید گرفته شود.

برای مثال برای استفاده از نگارش `2.8.2` (آخرین نگارش در زمان نوشتن این ترجمه):

<div dir="ltr">

```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.2/dist/alpine.min.js" defer></script>
```

</div>

**از npm :** بسته را از npm نصب کنید.

<div dir="ltr">

```js
npm i alpinejs
```

</div>

در اسکریپت خود وارد کنید.

<div dir="ltr">

```js
import 'alpinejs'
```

</div>

** برای پشتیبانی از اینترنت اکسپلورر ۱۱: ** از اسکریپت‌های زیر استفاده کنید.

<div dir="ltr">

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
```

</div>

الگوی بالا، [module/nomodule الگوی ](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)
است که باعث می‌شود بسته مدرن بصورت اتوماتیک در مرورگرهای مدرن بارگیری شود، و بسته مخصوص اینترنت اکسپلورر ۱۱، در مرورگر اینترنت اکسپلورر ۱۱ و سایر مرورگرهای قدیمی بارگیری شود.

## استفاده

کشویی / مودال - *Dropdown/Modal*

<div dir="ltr">

```html
<div x-data="{ open: false }">
    <button @click="open = true">Open Dropdown</button>

    <ul
        x-show="open"
        @click.away="open = false"
    >
        Dropdown Body
    </ul>
</div>
```

</div>

زبانه - *Tabs*

<div dir="ltr">

```html
<div x-data="{ tab: 'foo' }">
    <button :class="{ 'active': tab === 'foo' }" @click="tab = 'foo'">Foo</button>
    <button :class="{ 'active': tab === 'bar' }" @click="tab = 'bar'">Bar</button>

    <div x-show="tab === 'foo'">Tab Foo</div>
    <div x-show="tab === 'bar'">Tab Bar</div>
</div>
```

</div>

حتی می‌توانید برای چیزهای پیچیده هم از این استفاده کنید:

*پیش دریافت محتوای HTML عنصر کشویی ( Dropdown ) حین قرارگیری زیر موشی.*

<div dir="ltr">

```html
<div x-data="{ open: false }">
    <button
        @mouseenter.once="
            fetch('/dropdown-partial.html')
                .then(response => response.text())
                .then(html => { $refs.dropdown.innerHTML = html })
        "
        @click="open = true"
    >Show Dropdown</button>

    <div x-ref="dropdown" x-show="open" @click.away="open = false">
        Loading Spinner...
    </div>
</div>
```

</div>

## یادگیری

۱۴ فرمان (Directive) در اختیار شما قرار دارد:

| فرمان | توضیحات |
| --- | --- |
| <div dir="ltr">[`x-data`](#x-data)</div> | محدوده مؤلفه جدید را تعریف می‌کند. |
| <div dir="ltr">[`x-init`](#x-init)</div> | یک عبارت را در هنگاه مقداردهی اولیه مؤلفه اجرا می‌کند. |
| <div dir="ltr">[`x-show`](#x-show)</div> | درج/حذف سبک `display: none;` روی عنصر، بسته به نتیجه عبارت محتوا ( true یا false ) |
| <div dir="ltr">[`x-bind`](#x-bind)</div> | مقدار یک نشانه ( attribute ) را برابر با نتیجه یک عبارت جاوااسکریپت قرار می‌دهد. |
| <div dir="ltr">[`x-on`](#x-on)</div> | یک شنوندهٔ رویداد را به عنصر متصل می‌کند. عبارت JS را در زمان انتشار ( Emit ) Event اجرا می‌کند. |
| <div dir="ltr">[`x-model`](#x-model)</div> | یک «اتصال دوطرفه داده» به عنصر اضافه می‌کند. مقدار یک عنصر input را با دادهٔ مؤلفه هم‌گام نگه می‌دارد. |
| <div dir="ltr">[`x-text`](#x-text)</div> | مانند `x-bind` عمل می‌کند، اما مقدار `innerText` یک عنصر را به‌روز می‌کند. |
| <div dir="ltr">[`x-html`](#x-html)</div> | مانند `x-bind` عمل می‌کند، اما مقدار `innerHTML` یک عنصر را به‌روز می‌کند. |
| <div dir="ltr">[`x-ref`](#x-ref)</div> | راهی ساده برای دریافت عنصر خام DOM از یک مؤلفه. |
| <div dir="ltr">[`x-if`](#x-if)</div> | یک عنصر را بصورت کامل از DOM حذف می‌کند. باید روی عنصر با برچسب `<template>` استفاده شود. |
| <div dir="ltr">[`x-for`](#x-for)</div> | به ازای هر عضو داخل یک آرایه، یک گره DOM جدید می‌سازد. باید روی عنصر با برچسب `<template>` استفاده شود. |
| <div dir="ltr">[`x-transition`](#x-transition)</div> | فرمان‌هایی برای اضافه کردن کلاس‌های لازم به عنصر در مراحل مختلف یک transition |
| <div dir="ltr">[`x-spread`](#x-spread)</div> | اجازه می‌دهد به منظور قابلیت استفاده مجدد بتوانید یک شیء از فرمان‌های آلپاین را به یک عنصر متصل کنید. |
| <div dir="ltr">[`x-cloak`](#x-cloak)</div> | این نشانه در زمان مقداردهی اولیه آلپاین حذف خواهد شد و برای مخفی کردن DOM تا زمان مقداردهی اولیه کاربرد دارد. |

و 6 ویژگی (property) جادویی:

| ویژگی‌های جادویی | توضیحات |
| --- | --- |
| <div dir="ltr">[`$el`](#el)</div> |  دریافت گره DOM ریشهء مؤلفه |
| <div dir="ltr">[`$refs`](#refs)</div> | دریافت عناصر DOM علامت خورده با `x-ref` داخل مؤلفه. |
| <div dir="ltr">[`$event`](#event)</div> | دریافت شیء "Event" محلی مرورگر از داخل یک شنوندهٔ رویداد. |
| <div dir="ltr">[`$dispatch`](#dispatch)</div> | یک `CustomEvent` ایجاد کرده و توسط <span dir="ltr">`.dispatchEvent()`</span> بصورت داخلی آن را مخابره می‌کند. |
| <div dir="ltr">[`$nextTick`](#nexttick)</div> | عبارت داده شده را بعد از اینکه آلپاین، به‌روزرسانی‌های واکنشی مربوط به DOM را انجام داد، اجرا می‌کند. |
| <div dir="ltr">[`$watch`](#watch)</div> | وقتی عنصری که در حال تماشا ( watch ) شدن است تغییر کند، متد Callback داده شده را اجرا می‌کند. |


## حامیان مالی

<img width="33%" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" alt="Tailwind CSS">

**می‌خواهید لوگوی شما اینجا بیاید؟ [در توییتر پیام دهید.](https://twitter.com/calebporzio)**

## پروژه‌های انجام شده توسط جامعه

* [Alpine Devtools](https://github.com/HugoDF/alpinejs-devtools)
* [Alpine Magic Helpers](https://github.com/KevinBatdorf/alpine-magic-helpers)
* [Alpine Weekly Newsletter](https://alpinejs.codewithhugo.com/newsletter/)
* [Spruce (State Management)](https://github.com/ryangjchandler/spruce)
* [Awesome Alpine](https://github.com/ryangjchandler/awesome-alpine)
* [Turbolinks Adapter](https://github.com/SimoTod/alpine-turbolinks-adapter)

### فرمان‌ها - Directives

---

### `x-data`

**مثال :**
<span dir="ltr">`<div x-data="{ foo: 'bar' }">...</div>`</span>

**ساختار**
<span dir="ltr">`<div x-data="[object literal]">...</div>`</span>

`x-data` یک محدودهٔ مؤلفه جدید تعریف می‌کند و به چهارچوب دستور می‌دهد که یک مؤلفه با شیء دادهٔ وارد شده بسازد.

فرض کنید این همان ویژگی `data` در یک مؤلفه Vue است.

**استخراج منطق مؤلفه**

می‌توانید داده (و رفتار) را بصورت متدهایی با قابلیت استفاده مجدد استخراج کنید.

<div dir="ltr">

```html
<div x-data="dropdown()">
    <button x-on:click="open">Open</button>

    <div x-show="isOpen()" x-on:click.away="close">
        // عنصر کشویی - Dropdown
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

</div>

> **برای کاربرانی که از سامانه‌های بسته‌بندی کننده (Bundler) استفاده می‌کنند:**
لطفا این نکته را در نظر داشته باشید که آلپاین به متدهایی دسترسی پیدا می‌کند که در محدوده ی کلی ( `window` ) تعریف شده باشند، باید بطور مشخص متدهایتان را به `window` متصل کنید تا بتوانید در `x-data` از آنها استفاده کنید. مانند <span dir="ltr">`window.dropdown = function () {}`</span>.
( این به آن خاطر است که در Webpack، Rollup، Parcel و ... توابعی که تعریف می‌کنید بصورت پیش فرض در محدوده ماژولِ مورد استفاده تعریف می‌شوند، نه `window`. )


همچنین می‌توانید چندیدن شیء داده را با استفاده از تخریب شیء (object destructuring) با هم مخلوط کنید.

<div dir="ltr">

```html
<div x-data="{...dropdown(), ...tabs()}">
```

</div>

---

### `x-init`
**مثال:**
<span dir="ltr">`<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`</span>

**ساختار:**
<span dir="ltr">`<div x-data="..." x-init="[expression]"></div>`</span>

`x-init` یک عبارت را در هنگاه مقدار دهی اولیه مؤلفه اجرا می‌کند.

If you wish to run code AFTER Alpine has made its initial updates to the DOM (something like a `mounted()` hook in VueJS), you can return a callback from `x-init`, and it will be run after:

اگر می‌خواهید که کدی را بعد از اینکه Alpine آپدیت‌های اولیه ی خود روی DOM را انجام داده، اجرا کنید ( چیزی مانند قلاب `mounted` در VueJS )، می‌توانید یک callback از `x-init` بازگردانید، که پس از آن اجرا خواهد شد.

<div dir="ltr">`x-init="() => { // در اینجا ما به وضعیت پس از مقداردهی اولیه DOM دسترسی داریم. // }"`</div>

---

### `x-show`
**مثال:**
<span dir="ltr">`<div x-show="open"></div>`</span>

**ساختار:**
<span dir="ltr">`<div x-show="[عبارت]"></div>`</span>

`x-show` استایل `display: none;` روی عنصر را بسته به نتیجه عبارت محتوا ( `true` یا `false` ) درج یا حذف می‌کند.

**x-show.transition**

`x-show.transition` یک API ساده برای این است که بتوانید عملیات `x-show` را با استفاده از transition‌های css لذت بخش تر کنید.

<div dir="ltr">

```html
<div x-show.transition="open">
    این محتوا با انتقال وارد و خارج می‌شود.
</div>
```

</div>

| فرمان | توضیحات |
| --- | --- |
| <span dir="ltr">`x-show.transition`</span> | یک Fade و Scale همزمان. (opacity, scale: 0.95, timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), duration-in: 150ms, duration-out: 75ms)
| <span dir="ltr">`x-show.transition.in`</span> | فقط transition به داخل. |
| <span dir="ltr">`x-show.transition.out`</span> | فقط transition به خارج. |
| <span dir="ltr">`x-show.transition.opacity`</span> | فقط از fade استفاده کن. |
| <span dir="ltr">`x-show.transition.scale`</span> | فقط از scale استفاده کن. |
| <span dir="ltr">`x-show.transition.scale.75`</span> | سفارشی کردن مقدار "scale" در CSS به `transform: scale(.75)`. |
| <span dir="ltr">`x-show.transition.duration.200ms`</span> | تنظیم ورود transition به 200ms. خروج به نصف این مقدار تنظیم می‌شود(100ms). |
| <span dir="ltr">`x-show.transition.origin.top.right`</span> | سفارشی کردن مقدار "transform origin" در CSS به `transform-origin: top right`. |
| <span dir="ltr">`x-show.transition.in.duration.200ms.out.duration.50ms`</span> | مدت‌های مختلف برای "ورود - in" و "خروج - in". |


> نکته: تمام این اصلاح‌کننده‌های transition می‌توانند با همدیگر به کار بروند. برای مثال این فرمان (هرچند مسخره! اما) درست است :
> 
> `x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale.95`

> نکته: `x-show` منتظر خواهد ماند تا تمامی فرزندان عنصرش transition خروجشان را به پایان برسانند، اگر می‌خواهید این رفتار را دور بزنید، عبارت `.immediate` را اضافه کنید.


<div dir="ltr">

```html
<div x-show.immediate="open">
    <div x-show.transition="open">
</div>
```

</div>

---

### `x-bind`

> نکته: می‌توانید از ترکیب کوتاه‌تر ":" استفاده کنید:
<span dir="ltr">`:type="..."`.</span>

**مثال:**
<span dir="ltr">`<input x-bind:type="inputType">`</span>

**ساختار:**
<span dir="ltr">`<input x-bind:[attribute]="[expression]">`</span>

`x-bind` مقدار یک نشانه ( attribute ) را برابر با نتیجه ی یک عبارت جاوااسکریپت قرار می‌دهد. عبارت داخل آن، به تمامی کلید‌های آبجکت دیتای مؤلفه دسترسی دارد، و هر  زمان که دیتای آن آپدیت شد، آن هم آپدیت می‌شود.

> نکته: اتصالات نشانه ها، تنها زمانی آپدیت می‌شوند که وابستگی هایشان آپدیت شوند. چهارچوب آنقدر باهوش هست که تغییرات دیتا را نظارت کند و بفهمد کدام اتصالات به دیتای تغییر یافته بستگی دارند.

**`x-bind` برای نشانه ی کلاس ها**

`x-bind` وقتی که به یک نشانه ی `class` متصل شود، به شیوه ی متفاوتی عمل می‌کند.

برای کلاس ها، شما مقدار را برابر یا یک آبجکت قرار می‌دهید که کلید‌های آن، نام `class`‌های مورد نظر می‌باشد، و مقادیر این کلیدها، عبارت هایی هستند که نتیجه ی ( یا مقدار ) آنها، مشخص می‌کند که `class` مورد نظر در عنصر اعمال شود یا خیر.

برای مثال:
`<div x-bind:class="{ 'hidden': foo }"></div>`

در این مثال, کلاس "hidden" فقط زمانی اعمال می‌شود که مقدار دیتای `foo` برابر با `true` شود.

**`x-bind` برای نشانه‌های بولی ( True یا False )**


`x-bind` همانطور که از نشانه‌های مقداری پشتیبانی می‌کند، از نشانه‌ها boolean هم پشتیبانی می‌کند، استفاده از یک متغیر به عنوان شرط یا هر عبارت جاوااسکریپت که به مقادیر `true` یا `false` نتیجه می‌شود.

برای مثال:

<div dir="ltr">

```html
<!-- با در نظر گرفتن: -->
<button x-bind:disabled="myVar">Click me</button>

<!-- زمانی که `myVar` برابر با `true` باشد: -->
<button disabled="disabled">Click me</button>

<!-- زمانی که `myVar` برابر با `false` باشد: -->
<button>Click me</button>
```

</div>

این نشانه ی `disabled` را بسته به `true` یا `false` بودن مقدار `myVar` به عنصر اضافه / حذف می‌کند.


نشانه‌های بولین طبق [ مشخصات HTML ](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute) پشتیبانی می‌شوند. برای مثال `disabled`، `readonly`، `required`، `checked`، `hidden`، `selected`، `open` و ... .

> نکته: اگر می‌خواهید وضعیت `false` برای نشانه ی شما نمایش داده شود، مثل
<span dir="ltr">`aria-*`</span>
، عبارت
<span dir="ltr">`.toString()`</span>
را به مقدار نشانه اضافه کنید و به نشانه متصل کنید. برای مثال : 
<span dir="ltr">`:aria-expanded="isOpen.toString()"`</span>
 برای هر مقدار `isOpen` به عنصر اضافه خواهد شد، چه `true` باشد و چه `false`.

**تغییر دهنده <span dir="ltr">`.camel`</span>**
**مثل :**
<span dir="ltr">`<svg x-bind:view-box.camel="viewBox">`</span>


تغییر دهنده `camel`، معادل "camel case" یک نشانه را به مقدار خود متصل می‌کند. در مثال بالا، مقدار نشانه `viewBox`، به نشانه  با نام `viewBox` متصل می‌شود، به جای نشانه با نام `view-box`.

---

### `x-on`

> نکته: شما آزادید تا از ترکیب "@" استفاده کنید. : <span dir="ltr">`@click="..."`</span>.

**مثال:** <span dir="ltr">`<button x-on:click="foo = 'bar'"></button>`</span>

**ساختار:** <span dir="ltr">`<button x-on:[event]="[expression]"></button>`</span>

`x-on` به المنتی که به آن متصل شده است، یک "Event Listener" وصل می‌کند. وقتی که "event" مورد نظر اعلان می‌شود، عبارت جاوااسکریپتی که به عنوان مقدار `x-on` ست کرده اید، اجرا می‌شود. شما می‌توانید `x-on` را با هر "Event" ای که برای عنصر مورد نظر در دسترس است استفاده کنید. برای دسترسی به لیست کامل "Event"‌ها و مقادیر احتمالی آنها، به [مرجع "Event"‌ها در MDN](https://developer.mozilla.org/en-US/docs/Web/Events) مراجعه کنید.

اگر هر دیتایی در این عبارت تغییر داده شود، سایر نشانه‌های "متصل" به این دیتا هم آپدیت خواهند شد.

> نکته: شما همچنین می‌توانید در مقدار آن، نام یک متد را قرار دهید.

**مثال:** <span dir="ltr">`<button x-on:click="myFunction"></button>`</span>

این برابر است با: <span dir="ltr">`<button x-on:click="myFunction($event)"></button>`</span>

**تغییر دهنده‌های `keydown`**

**مثال:** <span dir="ltr">`<input type="text" x-on:keydown.escape="open = false">`</span>

شما می‌توانید برای استفاده از تغییر دهنده‌های "keydown" اضافه شده به فرمان `x-on:keydown`، یک نوع کلید خاص را مشخص کنید. در نظر داشته باشید که نام تغییر دهنده ها، معادل "Kebab-case" مقادیر `Event.key` هستند.

مثال ها: `enter`، `escape`، `arrow-up`، `arrow-down`

> نکته: همچنین می‌توانید به "Event" ترکیب کلید‌های سیستمی "Listen" کنید:
<span dir="ltr">`x-on:keydown.cmd.enter="foo"`</span>

**تغییر دهنده <span dir="ltr">`.away`</span>**

**مثال:** <span dir="ltr">`<div x-on:click.away="showModal = false"></div>`</span>

زمانی که تغییر دهنده ی 
<span dir="ltr">`.away`</span>
حاضر باشد، عبارت مسئول رویداد فقط زمانی اجرا می‌شود که رویداد از یک منشا دیگری آغاز شده باشد، نه خود عنصر و فرزندان آن. 

این زمانی به کار می‌آید که می‌خواهیم المنت‌های کشویی و مودال‌ها را با کلیک کاربر روی سایر نقاط DOM مخفی کنیم.

**تغییر دهنده <span dir="ltr">`.prevent`</span>**
**مثال:** <span dir="ltr">`<input type="checkbox" x-on:click.prevent>`</span>

اضافه کردن `.prevent` به یک شنونده رویداد ( Event Listener )، باعث می‌شود که متد `preventDefault` روی رویداد مورد نظر اجرا شود. در مثال بالا، این باعث می‌شود که عنصر "Checkbox" با کلیک کاربر تیک نمیخورد.

**تغییر دهنده <span dir="ltr">`.stop`</span>**
**مثال:** <span dir="ltr">`<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`</span>


اضافه کردن `.stop` به یک شنونده رویداد، باعث فراخوانی متد `stopPropagation` روی رویداد مورد نظر می‌شود. در مثال بالا، این به آن معنیست که رویداد "click" بصورت حبابی از عنصر `<button>` به عنصر خارجی `<div>` نخواهد رسید. به عبارت دیگر، وقتی کاربر روی `<button>` کلیک می‌کند، متغییر `foo` مقدار `'bar'` را نخواهد گرفت.

**تغییر دهنده <span dir="ltr">`.self`</span>**
**مثال:** <span dir="ltr">`<div x-on:click.self="foo = 'bar'"><button></button></div>`</span>

اضافه کردن 
<span dir="ltr">`.self`</span>
 به یک شنونده ی رویداد، باعث می‌شود که عبارت متصل شده به آن فقط زمانی فراخوانی شود که 
<span dir="ltr">`$event.target`</span>
خود عنصر باشد. در مثال بالا، این به به آن معنیست که رویداد "click" که بصورت حبابی از عنصر `<button>` به عنصر خارجی `<div>` می‌رسد، عبارت متصل به آن را **اجرا نخواهد کرد**.

**تغییر دهنده <span dir="ltr">`.window`</span>**
**مثال:** <span dir="ltr">`<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`</span>

اضافه کردن 
<span dir="ltr">`.window`</span>
 به یک شنونده ی رویداد، باعث می‌شود که شنونده به جای نصب روی نود DOM تعریف شده، روی آبجکت کلی "window" نصب می‌شود. این زمانی به کار می‌آید که می‌خواهید وضعیت یک مؤلفه را به همراه تغییری در "window" تغییر دهید، مثل رویداد "resize". در این مثال، وقتی که عرض پنجره از 768 پیکسل بیشتر شود، ما مودال یا عنصر کشویی مورد نظر را می‌بندیم، در غیر اینصورت وضعیت ثابت می‌ماند.

>نکته: شما همچنین می‌توانید از تغییر دهنده
<span dir="ltr">`.document`</span>
استفاده کنید تا شنونده را به جای `window` به `document` متصل کنید.

**تغییر دهنده <span dir="ltr">`.once`</span>**
**مثال:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

اضافه کردن تغییر دهنده
<span dir="ltr">`.once`</span>
به یک شنونده رویداد، اطمینان حاصل می‌کند که شنونده فقط یک بار اجرا می‌شود. این زمانی به کار می‌آید که بخواهیم کاری را فقط یک بار انجام دهیم، مثل دریافت بخش هایی از "HTML" و امثال آنها.


**تغییر دهنده <span dir="ltr">`.passive`</span>**
**مثال:** `<button x-on:mousedown.passive="interactive = true"></button>`

اضافه کردن تغییر دهنده
<span dir="ltr">`.passive`</span>
به یک شنونده رویداد، آن شنونده را منفعل می‌کند، این به آن معناست که
<span dir="ltr">`preventDefault()`</span>
روی هیچ رویدادی که پردازش می‌شود کار نخواهد کرد. برای مثال، این رفتار می‌تواند به کارایی اسکرول در دستگاه‌های تاچ کمک کند.


**تغییر دهنده <span dir="ltr">`.debounce`</span>**
**مثال:** `<input x-on:input.debounce="fetchSomething()">`

تغییر دهنده ی `debounce`، اجازه می‌دهد تا یک شنونده ی رویداد را "رد" کرد. به عبارت دیگر، شنونده ی رویداد تا وقتی که یک زمان معین از آخرین اعلان رویداد نگذشته باشد، اجرا نخواهد شد. وقتی که زمان اجرای شنونده ی رویداد فرارسید، آخرین فراخوانی شنونده اجرا خواهد شد.

زمان پیش فرض انتظار "debounce" 250 میلی ثانیه است.

اگر مایلید این زمان را شخصی سازی کنید، می‌توانید به این شکل عمل کنید :

<div dir="ltr">

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

</div>

**تغییر دهنده <span dir="ltr">`.camel`</span>**
**مثال:** `<input x-on:event-name.camel="doSomething()">`

تغییر دهنده
<span dir="ltr">`.camel`</span>
، یک شنونده به رویداد با نامی معادل "camel case" شده ی نام رویداد داده شده متصل خواهد کرد.
در مثال بالا، عبارت مشخص شده، زمانی اجرا می‌شود که رویدادی با نام `eventName` منتشر شده باشد.

---

### `x-model`
**مثال:** <span dir="ltr">`<input type="text" x-model="foo">`</span>

**ساختار:** <span dir="ltr">`<input type="text" x-model="[data item]">`</span>

`x-model` یک "اتصال دوطرفه داده" به عنصر اضافه می‌کند. به عبارت دیگر، مقدار یک عنصر input را با داده ی متناظر آن در مؤلفه هماهنگ نگه می‌دارد.

> نکته: `x-model` به اندازه ای باهوش است که می‌تواند تغییرات در المنت‌ها ورودی text، checkboxها، دکمه‌های radio، textarea ها، select ها، و multiple select‌ها را تشخیص دهد. در این سناریو ها، باید آنطور که
[Vue عمل می‌کند](https://vuejs.org/v2/guide/forms.html)
، عمل کند.

**تغییر دهنده <span dir="ltr">`.number`</span>**
**مثال:** <span dir="ltr">`<input x-model.number="age">`</span>

تغییر دهنده
<span dir="ltr">`.number`</span>
، مقدار یک فیلد ورودی را به عدد تبدیل می‌کند. اگر مقدار مورد نظر قابل پارس کردن به عدد نباشد، مقدار اصلی را باز می‌گرداند.

**تغییر دهنده <span dir="ltr">`.debounce`</span>**
**مثال:** <span dir="ltr">`<input x-model.debounce="search">`</span>

The `debounce` modifier allows you to add a "debounce" to a value update. In other words, the event handler will NOT run until a certain amount of time has elapsed since the last event that fired. When the handler is ready to be called, the last handler call will execute.

تغییر دهنده
<span dir="ltr">`.debounce`</span>
اجازه میدهد که به آپدیت مقدار فیلد ورودی، رفتار رد کردن ( Debounce ) بدهید. به عبارت دیگر، شنونده ی رویداد تا وقتی که یک زمان معین از آخرین اعلان رویداد نگذشته باشد، اجرا نخواهد شد. وقتی که زمان اجرای شنونده ی رویداد فرارسید، آخرین فراخوانی شنونده اجرا خواهد شد.

زمان پیش فرض انتظار "debounce" 250 میلی ثانیه است.

اگر مایلید این زمان را شخصی سازی کنید، می‌توانید به این شکل عمل کنید :

<div dir="ltr">

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

</div>

---

### `x-text`
**مثال:** <span dir="ltr">`<span x-text="foo"></span>`</span>

**ساختار:** <span dir="ltr">`<span x-text="[expression]"`</span>

`x-text` مانند `x-bind` عمل می‌کند، اما به جای آپدیت کردن مقدار یک نشانه، مقدار `innerText` عنصر را آپدیت می‌کند.

---

### `x-html`
**مثال:** <span dir="ltr">`<span x-html="foo"></span>`</span>

**ساختار:** <span dir="ltr">`<span x-html="[expression]"`</span>

`x-text` مانند `x-bind` عمل می‌کند، اما به جای آپدیت کردن مقدار یک نشانه، مقدار `innerHTML` عنصر را آپدیت می‌کند.


> :اخطار: **فقط روی محتوای قابل اعتماد استفاده کنید، هرگز روی محتوایی که کاربر وارد کرده است استفاده نکنید.** :اخطار:
>
> رندر کردن HTML از سمت شخص ثالث، به راحتی منجر به آسیب پذیری [XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) خواهد شد.

---

### `x-ref`
**مثال:** <span dir="ltr">`<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`</span>

**ساختار:** <span dir="ltr">`<div x-ref="[ref name]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`</span>

`x-ref` یک راه ساده برای دریافت عنصر DOM بصورت خام از مؤلفهتان فراهم می‌کند. با قرار دادن نشانه ی `x-ref` روی یک المنت، شما عنصر مورد نظر را در اختیار تمامی شنونده‌های رویداد قرار خواهید داد که می‌توانند از طریق آبجکت
<span dir="ltr">`$refs`</span>
به آن دسترسی داشته باشند.

این یک جایگزین مفید به جای اختصاص دادن id روی المنت‌ها و استفاده از
<span dir="ltr">`document.querySelector`</span>
در همه جای کدتان است.

> نکته: اگر نیاز داشته باشید، می‌توانید از مقادیر داینامیک هم برای `x-ref` استفاده کنید:
<span dir="ltr">`<span :x-ref="item.id"></span>`</span>

---

### `x-if`
**مثال:** <span dir="ltr">`<template x-if="true"><div>Some Element</div></template>`</span>

**ساختار:** <span dir="ltr">`<template x-if="[expression]"><div>Some Element</div></template>`</span>

برای مواقعی که استفاده از `x-show` کافی نیست، می‌توانید از `x-if` استفاده کنید تا عنصر را بصورت کامل از DOM حذف کند.
یادآوری `x-show` : درج/حذف استایل display: none; روی عنصر بسته به نتیجه عبارت محتوا ( true یا false )

لازم است که از `x-if` روی تگ
<span dir="ltr">`<template></template>`</span>
استفاده شود، به این دلیل که Alpine از DOM مجازی استفاده نمی‌کند، و این روش پیاده سازی اجازه می‌دهد که Alpine قدرتمند بماند و از DOM واقعی برای جادوی خودش استفاده کند.

> نکته: `x-if` باید در داخل تگ 
<span dir="ltr">`<template></template>`</span>
یک عنصر ریشه بیشتر نداشته باشد.

> نکته: در هنگام استفاده از `template` داخل تگ `svg`، باید یک
[polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538)
به صفحه اضافه کنید که قبل از مقداردهی اولیه Alpine اجرا شود.

---

### `x-for`
**مثال:**

<div dir="ltr">

```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

</div>

> نکته: اتصال `:key` اختیاری است، اما به شدت توصیه می‌شود.

`x-for` در اختیار شماست برای زمانی که می‌خواهید به ازای هر آیتم داخل یک آرایه، یک نود DOM جدید بسازید. این باید شبیه `v-for` در Vue باشد، با این تفاوت که باید روی تگ `template` قرار گیرد، نه روی یک عنصر DOM معمولی.

اگر می‌خواهید به اندیس کنونی حلقه دستیابی داشته باشید، از سینتکس زیر استفاده کنید :

<div dir="ltr">

```html
<template x-for="(item, index) in items" :key="index">
    <!-- You can also reference "index" inside the iteration if you need. -->
    <div x-text="index"></div>
</template>
```

</div>

اگر می‌خواهید به آبجکت آرایه ( کالکشن ) دور مورد نظر دست یابید، از سینتکس زیر استفاده کنید:

<div dir="ltr">

```html
<template x-for="(item, index, collection) in items" :key="index">
    <div>
        <!-- You can also reference "collection" inside the iteration if you need. -->
        <!-- Current item. -->
        <div x-text="item"></div>
        <!-- Same as above. -->
        <div x-text="collection[index]"></div>
        <!-- Previous item. -->
        <div x-text="collection[index - 1]"></div>
    </div>
</template>
```

</div>

> نکته: `x-for` باید در داخل تگ 
<span dir="ltr">`<template></template>`</span>
یک عنصر ریشه بیشتر نداشته باشد.

> نکته: در هنگام استفاده از `template` داخل تگ `svg`، باید یک
[polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538)
به صفحه اضافه کنید که قبل از مقداردهی اولیه Alpine اجرا شود.

#### `x-for`‌های تودرتو :
شما می‌توانید حلقه‌های `x-for` را داخل هم قرار دهید، اما باید هر حلقه را درون یک عنصر بگذارید، برای مثال :

<div dir="ltr">

```html
<template x-for="item in items">
    <div>
        <template x-for="subItem in item.subItems">
            <div x-text="subItem"></div>
        </template>
    </div>
</template>
```

</div>

#### دور زدن روی یک رنج

Alpine از سینتکس `i in n` پشتیبانی می‌کند، که `n` یک عدد است و به شما اجازه ی دور زدن حول یک رنج ثابت از عناصر را می‌دهد.

<div dir="ltr">

```html
<template x-for="i in 10">
    <span x-text="i"></span>
</template>
```

</div>

---

### `x-transition`
**مثال:**

<div dir="ltr">

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

</div>

<div dir="ltr">

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

</div>

> مثال بالا، از کلاس‌های چهارچوب [Tailwind CSS](https://tailwindcss.com) استفاده می‌کند.

آلپاین شش فرمان مختلف transition برای قراردادن کلاس در مراحل گوناگون transition یک عنصر بین وضعیت مخفی (Hidden) و (Shown) در اختیار قرار می‌دهد. این فرمان‌ها، هم با `x-show` کار می‌کنند و هم با `x-if`.

این فرمان‌ها کاملا مثل فرمان‌های Transition چهارچوب VueJS رفتار می‌کنند، منتها نام گذاری اینها متفاوت و معقولانه تر است.

| فرمان‌ها | توضیحات |
| --- | --- |
| <div dir="ltr">`:enter`</div> | در کل فاز ورود اعمال می‌شود. |
| <div dir="ltr">`:enter-start`</div> | قبل از اینکه عنصر وارد شود اضافه می‌شود، و 1 فریم بعد از ورود عنصر حذف می‌شود. |
| <div dir="ltr">`:enter-end`</div> | 1 فریم بعد از ورود عنصر اضافه می‌شود ( زمانی که `enter-start` حذف میشود )، وقتی که transition یا animation پایان می‌یابد، حذف می‌شود. 
| <div dir="ltr">`:leave`</div> | در کل فاز خروج اعمال می‌شود. |
| <div dir="ltr">`:leave-start`</div> | به محض شروع transition خروجی اضافه میشود، 1 فریم بعد حذف می‌شود. |
| <div dir="ltr">`:leave-end`</div> | 1 فریم بعد از شروع transition خروجی اضافه می‌شود ( زمانی که `leave-start` حذف میشود )، وقتی که transition یا animation پایان می‌یابد، حذف می‌شود. 

---

### `x-spread`
**مثال:**

<div dir="ltr">

```html
<div x-data="dropdown()">
    <button x-spread="trigger">کشو رو باز کن</button>

    <span x-spread="dialogue">محتوای کشو </span>
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

</div>

`x-spread` به شما اجازه می‌دهد اتصالات Alpine برای یک عنصر را به یک آبجکت قابل استفاده مجدد استخراج کنید.

کلید‌های آبجکت، فرمان‌ها هستند ( می‌تواند هر فرمان ای به همراه تغییر دهنده هایش باشد )، و مقادیر آن، متد هایی هستند که توسط Alpine ارزیابی می‌شوند.


> نکته: برای استفاده از x-spread، یک سری هشدار‌ها وجود دارد :
> - وقتی فرمان ای که می‌خواهیم "spread" کنیم `x-for` باشد، باید از متد مورد نظر، یک عبارت نرمال داخل یک رشته را برگردانید. برای مثال : <span dir="ltr">`['x-for']() { return 'item in items' }`</span>.
> - `x-data` و `x-init` را نمی‌توان داخل یک آبجکت "spread" استفاده کرد.

---

### `x-cloak`
**مثال:** <span dir="ltr">`<div x-data="{}" x-cloak></div>`</span>

نشانه‌های `x-cloak` در زمان مقدار دهی اولیه Alpine از عنصر حذف خواهد شد، این رفتار برای مخفی کردن DOM تا زمان مقداردهی اولیه کاربرد دارد. به طور معمول، این استایل کلی را برای این هدف اضافه می‌کنند.

<div dir="ltr">

```html
<style>
    [x-cloak] {
        display: none !important;
    }
</style>
```

</div>

### ویژگی‌های جادویی

> به جز <span dir="ltr">`$el`</span>، سایر ویژگی‌های جادویی **داخل `x-data` در دسترس نیستند**، زیرا هنوز مؤلفه مقدار دهی اولیه نشده.

---

### <span dir="ltr">`$el`</span>
**مثال:**

<div dir="ltr">

```html
<div x-data>
    <button @click="$el.innerHTML = 'foo'">من را با "foo" جایگزین کن</button>
</div>
```

</div>

<span dir="ltr">`$el`</span> یک ویژگی جادویی است که می‌توان با استفاده از آن، نود DOM ریشه ی مؤلفه را دریافت کرد.

### <span dir="ltr">`$refs`</span>
**مثال:**

<div dir="ltr">

```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

</div>

<span dir="ltr">`$refs`</span> یک ویژگی جادویی است که با استفاده از آن می‌توان المنت‌های DOM علامت خورده با x-ref داخل مؤلفه را دریافت کرد. این زمانی به کار می‌آید که می‌خواهیم بطور دستی المنت‌های DOM را دستکاری کنیم.

---

### <span dir="ltr">`$event`</span>
**مثال:**

<div dir="ltr">

```html
<input x-on:input="alert($event.target.value)">
```

</div>

<span dir="ltr">`$event`</span>
یک ویژگی جادویی است که با استفاده از آن می‌توان داخل یک شنونده ی رویداد، آبجکت "Event" محلی مرورگر از دریافت کرد.

> نکته: ویژگی <span dir="ltr">`$event`</span> فقط در عبارات DOM در دسترس است.

اگر می‌خواهید از داخل یک متد جاوااسکریپت به
<span dir="ltr">`$event`</span>
دسترسی داشته باشید، می‌توانید مستقیما به متد اضافه کنید:

<span dir="ltr">`<button x-on:click="myFunction($event)"></button>`</span>

---

### <span dir="ltr">`$dispatch`</span>
**مثال:**

<div dir="ltr">

```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
    <!-- وقتی کلیک شود، رشته "bar" را در کنسول مرورگر لاگ می‌کند. ( console.log ) -->
</div>
```

</div>

**نکته درباره انتشار رویداد ( Event Propagation )**

توجه داشته باشید که به علت 
[حرکت حبابی رویداد](https://en.wikipedia.org/wiki/Event_bubbling)
، وقتی می‌خواهید رویدادی را بگیرید که توسط نودی فرستاده شده، که تحت همان سلسله مراتب ( شجره نامه ) عنصر شماست، نیاز خواهید داشت که از تغییر دهنده 
[`.window`](https://github.com/alpinejs/alpine#x-on)
 استفاده کنید.

**مثال:**

<div dir="ltr">

```html
<div x-data>
    <span @custom-event="console.log($event.detail.foo)"></span>
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
<div>
```

</div>

> این کار نمی‌کند، زیرا وقتی `custom-event` اعلان می‌شود، به سمت جد مشترکشان، عنصر `div` منتشر می‌شود.

**ارسال به مؤلفه ها**

شما همچنین می‌توانید از تکنیک قبلی برای ارتباط بین مؤلفه‌ها استفاده کنید.

**مثال:**

<div dir="ltr">

```html
<div x-data @custom-event.window="console.log($event.detail)"></div>

<button x-data @click="$dispatch('custom-event', 'Hello World!')">
<!-- وقتی کلیک شود، رشته "Hello World" را در کنسول مرورگر لاگ می‌کند. ( console.log ) -->
```

</div>

`$dispatch` یک میانبر برای ساخت یک `CustomEvent` و ارسال آن توسط `.dispatchEvent()` بصورت داخلی است. دلایل خوب زیادی برای انتقال دیتا بین مؤلفه‌ها با استفاده از رویداد‌های شخصی وجود دارد.
برای اطلاعات بیشتر درباره اساس سیستم `CustomEvent` در مرورگر ها
[اینجا را بخوانید](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events)


متوجه خواهید شد که هر دیتایی که به عنوان پارامتر دوم به
<span dir="ltr">`$dispatch('some-event', { some: 'data' })`</span>
فرستاده شود، توسط ویژگی "detail" در رویداد جدید در دسترس قرار می‌گیرد : 
<span dir="ltr">`$event.detail.some`</span> .
اتصال دیتا به ویژگی `.detail` در رویداد‌های شخصی، یک استاندارد برای `CustomEvent`‌ها در مرورگر هاست.

شما همچنین می‌توانید از `$dispatch()` برای راه انداختن آپدیت برای اتصالات `x-model` استفاده کنید.

<div dir="ltr">

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')">
        <!-- پس از کلیک دکمه، `x-model` رویداد "input" حباب شده را دریافت می‌کند، و مقدار متغیر "foo" را به "baz" تغییر می‌دهد.  -->
    </span>
</div>
```

</div>

> نکته: ویژگی <span dir="ltr">`$dispatch`</span> فقط در عبارات DOM در دسترس است.


اگر می‌خواهید از داخل یک متد جاوااسکریپت به
<span dir="ltr">`$dispatch`</span>
دسترسی داشته باشید، می‌توانید مستقیما به متد اضافه کنید:

`<button x-on:click="myFunction($dispatch)"></button>`

---

### <span dir="ltr">`$nextTick`</span>
**مثال:**

<div dir="ltr">

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

</div>

<span dir="ltr">`$nextTick`</span>
یک ویژگی جادویی است که به شما اجازه می‌دهد یک عبارت را بعد از اینکه Alpine آپدیت‌های ری اکتیو مربوط به DOM را انجام داد، اجرا کند. این زمانی به کار می‌آید که شما می‌خواهید با DOM کار کنید، اما فقط بعد از اینکه تغییرات دیتایی انجام شده را اعمال کرده باشد.

---

### `$watch`
**مثال:**

<div dir="ltr">

```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```

</div>

شما می‌توانید یک ویژگی مؤلفه را با متد جادویی
<span dir="ltr">`$watch`</span>
تحت نظر بگیرید. در مثال بالا، وقتی دکمه کلیک می‌شود و متغیر `open` تغییر می‌کند، متد فراهم شده فراخوانی می‌شود و مقدار جدید را در کنسول مرورگر لاگ می‌کند.

## امنیت

اگر تهدیدی امنیتی در سیستم پیدا کردید، لطفا یک ایمیل به آدرس [calebporzio@gmail.com]() ارسال کنید.

</div>

آلپاین به یک پیاده‌سازی سفارشی از شیء`function` برای ارزیابی فرمان‌هایش متکی است. فارغ از اینک به مراتب از `eval()` امن‌تر است، استفاده از آن در برخی محیط‌ها مانند Google Chrome App به خاطر سیاست امنیت محتوا (CSP) محدودکننده، ممنوع است.

اگر یکی وب‌گاهی با داده‌های حساس و که نیازمند [CSP](https://csp.withgoogle.com/docs/strict-csp.html) است از آلپاین استفاده می‌کنید لازم است `unsafe-eval` را در سیاست خود وارد کنید. یک سیاست مستحکم که به درستی پیکربندی شده باشد، به حفاظت است کابران‌تان زمانی که داده‌های شخصی یا مالی استفاده می‌شود کمک می‌کند.

از آن جایی که یک سیاست به تمام اسکریپت‌های یک صفحه اعمال می‌شود، این مساله دارای اهمیت است که سایر کتاب‌خانه‌های خارجی که در وب‌گاه وارد شده‌اند به دقت مورد بازبینی قرار گرفته و اطمینان حاصل شود که قابل اعتماد هستند و آسیب‌پذیری‌های XSS را به واسطه استفاده از تابع `eval()` یا دستکاری ساختار DOM به منظور تزریع کدهای بد در صفحه ایجاد نمی‌کنند.

## نقشه راه نگارش ۳
* Move from `x-ref` to `ref` for Vue parity?
* Add `Alpine.directive()`
* Add `Alpine.component('foo', {...})` (With magic `__init()` method)
* Dispatch Alpine events for "loaded", "transition-start", etc... ([#299](https://github.com/alpinejs/alpine/pull/299)) ?
* Remove "object" (and array) syntax from `x-bind:class="{ 'foo': true }"` ([#236](https://github.com/alpinejs/alpine/pull/236) to add support for object syntax for the `style` attribute)
* Improve `x-for` mutation reactivity ([#165](https://github.com/alpinejs/alpine/pull/165))
* Add "deep watching" support in V3 ([#294](https://github.com/alpinejs/alpine/pull/294))
* Add `$el` shortcut
* Change `@click.away` to `@click.outside`?

## پروانه

Copyright © 2019-2021 Caleb Porzio and contributors

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
