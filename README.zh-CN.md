# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true)](https://alpinejs.codewithhugo.com/chat/)

Alpine.js 通过很低的成本提供了于 Vue 或 React 这类大型框架相近的响应式和声明式特性。

你可以继续操作 DOM，并在需要的时候使用 Alpine.js。

可以理解为 JavaScript 版本的 [Tailwind](https://tailwindcss.com/)。

> 备注：Alpine.js 的语法几乎完全借用自 [Vue](https://vuejs.org/) （并用 [Angular](https://angularjs.org/) 的语法做了些扩展）。在此由衷感谢他们对 Web 世界的贡献。

## 安装 Install

**使用 CDN：** 把以下脚本加入到你的 `<head>` 尾部.
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
```

就是这样，Alpine.js 会自行初始化。

生产环境中，建议在链接中锁定特定版本号，以此避免新版本中的变更造成问题。
例如，锁定版本为 `2.8.2` (最新版本):
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.2/dist/alpine.min.js" defer></script>
```

**使用 npm：** 从 npm 安装依赖包。
```js
npm i alpinejs
```

并在你的脚本中引入它。
```js
import 'alpinejs'
```

**需要 IE11 支持的场景** 改用这段脚本。
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
```

这一写法使用了 [module/nomodule 模式（英文）](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/) ，这样的写法可以让现代浏览器自动加载模块版本依赖，而在 IE11 或其他早期浏览器中自动加载专属兼容版本。

## 使用 Use

*下拉菜单（Dropdown）/模态弹窗（Modal）*
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

*标签页 Tabs*
```html
<div x-data="{ tab: 'foo' }">
    <button :class="{ 'active': tab === 'foo' }" @click="tab = 'foo'">Foo</button>
    <button :class="{ 'active': tab === 'bar' }" @click="tab = 'bar'">Bar</button>

    <div x-show="tab === 'foo'">Tab Foo</div>
    <div x-show="tab === 'bar'">Tab Bar</div>
</div>
```

这样的写法也可以用在其他地方：
*鼠标悬停时从服务器预加载下拉菜单中的 HTML 内容。*
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

## 学习 Learn

当前共有 14 个指令可用，如下所示：

| 指令 | 描述 |
| --- | --- |
| [`x-data`](#x-data) | 定义一个新的组件作用域。 |
| [`x-init`](#x-init) | 组件初始化时运行其中的表达式。 |
| [`x-show`](#x-show) | 根据表达式结果（true 或 false）控制元素的 `display: none;`（译者注：控制模块显示/隐藏） |
| [`x-bind`](#x-bind) | 将当前属性的值设定为指令中表达式的结果。 |
| [`x-on`](#x-on) | 向元素上挂载事件监听器。当事件触发时执行其中的表达式。 |
| [`x-model`](#x-model) | 向当前元素新增「双向数据绑定」。保持输入元素与组件数据同步。 |
| [`x-text`](#x-text) | 和 `x-bind` 类似，但更新的是元素的 `innerText`。 |
| [`x-html`](#x-html) | 和 `x-bind` 类似，但更新的是元素的 `innerHTML`。 |
| [`x-ref`](#x-ref) | 在组件外获取原始 DOM 元素的简便方法。 |
| [`x-if`](#x-if) | 值为 false 时将从 DOM 中完全移除元素。需要在 `<template>` 标签中使用。 |
| [`x-for`](#x-for) | 为数组中的每一项创建一个新的 DOM 节点。需要在 `<template>` 标签中使用。 |
| [`x-transition`](#x-transition) | 用于在过渡（CSS Translation）的各个阶段中为元素添加 class 的指令。 |
| [`x-spread`](#x-spread) | 为了更好的复用，可以绑定一个带有 Alpine 指令（作为 key）的对象到元素上。 |
| [`x-cloak`](#x-cloak) | 这一属性会在 Alpine 初始化完成后被移除，可以用来隐藏未初始化的 DOM。 |

以及 6 个魔法属性：

| 魔法属性 | 描述 |
| --- | --- |
| [`$el`](#el) | 获取根元素的 DOM 节点。 |
| [`$refs`](#refs) | 获取组件中标记有 `x-ref` 的 DOM 元素。 |
| [`$event`](#event) | 在事件监听器中获取浏览器原生的「Event」对象。 |
| [`$dispatch`](#dispatch) | 创建一个「CustomEvent」并使用其内部的 `.dispatchEvent()` 方法进行分发。 |
| [`$nextTick`](#nexttick) | 在 Alpine 做出响应式 DOM 更新后，执行一个给出的表达式。 |
| [`$watch`](#watch) | 当监听的组件属性发生变化时，触发给定的回调函数。 |


## 赞助商 Sponsors

<img width="33%" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" alt="Tailwind CSS">

**想让你的 Logo 也出现在这? [到 Twitter 发送 DM](https://twitter.com/calebporzio)**

## 社区相关项目 Community Projects

* [AlpineJS 周报（英文）](https://alpinejs.codewithhugo.com/newsletter/)
* [Spruce （状态管理框架/英文）](https://github.com/ryangjchandler/spruce)
* [Turbolinks Adapter（英文）](https://github.com/SimoTod/alpine-turbolinks-adapter)
* [Alpine Magic Helpers（英文）](https://github.com/KevinBatdorf/alpine-magic-helpers)
* [Awesome Alpine（英文）](https://github.com/ryangjchandler/awesome-alpine)

### 指令 Directives

---

### `x-data`

**例如：** `<div x-data="{ foo: 'bar' }">...</div>`

**结构：** `<div x-data="[可迭代对象]">...</div>`

`x-data` 将定义一个新的组件作用域。它将通知框架初始化带有传入数据的一个新组件。

类似 Vue 组件中的 data 属性。

**抽离组件逻辑**

你可以把数据（以及行为）通过一个可复用的函数抽离出来：

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

> **各位 Bundler 使用者**，注意 Alpine.js 操作的函数都在全局作用域（`window`），你需要把 `x-data` 使用的函数声明到 `window` 上，例如 `window.dropdown = function () {}` (因为在 Webpack, Rollup, Parcel 等工具中，`function` 默认会被挂载模块作用域，而非 `window`).

你也可以通过对象解构语法，把多个数据对象混合起来：

```html
<div x-data="{...dropdown(), ...tabs()}">
```

---

### `x-init`
**例如：** `<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`

**结构：** `<div x-data="..." x-init="[表达式]"></div>`

`x-init` 将在组件初始化时运行给定的表达式。

如果你希望代码在 Alpine 对 DOM 进行初始化更新后再调用（类似 VueJS 中的 `mounted()` 钩子），你可以传入一个回调函数，它将在 DOM 操作完成后被调用，例如：

`x-init="() => { // we have access to the post-dom-initialization state here // }"`

---

### `x-show`
**例如:** `<div x-show="open"></div>`

**结构:** `<div x-show="[表达式]"></div>`

`x-show` 将根据表达式结果（true 或 false）控制元素的 `display: none;`（译者注：控制模块显示/隐藏）

**x-show.transition**

`x-show.transition` 是一个可以让你在使用 `x-show` 操作 CSS 过渡（Transition）时更爽的简便 API。

```html
<div x-show.transition="open">
    这段内容会在过渡中滑入/滑出。
</div>
```

| 指令 | 描述 |
| --- | --- |
| `x-show.transition` | 同时滑入/滑出并缩放（默认值：opacity, scale: 0.95, timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), duration-in: 150ms, duration-out: 75ms）
| `x-show.transition.in` | 仅滑入 |
| `x-show.transition.out` | 仅滑出 |
| `x-show.transition.opacity` | 仅使用淡入淡出 |
| `x-show.transition.scale` | 仅使用缩放 |
| `x-show.transition.scale.75` | 自定义 CSS 缩放转换为 `transform: scale(.75)`. |
| `x-show.transition.duration.200ms` | 设定 "in" 的的过渡时间为 200ms。出动作（"out"）将是它的一半 (100ms). |
| `x-show.transition.origin.top.right` | 自定义 CSS 转换起始位置为 `transform-origin: top right`. |
| `x-show.transition.in.duration.200ms.out.duration.50ms` | 为 "in" 和 "out" 设定不同的过渡时间。 |

> 备注： 所有的过渡修饰符都可组合使用。也就是说可以这么用（虽然真这么用过于粗暴23333）: `x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale.95`

> 备注： `x-show` 将等待子元素完成 out。如果你希望跳过这一行为，可以添加 `.immediate` 修饰符：
```html
<div x-show.immediate="open">
    <div x-show.transition="open">
</div>
```
---

### `x-bind`

> 备注：可以用 ":" 简写语法替代，例如： `:type="..."`.

**例如:** `<input x-bind:type="inputType">`

**结构:** `<input x-bind:[HTML属性]="[表达式]">`

`x-bind` 将当前属性的值设定为指令中表达式的结果。 这一表达式可以访问组件数据对象中的所有 key，并在每次数据更新时重算结果。

> 备注： 属性数据绑定只会在依赖的值更新时被重算。框架足够智能，可以观测数据变化并检测绑定是否关心这些变化。

**`x-bind` 到 class 属性**

`x-bind` 在完成到 `class` 属性的绑定时，行为略有不同。

对于 class，你可以传入一个对象，key 为 class 名，值为布尔量，用来表示对应 class 是否应该生效。

例如：
`<div x-bind:class="{ 'hidden': foo }"></div>`

在这一例子中，"hidden" 这一 class 将只会在 foo 数据属性为 `true` 时有效。

**`x-bind` 到布尔值属性**

`x-bind` 支持布尔值属性，与其他 value 属性一样，使用变量或者其他结果为 `true` 或 `false` 的表达式作为其条件。

例如：
```html
<!-- 给定值: -->
<button x-bind:disabled="myVar">Click me</button>

<!-- 当 myVar == true: -->
<button disabled="disabled">Click me</button>

<!-- 当 myVar == false: -->
<button>Click me</button>
```

这将在 `myVar` 为 true 或 false 时分别新增或删除 `disabled` 属性。

[HTML specification 文档（英文）](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute)中列出的布尔值属性都被支持，例如： `disabled`, `readonly`, `required`, `checked`, `hidden`, `selected`, `open` 等等。

> 备注：如果你需要一个 false 状态来展示你的属性，如：`aria-*`，要用对绑定值使用链式的 `.toString()`。例如： `:aria-expanded="isOpen.toString()"` 将在 `isOpen` 为 `true` 或 `false` 时都能保持属性存在。

**`.camel` 修饰符**
**例如:** `<svg x-bind:view-box.camel="viewBox">`

`camel` 修饰符用来绑定等效驼峰写法的属性名。如上面的例子，`viewBox` 的值将被绑定到 `viewBox` 属性，他被表示为 `view-box`。

---

### `x-on`

> 备注：你可以直接使用简化的 "@" 语法，例如：`@click="..."`。

**例如:** `<button x-on:click="foo = 'bar'"></button>`

**结构:** `<button x-on:[事件]="[表达式]"></button>`

`x-on` 挂载一个事件监听器到声明的元素昂，当事件触发后，传入的表达式将被执行。你可以在指令所在元素可用的任何事件上使用 `x-on`，完整的事件列表，可以参考 [MDN 上的事件参考文档](https://developer.mozilla.org/en-US/docs/Web/Events)。

如果表达式中的进行了任何数据变动，其他绑定到这些数据的元素属性将被更新。

> 备注：你也可以直接使用 JavaScript 函数名。

**例如:** `<button x-on:click="myFunction"></button>`

这等效于：`<button x-on:click="myFunction($event)"></button>`

**`keydown` 修饰符**

**例如:** `<input type="text" x-on:keydown.escape="open = false">`

你可以通过向 `x-on:keydown` 指令增加 keydown 修饰符来指定特定需要监听的按钮。注意修饰符是 `Event.key` 值的短横线隔开写法（kebab-cased）版本。

例如：`enter`, `escape`, `arrow-up`, `arrow-down`

> 备注：你也可以这样监听混合的系统修饰符： `x-on:keydown.cmd.enter="foo"`

**`.away` 修饰符**

**例如:** `<div x-on:click.away="showModal = false"></div>`

当 `.away` 修饰符存在时，事件处理器将在源头不是他们自己或他们的子元素时被触发。

这对下拉菜单或模态框中处理用户点击其外部的位置关闭的交互动作非常有用。

**`.prevent` 修饰符**
**例如:** `<input type="checkbox" x-on:click.prevent>`

增加 `.prevent` 到事件监听器上，将会调用触发事件的 `preventDefault` 方法。在上面的例子中，这意味着这个 checkbox 在用户点击时不会真的被选中。

**`.stop` 修饰符**
**例如:** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

增加 `.stop` 到事件监听器上，将会调用触发事件的 `stopPropagation` 方法。在上面的例子中，这意味着点击事件不会从这个按钮冒泡到其他 div 上。换句话说，用户点击按钮时 `foo` 并不会被置为 `bar`。

**`.self` 修饰符**
**例如:** `<div x-on:click.self="foo = 'bar'"><button></button></div>`

增加 `.self` 到事件监听器上，将会使得处理器只在 `$event.target` 为元素自己的时候被调用。在上面的例子中，这意味着按钮的点击事件会冒泡的上层的 `<div>` 时，将 **不会** 调用处理器函数。

**`.window` 修饰符**
**例如:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

增加 `.window` 到事件监听器上，将会安装监听器到全局的 window 对象而不是实际声明的 DOM 节点。当你需要在 window 上的属性变化（如 resize 事件）时修改自己组件的状态，这会非常有用。在例子中，当窗口宽度扩大到 768 像素以上时我们就会关闭模态框/下拉菜单，否则保持已有状态。

>备注：你也可以使用 `.document` 修饰符来挂载监听器到`document` 而不是 `window`

**`.once` 修饰符**
**例如:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

增加 `.once` 修饰符到事件监听器上，将会确保监听器只被调用一次。这对于那些你只想调一次的事件来说超有用，比如请求 HTML 片段之类的。

**`.passive` 修饰符**
**例如:** `<button x-on:mousedown.passive="interactive = true"></button>`

增加 `.passive` 修饰符到事件监听器上，将会使监听器为 passive 状态，这意味着 `preventDefault()`不能工作。这可以帮助处理触摸设备上的滑动性能问题。

**`.debounce` 修饰符**
**例如:** `<input x-on:input.debounce="fetchSomething()">`

`debounce` 修饰符允许你对事件处理器进行「防抖」。换句话说，事件处理器将会在上次触发完成后等待一段时间才会再次触发。当处理器准备好后再处理上一个调用。

默认的防抖「等待」时间是 250 毫秒。

如果你打算自定义它，可以这样指定：

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

**`.camel` 修饰符**
**例如:** `<input x-on:event-name.camel="doSomething()">`

`camel` 修饰符用来挂载等效驼峰写法的事件监听器。如上面的例子，表达式将在 `eventName` 事件触发时被执行。

---

### `x-model`
**例如:** `<input type="text" x-model="foo">`

**结构:** `<input type="text" x-model="[data item]">`

`x-model` 新增「双向数据绑定」到一个元素上。换句话说，输入元素的 value 值将于组件中数据项的值维持同步。

> 备注：`x-model` 可以智能地检测文字输入框(input)、多选框(checkbox)、单选框(radio button)、文本输入区(textarea)、下拉选择(select)、下拉多选(multi selects)。他的行为及使用场景和 [Vue](https://vuejs.org/v2/guide/forms.html) 别无二致。

**`.number` 修饰符**
**例如:** `<input x-model.number="age">`

`number` 修饰符将转换输入的值为数据为数字类型，如果不能被成功转换，将返回原始值。

**`.debounce` 修饰符**
**例如:** `<input x-model.debounce="search">`

`debounce` 修饰符允许你对值的更新进行「防抖」。换句话说，事件处理器将会在上次触发完成后等待一段时间才会再次触发。当处理器准备好后再处理上一个调用。

默认的防抖「等待」时间是 250 毫秒。

如果你打算自定义它，可以这样指定：

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

---

### `x-text`
**例如:** `<span x-text="foo"></span>`

**结构:** `<span x-text="[表达式]"`

`x-text` 与 `x-bind` 十分相似，只不过当属性中的值更新时，他会更新元素的 `innerText`。

---

### `x-html`
**例如:** `<span x-html="foo"></span>`

**结构:** `<span x-html="[表达式]"`

`x-html` 与 `x-bind` 十分相似，只不过当属性中的值更新时，他会更新元素的 `innerHTML`。

> :warning: **只能用在可信内容上，绝不要直接展示用户的内容** :warning:
>
> 动态渲染第三方来源的 HTML 会非常容易造成 [XSS 漏洞（英文）](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting)。

---

### `x-ref`
**例如:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**结构:** `<div x-ref="[ref 名称]"></div><button x-on:click="$refs.[ref 名称].innerText = 'bar'"></button>`

`x-ref` 提供了一种在组件外获取原始 DOM 元素的简便方法。通过设置元素上的 `x-ref` 属性，你可在任何事件处理中通过内置对象（魔法属性） `$refs` 和标记的 refName 拿到 DOM。

它可以帮助你在任何地方替代设置id再通过 `document.querySelector` 取值的做法。

> 备注：如果你需要，也可以绑个动态值到 x-ref `<span :x-ref="item.id"></span>`。

---

### `x-if`
**例如:** `<template x-if="true"><div>Some Element</div></template>`

**结构:** `<template x-if="[表达式]"><div>Some Element</div></template>`

有的时候，`x-show` 可能会不太好用（它会在值为 false 时为元素增加 `display: none` 样式），`x-if` 可以真实的完整的把元素从 DOM 中删除。

但要注意，`x-if` 只能在 `<template></template>` 标签中使用，因为 Alpine 没有使用虚拟 DOM。这一实现允许 Alpine 保持简洁，直接使用真实的 DOM 来完成动态部分（magic）。

> 备注：`x-if` 要求在 `<template></template>` 标签中有单一的根元素。

> 备注：当在 `svg` 标签中使用 `template` 的时候，你需要增加 [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) 在初始化 Alpine 之前运行它。

---

### `x-for`
**例如:**
```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

> 备注：`:key` 绑定时可选的，但是强烈推荐，使用它在列表渲染中是必要的。

`x-for` 可以用于为数组中的每一项创建一个新的 DOM 节点。这一特性与 Vue 中的 `v-for` 非常类似，他也需要在 `template` 标签上使用，不能是普通的 DOM 元素。

如果需要使用当前迭代中的索引，可以这样写：

```html
<template x-for="(item, index) in items" :key="index">
    <!-- 你可以在需要时直接使用索引值 index。 -->
    <div x-text="index"></div>
</template>
```

若果你需要在迭代中访问原始数组对象，可以这样写：

```html
<template x-for="(item, index, collection) in items" :key="index">
    <div>
        <!-- 你可以在需要时直接使用数组原始值 collection。 -->
        <!-- 当前项 -->
        <div x-text="item"></div>
        <!-- 和上一行效果一致 -->
        <div x-text="collection[index]"></div>
        <!-- 上一项 -->
        <div x-text="collection[index - 1]"></div>
    </div>
</template>
```

> 备注：`x-for` 要求在 `<template></template>` 标签中有单一的根元素。

> 备注：当在 `svg` 标签中使用 `template` 的时候，你需要增加 [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) 在初始化 Alpine 之前运行它。

#### 嵌套 `x-for`
可以嵌套使用 `x-for` 循环，但是你必须为每个循环外面都包裹一个元素，如下：

```html
<template x-for="item in items">
    <div>
        <template x-for="subItem in item.subItems">
            <div x-text="subItem"></div>
        </template>
    </div>
</template>
```

#### 范围内迭代

Alpine 支持 `i in n` 语法，当 n 是整数时，就可以完成在一个固定范围内迭代的目标了。

```html
<template x-for="i in 10">
    <span x-text="i"></span>
</template>
```

---

### `x-transition`
**例如:**
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

> 这个例子使用了 [Tailwind CSS](https://tailwindcss.com) 中提供的 class。

Alpine 提供了 6 个不同的过渡指令用来在元素过渡（Transition）的显示/隐藏状态下不同阶段生效不同的 class。这些指令都能和 `x-show` 还有 `x-if` 一起使用。

这些行为与 VueJS 的过渡指令完全一致。只是用了更清晰的命名。

| 指令 | 描述 |
| --- | --- |
| `:enter` | 在整个 Enter 阶段都生效 |
| `:enter-start` | 在元素被插入前生效，在元素被插入的后1帧被删除 |
| `:enter-end` | 在元素被插入后1帧（`enter-start` 被移除的同时）生效，在过渡/动画结束后被删除 ｜
| `:leave` | 在整个 Leave 阶段都生效 |
| `:leave-start` | 在 Leave 过渡触发后立即生效，1帧即被删除 |
| `:leave-end` | 在 Leave 过渡触发后（`leave-start` 删除的同时）1 帧新增，并在过渡/动画结束时删除。｜

---

### `x-spread`
**例如:**
```html
<div x-data="dropdown()">
    <button x-spread="trigger">Open Dropdown</button>

    <span x-spread="dialogue">Dropdown Contents</span>
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

`x-spread` 允许你展开一个可以复用的对象，其中包括元素的 Alpine 绑定。

这一对象的 key 是指令（当然也可以包括修饰符），value 是可被 Alpine 执行的回调。

> 备注： x-spread 有以下两点需要注意
> - 当被展开的指令是 `x-for` 时，你需要在回调中返回一个表达式字符串，如：`['x-for']() { return 'item in items' }`.
> - `x-data` 和 `x-init` 不能在「spread」对象中使用。

---

### `x-cloak`
**例如:** `<div x-data="{}" x-cloak></div>`

`x-cloak` 属性将在 Alpine 初始化后被移除。这对于隐藏未初始化完毕的 DOM 非常有效，一种典型的通过全局样式的工作方式如下：

```html
<style>
    [x-cloak] {
        display: none !important;
    }
</style>
```

### 魔法属性 Magic Properties

> 除 `$el` 外，魔法属性 **在 `x-data` 中的无法使用**，因为那时组件还没初始化。

---

### `$el`
**例如:**
```html
<div x-data>
    <button @click="$el.innerHTML = 'foo'">Replace me with "foo"</button>
</div>
```

`$el` 是一个用来获取根组件 DOM 节点的魔法属性。

### `$refs`
**例如:**
```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

`$refs` 是一个用来在组件中获取原生 DOM 元素的魔法属性。这可以帮助你在需要时手动拿到原始的 DOM 元素。

---

### `$event`
**例如:**
```html
<input x-on:input="alert($event.target.value)">
```

`$event` 是一个用来在事件监听器中接受浏览器原生「Event」对象的魔法属性。

> 备注: $event 属性只在 DOM 表达式中有效。

如果你需要在一个 JavaScript 函数中使用 $event，可以直接这么干：

`<button x-on:click="myFunction($event)"></button>`

---

### `$dispatch`
**例如:**
```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
    <!-- 点击时，将触发 console.log -->
</div>
```

**有关事件传播 (Event Propagation)**

请注意，因为 [事件冒泡机制](https://en.wikipedia.org/wiki/Event_bubbling) 的存在，当你需要从相同层级节点上拦截已触发的事件时，需要增加 [`.window`](https://github.com/alpinejs/alpine#x-on) 修饰符：

**例如:**

```html
<div x-data>
    <span @custom-event="console.log($event.detail.foo)"></span>
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
<div>
```

> 上面的例子是错误示范，不能正常工作，因为 `custom-event` 被触发时，他只会传播到共同的祖先，上级的 `div` 元素。

**分发到组件**

也可以刚才这一技巧在组件之间通信使用：

**例如:**

```html
<div x-data @custom-event.window="console.log($event.detail)"></div>

<button x-data @click="$dispatch('custom-event', 'Hello World!')">
<!-- 当点击发生时，将会 console.log "Hello World!". -->
```

`$dispatch` 是一个创建 `CustomEvent` 并使用其内部的 `.dispatchEvent()` 进行分发的快捷方式。有很多使用自定义事件在组件间传递数据的优秀用例。[参考这篇文档](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) 来获取更多关于浏览器中 `CustomEvent` 的信息。

可以注意到，放在 `$dispatch('some-event', { some: 'data' })` 第二个参数的数据，在新事件上可通过「detail」属性来拿到：`$event.detail.some`。将自定义事件的数据附加到 .detail 属性是在浏览器中 `CustomEvent` 的标准实践。更多信息参阅 [这篇文档（英文）](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)。

你也可以使用 `$dispatch()` 来触发 `x-model` 绑定的数据更新。例如：

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')">
        <!-- 按钮被点击后，`x-model` 将获得冒泡的 「input」事件，并更新 foo 为 「baz」。 -->
    </span>
</div>
```

> 备注：$dispatch 属性只在 DOM 表达式中有效。

如果你需要在一个 JavaScript 函数中使用 $dispatch，可以直接这么干：

`<button x-on:click="myFunction($dispatch)"></button>`

---

### `$nextTick`
**例如：**
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

`$nextTick` 是一个运行你在 Alpine 做出响应式 DOM 更新后，执行一个给定表达式的指令。这在你需要在完成数据更新后用 DOM 状态做交互时非常有用。

---

### `$watch`
**例如：**
```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```

你可以通过 `$watch` 魔法方法「监听」一个组件属性。在上面的例子中，当按钮被点击且 open 被改变时，你提供的回调函数会被调用，`console.log` 新的 value。

## 安全相关 Security
如果你发现了安全漏洞，请发邮件到 [calebporzio@gmail.com]().

Alpine 依赖对 `Function` 对象的自定义实现来运行指令。虽然比 `eval()` 安全一，但在某些环境下这一方法也不可用，例如 Google Chrome App 使用的限制性内容安全策略（Content Security Policy/CSP）.

如果你在使用 Alpin 的网站上处理敏感数据，就需要设置 [CSP](https://csp.withgoogle.com/docs/strict-csp.html) 使之包括 `unsafe-eval`。正确设置安全的策略有助于保护用户的个人隐私数据。

由于策略设置会适用于页面中所有脚本，务必要检查页面引入的其他外部依赖，避免它们引发 XSS 漏洞、通过 `eval()` 修改 DOM 注入恶意代码。

## V3 路线图 Roadmap
* 从`x-ref` 迁移到 `ref` 以与 Vue 保持一致？
* 新增 `Alpine.directive()`
* 新增 `Alpine.component('foo', {...})` (通过 `__init()` 魔法方法)
* 分发 Alpine 的 "loaded", "transition-start" 等多个事件 ([#299](https://github.com/alpinejs/alpine/pull/299)) ？
* 移除 `x-bind:class="{ 'foo': true }"` 中的使用对象（以及数组）的语法 ([#236](https://github.com/alpinejs/alpine/pull/236) 并增加在 `style` 中使用对象的支持
* 优化 `x-for` 的响应式效果 ([#165](https://github.com/alpinejs/alpine/pull/165))
* 增加 "deep watching" 支持 ([#294](https://github.com/alpinejs/alpine/pull/294))
* 增加 `$el` 快捷方式
* 修改 `@click.away` 为 `@click.outside`?

## 许可证 License

Copyright © 2019-2021 Caleb Porzio 与仓库所有贡献者 版权所有

基于 MIT 许可证开源，查看 [LICENSE.md](LICENSE.md) 获取详情。
