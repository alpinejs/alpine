# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
![npm total download](https://img.shields.io/npm/dt/alpinejs)

Alpine.js は、Vue や React などの大きなフレームワークのリアクティブで宣言的な性質をはるかに低いコストで提供します。

DOM を保持し、適切な動作を施すことができます。

[Tailwind](https://tailwindcss.com/) の JavaScript 版のようなものです。

> 注意: このツールのシンタックスは、ほぼ完全に [Vue](https://vuejs.org/)（それと、[Angular](https://angularjs.org/) による拡張）から借用しています。ウェブからの賜り物に感謝しています。

## Install

**CDNより:** `<head>` セクションの最後に次のスクリプトを追加します。
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v1.10.1/dist/alpine.js" defer></script>
```

それだけです。初期は自身で行われます。

**NPMより:** NPM からパッケージをインストールします。
```js
npm i alpinejs
```

各自スクリプトでインクルードします。
```js
import 'alpinejs'
```

IE11 では、ポリフィルを提供する必要があります。次のスクリプトを上記の Alpine スクリプトの前にロードしてください。
```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=MutationObserver%2CArray.from%2CArray.prototype.forEach%2CMap%2CSet%2CArray.prototype.includes%2CString.prototype.includes%2CPromise%2CNodeList.prototype.forEach%2CObject.values%2CReflect%2CReflect.set"></script>

<script src="https://cdn.jsdelivr.net/npm/proxy-polyfill@0.3.0/proxy.min.js"></script>
```

## 使う

*ドロップダウン/モーダル*
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

*タブ*
```html
<div x-data="{ tab: 'foo' }">
    <button :class="{ 'active': tab === 'foo' }" @click="tab = 'foo'">Foo</button>
    <button :class="{ 'active': tab === 'bar' }" @click="tab = 'bar'">Bar</button>

    <div x-show="tab === 'foo'">Tab Foo</div>
    <div x-show="tab === 'bar'">Tab Bar</div>
</div>
```

自明ではないことにも使用できます:
*ホバー時にドロップダウンの HTML コンテンツをプリフェッチする*
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

## Learn

次の13のディレクティブを使用できます。

| ディレクティブ
| --- |
| [`x-data`](#x-data) |
| [`x-init`](#x-init) |
| [`x-show`](#x-show) |
| [`x-bind`](#x-bind) |
| [`x-on`](#x-on) |
| [`x-model`](#x-model) |
| [`x-text`](#x-text) |
| [`x-html`](#x-html) |
| [`x-ref`](#x-ref) |
| [`x-if`](#x-if) |
| [`x-for`](#x-for) |
| [`x-transition`](#x-transition) |
| [`x-cloak`](#x-cloak) |

それと5つのマジックプロパティ：

| マジックプロパティ
| --- |
| [`$el`](#el) |
| [`$refs`](#refs) |
| [`$event`](#event) |
| [`$dispatch`](#dispatch) |
| [`$nextTick`](#nexttick) |


### ディレクティブ

---

### `x-data`

**例:** `<div x-data="{ foo: 'bar' }">...</div>`

**構造:** `<div x-data="[JSON data object]">...</div>`

`x-data` は新しいコンポーネントスコープを宣言します。フレームワークに、データオブジェクトを使用して新しいコンポーネントを初期化するよう指示します。

Vue コンポーネントの `data` プロパティのように考えてください。

**コンポーネントロジックの抽出**

データ（と動作）を再利用可能な関数に抽出できます:

```html
<div x-data="dropdown()">
    <button x-on:click="open()">オープン</button>

    <div x-show="isOpen()" x-on:click.away="close()">
        // ドロップダウン
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

オブジェクトの構造化を使用して、複数のデータオブジェクトを混在も出来ます:

```html
<div x-data="{...dropdown(), ...tabs()}">
```

---

### `x-init`
**例:** `<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`

**構造:** `<div x-data="..." x-init="[式]"></div>`

`x-init` はコンポーネントが初期化されると式を実行します。

Alpine が DOM（VueJS の `mounted()` フックのようなもの）に最初の更新を行った後にコードを実行したい場合、`x-init` からコールバックを返すことができ、その後実行されます：

`x-init="return () => { // ここで初期化後の DOM ステートにアクセスできます // }"`

---

### `x-show`
**例:** `<div x-show="open"></div>`

**構造:** `<div x-show="[式]]"></div>`

`x-show` は、式が `true` または `false` のどちらかの結果によって、要素の `display: none;` スタイルを切り替えます。

---

### `x-bind`

> 注意: 短い「:」シンタックスを使えます: `:type="..."`

**例:** `<input x-bind:type="inputType">`

**構造:** `<input x-bind:[属性]="[式]">`

`x-bind` は、属性の値を JavaScript 式の結果を設定します。この式は、コンポーネントのデータオブジェクトのすべてのキーにアクセスでき、データが更新されるたびに反映されます。

> 注意: 属性バインディングは、依存関係が更新されたときにのみ更新されます。このフレームワークは、データの変化を観察し、どのバインディングがそれらを検出するのか最適化されています。

**`x-bind` for class attributes**

`x-bind` は、`class` 属性にバインドするときの動作が少し異なります。

クラスの場合、キーがクラス名であり、値がそれらのクラス名が適用されるかどうかを決定するブール式であるオブジェクトを渡します。

例:
`<div x-bind:class="{ 'hidden': foo }"></div>`

この例では、「hidden」クラスは、`foo` データ属性値が `true` の場合にのみ適用されます。

**ブール属性の `x-bind`**

`x-bind` は、値属性と同じ方法でブール値属性をサポートします。条件として変数を使用するか、`true` または `false` に解決される JavaScript 式を使用します。

例:
`<button x-bind:disabled="myVar">Click me</button>`

`myVar` が true または false の場合に `disabled` 属性を追加または削除します。

`readonly`, `required` など、最も一般的なブール属性がサポートされています。

---

### `x-on`

> 注意： より短い「@」シンタックスを自由に使用できます: `@click="..."`

**例:** `<button x-on:click="foo = 'bar'"></button>`

**構造:** `<button x-on:[event]="[expression]"></button>`

`x-on` は、イベントリスナを宣言された要素にアタッチします。そのイベントが発行されると、その値として設定された JavaScript 式が実行されます。

式でデータが変更されると、このデータに「バインドされた」他の要素属性が更新されます。

**`keydown` 修飾子**

**例:** `<input type="text" x-on:keydown.escape="open = false">`

`x-on：keydown` ディレクティブに追加された keydown 修飾子を使用し、待ち受けする特定のキーを指定できます。修飾子は `Event.key` 値のケバブケースであることに注意してください。

例: `enter`, `escape`, `arrow-up`, `arrow-down`

> 注意: 次のようなシステム修飾子キーの組み合わせを待ち受けもできます: `x-on：keydown.cmd.enter="foo"`

**`.away` 修飾子**

**例:** `<div x-on:click.away="showModal = false"></div>`

`.away` 修飾子を付与すると、イベントがそれ自体またはその子以外のソースから発生した場合にのみイベントハンドラは実行されます。

ユーザがクリックしたときにドロップダウンやモーダルを非表示にするのに便利です。

**`.prevent` 修飾子**
**例:** `<input type="checkbox" x-on:click.prevent>`

イベントリスナに `.prevent` を追加すると、トリガされたイベントで `preventDefault` が呼び出されます。上記の例では、ユーザがクリックしたときにチェックボックスが実際にチェックされないことを意味します。

**`.stop` 修飾子**
**例:** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

イベントリスナに `.stop` を追加すると、トリガされたイベントで `stopPropagation` が呼び出されます。上記の例では、ボタンから外側の `<div>` に「click」イベントが浮上しないことを意味します。言い換えると、ユーザがボタンをクリックしても、`foo` は `'bar'` に設定されません。

**`.window` 修飾子**
**例:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

イベントリスナに `.window` を付与すると、それが宣言されている DOM ノードではなく、グローバル window オブジェクトにリスナがインストールされます。これは、resize イベントなど window で何かが変更されたときにコンポーネントの状態を変更する場合に役立ちます。この例では、ウィンドウの幅が768ピクセルを超えた場合、モーダル/ドロップダウンを閉じます。それ以外の場合は同じ状態を維持します。

> 注意: `.document` 修飾子を使用して、リスナを `window` の代わりに `document` にアタッチすることもできます。

**`.once` 修飾子**
**例:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

イベントリスナに `.once` 修飾子を付与すると、リスナが1回だけ処理されることが保証されます。HTML パーシャルの取得など、1度だけ実行したい場合に便利です。

---

### `x-model`
**例:** `<input type="text" x-model="foo">`

**構造:** `<input type="text" x-model="[data item]">`

`x-model` は要素に「双方向データバインディング」を追加します。つまり、入力要素の値はコンポーネントの項目データの値と同期します。

> 注意: `x-model` は、テキストインプット、チェックボックス、ラジオボタン、テキストエリア、セレクト、およびマルチセレクトの変更を検出するのに最適です。これらのシナリオで [Vue がどのように](https://vuejs.org/v2/guide/forms.html)動作するのか確認してください。

---

### `x-text`
**例:** `<span x-text="foo"></span>`

**構造:** `<span x-text="[expression]"`

`x-text` は `x-bind` と同様に機能しますが、属性値を更新する代わりに要素の `innerText` を更新します。

---

### `x-html`
**例:** `<span x-html="foo"></span>`

**構造:** `<span x-html="[expression]"`

`x-html` は `x-bind` と同様に機能しますが、属性の値を更新する代わりに要素の `innerHTML` を更新します。

---

### `x-ref`
**例:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**構造:** `<div x-ref="[ref name]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`

`x-ref` は、コンポーネントから生 DOM 要素を取得する便利な方法を提供します。要素に `x-ref` 属性を設定することで、すべてのイベントハンドラで `$refs` というオブジェクト内から利用できるようになります。

これは、ID を設定し、あらゆる場所で `document.querySelector` を使用する代替手段に役立ちます。

---

### `x-if`
**例:** `<template x-if="true"><div>Some Element</div></template>`

**構造:** `<template x-if="[expression]"><div>Some Element</div></template>`

`x-show` では不十分な場合（`x-show` が false の場合、要素を `display： none` に設定します）、`x-if` を使用して DOM から要素を完全に削除できます。

Alpine は仮想 DOM を使用しないため、`<template></template>` タグで `x-if` を使用することが重要です。この実装により、Alpine は堅牢性を保ち、実際の DOM を使用してその仕様を働かせることができます。

> 注意: `x-if` には、`<template></template>` タグ内に単一要素のルートが必要です。

---

### `x-for`
**例:**
```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

`x-for` は、配列の各アイテム毎に新しい DOM ノードを作成する場合に使用します。これは、Vue の `v-for` に似ています。ただし、通常の DOM 要素ではなく、`template` タグに存在する必要があります。

> 注意: `：key` バインディングはオプションですが、強く推奨しています。

---

### `x-transition`
**例:**
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

Alpine は、「非表示」と「表示」の遷移間のさまざまな段階にクラスを要素に適用するための6つの異なるトランジションディレクティブを提供します。これらのディレクティブは、`x-show` と `x-if` の両方で機能します。

これらは、VueJs のトランジションディレクティブとまったく同じように動作しますが、より理にかなった異なる名前を持っています。

| ディレクティブ | 説明 |
| --- | --- |
| `:enter` | エンターフェーズ全体に適用されます。 |
| `:enter-start` | 要素が挿入される前に追加され、要素が挿入の1フレーム後に削除されます。 |
| `:enter-end` | 要素が挿入後（`enter-start` が削除されると同時）の1フレームに追加され、トランジション/アニメーションが終了すると削除されます。
| `:leave` | リーブフェーズ全体に適用されます。 |
| `:leave-start` | リーブ遷移がトリガされるとすぐに追加され、1フレーム後に削除されます。 |
| `:leave-end` | リーブ遷移がトリガされた後（同時に `leave-start` が削除される）の1フレームに追加され、トランジション/アニメーションが終了すると削除されます。

---

### `x-cloak`
**例:** `<div x-data="{}" x-cloak></div>`

Alpine の初期化時に、要素から `x-cloak` 属性が削除されます。これは、事前に初期化された DOM を隠すのに役立ちます。これが機能するためには、通常、次のグローバルスタイルを追加します。:

```html
<style>
    [x-cloak] { display: none; }
</style>
```

### マジックプロパティ

---

### `$el`
**例:**
```html
<div x-data>
    <button @click="$el.innerHTML = 'foo'">"foo"に置換します</button>
</div>
```

`$el` は、ルートコンポーネントの DOM ノードを取得するために使用できるマジックプロパティです。

### `$refs`
**例:**
```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

`$refs` は、コンポーネント内で `x-ref` でマークされた DOM 要素を取得するために使用できるマジックプロパティです。これは、DOM 要素を手動で操作する必要がある場合に便利です。

---

### `$event`
**例:**
```html
<input x-on:input="alert($event.target.value)">
```

`$event` は、ネイティブブラウザの「Event」オブジェクトを取得するためにイベントリスナ内で使用できるマジックプロパティです。

---

### `$dispatch`
**例:**
```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
    <!-- クリックされると、 console.log が「bar」を出力します -->
</div>
```

`$dispatch` は、`CustomEvent` を作成し、内部で `.dispatchEvent()` を使用してディスパッチするためのショートカットです。カスタムイベントを使用してコンポーネント間およびコンポーネント間でデータを渡すには、多くの適切なユースケースがあります。基礎となるブラウザの `CustomEvent` システムの詳細については、[こちらをご覧ください。](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events)

`$dispatch('some-event', { some: 'data' })` の2番目のパラメータとして渡されるデータは、新しいイベントの「detail」プロパティ: `$event.detail.some` です。カスタムイベントデータを `.detail` プロパティにアタッチすることは、ブラウザの `CustomEvent` の標準的な方法です。詳細は[こちらをご覧ください。](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)

また、`$dispatch()` を使用して、`x-model` バインディングのデータ更新をトリガすることもできます。 例えば:

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')">
        <!-- ボタンがクリックされると、`x-model` は浮上する「input」イベントをキャッチし、foo を「baz」に更新します。 -->
    </span>
</div>
```

---

### `$nextTick`
**例:**
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

`$nextTick` は、Alpine がリアクティブな DOM 更新を行った後、指定された式のみを実行できるマジックプロパティです。これは、データ更新が反映された後に DOM ステートとやり取りしたい場合に便利です。

## ライセンス

Copyright © 2019-2020 Caleb Porzio and contributors

MIT ライセンスの下でライセンスされています。詳細については、[LICENSE.md](LICENSE.md) を参照してください。
