# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true)](https://alpinejs.codewithhugo.com/chat/)

Alpine.js предоставляет реактивность и декларативность как в больших фреймворках вроде Vue или React, но с меньшими затратами.

Вы сможете использовать обычный DOM, при этом изменяя поведение по своему усмотрению.

Можете думать о Alpine.js как о [Tailwind](https://tailwindcss.com/) для JavaScript.

> Замечание: синтаксис Alpine.js почти полностью заимствован из [Vue](https://ru.vuejs.org/) (а, соответственно, и из [Angular](https://angularjs.org/)). Я безмерно благодарен разработчикам этих инструментов за тот вклад, который они внесли в Web.

## Установка

**С помощью CDN:** Добавьте следующий `<script>` в конец секции `<head>`.
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
```

Вот и всё. Он инициализируется самостоятельно.

Для рабочего окружения рекомендуется использовать ссылку с конкретным номером версии, чтобы избежать неожиданных поломок после выпуска новых версий.
Например, чтобы использовать версию `2.8.2`:
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.2/dist/alpine.min.js" defer></script>
```

**С помощью npm:** Установите пакет из npm.
```js
npm i alpinejs
```

Добавьте его в свой код.
```js
import 'alpinejs'
```

**Для поддержки IE11** используйте вместо указанных выше следующие скрипты:
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
```

Паттерн, использующийся выше, называется [паттерн module/nomodule](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/). Он позволяет автоматически загружать современный пакет в современных браузерах, а в IE11 и других устаревших браузерах – пакет для IE11.

## Использование

*Выпадающий список/Модальное окно*
```html
<div x-data="{ open: false }">
    <button @click="open = true">Открыть</button>

    <ul
        x-show="open"
        @click.away="open = false"
    >
        Содержимое
    </ul>
</div>
```

*Вкладки*
```html
<div x-data="{ tab: 'foo' }">
    <button :class="{ 'active': tab === 'foo' }" @click="tab = 'foo'">Foo</button>
    <button :class="{ 'active': tab === 'bar' }" @click="tab = 'bar'">Bar</button>

    <div x-show="tab === 'foo'">Вкладка Foo</div>
    <div x-show="tab === 'bar'">Вкладка Bar</div>
</div>
```

Alpine.js можно использовать и для более серьезных выражений. Например, *предзагрузка HTML-содержимого при наведении мыши*.

```html
<div x-data="{ open: false }">
    <button
        @mouseenter.once="
            fetch('/dropdown-partial.html')
                .then(response => response.text())
                .then(html => { $refs.dropdown.innerHTML = html })
        "
        @click="open = true"
    >Показать</button>

    <div x-ref="dropdown" x-show="open" @click.away="open = false">
        Загрузка...
    </div>
</div>
```

## Изучение

Всего в Alpine 14 директив:

| Директива | Описание |
| --- | --- |
| [`x-data`](#x-data) | Объявляет новый компонент и его данные. |
| [`x-init`](#x-init) | Выполняет переданное выражение, когда компонент инициализируется. |
| [`x-show`](#x-show) | Переключает `display: none;` на элементе, в зависимости от результата переданного выражения (true или false). |
| [`x-bind`](#x-bind) | Устанавливает значение атрибута равным результату переданного JS-выражения. |
| [`x-on`](#x-on) | Устанавливает обработчик события на элемент. Когда событие срабатывает, выполняет переданное JS-выражение. |
| [`x-model`](#x-model) | Добавляет "двустороннюю привязку данных" (two-way data binding) на элемент. Синхронизирует элемент и данные компонента. |
| [`x-text`](#x-text) | Устанавливает значение `innerText` элемента равным результату переданного JS-выражения. |
| [`x-html`](#x-html) | Устанавливает значение `innerHTML` элемента равным результату переданного JS-выражения. |
| [`x-ref`](#x-ref) | Удобный способ получения DOM-элементов вашего компонента. |
| [`x-if`](#x-if) | При невыполнении переданного условия полностью удаляет элемент из DOM. Должна использоваться в теге `<template>`. |
| [`x-for`](#x-for) | Создает новые DOM узлы для каждого элемента в массиве. Должна использоваться в теге `<template>`. |
| [`x-transition`](#x-transition) | Директивы для добавления css-классов различным стадиям перехода (transition) элемента. |
| [`x-spread`](#x-spread) | Позволяет привязывать объект с директивами Alpine к элементам, улучшая повторное использование кода. |
| [`x-cloak`](#x-cloak) | Атрибут удаляется после инициализации Alpine. Используется для скрытия элементов до DOM инициализации. |

И 6 магических свойств (magic properties):

| Магическое свойство | Описание |
| --- | --- |
| [`$el`](#el) |  Получить DOM-узел корневого компонента. |
| [`$refs`](#refs) | Получить DOM-элементы компонента, отмеченные `x-ref`. |
| [`$event`](#event) | В обработчике события получить нативный объект браузера "Event".  |
| [`$dispatch`](#dispatch) | Создать `CustomEvent` и вызвать его, используя `.dispatchEvent()`. |
| [`$nextTick`](#nexttick) | Выполнить переданное выражение ПОСЛЕ того, как Alpine сделает реактивное обновление DOM. |
| [`$watch`](#watch) | Выполнить переданный колбэк, когда наблюдаемое свойство компонента изменится. |


## Спонсоры

<img width="33%" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" alt="Tailwind CSS">

**Хочешь здесь своё лого? [Напиши мне сообщение в Twitter](https://twitter.com/calebporzio)**

## Сообщество проекта

* [Еженедельная рассылка AlpineJS](https://alpinejs.codewithhugo.com/newsletter/)
* [Spruce (глобальные данные между компонентами)](https://github.com/ryangjchandler/spruce)
* [Turbolinks Adapter](https://github.com/SimoTod/alpine-turbolinks-adapter)
* [Alpine Magic Helpers (полезные хелперы для Alpine)](https://github.com/KevinBatdorf/alpine-magic-helpers)
* [Awesome Alpine (ссылки на прочие проекты об Alpine)](https://github.com/ryangjchandler/awesome-alpine)

### Директивы

---

### `x-data`

**Пример:** `<div x-data="{ foo: 'bar' }">...</div>`

**Синтаксис:** `<div x-data="[JSON-объект]">...</div>`

`x-data` объявляет область видимости нового компонента с использованием переданного объекта данных.

Аналогична свойству `data` в компонентах Vue.

**Задание логики компонента отдельной функцией**

Можно получить данные (и задать поведение компонента) в повторно используемых функциях:

```html
<div x-data="dropdown()">
    <button x-on:click="open">Открыть</button>

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

> **Для пользователей бандлеров (bundler)**. Alpine.js получает доступ к функциям только из глобальной области видимости (`window`). Вам необходимо явно присвоить свои функции объекту `window`, чтобы использовать их с `x-data`. Например, вот так: `window.dropdown = function () {}` (с Webpack, Rollup, Parcel и другими бандлерами функции, которые вы объявляете, по умолчанию принадлежать области видимости бандлера, а не `window`).


Вы также можете объединять несколько объектов с данными с помощью деструктуризации:

```html
<div x-data="{...dropdown(), ...tabs()}">
```

---

### `x-init`
**Пример:** `<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`

**Синтаксис:** `<div x-data="..." x-init="[выражение]"></div>`

`x-init` выполняет переданное выражение, когда компонент инициализируется.

Если вы хотите выполнить код ПОСЛЕ первоначальных обновлений DOM Alpine (наподобие хука `mounted()` во VueJS), то можете передать в `x-init` колбэк, и он выполнит его после инициализации:

`x-init="() => { // здесь уже есть доступ к состоянию после инициализации DOM // }"`

---

### `x-show`
**Пример:** `<div x-show="open"></div>`

**Синтаксис:** `<div x-show="[выражение]"></div>`

`x-show` переключает `display: none;` на элементе в зависимости от результата выполнения выражения (`true` или `false`).

**x-show.transition**

`x-show.transition` – удобный API для добавления к `x-show` CSS-переходов (transitions).

```html
<div x-show.transition="open">
    Это содержимое будет иметь переходы при появлении и исчезновении.
</div>
```

| Директива | Описание |
| --- | --- |
| `x-show.transition` | Одновременный fade и scale. (opacity, scale: 0.95, timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), duration-in: 150ms, duration-out: 75ms)
| `x-show.transition.in` | Переход только при появлении. |
| `x-show.transition.out` | Переход только при исчезновении. |
| `x-show.transition.opacity` | Использовать только fade. |
| `x-show.transition.scale` | Использовать только scale. |
| `x-show.transition.scale.75` | Кастомизация scale перехода `transform: scale(.75)`. |
| `x-show.transition.duration.200ms` | Устанавливает время перехода при появлении на 200мс. Переход при исчезновении будет равен половине этого значения (100мс). |
| `x-show.transition.origin.top.right` | Кастомизация места возникновения перехода `transform-origin: top right`. |
| `x-show.transition.in.duration.200ms.out.duration.50ms` | Различные длительности для переходов при появлении и исчезновении. |

> Замечание: Все эти модификаторы переходов могут использоваться в сочетании друг с другом. Это возможно (хоть и нелепо): `x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale.95`

> Замечание: `x-show` будет ждать окончания переходов всех дочерних элементов. Можно изменить это поведение модификатором `.immediate`:
```html
<div x-show.immediate="open">
    <div x-show.transition="open">
</div>
```
---

### `x-bind`

> Сокращенный синтаксис ":". Например: `:type="..."`

**Пример:** `<input x-bind:type="inputType">`

**Синтаксис:** `<input x-bind:[атрибут]="[выражение]">`

`x-bind` устанавливает значение атрибута равным результату JS-выражения. Выражение имеет доступ ко всем ключам хранилища данных компонента и будет обновляться каждый раз при обновлении данных.

> Замечание: обновление значения атрибута с `x-bind` будет происходить ТОЛЬКО при обновлении его зависимостей.

**`x-bind` для атрибутов class**

`x-bind` ведет себя немного иначе, когда привязан к атрибуту `class`.

Для css-классов необходимо передавать объект, где ключи – это имена классов, а значения – логические выражения, которые определяют применяются эти классы или нет.

Например:
`<div x-bind:class="{ 'hidden': foo }"></div>`

В этом примере, класс "hidden" будет применен только если значение выражения `foo` равно `true`.

**`x-bind` для логических атрибутов**

`x-bind` поддерживает логические атрибуты так же, как и атрибуты значения, используя переменную как условие или любое JS-выражение, которое разрешается в `true` или `false`.

Например:
```html
<!-- Дано: -->
<button x-bind:disabled="myVar">Нажми на меня</button>

<!-- Когда myVar == true: -->
<button disabled="disabled">Нажми на меня</button>

<!-- Когда myVar == false: -->
<button>Нажми на меня</button>
```

Это добавит или удалит атрибут `disabled`, в зависимости от того, равна `myVar` true или false.

Логические атрибуты поддерживаются в соответствии с [HTML спецификацией](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute), такие как, например, `disabled`, `readonly`, `required`, `checked`, `hidden`, `selected`, `open` и другие.

> Замечание: Если нужно вернуть логическое (true/false) значение атрибута в виде текста, например для `aria-*`, используйте метод `.toString()`. Например `:aria-expanded="isOpen.toString()"` вернёт строку `true` или `false`в зависимости от значения `isOpen`.

**Модификатор `.camel`**
**Пример:** `<svg x-bind:view-box.camel="myVar">`

Модификатор `camel` позволяет задать имя атрибута, которое будет преобразовано к синтаксису "camelCase". В данном примере значение будет присвоено атрибуту `viewBox`, а не `view-box`.

---

### `x-on`

> Сокращенный синтаксис "@": `@click="..."`

**Пример:** `<button x-on:click="foo = 'bar'"></button>`

**Синтаксис:** `<button x-on:[событие]="[выражение]"></button>`

`x-on` цепляет слушатель события на элемент, в котором был объявлен. Когда событие срабатывает, выполняется переданное JS-выражение. Можно использовать `x-on` с любым событием. См. полный список событий в [документации MDN](https://developer.mozilla.org/en-US/docs/Web/Events).

Если в этом выражении меняются какие-либо данные, другие элементы, "привязанные" к этим данным, также будут обновлены.

> Замечание: Также можно задать имя JS-функции.

**Пример:** `<button x-on:click="myFunction"></button>`

Это равноценно: `<button x-on:click="myFunction($event)"></button>`

**Модификатор `keydown`**

**Пример:** `<input type="text" x-on:keydown.escape="open = false">`

Можно обозначить конкретные клавиши для прослушивания, присоединяя их через точку к директиве `x-on:keydown`. Модификаторы – это значения `Event.key`, записанные в kebab-стиле.

Например: `enter`, `escape`, `arrow-up`, `arrow-down`

> Замечание: Можно также прослушивать комбинации с системными клавишами, например: `x-on:keydown.cmd.enter="foo"`

**Модификатор `.away`**

**Пример:** `<div x-on:click.away="showModal = false"></div>`

При добавлении модификатора `.away` обработчик события сработает, только когда событие произошло на другом источнике, а не на этом элементе или его потомках.

Это полезно для скрытия дропдаунов или модальных окон, когда пользователь кликает в другом месте экрана.

**Модификатор `.prevent`**

**Пример:** `<input type="checkbox" x-on:click.prevent>`

При добавлении `.prevent` обработчик вызовет `preventDefault` на сработавшем событии. В примере выше это приведет к тому, что чекбокс не будет отмечен при нажатии на него.

**Модификатор `.stop`**

**Пример:** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

При добавлении `.stop` обработчик вызовет `stopPropagation` на сработавшем событии. В примере выше это приведет к тому, что событие "click" не всплывет от кнопки к внешнему `<div>`. Другими словами, когда пользователь нажимает на кнопку, `foo` не устанавливается в `'bar'`.

**Модификатор `.self`**

**Пример:** `<div x-on:click.self="foo = 'bar'"><button></button></div>`

При добавлении `.self` обработчик события сработает, только если `$event.target` – это сам элемент. В примере выше это приведет к тому, что событие "click", всплыв от кнопки к внешнему `<div>`, **не** вызовет его обработчик.

**Модификатор `.window`**

**Пример:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

При добавлении `.window` слушатель события установится не на узел DOM, на котором был вызван, а на глобальный объект window. Это используется, когда нужно изменить состояние компонента при изменении чего-либо в window, например, при событии "resize". В примере выше, когда ширина окна будет больше 768 пикселей, модальное окно закроется.

>Замечание: Также можно использовать модификатор `.document` для добавления слушателей к `document`.

**Модификатор `.once`**

**Пример:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

При добавлении `.once` обработчик события будет вызван лишь единожды. Это полезно для вещей, которые нужно сделать только один раз, например, загрузка данных и т.п.

**Модификатор `.passive`**

**Пример:** `<button x-on:mousedown.passive="interactive = true"></button>`

Добавление модификатора `.passive` к слушателю события сделает его пассивным. Это значит, что `preventDefault()` не будет работать ни с какими обрабатываемыми событиями. Это может помочь например с производительностью при прокрутке на сенсорных устройствах.

**Модификатор `.debounce`**

**Пример:** `<input x-on:input.debounce="fetchSomething()">`

Модификатор `debounce` позволяет избавиться от ложных повторных вызовов обработчика события. Другими словами, обработчик НЕ будет вызван, пока не пройдет определенное количество времени с предыдущего вызова. Когда обработчик будет готов, будет вызван последний вызов.

Время ожидания по умолчанию 250 миллисекунд.

Вы также можете указать свое время:

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

**Модификатор `.camel`**

**Пример:** `<input x-on:event-name.camel="doSomething()">`

Модификатор `camel` позволяет задать событие, которое будет преобразовано к синтаксису "camelCase". В данном примере слушатель будет добавлен к событию `eventName`.

---

### `x-model`
**Пример:** `<input type="text" x-model="foo">`

**Синтаксис:** `<input type="text" x-model="[хранилище данных]">`

`x-model` добавляет элементу "двустороннюю привязку данных" (two-way data binding). Другими словами, значение поля ввода будет синхронизировано со значением в хранилище данных компонента.

> Замечание: `x-model` достаточно умен, чтобы замечать изменения в текстовых полях ввода, чекбоксах, радио-кнопках, textarea, select, и множественных select. В данных сценариях `x-model` ведет себя аналогично `v-model` [во Vue](https://ru.vuejs.org/v2/guide/forms.html).

**Модификатор `.number`**
**Пример:** `<input x-model.number="age">`

Модификатор `number` преобразует входное значение в число. Если оно не может быть преобразовано, то возвращается исходное значение.

**Модификатор `.debounce`**
**Пример:** `<input x-model.debounce="search">`

Модификатор `debounce` позволяет избавиться от ложных повторных изменений значения. Другими словами, обработчик НЕ будет вызван, пока не пройдет определенное количество времени с предыдущего вызова. Когда обработчик будет готов, будет вызван последний вызов.

Время ожидания по умолчанию 250 миллисекунд.

Вы также можете указать свое время:

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

---

### `x-text`
**Пример:** `<span x-text="foo"></span>`

**Синтаксис:** `<span x-text="[выражение]"`

`x-text` устанавливает значение `innerText` элемента равным результату переданного JS-выражения. Другими словами, работает аналогично `x-bind`, но не для атрибута, а для `innerText` элемента.

---

### `x-html`
**Пример:** `<span x-html="foo"></span>`

**Синтаксис:** `<span x-html="[выражение]"`

`x-html` устанавливает значение `innerHTML` элемента равным результату переданного JS-выражения. Другими словами, работает аналогично `x-bind`, но не для атрибута, а для `innerHTML` элемента.

> :warning: **Используйте только надежные источники контента и никогда не используйте контент, предоставленный пользователем.** :warning:
>
> Динамически отрендеренный HTML от третьих сторон может легко привести к [XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) уязвимостям.

---

### `x-ref`
**Пример:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**Синтаксис:** `<div x-ref="[имя рефа]"></div><button x-on:click="$refs.[имя рефа].innerText = 'bar'"></button>`

`x-ref` предоставляет удобный способ получения DOM-элементов ваших компонентов. При установлении атрибута `x-ref` на элемент, вы делаете его доступным всем обработчикам событий в объекте `$refs`.

Это удобная альтернатива установке id и использования `document.querySelector`.

> Замечание: при необходимости также можно привязывать x-ref динамические значения: `<span :x-ref="item.id"></span>`.

---

### `x-if`
**Пример:** `<template x-if="true"><div>Какой-то элемент</div></template>`

**Синтаксис:** `<template x-if="[выражение]"><div>Какой-то элемент</div></template>`

В случаях, когда `x-show` недостаточно (`x-show` устанавливает элементу `display: none`, если выражение ложно), можно использовать `x-if`, чтобы полностью удалить элемент из DOM.

Alpine не использует Virtual DOM, поэтому важно, чтобы `x-if` использовался в теге `<template></template>`.

> Замечание: Внутри тега `<template></template>` с `x-if` должен быть лишь один корневой элемент.

> Замечание: При использовании `template` в тэге `svg`, используйте [полифил](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538). Он должен быть запущен до инициализации Alpine.js.

---

### `x-for`
**Пример:**
```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

> Замечание: привязка `:key` опциональна, хотя КРАЙНЕ рекомендуется.

`x-for` используется для создания новых DOM-узлов для каждого элемента в массиве. `x-for` похоже на `v-for` во Vue, с одним отличием: `x-for` может использовался только в теге `<template></template>`.

Если вы хотите получить доступ к индексу текущей итерации, используйте следующий синтаксис:

```html
<template x-for="(item, index) in items" :key="index">
    <!-- Если необходимо, вы также можете ссылаться на "index" внутри итерации. -->
    <div x-text="index"></div>
</template>
```
Если нужно получить доступ к массиву данных (collection) внутри цикла, используйте такой синтаксис:

```html
<template x-for="(item, index, collection) in items" :key="index">
    <!-- Можно ссылаться на массив "collection" -->
    <!-- Текущий элемент -->
    <div x-text="item"></div>
    <!-- или так -->
    <div x-text="collection[index]"></div>
    <!-- Предыдущий элемент -->
    <div x-text="collection[index - 1]"></div>
</template>
```

> Замечание: Внутри тега `<template></template>` с `x-for` должен быть лишь один корневой элемент.

> Замечание: При использовании `template` в тэге `svg`, используйте [полифил](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538). Он должен быть запущен до инициализации Alpine.js.

#### Вложенные `x-for`
Можно вкладывать `x-for` друг в друга, но НУЖНО оборачивать каждый цикл в какой-нибудь элемент. Например:

```html
<template x-for="item in items">
    <div>
        <template x-for="subItem in item.subItems">
            <div x-text="subItem"></div>
        </template>
    </div>
</template>
```

#### Количество итераций

Alpine поддерживает синтаксис `i in n`, где `n` число, указывающее на количество итераций цикла.

```html
<template x-for="i in 10">
    <span x-text="i"></span>
</template>
```

---

### `x-transition`
**Пример:**
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

> Пример выше использует классы из [Tailwind CSS](https://tailwindcss.com)

Alpine предлагает 6 разных transition-директив для добавления классов к различным стадиям перехода элемента от состояния "скрытого" к "видимому". Все эти директивы работают как с `x-show`, так и с `x-if`.

Они ведут себя абсолютно так же, как transition-директивы во VueJS, но у них более понятные названия:

| Директива | Описание |
| --- | --- |
| `:enter` | Применяется в ходе всей фазы появления. |
| `:enter-start` | Добавляется до введения элемента, удаляется на следующий фрейм после с введения элемента. |
| `:enter-end` | Добавляется на следующий фрейм после с введения элемента (одновременно с удалением `enter-start`), удаляется, когда переход/анимация заканчивается.
| `:leave` | Применяется в ходе всей фазы исчезновения. |
| `:leave-start` | Добавляется, как только вызвано исчезновение, удаляется на следующий фрейм. |
| `:leave-end` | Добавляется на следующий фрейм, как только вызвано исчезновение (одновременно с удалением `leave-start`), удаляется, когда переход/анимация заканчивается.

---

### `x-spread`
**Пример:**
```html
<div x-data="dropdown()">
    <button x-spread="trigger">Открыть</button>

    <span x-spread="dialogue">Содержимое</span>
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

`x-spread` позволяет вынести привязки Alpine из элементов в объект (он может повторно использоваться в других компонентах).

Ключи объекта – это директивы (любые, в том числе и с модификаторами), а значения – колбэки, с которыми будет работать Alpine.

> Замечание: Единственная особенность при работе с x-spread – это то, как обрабатывается `x-for`. Когда директива, используемая в x-spread – это `x-for`, в колбэке необходимо возвращать выражение в виде строки. К примеру: `['x-for']() { return 'item in items' }`.

> Замечание: Директивы `x-data` и `x-init` не могут использоваться в "spread"-объекте.

---

### `x-cloak`
**Пример:** `<div x-data="{}" x-cloak></div>`

Атрибуты `x-cloak` удаляются с элементов, когда Alpine будет проинициализирован. Это полезно для скрытия элемента до построения DOM. Для использования `x-cloak` необходимо добавить следующие css-правила:

```html
<style>
    [x-cloak] { display: none; }
</style>
```

### Магические свойства

> Не считая `$el`, магические свойства **не доступны внутри `x-data`**, так как компонент еще не инициализирован.

---

### `$el`
**Пример:**
```html
<div x-data>
    <button @click="$el.innerHTML = 'foo'">Замени меня на "foo"</button>
</div>
```

`$el` – магическое свойство, которое используется для получения корневого DOM-узла компонента.

### `$refs`
**Пример:**
```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

`$refs` – это магическое свойство, которое используется для получения DOM-элементов внутри компонента, помеченных `x-ref`. Оно используется, когда нужно вручную манипулировать элементами DOM.

---

### `$event`
**Пример:**
```html
<input x-on:input="alert($event.target.value)">
```

`$event` – это магическое свойство, которое можно использовать в слушателе событий для получения нативного объекта "Event".

> Замечание: свойство $event доступно только в DOM-выражениях.

Если нужно получить доступ к $event внутри функции JavaScript, вы можете передать его как параметр:

`<button x-on:click="myFunction($event)"></button>`

---

### `$dispatch`
**Пример:**
```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })"></button>
    <!-- После нажатия кнопки выводит в консоль "bar" -->
</div>
```

**Примечание по распространению событий (event propagation)**

Когда требуется перехватить событие, вызванное из узла на том же уровне вложенности, можно использовать модификатор [`.window`](https://github.com/alpinejs/alpine/blob/master/README.ru.md#x-on):

**Пример неверного использования:**

```html
<div x-data>
    <span @custom-event="console.log($event.detail.foo)"></span>
    <button @click="$dispatch('custom-event', { foo: 'bar' })"></button>
<div>
```

> Это не будет работать, потому что, когда вызывается `custom-event`, он сразу всплывает ([event bubbling](https://en.wikipedia.org/wiki/Event_bubbling)) к родителю `div`.

**Диспетчеризация для компонентов**

Вы также можете использовать предыдущую технику для общения компонентов друг с другом:

**Пример:**

```html
<div x-data @custom-event.window="console.log($event.detail)"></div>

<button x-data @click="$dispatch('custom-event', 'Hello World!')"></button>
<!-- При нажатии в консоль выведется "Hello World!". -->
```

`$dispatch` – это удобное сокращение для создания `CustomEvent` (пользовательские события) и их вызова с помощью `.dispatchEvent()`. Существует множество сценариев использования передачи данных между компонентами с помощью пользовательских событий. [Пройдите по этой ссылке](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events), чтобы больше узнать о системе, лежащей в основе `CustomEvent` в браузерах.

Любые данные, переданные как второй параметр в `$dispatch('some-event', { some: 'data' })`, становятся доступны через свойство "detail" события: `$event.detail.some`. Добавление событию пользовательских данных через свойство `.detail` – стандартная практика для `CustomEvent` в браузерах. [Подробнее здесь](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail).

Вы также можете использовать `$dispatch()` для вызова обновления данных в привязках `x-model`. Например:

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')"></button>
        <!-- После нажатия кнопки, `x-model` перехватит всплывающее событие "input" (oninput), и обновит foo на "baz". -->
    </span>
</div>
```

> Замечание: Свойство $dispatch доступно только в DOM-выражениях.

Если нужен доступ к $dispatch внутри JavaScript-функции, вы можете передать его напрямую:

`<button x-on:click="myFunction($dispatch)"></button>`

---

### `$nextTick`
**Пример:**
```html
<div x-data="{ fruit: 'яблоко' }">
    <button
        x-on:click="
            fruit = 'груша';
            $nextTick(() => { console.log($event.target.innerText) });
        "
        x-text="fruit"
    ></button>
</div>
```

`$nextTick` – это магическое свойство, которое выполняет переданное выражение только ПОСЛЕ того, как Alpine реактивно обновит DOM. Это полезно в тех случаях, когда вы хотите взаимодействовать с состоянием DOM, ПОСЛЕ того, как оно отразит сделанное вами обновление данных.

---

### `$watch`
**Пример:**
```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```

Магический метод `$watch` позволяет следить за выбранным свойством компонента. В примере выше при нажатии на кнопку: 1) значение `open` изменится; 2) выполнится переданный в `$watch` колбэк; 3) в консоль выведется новое значение.

