# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true)](https://alpinejs.codewithhugo.com/chat/)

Alpine.js, Vue.js yada React gibi önemli framework' ların yüksek seviye programlama (reaktif ve deklaratif vb.) yapısını daha düşük bir maliyetle sunar.

DOM' unuza hükmedin ve uygun gördüğünüz şekilde düzenleyin.

Bunu [Tailwind](https://tailwindcss.com/) 'ın JavaScript versiyonu olarak düşünebilirsiniz.

> Not: Bu kütüphanenin sentaksının neredeyse tamamında [Vue](https://vuejs.org/) (ve dolayısıyla [Angular](https://angularjs.org/)) 'dan esinlenilmiştir. Onlara, web' e yaptıkları katkılarından ötürü sonsuza dek minnettarım.

## Translated documentation

| Language | Link for documentation |
| --- | --- |
| Chinese Traditional | [**繁體中文說明文件**](./README.zh-TW.md) |
| German | [**Dokumentation in Deutsch**](./README.de.md) |
| Indonesian | [**Dokumentasi Bahasa Indonesia**](./README.id.md) |
| Japanese | [**日本語ドキュメント**](./README.ja.md) |
| Portuguese | [**Documentação em Português**](./README.pt.md) |
| Russian | [**Документация на русском**](./README.ru.md) |
| Spanish | [**Documentación en Español**](./README.es.md) |
| Turkish | [**Türkçe Dökümantasyon**](./README.tr.md) |

## Kurulum

**CDN ile:** Aşağıdaki script' i `<head>` alanının sonuna ekleyin.
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
```

İşte bu kadar. Kendini başlatması için yeterli.

Gerçek ortamda kullanırken yeni çıkan sürümlerden kaynaklanabilecek bozukluklardan kaçınmak için bağlantıda versiyon numarasını tam olarak belirtmek önerilir.
Örneğin, `2.8.2` (son sürüm) sürümünü kullanmak için:
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.2/dist/alpine.min.js" defer></script>
```

**Npm ile:** Npm kullanarak paketi yükleyin.
```js
npm i alpinejs
```

Kodunuza dahil edin.
```js
import 'alpinejs'
```

**IE11 desteği için** O halde aşağıdaki script' leri kullanın.
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
```

Yukarıdaki [module/nomodule üslubu](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/) üslubu, modern tarayıcılarda otomatik olarak modern paketi, IE11 ve diğer eski tarayıcılarda ise ona uygun paketi yükleyecektir.

## Kullanım

*Dropdown/Modal Açılır menü ve pencere*
```html
<div x-data="{ open: false }">
    <button @click="open = true">Menüyü Göster</button>

    <ul
        x-show="open"
        @click.away="open = false"
    >
        Menü İçeriği
    </ul>
</div>
```

*Tabs Sekmeler*
```html
<div x-data="{ tab: 'foo' }">
    <button :class="{ 'active': tab === 'foo' }" @click="tab = 'foo'">Foo</button>
    <button :class="{ 'active': tab === 'bar' }" @click="tab = 'bar'">Bar</button>

    <div x-show="tab === 'foo'">Foo Sekmesi</div>
    <div x-show="tab === 'bar'">Bar Sekmesi</div>
</div>
```

Basit olmayan yapılar için bile kullanabilirsiniz:
*Daha hover event' i tetiklenirken açılır menünün içeriğini getirmeye başlayarak.*
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

## Öğrenme

Sizin için 14 direktif var:

| Direktif | Açıklaması |
| --- | --- |
| [`x-data`](#x-data) | Yeni bir bileşenin kapsamını tanımlar. |
| [`x-init`](#x-init) | Bileşen başlar başlamaz bir ifadeyi çalıştırır. |
| [`x-show`](#x-show) | (true or false) durumuna göre elemente `display: none;` özelliği ekler çıkarır. |
| [`x-bind`](#x-bind) | JS ifadesinin sonucuna göre değişkene değer atar. |
| [`x-on`](#x-on) | Elemente olay dinleyicisi ekler. Tetiklendiğinde JS ifadesini çalıştırır. |
| [`x-model`](#x-model) | Elemente "çift yönlü bağlama" ekler. Bu input elementi ile bileşendeki datayı senkronize şekilde tutar. |
| [`x-text`](#x-text) | 'x-bind' ile benzer çalışır, yalnız bu elementin `innerText` özelliğini günceller. |
| [`x-html`](#x-html) | 'x-bind' ile benzer çalışır, yalnız bu elementin `innerHTML` özelliğini günceller. |
| [`x-ref`](#x-ref) | İşlenmemiş DOM elementleri bileşeninizin dışından tekrar almak için kullanışlı bir yöntem. |
| [`x-if`](#x-if) | Elementi DOM' dan tamamen kaldırır. `<template>` etiketi üzerinde kullanılması gerekir. |
| [`x-for`](#x-for) | Dizideki her bir eleman için yeni DOM düğümü oluşturur. `<template>` etiketi üzerinde kullanılması gerekir. |
| [`x-transition`](#x-transition) | Elementin çeşitli değişim aşamalarına sınıflar ekleyen direktifler. |
| [`x-spread`](#x-spread) | Daha iyi yeniden kullanılabilirlik için Alpine direktifler nesnesini bir elemente bağlamanızı sağlar. |
| [`x-cloak`](#x-cloak) | Bu özellik Alpine başlatıldığında kaldırılır. Önceden yüklenmiş DOM' u gizlemek için kullanışlıdır. |

Ve altı sihirli özellik:

| Sihirli Özellik | Açıklaması |
| --- | --- |
| [`$el`](#el) |  Kök bileşen DOM düğümünü getirir. |
| [`$refs`](#refs) | Bileşen içindeki `x-ref` ile işaretlenmiş DOM elementlerini getirir. |
| [`$event`](#event) | Olay dinleyicisine bağlı tarayıcıya ait "Event" nesnesini getirir. |
| [`$dispatch`](#dispatch) | `CustomEvent` oluşturur ve dahili olarak `.dispatchEvent()` kullanıp gönderir. |
| [`$nextTick`](#nexttick) | Alpine kendi reaktif DOM güncellemelerini yaptıktan SONRA verilen ifadeyi çalıştırır. |
| [`$watch`](#watch) | "İzlediğiniz" bir bileşen özelliği değişir değişmez verilen bir callback fonksiyonu tetiklenecek. |


## Sponsorlar

<img width="33%" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" alt="Tailwind CSS">

**Logonuzun burda olmasını ister misiniz? [DM on Twitter](https://twitter.com/calebporzio)**

## Topluluk Projeleri

* [AlpineJS Weekly Newsletter](https://alpinejs.codewithhugo.com/newsletter/)
* [Spruce (State Management)](https://github.com/ryangjchandler/spruce)
* [Turbolinks Adapter](https://github.com/SimoTod/alpine-turbolinks-adapter)
* [Alpine Magic Helpers](https://github.com/KevinBatdorf/alpine-magic-helpers)
* [Awesome Alpine](https://github.com/ryangjchandler/awesome-alpine)

### Direktifler

---

### `x-data`

**Örnek:** `<div x-data="{ foo: 'bar' }">...</div>`

**Yapı:** `<div x-data="[object literal]">...</div>`

`x-data` yeni bileşenin kapsamını tanımlar. Framework' a akabindeki veri nesnesiyle yeni bir bileşen oluşturmasını söyler.

Bunu Vue bileşenindeki `data` özelliği gibi düşünebilirsiniz.

**Bileşenin Mantığını Ayırmak**

Bileşenin veriyi (ve davranışı) yeniden kullanılabilir fonksiyonlara taşıyablirsiniz:

```html
<div x-data="dropdown()">
    <button x-on:click="open">Open</button>

    <div x-show="isOpen()" x-on:click.away="close">
        // Dropdown
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

> **Bundler aracı kullananlar için**, Alpine.js global kapsamdaki (`window`) fonksiyonlara eriştiğinden, onları `x-data` ile kullanmak için açıkça `window`' a atamanız gerekir. Yani `window.dropdown = function () {}` şeklinde kullanmalısınız. (Bu durum, Webpack, Rollup, Parcel gibi bundler' lar kullandığınızda, tanımladığınız fonksiyonların `window` 'da değil de ilgili modülün kapsamında geçerli olmasından kaynaklanır.)


Ayrıca nesne parçalama kullanarak birden çok veriyi karıştırabilirsiniz:

```html
<div x-data="{...dropdown(), ...tabs()}">
```

---

### `x-init`
**Örnek:** `<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`

**Yapı:** `<div x-data="..." x-init="[expression]"></div>`

`x-init` bir bileşen başlar başlamaz bir ifadeyi çalıştırır.

Eğer Alpine' ın DOM üzerindeki kendi başlangıç güncellemelerinden sonra bir kod parçası çalıştırmak istiyorsanız (VueJS' deki hayat döngüsü olaylarından biri olan `mounted()` olayı gibi), `x-init` 'dan bir geri çağırma fonksiyonu döndürebilir ve sonrasında çalıştırabilirsiniz:

`x-init="() => { // DOM' un ilk kez yüklendikten sonraki durumuna burda erişebilirsiniz. // }"`

---

### `x-show`
**Örnek:** `<div x-show="open"></div>`

**Yapı:** `<div x-show="[expression]"></div>`

`x-show` ifadenin (true or false) olup olmamasına göre elemente `display: none;` özelliği ekler veya çıkarır. 

**x-show.transition**

`x-show.transition` CSS geçiş animasyonlarını kullanarak `x-show`' unuzu daha güzel hale getirmek için kullanışlı bir API' dir.

```html
<div x-show.transition="open">
    Bu içerik görünürken ve kaybolurken geçiş animasyonuna sahip olacak.
</div>
```

| Direktif | Açıklama |
| --- | --- |
| `x-show.transition` | Aynı anda solma efekti ve ölçeklendirme. (opacity, scale: 0.95, timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), duration-in: 150ms, duration-out: 75ms)
| `x-show.transition.in` | Sadece içerik görünürken uygular. |
| `x-show.transition.out` | Sadece içerik kaybolurken uygular. |
| `x-show.transition.opacity` | Sadece solma efektini kullan. |
| `x-show.transition.scale` | Sadece ölçeklendirme efektini kullan. |
| `x-show.transition.scale.75` | CSS ölçeklendirme dönüşümünü `transform: scale(.75)` düzenler. |
| `x-show.transition.duration.200ms` | Giriş süresini 200ms' ye ayarlar. Bu durumda çıkış onun yarısı olacaktır (100ms). |
| `x-show.transition.origin.top.right` | CSS geçiş özelliğinin `transform-origin: top right` başlangıç noktasını düzenler. |
| `x-show.transition.in.duration.200ms.out.duration.50ms` | Giriş ve çıkış için ayrı ayrı süreler tanımlar. |

