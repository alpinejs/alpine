# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true)](https://alpinejs.codewithhugo.com/chat/)

O Alpine.js oferece a natureza reativa e declarativa de grandes estruturas, como Vue ou React, a um custo muito menor.

Podemos manter a DOM e abrilhantar o comportamento como acharmos melhor.

Pensem nisso como o [Tailwind](https://tailwindcss.com/) para JavaScript.

> Nota: A sintaxe desta ferramenta é quase totalmente inspirada no [Vue](https://vuejs.org/) (e por extensão [Angular](https://angularjs.org/)). Estou eternamente agradecido pelo presente que estas são para a web.

## Instalação

**No CDN:** Adicionem o seguinte script ao final da seção `<head>`.

```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
```

E é isso. Ele irá se inicializar.

Para ambiente de produção, é recomendável fixar um número de versão específico no link para evitar problemas inesperadas das versões mais recentes.
Por exemplo, para usar a versão `2.3.5`:

```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.3.5/dist/alpine.min.js" defer></script>
```

**No NPM:** Instale o pacote no NPM.

```js
npm i alpinejs
```

Inclua no script.

```js
import 'alpinejs';
```

**Para suportar o IE11** Use os seguintes scripts.

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
```

O padrão acima é o [padrão de módulo/nomodule](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/) que resultará no pacote moderno carregado automaticamente em browsers modernos e o Pacote IE11 carregado automaticamente no IE11 e em outros browsers herdados.

## Usar

_Dropdown/Modal_

```html
<div x-data="{ open: false }">
    <button @click="open = true">Open Dropdown</button>

    <ul x-show="open" @click.away="open = false">
        Corpo do Dropdown
    </ul>
</div>
```

_Tabs_

```html
<div x-data="{ tab: 'foo' }">
    <button :class="{ 'active': tab === 'foo' }" @click="tab = 'foo'">
        Foo
    </button>
    <button :class="{ 'active': tab === 'bar' }" @click="tab = 'bar'">
        Bar
    </button>

    <div x-show="tab === 'foo'">Tab Foo</div>
    <div x-show="tab === 'bar'">Tab Bar</div>
</div>
```

Podemos até usá-lo para coisas não triviais:
_Pré pedido de conteudo para HTML dropdown's ao passar com o rato_

```html
<div x-data="{ open: false }">
    <button
        @mouseenter.once="
            fetch('/dropdown-partial.html')
                .then(response => response.text())
                .then(html => { $refs.dropdown.innerHTML = html })
        "
        @click="open = true"
    >
        Mostrar Dropdown
    </button>

    <div x-ref="dropdown" x-show="open" @click.away="open = false">
        Carregando Spinner...
    </div>
</div>
```

## Aprenda

Existem 14 diretrizes disponíveis:

| Directiva                       | Descrição                                                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [`x-data`](#x-data)             | Declara um novo scope de componente.                                                                                          |
| [`x-init`](#x-init)             | Executa uma expressão quando um componente é inicializado.                                                                    |
| [`x-show`](#x-show)             | Alterna `display: none;` no elemento dependendo da expressão (verdadeiro ou falso).                                           |
| [`x-bind`](#x-bind)             | Define o valor de um atributo para o resultado de uma expressão JS                                                            |
| [`x-on`](#x-on)                 | Anexa um evento de escuta ao elemento. Executa a expressão JS quando emitida.                                                 |
| [`x-model`](#x-model)           | Adiciona "ligação de dados bidirecional" a um elemento. Mantém o elemento de entrada sincronizado com os dados do componente. |
| [`x-text`](#x-text)             | Funciona da mesma forma que o `x-bind`, mas atualiza o`innerText` de um elemento.                                             |
| [`x-html`](#x-html)             | Funciona de maneira semelhante ao `x-bind`, mas atualiza o`innerHTML` de um elemento.                                         |
| [`x-ref`](#x-ref)               | Maneira conveniente de recuperar elementos DOM fora do seu componente.                                                        |
| [`x-if`](#x-if)                 | Remove um elemento completamente do DOM. Precisa ser usado em uma tag `<template>`.                                           |
| [`x-for`](#x-for)               | Crie novos nós DOM para cada item em uma matriz. Precisa ser usado em uma tag `<template>`.                                   |
| [`x-transition`](#x-transition) | Diretrizes para aplicar classes a vários estágios da transição de um elemento                                                 |
| [`x-spread`](#x-spread)         | Permite vincular um objeto de diretivas Alpine a um elemento para melhor reutilização                                         |
| [`x-cloak`](#x-cloak)           | Este atributo é removido quando o Alpine é inicializado. Útil para ocultar a pré-inicialização da DOM .                       |

E 6 propriedades mágicas:

| Propriedades Mágicas     | Descrição                                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| [`$el`](#el)             | Recupere o nó DOM do componente raiz.                                                                            |
| [`$refs`](#refs)         | Recupera elementos DOM marcados com `x-ref` dentro do componente.                                                |
| [`$event`](#event)       | Recupera o objeto "Evento" do browser nativo em um evento que esteja a escuta.                                   |
| [`$dispatch`](#dispatch) | Cria um `CustomEvent` e envio-o usando`.dispatchEvent ()`internamente.                                           |
| [`$nextTick`](#nexttick) | Execute uma determinada expressão APÓS a Alpine fazer suas atualizações reativas do DOM.                         |
| [`$watch`](#watch)       | Disparará um retorno de chamada fornecido quando uma propriedade do componente que está a "escuta" for alterada. |

## Patrocinadores

<img width="33%" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" alt="Tailwind CSS">

**Queres o teu logotipo aqui? [Mensagem no Twitter](https://twitter.com/calebporzio)**

## Colaboradores VIP

<table>
  <tr>
    <td align="center"><a href="http://calebporzio.com"><img src="https://avatars2.githubusercontent.com/u/3670578?v=4" width="100px;" alt="Caleb Porzio"/><br /><sub><b>Caleb Porzio</b></sub></a><br /><sub>(Creator)</sub></td>
    <td align="center"><a href="https://github.com/HugoDF"><img src="https://avatars2.githubusercontent.com/u/6459679?v=4" width="100px;" alt="Hugo"/><br /><sub><b>Hugo</b></sub></a></td>
    <td align="center"><a href="https://github.com/ryangjchandler"><img src="https://avatars2.githubusercontent.com/u/41837763?v=4" width="100px;" alt="Ryan Chandler"/><br /><sub><b>Ryan Chandler</b></sub></a></td>
    <td align="center"><a href="https://github.com/SimoTod"><img src="https://avatars2.githubusercontent.com/u/8427737?v=4" width="100px;" alt="Simone Todaro"/><br /><sub><b>Simone Todaro</b></sub></a></td>
  </tr>
</table>

### Diretivas

---

### `x-data`

**Exemplo:** `<div x-data="{ foo: 'bar' }">...</div>`

**Estrutura:** `<div x-data="[JSON data object]">...</div>`

`x-data` declara um novo scope do componente. Diz à estrutura para inicializar um novo componente com o seguinte objeto de dados.

Pense nisso como a propriedade `data` de um componente Vue.

**Extrair Lógica de Componentes**

Podemos extrair dados (e comportamento) em funções reutilizáveis:

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
            open() {
                this.show = true;
            },
            close() {
                this.show = false;
            },
            isOpen() {
                return this.show === true;
            },
        };
    }
</script>
```

> **Para utilizadores do bundler**, observem que o Alpine.js assede a funções que estão no scope global (`window`), vamos precisar atribuir explicitamente as suas funções à `window` para usá-las com `x- data`, por exemplo `window.dropdown = function () {}` (isso ocorre com Webpack, Rollup, Parcel etc. `function`'s que defenir serão padronizados para o scope do módulo, e não para `window`).

Também podemos misturar vários objetos de dados usando a desestruturação de objetos:

```html
<div x-data="{...dropdown(), ...tabs()}"></div>
```

---

### `x-init`

**Exemplo:** `<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`

**Estrutura:** `<div x-data="..." x-init="[expression]"></div>`

`x-init` executa uma expressão quando um componente é inicializado.

Se desejam executar o código ANTES do Alpine fazer as atualizações iniciais na DOM (algo como um gancho `mounted ()` no VueJS)), podem retornar um callback do `x-init`, e será executado após:

`x-init="() => { // temos acesso ao estado de pós-inicialização aqui // }"`

---

### `x-show`

**Exemplo:** `<div x-show="open"></div>`

**Estrutura:** `<div x-show="[expression]"></div>`

`x-show` alterna o estilo `display: none;` no elemento, dependendo se a expressão for resolvida como`verdadeiro` ou `falso`.

**x-show.transition**

`x-show.transition` é uma API de conveniência para tornar o seu`x-show` mais agradável usando transições CSS.

```html
<div x-show.transition="open">
    Esses conteúdos serão transferidos para dentro e para fora.
</div>
```

| Diretivas                                               | Descrição                                                                                                                                           |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `x-show.transition`                                     | Desvanecer e escala em simultâneos. (opacity, scale: 0.95, timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), duration-in: 150ms, duration-out: 75ms) |
| `x-show.transition.in`                                  | Apenas transição de entrada.                                                                                                                        |
| `x-show.transition.out`                                 | Apenas transição de saida.                                                                                                                          |
| `x-show.transition.opacity`                             | Apenas transição de desvanecer.                                                                                                                     |
| `x-show.transition.scale`                               | Apenas transição de escala.                                                                                                                         |
| `x-show.transition.scale.75`                            | Personalizar a transformação de escala CSS `transform: scale(.75)`.                                                                                 |
| `x-show.transition.duration.200ms`                      | Define a transição "entrada" para 200ms. A saída será ajustada para metade disso (100ms).                                                           |
| `x-show.transition.origin.top.right`                    | Personalizar a origem da transformação CSS `transform-origin: top right`.                                                                           |
| `x-show.transition.in.duration.200ms.out.duration.50ms` | Durações diferentes para "entrada" e "saida".                                                                                                       |

> Nota: Todos esses modificadores de transição podem ser usados em conjunto. Isso é possível (apesar de ridículo: lol): `x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale.95`

> Nota: `x-show` espera que todas os filhos terminem a transição. Se desejam ignorar esse comportamento, adicionem o modificador `.immediate`:

```html
<div x-show.immediate="open">
    <div x-show.transition="open"></div>
</div>
```

---

### `x-bind`

> Nota: Podem usar a sintaxe ":" mais curta: `: type =" ... "`

**Exemplo:** `<input x-bind:type="inputType">`

**Estrutura:** `<input x-bind:[attribute]="[expression]">`

`x-bind` define o valor de um atributo para o resultado de uma expressão JavaScript. A expressão tem acesso a todas as chaves do objeto de dados do componente e será atualizada sempre que seus dados forem atualizados.

> Nota: as ligações de atributo APENAS são atualizadas quando as dependências são atualizadas. A estrutura é inteligente o suficiente para observar alterações nos dados e detectar quais ligações se importam com elas.

**`x-bind` para atributos de classes**

`x-bind` comporta-se de maneira um pouco diferente ao vincular o atributo`class`.

Para classes, passamos um objeto cujas as chaves são nomes de classe e valores são expressões booleanas para determinar se esses nomes de classe são aplicados ou não.

Por exemplo: `<div x-bind:class="{ 'hidden': foo }"></div>`

Neste exemplo, a classe "hidden" será aplicada apenas quando o valor do atributo de dados `foo` for `verdadeiro`.

**`x-bind` para atributos booleanos**

O `x-bind` suporta atributos booleanos da mesma maneira que os atributos de valor, usando uma variável como a condição ou qualquer expressão JavaScript que resolva como `verdadeiro` ou `falso`.

Por exemplo:

```html
<!-- Given: -->
<button x-bind:disabled="myVar">Clique em mim</button>

<!-- When myVar == true: -->
<button disabled="disabled">Clique em mim</button>

<!-- When myVar == false: -->
<button>Clique em mim</button>
```

Isso adicionará ou removerá o atributo `disabled` quando`myVar` for verdadeiro ou falso, respectivamente.

Os atributos booleanos são suportados de acordo com a [especificação HTML](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute), por exemplo `disabled`,`readonly`, `required`, `checked`,`hidden`, `selected`,`open` etc.

**`.camel` modificador**
**Exemplo:** `<svg x-bind:view-box.camel="viewBox">`

O modificador `camel` se ligará ao equivalente em maiúsculas e minúsculas do nome do atributo. No exemplo acima, o valor de `viewBox` será vinculado ao atributo`viewBox` em oposição ao atributo `viewbox`.

---

### `x-on`

> Nota: podem usar a sintaxe "@" mais curta: `@click =" ... "

**Exemplo:** `<button x-on:click="foo = 'bar'"></button>`

**Estrutura:** `<button x-on:[event]="[expression]"></button>`

O `x-on` anexa um evento de escuta ao elemento em que está declarado. Quando esse evento é emitido, a expressão JavaScript definida como seu valor é executada.

Se algum dado for modificado na expressão, outros atributos do elemento "vinculados" a esses dados serão atualizados.

> Nota: Também podem especificar um nome de função JavaScript

**Exemplo:** `<button x-on:click="myFunction"></button>`

Isso é equivalente a: `<button x-on:click="myFunction($event)"></button>`

**`keydown` modificadores**

**Exemplo:** `<input type="text" x-on:keydown.escape="open = false">`

Podemos especificar chaves específicas para escutar usando modificadores de keydown anexados à diretiva `x-on: keydown`. Observem que os modificadores são versões em kebab dos valores do `Event.key`.

Exemplos: `enter`, `escape`, `arrow-up`, `arrow-down`

> Nota: Também podem ouvir a combinações de teclas do sistema como: `x-on:keydown.cmd.enter="foo"`

**`.away` modificador**

**Exemplo:** `<div x-on:click.away="showModal = false"></div>`

Quando o modificador `.away` estiver presente, o manipulador de eventos será executado apenas quando o evento se originar de uma fonte que não seja ela própria ou seus filhos.

Isso é útil para ocultar dropdowns e modals quando um utilizador clicar longe deles.

**`.prevent` modificador**
**Exemplo:** `<input type="checkbox" x-on:click.prevent>`

Adicionar `.prevent` a um evento de escuta ira chamar o ` preventDefault` no evento acionado. No exemplo acima, isso significa que a caixa de seleção não é realmente verificada quando um utilizador clicar nela.

**`.stop` modificador**
**Exemplo:** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

Adicionar `.stop` a um evento de escut ira chamar o ` stopPropagation` no evento acionado. No exemplo acima, isso significa que o evento "click" não borbulha do botão para o exterior `<div>`. Ou seja, quando um utilizador clicar no botão, `foo` não será definido como 'bar'.

**`.self` modificador**
**Exemplo:** `<div x-on:click.self="foo = 'bar'"><button></button></div>`

Adding `.self` to an event listener will only trigger the handler if the `$event.target` is the element itself. In the above example, this means the "click" event that bubbles from the button to the outer `<div>` will **not** run the handler.

**`.window` modificador**
**Exemplo:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

Adding `.window` to an event listener will install the listener on the global window object instead of the DOM node on which it is declared. This is useful for when you want to modify component state when something changes with the window, like the resize event. In this example, when the window grows larger than 768 pixels wide, we will close the modal/dropdown, otherwise maintain the same state.

> Note: You can also use the `.document` modificador to attach listeners to `document` instead of `window`

**`.once` modificador**
**Exemplo:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

Adding the `.once` modificador to an event listener will ensure that the listener will only be handled once. This is useful for things you only want to do once, like fetching HTML partials and such.

**`.passive` modificador**
**Exemplo:** `<button x-on:mousedown.passive="interactive = true"></button>`

Adding the `.passive` modificador to an event listener will make the listener a passive one, which means `preventDefault()` will not work on any events being processed, this can help, for example with scroll performance on touch devices.

**`.debounce` modificador**
**Exemplo:** `<input x-on:input.debounce="fetchSomething()">`

The `debounce` modificador allows you to "debounce" an event handler. In other words, the event handler will NOT run until a certain amount of time has elapsed since the last event that fired. When the handler is ready to be called, the last handler call will execute.

The default debounce "wait" time is 250 milliseconds.

If you wish to customize this, you can specifiy a custom wait time like so:

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

**`.camel` modificador**
**Exemplo:** `<input x-on:event-name.camel="doSomething()">`

The `camel` modificador will attach an event listener for the camel case equivalent event name. In the example above, the expression will be evaluated when the `eventName` event is fired on the element.

---

### `x-model`

**Exemplo:** `<input type="text" x-model="foo">`

**Estrutura:** `<input type="text" x-model="[data item]">`

`x-model` adds "two-way data binding" to an element. In other words, the value of the input element will be kept in sync with the value of the data item of the component.

> Note: `x-model` is smart enough to detect changes on text inputs, checkboxes, radio buttons, textareas, selects, and multiple selects. It should behave [how Vue would](https://vuejs.org/v2/guide/forms.html) in those scenarios.

**`.debounce` modificador**
**Exemplo:** `<input x-model.debounce="search">`

The `debounce` modificador allows you to add a "debounce" to a value update. In other words, the event handler will NOT run until a certain amount of time has elapsed since the last event that fired. When the handler is ready to be called, the last handler call will execute.

The default debounce "wait" time is 250 milliseconds.

If you wish to customize this, you can specifiy a custom wait time like so:

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

---

### `x-text`

**Exemplo:** `<span x-text="foo"></span>`

**Estrutura:** `<span x-text="[expression]"`

`x-text` works similarly to `x-bind`, except instead of updating the value of an attribute, it will update the `innerText` of an element.

---

### `x-html`

**Exemplo:** `<span x-html="foo"></span>`

**Estrutura:** `<span x-html="[expression]"`

`x-html` works similarly to `x-bind`, except instead of updating the value of an attribute, it will update the `innerHTML` of an element.

> :warning: **Only use on trusted content and never on user-provided content.** :warning:
>
> Dynamically rendering HTML from third parties can easily lead to [XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) vulnerabilities.

---

### `x-ref`

**Exemplo:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**Estrutura:** `<div x-ref="[ref name]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`

`x-ref` provides a convenient way to retrieve raw DOM elements out of your component. By setting an `x-ref` attribute on an element, you are making it available to all event handlers inside an object called `$refs`.

This is a helpful alternative to setting ids and using `document.querySelector` all over the place.

> Note: you can also bind dynamic values for x-ref: `<span :x-ref="item.id"></span>` if you need to.

---

### `x-if`

**Exemplo:** `<template x-if="true"><div>Some Element</div></template>`

**Estrutura:** `<template x-if="[expression]"><div>Some Element</div></template>`

For cases where `x-show` isn't sufficient (`x-show` sets an element to `display: none` if it's false), `x-if` can be used to actually remove an element completely from the DOM.

