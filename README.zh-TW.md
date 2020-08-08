# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true)](https://alpinejs.codewithhugo.com/chat/)

Alpine.js 提供了像是 Vue 或 React 這樣的大型框架的回應式或宣告式的特性，但使用成本卻低得多。

你依然可以保留你的 DOM ，並且在你認為合適的時候添加行為。

你可以把 Alpine.js 想像成 JavaScript 的 [Tailwind](https://tailwindcss.com/) 。

> 備註：這個工具的語法幾乎借鑑了 [Vue](https://vuejs.org/) （以及一些 [Angular](https://angularjs.org/) 的延伸）。我永遠感謝他們為 Web 帶來的大禮。

## 部屬

**使用 CDN 來源：** 在你的 `<head>` 標籤的末端添加以下腳本。
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
```

僅僅如此，它會自動初始化。

如果是正式環境，建議在連結中加入一個特定的版本號碼，避免新版本的升級題你的程式帶來執行上的意外的錯誤。
舉個例子，你想固定在 `2.3.5` 這個版本：
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.3.5/dist/alpine.min.js" defer></script>
```

**使用 NPM 來源：** 使用 NPM 程式包安裝
```js
npm i alpinejs
```

在你的腳本中引入它。
```js
import 'alpinejs'
```

**對於 IE11 的支援** 請使用以下腳本替代。
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
```

上述的寫法是 [module/nomodule 模式](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/) ，它會讓現代化網頁瀏覽器自動載入它所需的程式包。而 IE11 版本的程式包將會在 IE11 上或者是其他的傳統網頁瀏覽器上被自動載入。

## 使用

*下拉式選單／互動式視窗*
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

*頁籤*
```html
<div x-data="{ tab: 'foo' }">
    <button :class="{ 'active': tab === 'foo' }" @click="tab = 'foo'">Foo</button>
    <button :class="{ 'active': tab === 'bar' }" @click="tab = 'bar'">Bar</button>

    <div x-show="tab === 'foo'">Tab Foo</div>
    <div x-show="tab === 'bar'">Tab Bar</div>
</div>
```

你甚至可以用它來達成一些並不顯而易見事情：
*在懸停時預取下拉式選單的 HTML 內容*
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

## 教學

共有 13 個指令可供你使用：

| 指令 | 功能描述 |
| --- | --- |
| [`x-data`](#x-data) | 宣告一個新的組件範圍。 |
| [`x-init`](#x-init) | 當一個組件被初始化時，運作一個運算式。 |
| [`x-show`](#x-show) | 根據運算式的不同（true 或 false）在元素上切換 `display: none;` 。 |
| [`x-bind`](#x-bind) | 將屬性的數值設定為 JS 運算式的結果。 |
| [`x-on`](#x-on) | 替元素附加一個事件監聽器，在觸發時執行 JS 運算式。 |
| [`x-model`](#x-model) | 替元素附加「雙向資料繫結」，使輸入元素與組件資料保持同步。 |
| [`x-text`](#x-text) | 它的工作原理類似於 `x-bind` ，但會更新元素的 `innerText` 。 |
| [`x-html`](#x-html) | 它的工作原理類似於 `x-bind` ，但會更新元素的 `innerHTML` 。 |
| [`x-ref`](#x-ref) | 便利地從組件中取得原始的 DOM 元素。 |
| [`x-if`](#x-if) | 從 DOM 中完全刪除一個元素，需要在 `<template>` 標籤上使用。 |
| [`x-for`](#x-for) | 替陣列中的每個項次創建新的 DOM 節點，需要在 `<template>` 標籤中使用。|
| [`x-transition`](#x-transition) | 將類別應用於元素過渡的各個階段的指令。 |
| [`x-cloak`](#x-cloak) | 這個屬性在 Alpine 初始化時將被移除，用於隱藏預初始化的 DOM 。 |

以及 6 種魔術屬性：

| 魔術屬性 | 功能描述 |
| --- | --- |
| [`$el`](#el) | 檢索根組件的 DOM 節點。 |
| [`$refs`](#refs) | 檢索組件內被標有 `x-ref` 的 DOM 元素。 |
| [`$event`](#event) | 檢索事件監聽器中的原生瀏覽器「Event」物件。 |
| [`$dispatch`](#dispatch) | 創建一個 `CustomEvent` 並在內部使用 `.dispatchEvent()` 進行調度。 |
| [`$nextTick`](#nexttick) | 在 Alpine 進行回應式 DOM 更新後執行給定的運算式。 |
| [`$watch`](#watch) | 當你「監聽」的組件屬性被改變時，會啟動一個你所提供的回呼。 |

## 贊助者

<img width="33%" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" alt="Tailwind CSS">

**想要讓你的 LOGO 置於這裡嗎？ [在 Twitter 上傳送私人訊息](https://twitter.com/calebporzio)**

## VIP 貢獻者

<table>
  <tr>
    <td align="center"><a href="http://calebporzio.com"><img src="https://avatars2.githubusercontent.com/u/3670578?v=4" width="100px;" alt="Caleb Porzio"/><br /><sub><b>Caleb Porzio</b></sub></a><br /><sub>(Creator)</sub></td>
    <td align="center"><a href="https://github.com/HugoDF"><img src="https://avatars2.githubusercontent.com/u/6459679?v=4" width="100px;" alt="Hugo"/><br /><sub><b>Hugo</b></sub></a></td>
    <td align="center"><a href="https://github.com/ryangjchandler"><img src="https://avatars2.githubusercontent.com/u/41837763?v=4" width="100px;" alt="Ryan Chandler"/><br /><sub><b>Ryan Chandler</b></sub></a></td>
    <td align="center"><a href="https://github.com/SimoTod"><img src="https://avatars2.githubusercontent.com/u/8427737?v=4" width="100px;" alt="Simone Todaro"/><br /><sub><b>Simone Todaro</b></sub></a></td>
  </tr>
</table>

### 指令

---

### `x-data`

**範例:** `<div x-data="{ foo: 'bar' }">...</div>`

**結構:** `<div x-data="[JSON data object]">...</div>`

`x-data` 宣告了一個新的組件作用域，它告訴框架得使用其作用域下的資料物件初始化一個新的組件。

想想看，是不是就和 Vue 組件的 `data` 屬性一樣。

**擷取組件邏輯**

你可以將資料（與行為）擷取到可重用的函數中：

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

> **對於 bundler 使用者來說**，得注意 Alpine.js 存取的函數是在全域範圍內的（`window`），你需要明確地將你的函數分配給　`window`，以便透過 `x-data` 來使用它們。例如：`window.dropdown = function () {}`（這是因為在 Webpack 、Rollup 與 Parcel 這些 module 中，你所定義的函數將是預設的 module 範圍，而不是 `window` ）。

你也可以使用物件解構來混合多個資料物件：

```html
<div x-data="{...dropdown(), ...tabs()}">
```

---

### `x-init`
**範例:** `<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`

**結構:** `<div x-data="..." x-init="[expression]"></div>`

`x-init` 會在組件初始化時運作一個運算式。

如果你希望在 Alpine 對 DOM 進行初始化更新之後，再運作程式碼（類似於 VueJS 中的 `mounted()` 鉤子），你可以從 `x-init` 中回傳一個回呼，然後再運作：

`x-init="() => { // 我們可以在這裡存取到 post-dom-initialization 後的狀態 // }"`

---

### `x-show`
**範例:** `<div x-show="open"></div>`

**結構:** `<div x-show="[expression]"></div>`

`x-show` 會在元素上切換顯示 `display: none;` 樣式，這取決於運算式為 `true` 或 `false` 。

**x-show.transition**

`x-show.transition` 是一個便利的 API ，在 CSS 轉場上你能愉快地使用`x-show` 。

```html
<div x-show.transition="open">
	這些內容的出現與消失都將經過轉場。
</div>
```

| 指令 | 功能描述 |
| --- | --- |
| `x-show.transition` | 同步淡出與縮放 (opacity, scale: 0.95, timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), duration-in: 150ms, duration-out: 75ms)
| `x-show.transition.in` | 只有「in」轉場。 |
| `x-show.transition.out` | 只有「out」轉場。 |
| `x-show.transition.opacity` | 只使用淡出。 |
| `x-show.transition.scale` | 只使用縮放。 |
| `x-show.transition.scale.75` | 自定 CSS 縮放`transform: scale(.75)` 。 |
| `x-show.transition.duration.200ms` | 將「in」轉場設定為 200毫秒。「out」將設定為 in 的一半（100 毫秒）。 |
| `x-show.transition.origin.top.right` |自訂 CSS 轉場起始點`transform-origin: top right`. |
| `x-show.transition.in.duration.200ms.out.duration.50ms` | 替「in」與「out」設定不同的持續時間。 |

> 備註：這些轉場的修飾器都是可以相互配合使用，這個範例是可行的（雖然很荒謬，呵呵）：`x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale.95`

> 備註：`x-show` 將等待任何子轉場完成，如果你想繞過這個行為，請添加 `.immediate` 修飾器：
 
```html
<div x-show.immediate="open">
    <div x-show.transition="open">
</div>
```
---

### `x-bind`

> 備註：你可以自由使用較短的「:」 語法：`:type="..."`

**範例:** `<input x-bind:type="inputType">`

**結構:** `<input x-bind:[attribute]="[expression]">`

`x-bind` 將一個屬性的數值設定為 JavaScript 運算式的結果。這個運算式可以存取組件的資料物件的所有鍵，並且每次更新資料時都會同步更新。

> 備註：屬性繫結只有在其依賴的關係被更新時才會更新，這個框架能從明地觀察到資料的變化，並檢測那些繫結能夠關係到它們。

**用於類別屬性的`x-bind`**

`x-bind` 與 `class` 屬性在繫結時的行為會有點不同。

對於類別而言，當你傳遞一個物件，這個物件的其鍵為類別名稱，值則是布林運算式來決定是否應該要應用這些類別名稱。

舉例來說：
`<div x-bind:class="{ 'hidden': foo }"></div>`

在這個範例中，只有當 `foo` 資料屬性的值為 `true` 時，hidden 類別才會被應用。

**用於布林屬性的 `x-bind`**

`x-bind` 支援與數值屬性相同的布林屬性，使用變數作為條件或任何可以解析為 `true` 或 `false` 的 JavaScript 運算式。

舉例來說:
```html
<!-- Given: -->
<button x-bind:disabled="myVar">Click me</button>

<!-- When myVar == true: -->
<button disabled="disabled">Click me</button>

<!-- When myVar == false: -->
<button>Click me</button>
```

這將在 `myVar` 為 true 或 false 時分別添加或刪除 `disabled` 屬性。

布林屬性將支援符合 [HTML 規範](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute) 的屬性，例如：`disabled`、 `readonly`、 `required`、 `checked`、 `hidden`、 `selected` 與 `open` 等。

---

### `x-on`

> 備註：你可以自由使用較短的「@」 語法：`@click="..."`

**範例:** `<button x-on:click="foo = 'bar'"></button>`

**結構:** `<button x-on:[event]="[expression]"></button>`

`x-on` 會將一個事件監聽器附加在它所宣告的元素上頭，當這個事件被觸發時，在其值所設定的 JavaScript 運算式將會被執行。

如果任何資料因為這個運算式而被修改，那麼與這個被修改的資料所「繫結」的元素屬性也會跟著更新。

**`keydown` 修飾器**
**範例:** `<input type="text" x-on:keydown.escape="open = false">`

你可以使用附加到 `x-on:keydown` 指令中的 keydown 修飾器，來指定要監聽的特定鍵值。請注意，這些修飾器的 `Event.key` 數值的命名方式是短橫線連接式。

例如: `enter`, `escape`, `arrow-up`, `arrow-down`

> 備註：你也可已經聽系統修飾器的鍵值組合，像是：`x-on:keydown.cmd.enter="foo"`

**`.away` 修飾器**
**範例:** `<div x-on:click.away="showModal = false"></div>`

當 `.away` 修飾器存在時，事件處理程序只有在事件的起源為非其自身或其子項時才會被執行。

當使用者點擊下拉式選單與互動式視窗時，這對於隱藏它們是非常有用的。

**`.prevent` 修飾器**
**範例:** `<input type="checkbox" x-on:click.prevent>`

在事件監聽器中加入 `.prevent` 後，將在觸發事件時呼叫 `preventDefault` 。上述的範例意味著，當使用者點擊核取方塊時，這個核取方塊並不會被選中。

**`.stop` 修飾器**
**範例:** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

在事件監聽器中加入 `.stop` 後，將在觸發事件時呼叫 `stopPropagation` 。上述的範例意味著，「點擊」事件不會從按鈕上升到外部的 `<div>` 。換句話說，當使用者點擊按鈕時，`foo` 並不會被設定為 `'bar'` 。

**`.self` 修飾器**
**範例:** `<div x-on:click.self="foo = 'bar'"><button></button></div>`

只有當 `$event.target` 是元素本身時，在事件監聽器中加入 `.self` 才會觸發處理程序。上述的範例意味著，按鈕的點擊事件將 **不會** 運作到外部 `<div>` 的處理程序。 

**`.window` 修飾器**
**範例:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

在事件監聽器中加入 `.window` 後，將會把監聽器加入到全域的 window 物件上，而不是被它所宣告的 DOM 節點上頭。這對於你想在視窗發生變化時修改組件狀態時會非常好用，比如：調整大小的事件。在這個範例中，當視窗寬度大於 768px 時，我們將關閉互動式窗／下拉式選單，否則保持相同的狀態。

>備註：你也可以使用 `.document` 修飾器，將監聽器加入到 `document` 中，而不是加入到 `window` 中。

**`.once` 修飾器**
**範例:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

在事件監聽器中加入 `.once` 修飾器後，將可以保證監聽器只被處理一次。這對於某些你只想執行一次的事件會非常有用處，比如獲取 HTML partials 之類的。

**`.debounce` 修飾器**
**範例:** `<input x-on:input.debounce="fetchSomething()">`

`debounce` 修飾器允許你替事件處理程序加上「防彈跳」機制，換而言之，事件處理程序將不會立即被運作，它會自事件觸發後等待一段時間才會開始運作。當處理程序準備好被呼叫時，最後一個處理程序的呼叫將被執行。

預設的 debounce 等待時間是 250 毫秒。

如果你想自訂這個時間，可以接著指定一個你所想要的時間，比如這樣：

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

---

### `x-model`
**範例:** `<input type="text" x-model="foo">`

**結構:** `<input type="text" x-model="[data item]">`

`x-model` 可以替元素增加「雙向資料繫結」。換而言之，輸入元素的數值將會與組件的資料項目的數值保持同步。

> 備註：`x-model` 將會聰明地察覺到 inputs 、 checkboxes 、 radio buttons 、 textareas 、 selects 以及 multiple selects 的變化。在這些情形下，`x-model` 的行為將會跟
 [Vue](https://cn.vuejs.org/v2/guide/forms.html) 有著一樣的表現。
 
**`.debounce` 修飾器**
**範例:** `<input x-model.debounce="search">`

`debounce` 修飾器允許你替事件處理程序加上「防彈跳」機制，換而言之，事件處理程序將不會立即被運作，它會自事件觸發後等待一段時間才會開始運作。當處理程序準備好被呼叫時，最後一個處理程序的呼叫將被執行。

預設的 debounce 等待時間是 250 毫秒。

如果你想自訂這個時間，可以接著指定一個你所想要的時間，比如這樣：

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

---

### `x-text`
**範例:** `<span x-text="foo"></span>`

**結構:** `<span x-text="[expression]"`

`x-text` 的工作原理與 `x-bind` 類似，只是它不會更新元素的值，而是更新元素的 `innerText` 。

---

### `x-html`
**範例:** `<span x-html="foo"></span>`

**結構:** `<span x-html="[expression]"`

`x-text` 的工作原理與 `x-bind` 類似，只是它不會更新元素的值，而是更新元素的 `innerHTML` 。

> :warning: **你只能在可以信賴的來源使用這個特性，絕對不能將使用者輸入的內容用於其中** :warning:
>
> 使用第三方內容動態生成的 HTML 很容易導致 [XSS](https://developer.mozilla.org/zh-TW/docs/Glossary/Cross-site_scripting) 漏洞的發生。

---

### `x-ref`
**範例:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**結構:** `<div x-ref="[ref name]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`

`x-ref` 提供了一個便利的方法讓你從你的組件中獲取原始的 DOM 元素。透過在一個元素上設定一個 `x-ref` 屬性，你就可以在一個叫做 `$refs` 的物件中呼叫所有的事件處理程序。

這是個很有用的替代方案，可以取代設定 id 以及到處使用 `document.querySelector` 來選取 id 。

> 備註：如果你需要的話，也可以為 x-ref 綁定動態數值：`<span :x-ref="item.id"></span>` 。

---

### `x-if`
**範例:** `<template x-if="true"><div>Some Element</div></template>`

**結構:** `<template x-if="[expression]"><div>Some Element</div></template>`

對於 `x-show` 還不足夠的情形（如果元素為 false 的話，`x-show` 將元素設定為 `display: none`），`x-if` 可以用來從 DOM 中完全刪除元素。

重要的是，`x-if` 必須使用在 `<template></template>` 標籤上，因為 Alpine 不使用虛擬 DOM 。因為這種實作方式可以使 Alpine 保持穩定，並使用真正的 DOM 來發揮 Alpine 的奇效。

> 備註：`x-if` 必須使用在 `<template></template>` 標籤內擁有根元素的情形下。

---

### `x-for`
**範例:**
```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

> 備註：`:key` 的繫結是可選的，但強烈建議你使用。

`x-for` 適用於你想為陣列中每一個成員創建新的 DOM 節點的情形。這應該與 Vue 的 `v-for` 類似，但有一個例外，就是它需要存在於 `template` 標籤上而不是普通的 DOM 元素。

如果你想存取當下的索引，請使用下列語法：


```html
<template x-for="(item, index) in items" :key="index">
    <!-- 如果你需要的話，也可以在疊代的內部使用「index」-->
    <div x-text="index"></div>
</template>
```

> 備註：`x-for` 必須使用在 `<template></template>` 標籤內擁有根元素的情形下。


#### 巢套 `x-for`

你也可以巢狀地使用 `x-for` 迴圈，但你必須將每個迴圈都包裹在同一個元素中，比如說：


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

> 上述範例使用了 [Tailwind CSS](https://tailwindcss.com) 中的類別。

Alpine 提供了 6 種不同的轉場指令，用於將類別應用到元素在「隱藏」與「顯示」狀態之間的不同階段。這些指令可以與 `x-show` 和 `x-if` 同時使用。

這些指令的行為與 VueJs 的轉場指令完全相同，只是它們的名字不同，更加地合理：

| 指令 | 功能描述 |
| --- | --- |
| `:enter` | 在整個 entering 階段時應用。 |
| `:enter-start` | 在元素插入前添加，在元素插入後刪除一幀。 |
| `:enter-end` | 元素在插入後添加一幀（同時刪除 `enter-start` ），在轉場／動畫結束時刪除。|
| `:leave` | 在整個 leaving 階段時應用。|
| `:leave-start` | 觸發 leaving 轉場時立即添加，一幀後刪除。 |
| `:leave-end` | 觸發 leaving 轉場後添加一幀（同時刪除 `leave-start` ），在轉場／動畫結束時刪除。 |

---

### `x-cloak`
**Example:** `<div x-data="{}" x-cloak></div>`

`x-cloak` attributes are removed from elements when Alpine initializes. This is useful for hiding pre-initialized DOM. It's typical to add the following global style for this to work:

```html
<style>
    [x-cloak] { display: none; }
</style>
```

### 魔術屬性

---

### `$el`
**範例:**
```html
<div x-data>
    <button @click="$el.innerHTML = 'foo'">Replace me with "foo"</button>
</div>
```

`$el` 是一個魔術屬性，可以用來檢索根組件的 DOM 節點。

### `$refs`
**範例:**
```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

`$refs` 是一個很有用的魔術屬性，用於檢索組件內有標注 `x-ref` 的 DOM 元素。

---

### `$event`
**範例:**
```html
<input x-on:input="alert($event.target.value)">
```

`$event` 是一個魔術屬性，可以在事件監聽器中用它來檢索原生瀏覽器的 Event 物件。

---

### `$dispatch`
**範例:**
```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
    <!-- 當點擊後, bar 將會出現在 console.log 上-->
</div>
```

`$dispatch` 是一個創建 `CustomEvent` 並且在其內部使用 `.dispatchEvent()` 的便利方法。使用自訂事件在組件之間傳遞資料有很多好的使用案例，[閱讀這裡](https://developer.mozilla.org/zh-TW/docs/Web/Guide/Events/Creating_and_triggering_events) 了解更多關於瀏覽器底層 `CustomEvent` 系統的資訊。

你可能發現了，任何作為第二個參數傳入到 `$dispatch('some-event', { some: 'data' })` 的資料，都會透過新的事件「detail」屬性來提供：`$event.detail.some` 。將自訂的事件資料附加到 `.detail` 屬性是瀏覽器中 `CustomEvent` 的標準做法。[閱讀這裡](https://developer.mozilla.org/zh-TW/docs/Web/API/CustomEvent/detail) 了解更多資訊。


你也可以使用 `$dispatch()` 來觸發 `x-model` 所繫結的資料更新，比如說：

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')">
        <!-- 點擊按鈕後，`x-model` 將捕捉到冒出的「輸入」事件，並將 foo 更新為 「baz」 -->
    </span>
</div>
```

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

`$nextTick` 是一個魔術屬性，它允許你只在 Alpine 進行回應式 DOM 更新後才執行給定的運算式。這對於你想在 DOM 狀態回應了你的任何資料更新後，再與之互動的情形下非常有用。

---

### `$watch`
**範例:**
```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```

你可以使用 `$watch` 魔術方法來「監視」一個組件的屬性。在上述的範例中，當按鈕被點擊和 `open` 被改變時，你所給予的回呼將會被觸發，並且 `console.log` 將會顯示新的數值。


## 安全性

如果你發現了安全性漏洞，請發送電子郵件至 [calebporzio@gmail.com]() 。

Alpine 依賴使用於 `Function` 物件的自訂實作來求值於其指令。儘管它比 `eval()` 安全得多，但在某些環境中，比如：Google Chrome 應用程式，使用了限制性的網頁內容安全政策（CSP），來禁止使用它。

如果你在處理機敏資料並在要求 [CSP](https://csp.withgoogle.com/docs/strict-csp.html) 的網站上使用 Alpine ，則需要在政策中加入`unsafe-eval` 。正確設定可靠的政策有助於保護使用者在使用個人或財產相關的資料時的安全性。

由於政策適用於網頁中的所有腳本，因此對網站中包含的其他外部程式庫必須要仔細地審查，以保證它們都是值得信賴的，並且它們不會因為使用 `eval()` 函數或控制 DOM 在頁面中注入惡意程式碼而造成跨網站指令碼的漏洞。
 
## V3 路線圖
* Move from `x-ref` to `ref` for Vue parity?
* Add `Alpine.directive()`
* Add `Alpine.component('foo', {...})` (With magic `__init()` method)
* Dispatch Alpine events for "loaded", "transition-start", etc... ([#299](https://github.com/alpinejs/alpine/pull/299)) ?
* Remove "object" (and array) syntax from `x-bind:class="{ 'foo': true }"` ([#236](https://github.com/alpinejs/alpine/pull/236) to add support for object syntax for the `style` attribute)
* Improve `x-for` mutation reactivity ([#165](https://github.com/alpinejs/alpine/pull/165))
* Add "deep watching" support in V3 ([#294](https://github.com/alpinejs/alpine/pull/294))
* Add `$el` shortcut
* Change `@click.away` to `@click.outside`?

## 授權條款

Copyright © 2019-2020 Caleb Porzio and contributors

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.

## 翻譯對照表

| 英文 | 此文件採用譯名 |
| --- | --- |
| animation | 動畫 |
| binding | 繫結 |
| callback | 回呼 |
| components | 組件 |
| declarative | 宣告式 |
| destructuring | 解構 |
| debounce | 防彈跳 |
| dropdown | 下拉式選單 |
| expression | 運算式 |
| handler | 處理程序 |
| insert | 插入 |
| kebab-case | 短橫線連接式 |
| listener | 監聽器 |
| modifier | 修飾器 |
| modals | 互動式視窗 |
| nesting | 巢套 |
| package | 軟體包 |
| reactive | 回應式 |
| tabs | 頁籤 |
| transition | 轉場 |
| two-way data binding | 雙向資料繫結 |