> Not: Tüm bu geçişler birbirleriyle birlikte kullanılabilir. Note: All of these transition modifiers can be used in conjunction with each other. Aşırı komik olmasına rağmen bu mümkün: `x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale.95`

> Not: `x-show` tüm çocuk elementlerin çıkış animasyonlarını bitirmesini bekler. Eğer bunu istemiyorsanız `.immediate` belirtecini ekleyin:
```html
<div x-show.immediate="open">
    <div x-show.transition="open">
</div>
```
---

### `x-bind`

> Not: Daha kısa sentaks ":" kullanmakta özgürsünüz: `:type="..."`.

**Örnek:** `<input x-bind:type="inputType">`

**Yapı:** `<input x-bind:[attribute]="[expression]">`

`x-bind` bir JavaScript ifadesinin sonucunu bir özelliğe eşitler. Bu ifade bileşenin tüm verilerinin anahtarlarına erişimine sahiptir ve bileşenin datası her ne zaman güncellenirse o da güncellenecektir.

> Not: özellik bağlamalar, sadece kendini ilgilendiren datalar güncellendiğinde güncellenir. Bu çatı, veri değişikliklerini izlemek ve hangi bağlamaların onları ilgilendiriğini anlamak için yeterince zekidir.

**Sınıf özellikleri için `x-bind`**