It's important that `x-if` is used on a `<template></template>` tag because Alpine doesn't use a virtual DOM. This implementation allows Alpine to stay rugged and use the real DOM to work its magic.

> Note: `x-if` must have a single element root inside the `<template></template>` tag.

---

### `x-for`

**Exemplo:**

```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

> Nota: a ligação `:key` é opcional, mas ALTAMENTE recomendada.

O `x-for` está disponível para casos em que desejem criar novos nós DOM para cada item em uma matriz. Isso deve parecer semelhante ao `v-for` no Vue, com uma exceção da necessidade de existir em uma tag`template`, e não em um elemento DOM comum.

Se desejam aceder ao índice atual da iteração, use a seguinte sintaxe:

```html
<template x-for="(item, index) in items" :key="index">
    <!-- You can also reference "index" inside the iteration if you need. -->
    <div x-text="index"></div>
</template>
```

> Nota: `x-for` deve ter uma raiz de elemento único dentro da tag`<template> </template>`.

#### Encadeamento de `x-for`s

Podemos ter encadeamento de ciclos `x-for`, mas DEVEM envolver cada ciclo em um elemento. Por exemplo:

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

**Exemplo:**

```html
<div
    x-show="open"
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0 transform scale-90"
    x-transition:enter-end="opacity-100 transform scale-100"
    x-transition:leave="transition ease-in duration-300"
    x-transition:leave-start="opacity-100 transform scale-100"
    x-transition:leave-end="opacity-0 transform scale-90"