## Безопасность
Если вы нашли уязвимость, пожалуйста, отправьте письмо на [calebporzio@gmail.com]().

Alpine полагается на собственную реализацию, которая использует объект `Function` для оценки своих директив. Несмотря на то, что он безопаснее, чем `eval()`, его использование запрещено в некоторых средах, таких как Google Chrome App, т.е. использующих Политику защиты контента (CSP).

Если вы используете Alpine на веб-сайте, имеющем дело с конфиденциальными данными и требующим [CSP](https://csp.withgoogle.com/docs/strict-csp.html), вы должны включить `unsafe-eval` в свою политику. Правильно настроенная политика поможет защитить ваших пользователей при использовании их личных или финансовых данных.

Поскольку политика применяется ко всем скриптам на вашей странице, важно, чтобы другие внешние библиотеки, которые используются на сайте, были тщательно проверены, чтобы убедиться, что они заслуживают доверия, и не будут создавать XSS-уязвимость с помощью функции `eval()` или манипулировать DOM для внедрения вредоносного кода на вашу страницу.

## Планы на третью версию
* Перейти с `x-ref` на `ref` для соответствия с Vue?
* Добавить `Alpine.directive()`
* Добавить `Alpine.component('foo', {...})` (с магическим методом `__init()`)
* Вызывать Alpine-события для "loaded", "transition-start", и т.д. ([#299](https://github.com/alpinejs/alpine/pull/299)) ?
* Удалить синтаксис объекта (и массива) у `x-bind:class="{ 'foo': true }"` ([#236](https://github.com/alpinejs/alpine/pull/236), чтобы добавить поддержку синтаксиса объекта для атрибута `style`)
* Улучшить изменение реактивности `x-for` ([#165](https://github.com/alpinejs/alpine/pull/165))
* Добавить поддержку "deep watching" ([#294](https://github.com/alpinejs/alpine/pull/294))
* Добавить сокращение для `$el`
* Изменить `@click.away` на `@click.outside`?

## Лицензия

Copyright © 2019-2021 Caleb Porzio и другие

Лицензировано по лицензии MIT, смотрите [LICENSE.md](LICENSE.md) для подробностей.
