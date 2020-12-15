# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true)](https://alpinejs.codewithhugo.com/chat/)

Alpine.js 提供了 Vue 與 React 等大框架的互動式與宣告式的功能，而不需花費太多成本。

有了 Alpine.js 就可以繼續使用 DOM，並在有需要的時候通過 Alpine.js 增加功能。

可以想像成是 JavaScript 版的 [Tailwind](https://tailwindcss.com/)。

> 備註：Alpine.js 的格式幾乎都是從 [Vue](https://vuejs.org/) 參考而來 (以及擴充了 [Angular](https://angularjs.org/))。本人在此由衷感謝這些套件為 Web 環境帶來的貢獻。

## 安裝  

**使用 CDN:** 將下列腳本新增至 `<head>` 末端。
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
```

就這樣。Alpine.js 會自行初始化。

在正式環境中，建議在連結中固定特定版本，以避免新版本使功能無法使用。
如，要使用 `2.8.0` 版則可以這樣寫：
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.0/dist/alpine.min.js" defer></script>
```

**使用 npm:** 從 npm 安裝套件。
```js
npm i alpinejs
```

在腳本中引入。
```js
import 'alpinejs'
```

**若要支援 IE11** 請改用下列腳本。
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
```

上述寫法使用了 [module/nomodule 模式 (英文)](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/) ，這樣寫可以讓現代瀏覽器自動載入模組套件組合，而 IE11 以及其他舊瀏覽器中則會自動載入 IE11 模組套件。

## 開始使用

**下拉選單 Dropdown、強制回應視窗 Modal**
```html
<div x-data="{ open: false }">
    <button @click="open = true">展開下拉選單</button>

    <ul
        x-show="open"
        @click.away="open = false"
    >
        下拉選單內容
    </ul>
</div>
```

**索引標籤 Tab**
```html
<div x-data="{ tab: 'foo' }">
    <button :class="{ 'active': tab === 'foo' }" @click="tab = 'foo'">Foo</button>
    <button :class="{ 'active': tab === 'bar' }" @click="tab = 'bar'">Bar</button>

    <div x-show="tab === 'foo'">索引標籤 Foo</div>
    <div x-show="tab === 'bar'">索引標籤 Bar</div>
</div>
```

也可以用在更多地方：

**遊標停留時預先截取下拉選單的 HTML**
```html
<div x-data="{ open: false }">
    <button
        @mouseenter.once="
            fetch('/dropdown-partial.html')
                .then(response => response.text())
                .then(html => { $refs.dropdown.innerHTML = html })
        "
        @click="open = true"
    >顯示下拉選單</button>

    <div x-ref="dropdown" x-show="open" @click.away="open = false">
        載入中進度環...
    </div>
</div>
```

## 學習

總共有 14 種可用的指示詞 (Directive)：

| 指示詞 | 說明 |
| --- | --- |
| [`x-data`](#x-data) | 宣告新元件定義範圍。 |
| [`x-init`](#x-init) | 模組初始化後執行運算式。 |
| [`x-show`](#x-show) | 依據運算式 (true 或 false) 新增或移除元素的 `display: none;`。 |
| [`x-bind`](#x-bind) | 將屬性的值設為 JS 運算式的執行結果。 |
| [`x-on`](#x-on) | 將事件監聽器附加至元素上。當事件發出後執行 JS 運算式。 |
| [`x-model`](#x-model) | 為元素新增「雙向資料繫結」。保持輸入元素與元件資料間的同步。 |
| [`x-text`](#x-text) | 與 `x-bind` 的運作方式類似，但更新的是元素的 `innerText`。 |
| [`x-html`](#x-html) | 與 `x-bind` 的運作方式類似，但更新的是元素的 `innerHTML`。 |
| [`x-ref`](#x-ref) |從元素中取得原始 DOM 元素的簡便方法。 |
| [`x-if`](#x-if) | 從 DOM 中完全移除元素。必須在 `<template>` 標籤上使用。 |
| [`x-for`](#x-for) | 為陣列中的每個項目建立新 DOM 節點。必須在 `<template>` 標籤上使用。 |
| [`x-transition`](#x-transition) | 用於在轉場的各個階段為元素設定 Class 的指示詞。 |
| [`x-spread`](#x-spread) | 為了更佳的可複用性，可將包含 Alpine 指示詞的物件繫結至元素上。 |
| [`x-cloak`](#x-cloak) | 該屬性會在 Alpine 初始化後移除。適合用來隱藏還未初始化的 DOM。 |

以及 6 個魔法屬性：

| 魔法屬性 | 說明 |
| --- | --- |
| [`$el`](#el) |  截取根元素的 DOM 節點。 |
| [`$refs`](#refs) | 截取元素中以 `x-ref` 標記的 DOM 元素。 |
| [`$event`](#event) | 在事件監聽器中截取瀏覽器的原生「Event」物件。  |
| [`$dispatch`](#dispatch) | 建立 `CustomEvent` 並在內部以其 `.dispatchEvent()` 發送該 `CustomEvent`。 |
| [`$nextTick`](#nexttick) | 在 Alpine 處理好 DOM 更新 **之後** 執行給定的運算式。 |
| [`$watch`](#watch) | 當正在「監聽 - watch」的屬性發生改動後，觸發給定的回呼函式。 |


## 贊助

<img width="33%" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" alt="Tailwind CSS">

**想在這裡顯示你的 Logo 嗎？ [在 Twitter 上傳送 DM](https://twitter.com/calebporzio)**

## VIP 參與者

<table>
  <tr>
    <td align="center"><a href="http://calebporzio.com"><img src="https://avatars2.githubusercontent.com/u/3670578?v=4" width="100px;" alt="Caleb Porzio"/><br /><sub><b>Caleb Porzio</b></sub></a><br /><sub>(作者)</sub></td>
    <td align="center"><a href="https://github.com/HugoDF"><img src="https://avatars2.githubusercontent.com/u/6459679?v=4" width="100px;" alt="Hugo"/><br /><sub><b>Hugo</b></sub></a></td>
    <td align="center"><a href="https://github.com/ryangjchandler"><img src="https://avatars2.githubusercontent.com/u/41837763?v=4" width="100px;" alt="Ryan Chandler"/><br /><sub><b>Ryan Chandler</b></sub></a></td>
    <td align="center"><a href="https://github.com/SimoTod"><img src="https://avatars2.githubusercontent.com/u/8427737?v=4" width="100px;" alt="Simone Todaro"/><br /><sub><b>Simone Todaro</b></sub></a></td>
  </tr>
</table>

### 指示詞

---

### `x-data`

**範例:** `<div x-data="{ foo: 'bar' }">...</div>`

**結構:** `<div x-data="[JSON 資料物件]">...</div>`

`x-data` 宣告新的元件定義範圍。使用 x-data 會告知 Alpine 以給定的資料物件來初始化新的元件。

可想像成 Vue 元件中的 `data` 屬性。

**抽出元素邏輯**

可以將資料 (與行為) 抽出成可重複使用的函式：

```html
<div x-data="dropdown()">
    <button x-on:click="open">開啟</button>

    <div x-show="isOpen()" x-on:click.away="close">
        // 下拉選單
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

> **各位 Bundler 使用者**，請注意，Alpine.js 存取的函式都在全域範圍 (`window`)，要在 `x-data` 中使用函式時必須要顯式將函式指派至 `window` 上。如 `window.dropdown = function () {}` (因為 Webpack, Rollup, Parcel …等中，定義的 `function` 預設都在模組範圍內而不是 `window`)。

也可以使用物件解構來將多個資料物件混合在一起：

```html
<div x-data="{...dropdown(), ...tabs()}">
```

---

### `x-init`
**範例:** `<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`

**結構:** `<div x-data="..." x-init="[運算式]"></div>`

`x-init` 會在元素初始化後執行運算式。

若想在 Alpine 將更新套用至 DOM **之後** 才執行程式碼的話 (類似 VueJS 中的 `mounted()` Hook)，可以從 `x-init` 中回傳一個回呼函式，該函式會在出套用至 DOM 後才執行：

`x-init="() => { // 此處可存取 DOM 初始化完畢後的狀態 // }"`

---

### `x-show`
**範例:** `<div x-show="open"></div>`

**結構:** `<div x-show="[運算式]"></div>`

`x-show` 會依據運算式為 `true` 或 `false` 來在元素上會新增或移除 `display: none;` 樣式。

**x-show.transition**

`x-show.transition` 是一個很方便的 API，可使 `x-show` 更與 CSS Transition 配合地更佳完美。

```html
<div x-show.transition="open">
    這裡的內容會轉換入、轉換出。
</div>
```

| 指示詞 | 說明 |
| --- | --- |
| `x-show.transition` | 同時淡入淡出並縮放。 (opacity, scale: 0.95, timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), duration-in: 150ms, duration-out: 75ms)
| `x-show.transition.in` | 僅轉換入。 |
| `x-show.transition.out` | 僅轉換出。 |
| `x-show.transition.opacity` | 僅使用淡入淡出。 |
| `x-show.transition.scale` | 僅使用縮放。 |
| `x-show.transition.scale.75` | 自定 CSS 縮放變換 `transform: scale(.75)`. |
| `x-show.transition.duration.200ms` | 設定「轉換入」的變換為 200ms。轉換出將設定為該值的一半 (100ms). |
| `x-show.transition.origin.top.right` | 自定 CSS 變換的起始 `transform-origin: top right`. |
| `x-show.transition.in.duration.200ms.out.duration.50ms` | 為「轉換入」與「轉換出」設定不同的持續時間。 |

> 備註：所有的轉換修飾詞都可以互相組合使用。可以這樣用 (雖然很故意XD)： `x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale.95`

> 備註：`x-show` 會等待所有子節點都完成轉換後。若想跳過這個行為，請加上 `.immediate` 修飾詞：
```html
<div x-show.immediate="open">
    <div x-show.transition="open">
</div>
```
---

### `x-bind`

> 備註：也可以使用較短的「:」語法： `:type="..."`

**範例:** `<input x-bind:type="inputType">`

**結構:** `<input x-bind:[屬性]="[運算式]">`

`x-bind` 將屬性值設為 JavaScript 運算式的結果。運算式中可以存取元件資料物件中的所有索引鍵，且每次資料有更新時都更新。

> 備註：屬性繫結 **僅會** 在其相依的值更新時才更新。Alpine 框架會觀察資料的更改，並偵測哪個繫結與該資料有關。

**將 `x-bind` 用在 Class 屬性**

當繫結在 `class` 屬性時，`x-bind` 的運作模式會有點不同。

對於 Class，需要傳入一個物件，其中物件的索引鍵為 Class 的名稱，而值則為布林運算式，用來判斷是否要套用該 Class 名稱。

如：
`<div x-bind:class="{ 'hidden': foo }"></div>`

在該例中，「hidden」class 只會在 `foo` 資料屬性的值為 `true` 時套用。

**將 `x-bind` 用在布林屬性**

`x-bind` 支援以與數值屬性相同的方式來繫結布林屬性，只需使用作為判斷條件的變數或是任意可以解為 `true` 或 `false` 的 JavaScript 運算式即可。

如：
```html
<!-- 如下程式: -->
<button x-bind:disabled="myVar">點擊此處</button>

<!-- 當 myVar == true: -->
<button disabled="disabled">點擊此處</button>

<!-- 當 myVar == false: -->
<button>點擊此處</button>
```

該範例中的程式會依據 `myVar` 為 true 或 false 來新增或移除 disabled 屬性。

布林屬性的支援係依據 [HTML 規格 (英文)](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute)，如 `disabled`, `readonly`, `required`, `checked`, `hidden`, `selected`, `open` …等。

**`.camel` 修飾詞**

**範例:** `<svg x-bind:view-box.camel="viewBox">`

使用 `camel` 修飾詞會繫結到對應駝峰命名法的屬性上。在上述例子中， `viewBox` 的值會被繫結到 `view-box` 所對應的 `viewBox` 屬性上。

---

### `x-on`

> 備註：也可以使用較短的「@」語法：`@click="..."`

**範例:** `<button x-on:click="foo = 'bar'"></button>`

**結構:** `<button x-on:[事件]="[運算式]"></button>`

`x-on` 將事件監聽器附加至宣告 `x-on` 的元素上。當發出該事件後，執行設定為該事件值的對應 JavaScript 運算式。

若在該運算式中有修改任何資料，則其他「繫結 Bind」該資料元素屬性也會一併更新。

> 備註：也可以指定一個 JavaScript 函式名稱

**範例:** `<button x-on:click="myFunction"></button>`

與該程式碼相同: `<button x-on:click="myFunction($event)"></button>`

**`keydown` 修飾詞**

**範例:** `<input type="text" x-on:keydown.escape="open = false">`

可以將按鍵附加到 `x-on:keydown` 指示詞後面來指定要監聽的按鍵。請注意，該修飾詞使用的是 `-` 號分隔命名 (kebab-cased) 版本的 `Event.key` 值。

如： `enter`, `escape`, `arrow-up`, `arrow-down`

> 備註：也可以監聽使用系統修飾詞的按鍵組合，如： `x-on:keydown.cmd.enter="foo"`

**`.away` 修飾詞**

**範例:** `<div x-on:click.away="showModal = false"></div>`

當有 `.away` 修飾詞時，將只會在由非該元素或該元素子節點的其他元素發出事件時執行事件處理常式。

適合用在讓使用者點擊元件外面來關閉下拉選單與強制回應視窗時隱藏這些元件等情況。

**`.prevent` 修飾詞**

**範例:** `<input type="checkbox" x-on:click.prevent>`

在事件監聽器加上 `.prevent` 會在觸發的事件上呼叫 `preventDefault`。在上述範例中，使用 `.prevent` 則代表該多選框在使用者點擊後不會被實際選中。

**`.stop` 修飾詞**

**範例:** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

在事件監聽器加上 `.stop` 會在觸發的事件上呼叫 `stopPropagation`。在上述範例中，使用 `.stop` 則代表「click」事件觸發之後不會從底部 Bubble 到外層的 `<div>` 。換句話來說，使用者點擊按鈕 (Button) 後， `foo` 的值不會被設為 `'bar'`。

**`.self` 修飾詞**

**範例:** `<div x-on:click.self="foo = 'bar'"><button></button></div>`

在事件監聽器加上 `.self` 則只會在 `$event.target` 是該元素的時候才觸發監聽器。在上述範例中，則表示從按鈕 Bubble 到外層 `<div>` 上來的「click」事件 **不會** 執行監聽器。

**`.window` 修飾詞**

**範例:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

在事件監聽器加上 `.window` 會將監聽器安裝到全域的 window 物件中，而不是宣告該監聽器的 DOM 物件上。適合用在當有其他東西修改了 window 而需要修改元件狀態的時候，如縮放事件。在本例中，當視窗調整為大於 768 像素寬時，程式會關閉強制回應視窗或下拉選單，否則會繼續維持原本的狀態。

>備註：也可以使用 `.document` 修飾詞來將監聽器附加到 `document` 而不是 `window` 上

**`.once` 修飾詞**

**範例:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

在事件監聽器加上 `.onece` 則可以確保只會呼叫一次事件監聽器。適合用來做一些只需要做一次就好的事，如取得 HTML 部分等。

**`.passive` 修飾詞**

**範例:** `<button x-on:mousedown.passive="interactive = true"></button>`

在事件監聽器加上 `.passive` 修飾詞則可讓監聽器成為被動，也就表示在所有處理的事件上 `preventDefault()` 都將不會有任何作用。可以用在如提升觸控裝置上的滾動效能等目的。 

**`.debounce` 修飾詞**

**範例:** `<input x-on:input.debounce="fetchSomething()">`

`.debounce` 修飾詞可以試事件監聽器「消除彈跳 (Debouce)」。也就是說，該處理常式會等到上一個事件觸發後的一段時間後才執行。當處理常式準備好可執行後，則會執行上一個處理常式呼叫。

預設的消除彈跳「等待」時間為 250 毫秒。

若要自定等待事件，則可使用如下方法指定：

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

**`.camel` 修飾詞**

**範例:** `<input x-on:event-name.camel="doSomething()">`

使用 `.camel` 修飾詞來監聽以駝峰命名法命名的事件。在上述例子中，元素觸發 `eventName` 事件後會執行該運算式。

---

### `x-model`
**範例:** `<input type="text" x-model="foo">`

**結構:** `<input type="text" x-model="[資料項目]">`

`x-model` 可用來在元素加上「雙向資料繫結 (Two-way Data Binding)」。也就是說，輸入元素的值會保持與元件資料項目的值同步。

> 備註：`x-model` 很聰明，會偵測文字輸入框、多選框、單選框、Textarea、下拉選單與多重選取區域等。`x-model` 的運作方式在各個情況下應該都[與 Vue 相同](https://vuejs.org/v2/guide/forms.html)。

**`.debounce` 修飾詞**

**範例:** `<input x-model.debounce="search">`

`debounce` 修飾詞可以在數值更新上加上「消除彈跳 (Debounce)」。也就是說，從上一次事件觸發之後的一段時間之後才會呼叫事件處理常式。當處理常式可呼叫後，才會執行上一個處理常式呼叫。

預設的消除彈跳「等待」時間為 250 毫秒。

若要自定等待時間，則可用下列方式指定：

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

---

### `x-text`
**範例:** `<span x-text="foo"></span>`

**結構:** `<span x-text="[運算式]"`

`x-text` 類似 `x-bind` ，但更新的不是元素的屬性，而是 `innerText`。

---

### `x-html`
**範例:** `<span x-html="foo"></span>`

**結構:** `<span x-html="[運算式]"`

`x-text` 類似 `x-bind` ，但更新的不是元素的屬性，而是 `innerHTML`。

> :warning: **絕對不要用在使用者輸入的內容，且請只用在可信任的內容上。** :warning:
>
> 從第三方來源動態呈現 HTML 可能會導致 [XSS (英文)](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) 漏洞。

---

### `x-ref`
**範例:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**結構:** `<div x-ref="[參照名稱]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`

`x-ref` 提供從元件上取得原始 DOM 元素的簡便方法。只要在元素上設定 `x-ref` 屬性，就可以在所有事件處理常式中通過 `$refs` 物件來取得該元素。

除了設定 ID 並在各個地方使用 `document.querySelector`，使用 `x-ref` 可作為替代方法。

> 備註：若有需要也可以在 `x-ref` 上繫結動態數值：`<span :x-ref="item.id"></span>`。

---

### `x-if`
**範例:** `<template x-if="true"><div>一些元素</div></template>`

**結構:** `<template x-if="[運算式]"><div>一些元素</div></template>`

但遇到一些 `x-show` 不合用的情況 (`x-show` 會在表達式為 false 時將元素設為 `display: none`)，則可以使用 `x-if` 來將元素完全從 DOM 中移除。

但要注意，`x-if` 必須要用在 `<template></template>` 標籤上，因為 Alpine 不使用虛擬 DOM。這種實作方式可保持 Alpine 簡陋，並使用真的 DOM 來處理動態 (Magic) 的部分。

> 備註：使用 `x-if` 時 `<template></template>` 標籤中必須只能有單一根元素。

> 備註：如果要在 `svg` 標籤中使用 `template`，則需要在 Alpine.js 初始化前執行一段 [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538)。

---

### `x-for`
**範例:**
```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

> 備註：`:key` 繫結為非必填。但「強烈」建議要加上。

`x-for` 適用於需要為陣列中每個項目建立新 DOM 節點的情況。用法看起來應該跟 Vue 中的 `v-for` 類似，但唯一不同的地方就是要放在 `template` 標籤上而不是一般的 DOM 元素。

若需要存取目前迭代的索引，則可使用下列語法：

```html
<template x-for="(item, index) in items" :key="index">
    <!-- 若有需要也可以在迭代中參照「index」。 -->
    <div x-text="index"></div>
</template>
```

> 備註：使用 `x-for` 時 `<template></template>` 標籤中必須只能有單一根元素。

> 備註：如果要在 `svg` 標籤中使用 `template`，則需要在 Alpine.js 初始化前執行一段 [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538)。

#### 巢狀嵌套 `x-for`
可以嵌套多層 `x-for` 迴圈，但每個迴圈都 **必須** 放在一個元素內，如：

```html
<template x-for="item in items">
    <div>
        <template x-for="subItem in item.subItems">
            <div x-text="subItem"></div>
        </template>
    </div>
</template>
```

---

### `x-transition`
**範例:**
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

> 上述範例使用了 [Tailwind CSS](https://tailwindcss.com) 的 Class

Alpine 中提供了 6 種不同的變換指示詞，可用於在元素變換的「hidden 隱藏」與「shown 顯示」狀態間的各個階段套用 Class。這些指示詞可用在 `x-show` **與** `x-if` 上。

這些行為都與 VueJS 的 transition 指示詞很類似，但不同的地方則是使用了不同的名稱：

| 指示詞 | 說明 |
| --- | --- |
| `:enter` | 套用於整個 Enter 階段。 |
| `:enter-start` | 在元素插入前新增，並在元素插入的 1 幀後刪除。 |
| `:enter-end` | 在元素插入後 (與 `enter-start` 刪除同時) 1 幀時新增，變換或動畫結束時刪除。 |
| `:leave` | 套用於整個 Leave 階段。 |
| `:leave-start` | 在 Leave 變換觸發後立刻新增、並在 1 幀後刪除。 |
| `:leave-end` | 在 Leave 變換觸發後 (與 `leave-start` 刪除同時) 1 幀新增，並在變換或動畫結束時刪除。 |

---

### `x-spread`
**範例:**
```html
<div x-data="dropdown()">
    <button x-spread="trigger">開啟下拉選單</button>

    <span x-spread="dialogue">下拉選單內容</span>
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

`x-spread` 可用來將元素的 Alpine 繫結截取到可重複使用的元素中。

元素的索引鍵為指示詞 (可以是任何指示詞，包含修飾詞)，而元素值則為由 Alpine 取值的回呼函式。

> 備註：x-spread 唯一要注意的就是與 `x-for` 搭配使用的情況。當被「spread」的指示詞是 `x-for`，則回呼內回傳的應該要是運算式字串。如： `['x-for']() { return 'item in items' }`.

---

### `x-cloak`
**範例:** `<div x-data="{}" x-cloak></div>`

`x-cloak` 屬性會在 Alpine 初始化後從元素上移除。可以用來隱藏還未初始化的 DOM 元素。通常使用下列全域樣式：

```html
<style>
    [x-cloak] { display: none; }
</style>
```

### 魔法屬性

> 除了 `$el` 是例外，所有的魔法屬性 **在 `x-data` 中都無法使用**，因為元素還未初始化。

---

### `$el`
**範例:**
```html
<div x-data>
    <button @click="$el.innerHTML = 'foo'">這裡的內容會取代為「foo」</button>
</div>
```

`$el` 是可用來取得元件根 DOM 節點的魔法屬性。

### `$refs`
**範例:**
```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

`$refs` 是可用來取得元件內以 `x-ref` 標記的 DOM 元素之魔法屬性。適合用在要手動操作 DOM 元素的情況。

---

### `$event`
**範例:**
```html
<input x-on:input="alert($event.target.value)">
```

`$event` 是可在事件監聽器內取得瀏覽器原生「Event」物件的魔法屬性。

> 備註：$event 屬性只可在 DOM 運算式中使用。

若有需要在 JavaScript 函式中存取 $event，則可以直接將 $event 傳入：

`<button x-on:click="myFunction($event)"></button>`

---

### `$dispatch`
**範例:**
```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
    <!-- 點擊後會 console.log "bar" -->
</div>
```

**有關事件傳播 (Event Propagation)**

請注意，由於 [Event Bubbling (英語)](https://en.wikipedia.org/wiki/Event_bubbling)，當有需要截取從相同層級節點觸發的事件時，則需要加上 [`.window`](#x-on) 修飾詞：

**範例:**

```html
<div x-data>
    <span @custom-event="console.log($event.detail.foo)"></span>
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
<div>
```

> 上述範例無效，因為 `custom-event` 觸發的時候，會傳播到共同母級節點，即 `div`。

**分派至元件**

也可以通過剛才那個技巧來在元件間互相溝通：

**範例:**

```html
<div x-data @custom-event.window="console.log($event.detail)"></div>

<button x-data @click="$dispatch('custom-event', 'Hello World!')">
<!-- 點擊後會 console.log "Hello World!". -->
```

`$dispatch` 是建立 `CustomEvent` 並在內部使用 `.dispatchEvent()` 分派的捷徑方法。還有其他許多通過自定事件來在元件間傳遞資料的例子。請 [參考此處 (英文)](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) 以瞭解更多有關不同瀏覽器中的 `CustomEvent` 資訊。

可以注意到放在第二個參數的資料 `$dispatch('some-event', { some: 'data' })`，在新事件上可通過「detail」屬性來取得：`$event.detail.some`。將自定事件資料附加到 `.detail` 屬性是在瀏覽器中 `CustomEvent` 的標準實踐。更多資訊請 [參考此處 (英文)](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)。

也可以使用 `$dispatch()` 來觸發 `x-model` 繫結的資料更新。如：

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')">
        <!-- 點擊按鈕後，`x-model` 會抓到 Bubbing 的「input」事件，並將 foo 更新為「baz」 -->
    </span>
</div>
```

> 備註：$dispatch 屬性只可在 DOM 運算式中使用。

若有需要在 JavaScript 函式中存取 $dispatch，則可以直接將 $dispatch 傳入：

`<button x-on:click="myFunction($dispatch)"></button>`

---

### `$nextTick`
**範例:**
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

通過 `$nextTick` 魔法屬性則可以在 Alpine 做出 DOM 更新 **之後** 才執行指定的運算式。適用於需要在資料反應到 DOM 上後才要與 DOM 互動的情況。

---

### `$watch`
**範例:**
```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">開啟／關閉</button>
</div>
```

可通過 `$watch` 魔法方法來「監聽 (Watch)」元件屬性。在上述例子中，當按鈕點擊後 `open` 會該表，接著會指定給定的回呼並以新的值來執行 `console.log`。

## 安全性 Security
若你發現安全性漏洞，請傳送電子郵件至 [calebporzio@gmail.com]()。

Alpine 仰賴與使用 `Function` 物件來自定實作以對指示詞取值。雖然比 `eval()` 來的安全，但這個做法依然在一些環境下被禁止，如 Google Chrome App 使用了限制性的 CSP (Content Security Policy，內容安全性原則)。

若在需要處理機敏資料的網站上使用 Alpine，且需要設定 [CSP (英語)](https://csp.withgoogle.com/docs/strict-csp.html)，則必須在 CSP 設定中加上 `unsafe-eval`。設定正確且堅固的原則有助於保護使用者在處理個人資料或財務資料上的安全。

由於原則設定會套用至頁面中的所有腳本，所以也應注意要小心審閱網站中引入的其他外部函式庫，以確保能信任這些函式庫，並避免這些函式庫引發 XSS 漏洞或使用 `eval()` 函式來調整 DOM 或在頁面中注入惡意程式碼。

## 授權條款 License

Copyright © 2019-2020 Caleb Porzio and contributors

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
透過 MIT 授權條款授權，詳情請參閱 [LICENSE.md](LICENSE.md)。