>
    ...
</div>
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
    >
        ...
    </div>
</template>
```

> O exemplo acima usa classes de [Tailwind CSS](https://tailwindcss.com)

O Alpine oferece 6 diretivas de transição diferentes para aplicar classes a vários estágios da transição de um elemento entre os estados "oculto" e "mostrado". Essas diretivas funcionam tanto com `x-show` E`x-if`.

Elas se comportam exatamente como as diretivas de transição do VueJs, exceto que têm nomes diferentes e mais sensíveis:

| Directiva      | Descrição                                                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `:enter`       | Aplicado durante toda a fase de entrada.                                                                                                             |
| `:enter-start` | Adicionado antes que o elemento seja inserido, removido um frame após o elemento ser inserido.                                                                       |
| `:enter-end`   | Adicionado um frame após a inserção do elemento (ao mesmo tempo em que o `enter-start` é removido), removido quando a transição/animação termina.                   |
| `:leave`       | Aplicado durante toda a fase de partida.                                                                                                             |
| `:leave-start` | Adicionado imediatamente quando uma transição de saída é acionada, removida após um frame.                                                                   |
| `:leave-end`   | Adicionado um frame depois que uma transição de saída é acionada (ao mesmo tempo em que o `leave-start` é removido), removido quando a transição/animação termina. |

---

### `x-spread`

**Exemplo:**

```html
<div x-data="dropdown()">
    <button x-spread="trigger">Dropdown Aberto</button>

    <span x-spread="dialogue">Conteúdo da Dropdown</span>