`x-bind` direktifi `class` özelliğine baplandığında biraz farklı işlev görür.

CSS sınıfları için bir veri nesnesi girersiniz. Bu nesnenin anahtarı sınıfın ismi iken, değeri ise sınıfın uygulanıp uygulanmayacağını belirleyen boolean ifadelerdir.

Örneğin:
`<div x-bind:class="{ 'hidden': foo }"></div>`

Bu örnekte, "hidden" sınıfı sadece `foo` veri özelliği `true` olduğunda uygulanır.

**Boolean özellikler için `x-bind`**

`x-bind` değer özellikleriyle aynı şekilde boolean özelliklerini de destekler. Bunlar bir değişkenin şartlı durum olarak kullanılması veya herhangi bir Javascript ifadesinin `true` or `false` olarak döndürülmesidir.

Örneğin:
```html
<!-- Verilen ifade: -->
<button x-bind:disabled="myVar">Tıkla</button>

<!-- myVar == true olduğunda: -->
<button disabled="disabled">Tıkla</button>

<!-- myVar == false olduğunda: -->
<button>Tıkla</button>
```

Bu, `myVar` true ya da false olduğunda sırasıyla `disabled` özelliğini ekler veya kaldırır.

[HTML specification](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute) 'e göre boolean ifadesinin hangi özelliklerde kullanılacağı görülebilir, örneğin `disabled`, `readonly`, `required`, `checked`, `hidden`, `selected`, `open`, vb.

> Not: `aria-*` gibi özelliklerin false durumunu göstermeniz gerekiyorsa özelliğe bağlama yaparken `.toString()` de kullanın. Örneğin: `isOpen` ister true olsun ister false olsun `:aria-expanded="isOpen.toString()"` görünmeye devam eder.

