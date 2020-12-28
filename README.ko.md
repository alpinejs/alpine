# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true)](https://alpinejs.codewithhugo.com/chat/)

Alpine.js는 저렴한 비용으로 Vue 또는 React와 같은 대규모 프레임워크의 반응성 및 선언적 특성을 제공합니다.

DOM을 유지하고 적절한 동작을 사용할 수 있습니다.

JavaScript용 [Tailwind](https://tailwindcss.com/)라고 생각하시면 됩니다.

> 참고: 이 도구는 [Vue](https://vuejs.org/) (및 [Angular](https://angularjs.org/))에서 영감을 받았습니다. 저는 이러한 도구의 개발자들이 웹에 기여한 것에 대해 대단히 감사하고있습니다.


## 설치

**CDN 사용:** `<head>`섹션 끝에 다음 스크립트를 추가합니다.
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
```

그것으로 끝입니다. 자체적으로 초기화됩니다.

프로덕션 환경의 경우 최신 버전의 예상치 못한 문제를 방지하기 위해 링크에 특정 버전 번호를 설정하는 것이 좋습니다.
예를 들어 `2.7.0` 버전 사용:
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.7.0/dist/alpine.min.js" defer></script>
```

**NPM 사용:** NPM에서 패키지를 설치합니다.
```js
npm i alpinejs
```

스크립트에 다음 내용을 추가하세요.
```js
import 'alpinejs'
```

**IE11을 지원하려면** 다음 스크립트를 사용하세요.
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
```

위의 패턴은 [module/nomodule 패턴](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)으로 최신 브라우저와 IE11 및 기타 레거시 브라우저에서 자동으로 로드됩니다.

## 사용법

*드롭다운/모달*
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

*탭*
```html
<div x-data="{ tab: 'foo' }">
    <button :class="{ 'active': tab === 'foo' }" @click="tab = 'foo'">Foo</button>
    <button :class="{ 'active': tab === 'bar' }" @click="tab = 'bar'">Bar</button>

    <div x-show="tab === 'foo'">Tab Foo</div>
    <div x-show="tab === 'bar'">Tab Bar</div>
</div>
```

사소한 목적으로도 사용할 수 있습니다.
*드롭다운에 마우스 오버 시 HTML 내용을 미리 가져옵니다.*
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

## 배우기

다음과 같이 총 14개의 지침이 있습니다.

| 지침 | 설명 |
| --- | --- |
| [`x-data`](#x-data) | 새로운 구성요소의 번위를 선언합니다. |
| [`x-init`](#x-init) | 구성요소가 초기화될 때 제공된 식을 실행합니다. |
| [`x-show`](#x-show) | `display: none;` 부울 표현식에 따라 요소를 토글랍니다. (true 또는 false). |
| [`x-bind`](#x-bind) | 전달 된 JS 표현식의 결과와 동일한 속성 값을 설정합니다. |
| [`x-on`](#x-on) | 요소에 이벤트 리스너를 설치합니다. 이벤트가 발생하면 제공된 JS 표현식을 실행합니다. |
| [`x-model`](#x-model) | 지시문은 입력 요소와의 데이터 바인딩을 보장합니다. 이를 통해 양방향으로 데이터 바인딩이 가능합니다. |
| [`x-text`](#x-text) | 유사한 방식으로 작동 `x-bind`의 `innerText` 요소가 업데이트됩니다. |
| [`x-html`](#x-html) | 유사한 방식으로 작동 `x-bind`의 `innerHTML` 요소가 업데이트됩니다. |
| [`x-ref`](#x-ref) | 구성 요소의 DOM 요소를 가져오는 편리한 방법입니다. |
| [`x-if`](#x-if) | 전달된 조건이 충족되지 않으면 DOM에서 요소를 완전히 제거합니다. `<template>` 태그에 사용되어야 합니다
 |
| [`x-for`](#x-for) | 배열의 각 항목에 대해 새 DOM 노드를 만듭니다. `<template>`태그에 사용해야합니다. |
| [`x-transition`](#x-transition) | 요소 전환의 다양한 단계에 클래스를 추가하기 위한 지시. |
| [`x-spread`](#x-spread) | Alpine 지시문이 있는 개체를 요소에 바인딩하여 재사용성을 높일 수 있습니다. |
| [`x-cloak`](#x-cloak) | Alpine이 초기화되면 해제됩니다. 초기화 전에 DOM을 숨기는 데 유용합니다. |

그리고 6가지 마법속성:

| 마법속성 | 설명 |
| --- | --- |
| [`$el`](#el) | 루트 구성 요소의 DOM 노드를 검색합니다. |
| [`$refs`](#refs) | `x-ref` 컴포넌트 내부에 표시된 DOM 요소를 검색합니다. |
| [`$event`](#event) | 이벤트 핸들러에서 기본 브라우저 "Event" 객체를 검색합니다.  |
| [`$dispatch`](#dispatch) | `CustomEvent`를 만들고 `.dispatchEvent()` 내부적으로 보냅니다. |
| [`$nextTick`](#nexttick) | Alpine이 반응형 DOM 업데이트를 수행한 후 제공된 표현식을 실행합니다. |
| [`$watch`](#watch) | "수신(watched)"중인 구성 요소의 속성이 변경될 때 제공되는 콜백을 트리거합니다. |


## 스폰서

<img width="33%" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" alt="Tailwind CSS">

**여기에 로고를 등록하고 싶으신가요? [Twitter로 DM을 보내주세요](https://twitter.com/calebporzio)**

## 커뮤니티 프로젝트

* [AlpineJS Weekly Newsletter](https://alpinejs.codewithhugo.com/newsletter/)
* [Spruce (State Management)](https://github.com/ryangjchandler/spruce)
* [Turbolinks Adapter](https://github.com/SimoTod/alpine-turbolinks-adapter)
* [Alpine Magic Helpers](https://github.com/KevinBatdorf/alpine-magic-helpers)
* [Awesome Alpine](https://github.com/ryangjchandler/awesome-alpine)

### 지시어

---

### `x-data`

**예제:** `<div x-data="{ foo: 'bar' }">...</div>`

**구조:** `<div x-data="[object literal]">...</div>`

`x-data` 구성 요소의 새 범위를 선언합니다.  다음 데이터 개체를 사용하여 새 구성 요소를 초기화하도록 프레임워크에 지시합니다.

Vue 컴포넌트의 `data` 속성과 유사합니다.

**컴포넌트 로직 추출**

재사용이 가능한 데이터(동작)를 추출할 수 있습니다.

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

> **번들러 사용자의 경우**, Alpine.js는 전역 범위(`window`)의 함수에만 액세스합니다. 예를 들어 `x-data`를 사용하려면 함수를 `window.dropdown = function () {}`처럼 `window`에 명시적으로 할당해야합니다. (이것은 Webpack, Rollup, Parcel 등의 `함수(function)`를 사용하면 기본적으로 `window`가 아닌 모듈의 범위로 설정되기 때문입니다.)


객체를 분리 사용하여 여러 데이터 객체를 혼합하여 사용할수도 있습니다.

```html
<div x-data="{...dropdown(), ...tabs()}">
```

---

### `x-init`
**예제:** `<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`

**구조:** `<div x-data="..." x-init="[expression]"></div>`

`x-init` 구성 요소가 초기화될 때 제공된 식을 실행합니다.

초기 Alpine DOM 업데이트 (예 : VueJS의 `mounted()` 후크 ) 후에 코드를 실행하려면 `x-init` 콜백을 전달할 수 있으며 초기화 후에 실행합니다.

`x-init="() => { // we have access to the post-dom-initialization state here // }"`

---

### `x-show`
**예제:** `<div x-show="open"></div>`

**구조:** `<div x-show="[expression]"></div>`

`x-show` 표현식이 true 또는 false로 결정됨에 따라 요소의 `display: none;` 스타일 속성을 전환합니다.

**x-show.transition**

`x-show.transition`은 `x-show` 보다 더 나은 CSS transition을 제공하는 편리한 API입니다.

```html
<div x-show.transition="open">
    These contents will be transitioned in and out.
</div>
```

| 지침 | 설명 |
| --- | --- |
| `x-show.transition` | A simultaneous fade and scale. (opacity, scale: 0.95, timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), duration-in: 150ms, duration-out: 75ms)
| `x-show.transition.in` | Only transition in. |
| `x-show.transition.out` | Only transition out. |
| `x-show.transition.opacity` | Only use the fade. |
| `x-show.transition.scale` | Only use the scale. |
| `x-show.transition.scale.75` | Customize the CSS scale transform `transform: scale(.75)`. |
| `x-show.transition.duration.200ms` | Sets the "in" transition to 200ms. The out will be set to half that (100ms). |
| `x-show.transition.origin.top.right` | Customize the CSS transform origin `transform-origin: top right`. |
| `x-show.transition.in.duration.200ms.out.duration.50ms` | Different durations for "in" and "out". |

> Note: All of these transition modifiers can be used in conjunction with each other. This is possible (although ridiculous lol): `x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale.95`

> Note: `x-show` will wait for any children to finish transitioning out. If you want to bypass this behavior, add the `.immediate` modifer:
```html
<div x-show.immediate="open">
    <div x-show.transition="open">
</div>
```
---

### `x-bind`

> 참고: 조금 더 간단한 문법을 사용할 수 있습니다. ":" syntax: `:type="..."`.

**예제:** `<input x-bind:type="inputType">`

**구조:** `<input x-bind:[attribute]="[expression]">`

`x-bind` JavaScript 표현식의 결과를 속성값으로 설정합니다. 표현식은 component가 가지고 있는 데이터 객체의 모든 키에 접근할 수 있으며, component의 데이터가 변경될 때마다 자동으로 갱신됩니다.

> 참고: 속성 바인딩은 종속성이 업데이트될 때만 업데이트됩니다. Framework는 데이터 변경 사항을 관찰하고 어떤 바인딩이 이를 처리하는지 감지할 수 있을 만큼 똑똑합니다.

**클래스 속성일 경우 `x-bind`**

`x-bind` behaves a little differently when binding to the `class` attribute.

`x-bind` 가 `class` 속성에 바인딩 될 때는 조금 다르게 동작합니다.

클래스의 경우, 키가 클래스 이름이고 값이 부울 표현 식인 객체를 전달하여 해당 클래스 이름의 적용여부를 결정합니다.

예제:
`<div x-bind:class="{ 'hidden': foo }"></div>`

이 예제에서, "hidden" 클래스는 `foo` 데이터 속성값이 `true` 인 경우에만 적용됩니다.

**부울 속성일 경우 `x-bind`**

`x-bind`는 변수를 조건식으로 사용하거나 `true` 또는 `false`로 확인되는 JavaScript 표현식을 사용하여, 값 속성과 동일한 방식으로 부울 속성을 지원합니다.

예제:
```html
<!-- Given: -->
<button x-bind:disabled="myVar">Click me</button>

<!-- When myVar == true: -->
<button disabled="disabled">Click me</button>

<!-- When myVar == false: -->
<button>Click me</button>
```

위 예제에서는 `myVar`의 값이 각각 true 또는 false 인지에 따라 `disabled`속성이 추가 또는 삭제됩니다.

부울 속성은 다음과 같은 속성에 대해 지원됩니다.[HTML specification](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute), 예 `disabled`, `readonly`, `required`, `checked`, `hidden`, `selected`, `open`, 그 외.

> 참고: `aria-*`와 같이 속성에 대해 보여줄 거짓 상태가 필요한 경우 속성에 바인딩 하는 동안 `.toString()`을 값에 연결합니다. 예: `:aria-expanded="isOpen.toString()"`는 `isOpen`가 `true` 또는 `false`여부에 관계없이 유지됩니다.

**`.camel` 수정자**
**예제:** `<svg x-bind:view-box.camel="viewBox">`

`camel`수정자는 camel 표기법에 해당하는 속성명으로 바인딩 합니다. 위 예제에서 `viewBox`의 값은 `view-box`속성이 아닌 `viewBox` 속성으로 바인딩 됩니다.

---

### `x-on`

> 참고: 조금 더 간단한 문법을 사용할 수 있습니다. "@" syntax: `@click="..."`.

**예제:** `<button x-on:click="foo = 'bar'"></button>`

**구조:** `<button x-on:[event]="[expression]"></button>`

`x-on`은(는) element가 선언된 곳에 이벤트 리스너를 등록합니다. 해당 이벤트가 발생하면 값으로 설정된 자바스크립트 표현식이 실행됩니다.

표현식에서 데이터가 수정되면, 이 데이터와 연관되어 있는 다른 요소의 속성도 업데이트됩니다.
> 참고: 자바스크립트 함수 이름을 지정할 수도 있습니다.

**예제:** `<button x-on:click="myFunction"></button>`

위 예제는 다음코드와 동일합니다: `<button x-on:click="myFunction($event)"></button>`

**`keydown` 수정자**

**예제:** `<input type="text" x-on:keydown.escape="open = false">`

You can specify specific keys to listen for using keydown modifiers appended to the `x-on:keydown` directive. Note that the modifiers are kebab-cased versions of `Event.key` values.

`x-on:keydown` 디렉티브에 keydown 수정자를 사용하여 수신 할 특정 키를 지정할 수 있습니다.

Examples: `enter`, `escape`, `arrow-up`, `arrow-down`

> Note: You can also listen for system-modifier key combinations like: `x-on:keydown.cmd.enter="foo"`

**`.away` modifier**

**예제:** `<div x-on:click.away="showModal = false"></div>`

When the `.away` modifier is present, the event handler will only be executed when the event originates from a source other than itself, or its children.

This is useful for hiding dropdowns and modals when a user clicks away from them.

**`.prevent` modifier**
**예제:** `<input type="checkbox" x-on:click.prevent>`

Adding `.prevent` to an event listener will call `preventDefault` on the triggered event. In the above example, this means the checkbox wouldn't actually get checked when a user clicks on it.

**`.stop` modifier**
**예제:** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

Adding `.stop` to an event listener will call `stopPropagation` on the triggered event. In the above example, this means the "click" event won't bubble from the button to the outer `<div>`. Or in other words, when a user clicks the button, `foo` won't be set to `'bar'`.

**`.self` modifier**
**예제:** `<div x-on:click.self="foo = 'bar'"><button></button></div>`

Adding `.self` to an event listener will only trigger the handler if the `$event.target` is the element itself. In the above example, this means the "click" event that bubbles from the button to the outer `<div>` will **not** run the handler.

**`.window` modifier**
**예제:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

Adding `.window` to an event listener will install the listener on the global window object instead of the DOM node on which it is declared. This is useful for when you want to modify component state when something changes with the window, like the resize event. In this example, when the window grows larger than 768 pixels wide, we will close the modal/dropdown, otherwise maintain the same state.

>Note: You can also use the `.document` modifier to attach listeners to `document` instead of `window`

**`.once` modifier**
**예제:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

Adding the `.once` modifier to an event listener will ensure that the listener will only be handled once. This is useful for things you only want to do once, like fetching HTML partials and such.

**`.passive` modifier**
**예제:** `<button x-on:mousedown.passive="interactive = true"></button>`

Adding the `.passive` modifier to an event listener will make the listener a passive one, which means `preventDefault()` will not work on any events being processed, this can help, for example with scroll performance on touch devices.

**`.debounce` modifier**
**예제:** `<input x-on:input.debounce="fetchSomething()">`

The `debounce` modifier allows you to "debounce" an event handler. In other words, the event handler will NOT run until a certain amount of time has elapsed since the last event that fired. When the handler is ready to be called, the last handler call will execute.

The default debounce "wait" time is 250 milliseconds.

If you wish to customize this, you can specifiy a custom wait time like so:

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

**`.camel` modifier**
**예제:** `<input x-on:event-name.camel="doSomething()">`

The `camel` modifier will attach an event listener for the camel case equivalent event name. In the example above, the expression will be evaluated when the `eventName` event is fired on the element.

---

### `x-model`
**예제:** `<input type="text" x-model="foo">`

**구조:** `<input type="text" x-model="[data item]">`

`x-model` adds "two-way data binding" to an element. In other words, the value of the input element will be kept in sync with the value of the data item of the component.

> Note: `x-model` is smart enough to detect changes on text inputs, checkboxes, radio buttons, textareas, selects, and multiple selects. It should behave [how Vue would](https://vuejs.org/v2/guide/forms.html) in those scenarios.

**`.number` modifier**
**예제:** `<input x-model.number="age">`

The `number` modifier will convert the input's value to a number. If the value cannot be parsed as a valid number, the original value is returned.

**`.debounce` modifier**
**예제:** `<input x-model.debounce="search">`

The `debounce` modifier allows you to add a "debounce" to a value update. In other words, the event handler will NOT run until a certain amount of time has elapsed since the last event that fired. When the handler is ready to be called, the last handler call will execute.

The default debounce "wait" time is 250 milliseconds.

If you wish to customize this, you can specifiy a custom wait time like so:

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

---

### `x-text`
**예제:** `<span x-text="foo"></span>`

**구조:** `<span x-text="[expression]"`

`x-text` works similarly to `x-bind`, except instead of updating the value of an attribute, it will update the `innerText` of an element.

---

### `x-html`
**예제:** `<span x-html="foo"></span>`

**구조:** `<span x-html="[expression]"`

`x-html` works similarly to `x-bind`, except instead of updating the value of an attribute, it will update the `innerHTML` of an element.

> :warning: **Only use on trusted content and never on user-provided content.** :warning:
>
> Dynamically rendering HTML from third parties can easily lead to [XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) vulnerabilities.

---

### `x-ref`
**예제:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**구조:** `<div x-ref="[ref name]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`

`x-ref` provides a convenient way to retrieve raw DOM elements out of your component. By setting an `x-ref` attribute on an element, you are making it available to all event handlers inside an object called `$refs`.

This is a helpful alternative to setting ids and using `document.querySelector` all over the place.

> Note: you can also bind dynamic values for x-ref: `<span :x-ref="item.id"></span>` if you need to.

---

### `x-if`
**예제:** `<template x-if="true"><div>Some Element</div></template>`

**구조:** `<template x-if="[expression]"><div>Some Element</div></template>`

For cases where `x-show` isn't sufficient (`x-show` sets an element to `display: none` if it's false), `x-if` can be used to  actually remove an element completely from the DOM.

It's important that `x-if` is used on a `<template></template>` tag because Alpine doesn't use a virtual DOM. This implementation allows Alpine to stay rugged and use the real DOM to work its magic.

> Note: `x-if` must have a single element root inside the `<template></template>` tag.

> Note: When using `template` in a `svg` tag, you need to add a [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) that should be run before Alpine.js is initialized.

---

### `x-for`
**예제:**
```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

> Note: the `:key` binding is optional, but HIGHLY recommended.

`x-for` is available for cases when you want to create new DOM nodes for each item in an array. This should appear similar to `v-for` in Vue, with one exception of needing to exist on a `template` tag, and not a regular DOM element.

If you want to access the current index of the iteration, use the following syntax:

```html
<template x-for="(item, index) in items" :key="index">
    <!-- You can also reference "index" inside the iteration if you need. -->
    <div x-text="index"></div>
</template>
```

If you want to access the array object (collection) of the iteration, use the following syntax:

```html
<template x-for="(item, index, collection) in items" :key="index">
    <!-- You can also reference "collection" inside the iteration if you need. -->
    <!-- Current item. -->
    <div x-text="item"></div>
    <!-- Same as above. -->
    <div x-text="collection[index]"></div>
    <!-- Previous item. -->
    <div x-text="collection[index - 1]"></div>
</template>
```

> Note: `x-for` must have a single element root inside of the `<template></template>` tag.

> Note: When using `template` in a `svg` tag, you need to add a [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) that should be run before Alpine.js is initialized.

#### Nesting `x-for`s
You can nest `x-for` loops, but you MUST wrap each loop in an element. For example:

```html
<template x-for="item in items">
    <div>
        <template x-for="subItem in item.subItems">
            <div x-text="subItem"></div>
        </template>
    </div>
</template>
```

#### Iterating over a range

Alpine supports the `i in n` syntax, where `n` is an integer, allowing you to iterate over a fixed range of elements.

```html
<template x-for="i in 10">
    <span x-text="i"></span>
</template>
```

---

### `x-transition`
**예제:**
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

> The example above uses classes from [Tailwind CSS](https://tailwindcss.com).

Alpine offers 6 different transition directives for applying classes to various stages of an element's transition between "hidden" and "shown" states. These directives work both with `x-show` AND `x-if`.

These behave exactly like VueJs's transition directives, except they have different, more sensible names:

| 지침 | 설명 |
| --- | --- |
| `:enter` | Applied during the entire entering phase. |
| `:enter-start` | Added before element is inserted, removed one frame after element is inserted. |
| `:enter-end` | Added one frame after element is inserted (at the same time `enter-start` is removed), removed when transition/animation finishes.
| `:leave` | Applied during the entire leaving phase. |
| `:leave-start` | Added immediately when a leaving transition is triggered, removed after one frame. |
| `:leave-end` | Added one frame after a leaving transition is triggered (at the same time `leave-start` is removed), removed when the transition/animation finishes.

---

### `x-spread`
**예제:**
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

`x-spread` allows you to extract an element's Alpine bindings into a reusable object.

The object keys are the directives (Can be any directive including modifiers), and the values are callbacks to be evaluated by Alpine.

> Note: There are a couple of caveats to x-spread:
> - When the directive being "spread" is `x-for`, you should return a normal expression string from the callback. For example: `['x-for']() { return 'item in items' }`.
> - `x-data` and `x-init` can't be used inside a "spread" object.

---

### `x-cloak`
**예제:** `<div x-data="{}" x-cloak></div>`

`x-cloak` attributes are removed from elements when Alpine initializes. This is useful for hiding pre-initialized DOM. It's typical to add the following global style for this to work:

```html
<style>
    [x-cloak] { display: none; }
</style>
```

### Magic Properties

> With the exception of `$el`, magic properties are **not available within `x-data`** as the component isn't initialized yet.

---

### `$el`
**예제:**
```html
<div x-data>
    <button @click="$el.innerHTML = 'foo'">Replace me with "foo"</button>
</div>
```

`$el` is a magic property that can be used to retrieve the root component DOM node.

### `$refs`
**예제:**
```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

`$refs` is a magic property that can be used to retrieve DOM elements marked with `x-ref` inside the component. This is useful when you need to manually manipulate DOM elements.

---

### `$event`
**예제:**
```html
<input x-on:input="alert($event.target.value)">
```

`$event` is a magic property that can be used within an event listener to retrieve the native browser "Event" object.

> Note: The $event property is only available in DOM expressions.

If you need to access $event inside of a JavaScript function you can pass it in directly:

`<button x-on:click="myFunction($event)"></button>`

---

### `$dispatch`
**예제:**
```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
    <!-- When clicked, will console.log "bar" -->
</div>
```

**Note on Event Propagation**

Notice that, because of [event bubbling](https://en.wikipedia.org/wiki/Event_bubbling), when you need to capture events dispatched from nodes that are under the same nesting hierarchy, you'll need to use the [`.window`](https://github.com/alpinejs/alpine#x-on) modifier:

**예제:**

```html
<div x-data>
    <span @custom-event="console.log($event.detail.foo)"></span>
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
<div>
```

> This won't work because when `custom-event` is dispatched, it'll propagate to its common ancestor, the `div`.

**Dispatching to Components**

You can also take advantage of the previous technique to make your components talk to each other:

**예제:**

```html
<div x-data @custom-event.window="console.log($event.detail)"></div>

<button x-data @click="$dispatch('custom-event', 'Hello World!')">
<!-- When clicked, will console.log "Hello World!". -->
```

`$dispatch` is a shortcut for creating a `CustomEvent` and dispatching it using `.dispatchEvent()` internally. There are lots of good use cases for passing data around and between components using custom events. [Read here](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) for more information on the underlying `CustomEvent` system in browsers.

You will notice that any data passed as the second parameter to `$dispatch('some-event', { some: 'data' })`, becomes available through the new events "detail" property: `$event.detail.some`. Attaching custom event data to the `.detail` property is standard practice for `CustomEvent`s in browsers. [Read here](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail) for more info.

You can also use `$dispatch()` to trigger data updates for `x-model` bindings. For example:

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')">
        <!-- After the button is clicked, `x-model` will catch the bubbling "input" event, and update foo to "baz". -->
    </span>
</div>
```

> Note: The $dispatch property is only available in DOM expressions.

If you need to access $dispatch inside of a JavaScript function you can pass it in directly:

`<button x-on:click="myFunction($dispatch)"></button>`

---

### `$nextTick`
**예제:**
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

`$nextTick` is a magic property that allows you to only execute a given expression AFTER Alpine has made its reactive DOM updates. This is useful for times you want to interact with the DOM state AFTER it's reflected any data updates you've made.

---

### `$watch`
**예제:**
```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```

You can "watch" a component property with the `$watch` magic method. In the above example, when the button is clicked and `open` is changed, the provided callback will fire and `console.log` the new value.

## Security
If you find a security vulnerability, please send an email to [calebporzio@gmail.com]().

Alpine relies on a custom implementation using the `Function` object to evaluate its directives. Despite being more secure then `eval()`, its use is prohibited in some environments, such as Google Chrome App, using restrictive Content Security Policy (CSP).

If you use Alpine in a website dealing with sensitive data and requiring [CSP](https://csp.withgoogle.com/docs/strict-csp.html), you need to include `unsafe-eval` in your policy. A robust policy correctly configured will help protecting your users when using personal or financial data.

Since a policy applies to all scripts in your page, it's important that other external libraries included in the website are carefully reviewed to ensure that they are trustworthy and they won't introduce any Cross Site Scripting vulnerability either using the `eval()` function or manipulating the DOM to inject malicious code in your page.

## V3 Roadmap
* Move from `x-ref` to `ref` for Vue parity?
* Add `Alpine.directive()`
* Add `Alpine.component('foo', {...})` (With magic `__init()` method)
* Dispatch Alpine events for "loaded", "transition-start", etc... ([#299](https://github.com/alpinejs/alpine/pull/299)) ?
* Remove "object" (and array) syntax from `x-bind:class="{ 'foo': true }"` ([#236](https://github.com/alpinejs/alpine/pull/236) to add support for object syntax for the `style` attribute)
* Improve `x-for` mutation reactivity ([#165](https://github.com/alpinejs/alpine/pull/165))
* Add "deep watching" support in V3 ([#294](https://github.com/alpinejs/alpine/pull/294))
* Add `$el` shortcut
* Change `@click.away` to `@click.outside`?

## License

Copyright © 2019-2020 Caleb Porzio and contributors

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