</div>

<script>
    function dropdown() {
        return {
            open: false,
            trigger: {
                ['@click']() {
                    this.open = true;
                },
            },
            dialogue: {
                ['x-show']() {
                    return this.open;
                },
                ['@click.away']() {
                    this.open = false;
                },
            },
        };
    }
</script>
```

O `x-spread` permite extrair as ligações de um elemento Alpine em um objeto reutilizável.

As chaves do objeto são as diretivas (pode ser qualquer diretiva, incluindo modificadores), e os valores são chamadas de retorno a serem avaliados pelo Alpine.

> Nota: A única anomalia com propagação x é quando usada com `x-for`. Quando a diretiva "spread" é `x-for`, devemos retornar uma string de expressão normal a partir da chamada de retorno. Por exemplo: `['x-for'] () {return 'item in items'}`.
---

### `x-cloak`

**Exemplo:** `<div x-data="{}" x-cloak></div>`

Os atributos `x-cloak` são removidos dos elementos quando o Alpine é inicializado. Isso é útil para ocultar o DOM pré-inicializado. É típico adicionar o seguinte estilo global para que isso funcione:

```html
<style>
    [x-cloak] {
        display: none;
    }
</style>
```

### Propriedades Mágicas

> Com exceção de `$el`, as propriedades mágicas **não estão disponíveis no` x-data`**, pois o componente ainda não foi inicializado.
---

### `$el`

**Exemplo:**

```html
<div x-data>
    <button @click="$el.innerHTML = 'foo'">Replace me with "foo"</button>