**`.camel` belirteci**
**Örnek:** `<svg x-bind:view-box.camel="viewBox">`

`camel` belirteci özelliğnin adının deve notasyonuna karşılık gelen ifadeye bağlama yapar. Yukardaki örnekte, `viewBox` özelliği `view-box` ' a değil  `viewBox` 'a bağlanacak.

---

### `x-on`

> Not: Daha kısa sentaksı "@" kullanabilirsiniz: `@click="..."`.

**Örnek:** `<button x-on:click="foo = 'bar'"></button>`

**Yapı:** `<button x-on:[event]="[expression]"></button>`

`x-on` tanımlandığı elemente bir olay dinleyici ekler. Bu olay tetiklendiği zaman, değeri olarak atanan Javascript ifadesi çalıştırılır. `x-on` özelliğini üzerine eklediğiniz elementin desteklediği bütün olayla için kullanabilirsiniz. Olayların tüm listesine ve muhtemel değerleri için [the Event reference on MDN](https://developer.mozilla.org/en-US/docs/Web/Events) adresine bakınız.

Javascript ifadesinde herhangi bir data güncellenirse o dataya bağlı diğer element özellikleri de güncellenir.

> Not: Ayrıca Javascript fonksiyon ismini de verebilirsiniz.

**Örnek:** `<button x-on:click="myFunction"></button>`

Yukardaki ifadeye denk: `<button x-on:click="myFunction($event)"></button>`

**`keydown` belirteçleri**

**Örnek:** `<input type="text" x-on:keydown.escape="open = false">`

Keydown belirteçlerini `x-on:keydown` direktifine ekleyip daha spesifik dinlemeler yapabilirsiniz. Bu belirteçler `Event.key` değerlerinin kebap notasyonu olduğuna dikkat edin.

Örnekler: `enter`, `escape`, `arrow-up`, `arrow-down`

> Not: Sistem-belirteci anahtar kombinasyonlarını da dinleyebilirsiniz: `x-on:keydown.cmd.enter="foo"`

**`.away` belirteci**

**Örnek:** `<div x-on:click.away="showModal = false"></div>`

`.away` belirteci kullanıldığında, olay yakalayıcı sadece kendi ve çocukları dışındaki bir kaynaktan gelen olayda çalıştırılır.

Bu, açılır menü ve diyalog pencelerinin dışına tıklandığında gizlenmesi için kullanışlıdır.

**`.prevent` belirteci**
**Örnek:** `<input type="checkbox" x-on:click.prevent>`

Bir olay dinleyicisine `.prevent` eklemek tetiklenecek event üzerinde `preventDefault` çağırır. Yukarıdaki örneğe bakıldığında bu, kullanıcı checkbox 'a tıkladığında gerçek bir checked olayının gerçekleşmeyeceği anlamına gelir.

**`.stop` belirteci**
**Örnek:** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

Bir olay dinleyicisine `.stop` eklemek tetiklenecek event üzerinde `stopPropagation` çağırır. Adding `.stop` to an event listener will call `stopPropagation` on the triggered event. Yukarıdaki örneğe bakıldığında bu, dıştaki `<div>` 'den gelen "click" olayının tetiklenmeyeceiği anlamına gelir. Başka bir deyişle, kullanıcı butona bastığında `foo` özelliğine `'bar'` atanmayacak.

**`.self` belirteci**
**Örnek:** `<div x-on:click.self="foo = 'bar'"><button></button></div>`

Bir olay dinleyicisine `.self` eklersek  olay yakalayıcısını sadece `$event.target` kendisi olması durumunda tetikleyecek. Yukarıdaki örnekte bu, butondan kaynaklanan "click" olayının dış `<div>`' deki yakalayıcıyı **çalıştırmayacağı** anlamına gelir.

**`.window` belirteci**
**Örnek:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

Olay dinleyicisine `.window` eklemek onu tanımlandığı DOM düğümü üzerinde değil glonal window nesnesinde çalıştıracak.Bu, resize olayı gibi window'  da bazı değişiklikler olduğunda bileşenin durumunu düzenlemek için kullanışlıdır. Yukardaki örnekte, pencere genişliği 768 pikselden daha geniş olduğunda açılır menüyü kapatırız, aksi halde aynı kalır.

> Not: Ayrıca dinleyicileri `window` yerine `document` 'e eklemek için `.document` belirtecini kullanabilirsiniz.

**`.once` belirteci**
**Örnek:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

Bir olay dinleyicisine `.once` belirtecini eklersek, dinleyicinin sadece bir kez çalışacağından emin oluruz. Bu, HTML kısımlar vb. şeyleri çekmek gibi sadece bir kez yapılmasını istediğiniz şeyler için kullanışlıdır.

**`.passive` belirteci**
**Örnek:** `<button x-on:mousedown.passive="interactive = true"></button>`

`.passive` belirtecini bir olay dinleyicisine eklersek bu belirteç o dinleyiciyi pasif hale getirir. Bu da `preventDefault()` fonksiyonunun işletilecek hiç bir event üzerinde çalışmayacağı anlamına gelir. Bu dokunmatik cihazlardaki scroll performansları gibi durumlarda yardım edebilir.

**`.debounce` belirteci**
**Örnek:** `<input x-on:input.debounce="fetchSomething()">`

`debounce` belirteci bir olay yakalayıcısına "dalgalı tıklama engelleyici" eklemenize izin verir. Başka bir deyişle, olay yakalayıcısı, son olayın tetiklenmesi üzerinden belli bir zaman geçmedikçe çalışmaz. Yakalayıcı tekrar çağrılmaya hazır olduğunda, en son ki yakalayıcı cağrısı çalışır.

Varsayılan engelleme süresi 250 milisaniyedir.

Bunu değiştirmek isterseniz, aşağıdaki gibi özel bir bekleme süresi belirtebilirsiniz:

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

**`.camel` belirteci**
**Örnek:** `<input x-on:event-name.camel="doSomething()">`

`camel` belirteci, olay dinleyiciye olay isminin deve notasyonuna denk gelen ifadesini ekler. Yukarıdaki örnekte, `eventName` olayı element üzerinde tetiklendiğinde, ifade çalıştırılacak.
---

### `x-model`
**Örnek:** `<input type="text" x-model="foo">`

**Yapı:** `<input type="text" x-model="[data item]">`

`x-model` özelliği elemente "çift yönlü bağlama" ekler. Yani, input elementinin değeri bileşenin veri öğesiyle senkronize tutulur. 

> Not: `x-model` metin girişleri, onay kutuları, radyo düğmeleri, metin alanları, seçimler ve çoklu seçimler üzerindeki değişiklikleri tespit edecek kadar zekidir. Bu [how Vue would](https://vuejs.org/v2/guide/forms.html) adresindeki senaryolara uygun çalışması gerekir.

**`.number` belirteci**
**Örnek:** `<input x-model.number="age">`

`number` belirteci girişin değerini bir numaraya çevirir. Eğer giriş değeri geçerli bir numaraya çevrilemeyecekse, orjinal değer döndürülür.

**`.debounce` belirteci**
**Example:** `<input x-model.debounce="search">`

The `debounce` belirteci bir değer güncellemesine bir "dalgalı tıklama engelleyici" ekler. Başka bir deyişle, olay yakalayıcısı, son olayın tetiklenmesi üzerinden belli bir zaman geçmedikçe çalışmaz. Yakalayıcı tekrar çağrılmaya hazır olduğunda, en son ki yakalayıcı cağrısı çalışır.

Varsayılan engelleme süresi 250 milisaniyedir.

Bunu değiştirmek isterseniz, aşağıdaki gibi özel bir bekleme süresi belirtebilirsiniz:

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

---

### `x-text`
**Örnek:** `<span x-text="foo"></span>`

**Yapı:** `<span x-text="[expression]"`

`x-text` direktifi `x-bind` ile benzer şekilde çalışır. Tek fark, `x-text` bir özelliğin değerini güncellemek yerine, bir elementin `innerText` özelliğini günceller.

---

### `x-html`
**Örnek:** `<span x-html="foo"></span>`

**Yapı:** `<span x-html="[expression]"`

`x-html` direktifi `x-bind` ile benzer şekilde çalışır. Tek fark, `x-text` bir özelliğin değerini güncellemek yerine, bir elementin `innerHTML` özelliğini günceller.

> :uyarı: **Yalnızca güvenilir içerikte kullanın ve asla kullanıcı tarafından sağlanan içerikte kullanmayın.** :uyarı:
>
> Üçüncü şahıslardan gelen HTML' in dinamik olarak işlenmesi açıkça [XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) zaaflarına yol açabilir.

---

### `x-ref`
**Örnek:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**Yapı:** `<div x-ref="[ref name]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`

`x-ref` bileşeninizin dışından işlenmemiş DOM elementlerini getirmek için kullanışlı bir yoldur. Bir element üzerinde `x-ref` kullanarak,onu, `$refs` denilen bir nesne içinde, tüm olay yakalayıcılarına erişebilir kılarsınız.

Bu bir elemente "id" ler atayıp `document.querySelector` ile her yerden erişme mantığına yardımcı bir alternatiftir.

> Not: Ayrıca ihtiyacınız olduğunda x-ref' e dinamik değerler `<span :x-ref="item.id"></span>` verebilirsiniz.

---

### `x-if`
**Örnek:** `<template x-if="true"><div>Some Element</div></template>`

**Yapı:** `<template x-if="[expression]"><div>Some Element</div></template>`

`x-show` 'in yetersiz olduğu durumlarda (`x-show` değeri false ise elemente `display: none` özelliği ekler), bir elementi tamamıyla DOM 'dan silmek için `x-if` kullanılabilir.

Alpine sanal DOM mantığını kullanmadığı için `x-if` 'in `<template></template>` etiketiyle kullanıldığına dikkat edin. Bu uygulama Alpine 'nın kararlı kalmasını ve büyüsünü gerçekleştirmek içingerçek DOM 'u kullanmasını sağlar.

> Not: `x-if` direktifi `<template></template>` etiketi içindeki tek bir kök element için kullanılması gerekir.

> Not: Bir `svg` etiketi içinde `template` kullanacaksanız, Alpine.js başlatılmadan önce bir [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) eklemeniz gerekir.

---

### `x-for`
**Örnek:**
```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

> Not: `:key` ile atama isteğe bağlıdır ama Note: the `:key` binding is optional, ama ŞİDDETLE tavsiye edilir.

Bir dizinin her bir elemanı için yeni bir DOM düğümü oluşturmak istediğiniz durumlar için `x-for` vardır. Bu Vue 'deki `x-for` etiketine benzerdir. Tek fark, Alpine bu direktifi normal bir DOM elementi üzerinde kullanamaz. Bunun için bir `template` etiketinin varlığına ihtiyaç duyar.

Eğer iterasyonun o anki indeksine erişmek istiyorsanız aşağıdaki sentaksı kullanın:

```html
<template x-for="(item, index) in items" :key="index">
    <!-- İhtiyacanız olduğunda iterasyon içinde "index" 'i ayrıca referans olarak gösterebilirsiniz. -->
    <div x-text="index"></div>
</template>
```

Bir nesne dizisinin (koleksiyon) iterasyonuna erişmek istiyorsanız aşağıdaki sentaksı kullanın:

```html
<template x-for="(item, index, collection) in items" :key="index">
    <!-- İhtiyacınız olduğunda iterasyon içinde ayrıca "collection" 'a referans gösterebilirsiniz. -->
    <!-- Geçerli öğe. -->
    <div x-text="item"></div>
    <!-- Üsteki ile aynı. -->
    <div x-text="collection[index]"></div>
    <!-- Bir önceki öğe. -->
    <div x-text="collection[index - 1]"></div>
</template>
```

> Not: `x-for` etiketi `<template></template>` etiketi içindeki tek bir kök element için kullanılması gerekir.

> Not: Bir `svg` etiketi içinde `template` kullanacaksanız, Alpine.js başlatılmadan önce bir [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) eklemeniz gerekir.

#### İç içe `x-for` lar
İç içe `x-for` döngüleri kullanabilirsiniz; ama her bir döngüyü bir elemente sarmanız ŞARTTIR. Örneğin:

```html
<template x-for="item in items">
    <div>
        <template x-for="subItem in item.subItems">
            <div x-text="subItem"></div>
        </template>
    </div>
</template>
```

#### Bir aralık üzerinde iterasyoun

Alpine `n` bir tamsayı olduğu durumlar için `i in n` sentaksını destekler. Bu belirlenmiş bir dizi eleman üzerinde dolaşmanızı sağlar.

```html
<template x-for="i in 10">
    <span x-text="i"></span>
</template>
```

---

### `x-transition`
**Örnek:**
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

> Yukarıdaki örnek [Tailwind CSS](https://tailwindcss.com) 'daki sınıfları kullanıyor.

Alpine, bir elementin "hidden" ve "shown" durumları arasındaki çeşitli aşamalara uygulamak için 6 farklı geçiş direktifi sunar. Bu direktifler hem `x-show` hem de `x-if` ile çalışır.

Bunlar farklı ve daha mantıklı isimli olmaları dışında, tam olarak VueJS 'in geçiş direktifleri gibi çalışır:

| Direktif | Açıklama |
| --- | --- |
| `:enter` | Giriş aşaması boyunca uygulanır. |
| `:enter-start` | Element yerleştirilmeden önce eklenir ve yerleştikten bir kare sonra kaldırılır. |
| `:enter-end` | Element yerleştirildikten bir kare sonrası eklenir (aynı anda `enter-start` kaldırılır), geçiş/animasyon bittiğinde kaldırılır.
| `:leave` | Ayrılma aşaması boyunca uygulanır.
| `:leave-start` | Bir ayrılma geçişi tetiklenir tetiklenmez eklenir ve bir kare sonrası kaldırılır. |
| `:leave-end` | Bir ayrılma geçişi tetiklendikten bir kare sonrasında eklenir (aynı anda `leave-start` kaldırılır), geçiş/animasyon bittiğinde kaldırılır.

---

### `x-spread`
**Örnek:**
```html
<div x-data="dropdown()">
    <button x-spread="trigger">Menüyü aç</button>

    <span x-spread="dialogue">Menü içeriği</span>
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

`x-spread` direktifi, bir elementin Alpine bağlamalarını yeniden kullanılabilir bir nesneye çıkarmanızı sağlar.

Bu nesne anahtarları birer direktiflerdir (Belirteçler içeren herhangi bir direktif olabilir) ve değerleri Alpine tarafından çalıştırlabilecek geri çağırma fonksiyonlarıdır.

> Not: x-spread için dikkat etmeniz gereken birkaç nokta var:
> - "spread" edilecek direktif `x-for` olduğu zaman, fonksiyondan düz bir string ifade döndürmeniz gerekir. Örneğin: `['x-for']() { return 'item in items' }`
> - `x-data` ve `x-init` ise bir "spread" nesnesinde kullanılamaz.

---

### `x-cloak`
**Örnek:** `<div x-data="{}" x-cloak></div>`

`x-cloak` özellikleri, Alpine başlatılır başlatılmaz elementlerden kaldırılır. Bu önceden yüklenmiş DOM 'u gizlemek için kullanışlıdır. attributes are removed from elements when Alpine initializes. This is useful for hiding pre-initialized DOM. Bunun çalışması için yaygın kullanım, aşağıdaki global stili eklemektir.

```html
<style>
    [x-cloak] { display: none; }
</style>
```

### Sihirli Özellikler

> `$el` hariç diğer sihirli özellikler, bileşen henüz başlatılmadığı için **`x-data` içinde kullanılamaz**.

---

### `$el`
**Örnek:**
```html
<div x-data>
    <button @click="$el.innerHTML = 'foo'">Beni "foo" ile yer değiştir</button>
</div>
```

`$el`, kök DOM düğümünü getirmek için kullanılan bir sihirli özelliktir.

### `$refs`
**Örnek:**
```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

`$refs` bileşen içinde `x-ref` ile işaretlenmiş DOM elementlerini getirmek için kullanılan shirili bir özelliktir. Bu, DOM elementlerini manuel olarak işlemeniz gerektiğinde kullanışlıdır.

---

### `$event`
**Örnek:**
```html
<input x-on:input="alert($event.target.value)">
```

`$event` tarayıcının kendi "Event" nesnesini getirmek için bir olay dinleyici içinde kullanılabilir.

> Not: $event özelliği yalnızca DOM ifadelerinde kullanılabilir.

Eğer $event 'a bir JavaScript fonksiyonu içinde erişmek istiyorsanız doğrudan parametre olarak verebilirsiniz:

`<button x-on:click="myFunction($event)"></button>`

---

### `$dispatch`
**Örnek:**
```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
    <!-- Tıklandığında console.log "bar" durumuna dönüşecek -->
</div>
```

**Olay yayılımı üzerine notlar**

[olay köpürme](https://en.wikipedia.org/wiki/Event_bubbling) 'den dolayı dikkat edin; aynı hiyerarşik seviyeden dağıtılan olayları yakalamanız gerektiğinde, [`.window`](https://github.com/alpinejs/alpine#x-on) belirtecini kullanmanız gerekir.

**Örnek:**

```html
<div x-data>
    <span @custom-event="console.log($event.detail.foo)"></span>
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
<div>
```

> Yukarıdaki örnek çalışmayacaktır; çünkü `custom-event` event dağıtıldığında ortak ataları olan `div` 'e yayılacak.

**Bileşenlere Dağıtmak**

Bileşenleri birbiriyle konuşturmak için bir önceki teknikten de faydalanabilirsiniz.

**Örnek:**

```html
<div x-data @custom-event.window="console.log($event.detail)"></div>

<button x-data @click="$dispatch('custom-event', 'Hello World!')">
<!-- Tıklandığında console.log "Hello World!" durumuna dönüşecek. -->
```

`$dispatch`, bir `CustomEvent` oluşturmanın ve dahili olan `dispatchEvent()` fonksiyonunu kullanarak onu iletmenin kısa yoludur. Özel olayları kullanarak bileşenlerde ve birbirleri arasında veri göndermenin birçok yararlı kullanım durumları vardır. Tarayıcılardaki `CustomEvent` sisteminin altında yatan daha fazla bilgi için [Bakınız](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events).

Dikkat edeceğiniz nokta; `$dispatch('some-event', { some: 'data' })` için ikinci parametre olarak verdiğiniz herhangi bir data, yeni bir olayın "detail" özelliğyle erişilebilir hale gelir:`$event.detail.some`. Özel olay verisinin `detail` özelliğine eklenmesi tarayıcılardaki `CustomEvent` 'lar için standart bir uygulamadır. Daha fazla bilgi için [Bakınız](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)

Ayrıca `x-model` bağlamaları için veri güncellemelerini tetiklemekte `$dispatch()` 'i kullanabilirsiniz. Örneğin:

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')">
        <!-- Butona tıklandığında, `x-model` köpüren "input" olayını yakalar ve foo 'yu "baz" olarak günceller. -->
    </span>
</div>
```

> Not: Bu $dispatch özelliği yalnızca DOM ifadelerinde kullanılabilir.

Eğer $dispatch 'a bir JavaScript fonksiyonu içinde erişmek istiyorsanız doğrudan parametre olarak verebilirsiniz:

`<button x-on:click="myFunction($dispatch)"></button>`

---

### `$nextTick`
**Örnek:**
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

`$nextTick`, verilen bir ifadeyi sadece, Alpine 'nın kendi reaktif DOM güncellemelerini yaptıktan SONRA çalıştırmanıza olanak sağlayan sihirli bir özelliktir. Bu, yaptığınız herhangi bir güncellemenin yansıltılmasından sonraki DOM durumuyla iletişim kurmak istediğinizde kullanışlıdır.

---

### `$watch`
**Örnek:**
```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Aç Kapa</button>
</div>
```

`$watch` sihirli metoduyla bir bileşen özelliğini "izleye" bilirsiniz. Yukarıdaki örnekte, butona tıklanıp `open` değiştiğinde, verilen geri çağırma fonksiyonu ateşlenir ve yeni değer `console.log` ile basılır.

## Güvenlik
Eğer güvenlik zaafları bulursanız lütfen [calebporzio@gmail.com]() adresine gönderin.

Alpine kendi direktiflerini çalıştırmak için `Function` nesnesinin özel bir uygulamasına dayanır. `eval()` fonksiyonundan daha güvenli olmasına rağmen, Google Chrome App gibi sınırlandırılmış İçerik Güvenliği Politikası (İGP) kullanan bazı ortamlarda kullanımı yasaktır.

Eğer Alpine 'ı hassas verilerle ilgilenen ve [CSP](https://csp.withgoogle.com/docs/strict-csp.html) gerektiren bir sitede kullanırsanız, politikanıza `unsafe-eval` 'i dahil etmeniz gerekir. Doğru şekilde yapılandırılmış sağlam bir politika, kişisel veya finansal verileri kullanırken kullanıcılarınızın korunmasına yardımcı olacaktır.

Bu politika, sayfanızdaki tüm kodlara uygulanacağından, sitenize eklediğiniz diğer dış kütüphanelerin güvenilir olduklarını ve sayfanıza ya `eval()` fonksiyonunu kullanarak ya da zararlı kod enjekte edip DOM 'u yöneterek Siteler Arası Betik Çalıştırma zaafını uygulamadığından emin olmak için söz konusu bu kütüphaneleri dikkatlice gözden geçirmek önemlidir.

## V3 Yol Haritası
* Vue benzerliği için "x-ref" ten "ref" e geçilsin mi?
* `Alpine.directive()` Eklemek
* `Alpine.component('foo', {...})` Eklemek (Sihirli `__init()` metoduyla birlikte)
* "loaded", "transition-start" vb. için Alpine olaylarını iletmek... ([#299](https://github.com/alpinejs/alpine/pull/299)) ?
* `x-bind:class="{ 'foo': true }"` 'dan "object" (ve array) sentaksını kaldırmak ([#236](https://github.com/alpinejs/alpine/pull/236) `style` özelliği için nesne sentaksını desteklemek)
* `x-for` reaktif değişimi geliştirmek ([#165](https://github.com/alpinejs/alpine/pull/165))
* V3 'te "derin izleme" desteği eklemek ([#294](https://github.com/alpinejs/alpine/pull/294))
* `$el` kısayolu eklemek
* `@click.away` 'i `@click.outside` olarak değiştirmek?

## Lisans

Copyright © 2019-2021 Caleb Porzio and contributors

MIT lisansı altında lisanslanmıştır, detaylar için [LICENSE.md](LICENSE.md) 'e bakınız.