</div>
```

`$el` é uma propriedade mágica que pode ser usada para recuperar o nó DOM do componente raiz.

### `$refs`

**Exemplo:**

```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

`$refs` é uma propriedade mágica que pode ser usada para recuperar elementos DOM marcados com `x-ref` dentro do componente. Isso é útil quando precisamos manipular manualmente os elementos do DOM.

---

### `$event`

**Exemplo:**

```html
<input x-on:input="alert($event.target.value)" />
```

`$event` é uma propriedade mágica que pode ser usada dentro de um evento de escuta para recuperar o objeto "Event" do browser nativo.

> Nota: A propriedade $event está disponível apenas nas expressões DOM.

Se precisarem aceder ao $event dentro de uma função JavaScript, podem passá-lo diretamente:

`<button x-on:click="myFunction($event)"></button>`

---

### `$dispatch`

**Exemplo:**

```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
    <!-- Quando clicado, console.log "bar" ->
</div>
```

**Nota sobre a propagação de eventos**

Observem que, devido a [evento com bolhas](https://en.wikipedia.org/wiki/Event_bubbling), quando precisam capturar eventos enviados por nós que estão sob a mesma hierarquia de aninhamento, usem o [`.window`](https://github.com/alpinejs/alpine#x-on) modificador:

**Exemplo:**

```html
<div x-data>
    <span @custom-event="console.log($event.detail.foo)"></span>
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
        <div></div>
    </button>
</div>
```

> Isso não vai funcionar porque, quando o `custom-event` for executado, ele será propagado para seu ancestral comum, a `div`.

**Expedição para componentes**

Também podemos tirar proveito da técnica anterior para fazer os componentes comunicarem entre si:

**Exemplo:**

```html
<div x-data @custom-event.window="console.log($event.detail)"></div>

<button x-data @click="$dispatch('custom-event', 'Olá Mundo!')">
    <!-- Quando clicado, o console.log "Olá Mundo!". -->
</button>
```

`$dispatch` é um atalho para criar um`CustomEvent` e enviá-lo internamente usando `.dispatchEvent ()`. Existem muitos casos de uso bons para transmitir dados entre componentes usando eventos personalizados. [Leia aqui](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) para obter mais informações sobre o sistema subjacente `CustomEvent` nos browsers.

Notarão que todos os dados passados como o segundo parâmetro para `$dispatch('some-event', {some: 'data'})` ficam disponíveis através da nova propriedade "detail" de eventos: `$event.detail.some`. Anexar dados de eventos personalizados à propriedade `.detail` é uma prática padrão para o `CustomEvent`s nos browsers. [Leia aqui](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail) para obter mais informações.

Também podemos usar `$dispatch()` para acionar atualizações de dados para ligações `x-model`. Por exemplo:

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')">
        <!-- Depois que o botão é clicado, o `x-model` irá capturar o evento "input" e atualizar foo para "baz". -->
    </span>
</div>
```

> Nota: A propriedade $dispatch está disponível apenas nas expressões DOM.

Se precisarem aceder ao $dispatch dentro de uma função JavaScript, poderão transmiti-la diretamente:

`<button x-on:click="myFunction($dispatch)"></button>`

---

### `$nextTick`

**Exemplo:**

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

`$ nextTick` é uma propriedade mágica que permite executar apenas uma determinada expressão APÓS o Alpine fazer suas atualizações a DOM. Isso é útil nos momentos em que desejam interagir com o estado da DOM, após refletir as atualizações de dados que fizemos.

---

### `$watch`

**Exemplo:**

```html
<div
    x-data="{ open: false }"
    x-init="$watch('open', value => console.log(value))"
>
    <button @click="open = ! open">Alternar Abrir</button>
</div>
```

Podemos "assistir" uma propriedade de componente com o método mágico `$watch`. No exemplo acima, quando o botão é clicado e o valor do `open` é alterado, a chamada de retorno fornecida é executada e o novo valor mostrado num `console.log`.

## Segurança

Se encontrarem uma vulnerabilidade de segurança, envie um email para [calebporzio@gmail.com](mailto:calebporzio@gmail.com)

O Alpine conta com uma implementação personalizada usando o objeto `Function` para avaliar suas diretivas. Apesar de ser mais seguro que o `eval()`, o seu uso é proibido em alguns ambientes, como o Google Chrome App, usando a Política de Segurança de Conteúdo restritiva (CSP).

Se usam o Alpine em um site que lida com dados confidenciais e exige [CSP](https://csp.withgoogle.com/docs/strict-csp.html), precisam incluir `unsafe-eval` na sua política. Uma política robusta configurada corretamente ajudará a proteger seus utilizadores ao usar dados pessoais ou financeiros.

Como uma política se aplica a todos os scripts da sua página, é importante que outras bibliotecas externas incluídas no site estejam cuidadosamente revisadas para garantir que sejam confiáveis e não apresentem nenhuma vulnerabilidade de Cross Site Scripting usando a função `eval()` ou manipular o DOM para injetar código malicioso na sua página.

## Licença

Copyright © 2019-2020 Caleb Porzio e colaboradores

Licenciado sob a licença MIT, consulte [LICENSE.md](LICENSE.md) para obter detalhes.
