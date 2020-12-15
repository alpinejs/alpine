# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true)](https://alpinejs.codewithhugo.com/chat/)

O Alpine.js oferece a natureza reativa e declarativa de grandes estruturas, como Vue ou React, a um custo muito menor.

Podemos manter a DOM e aperfeiçoar o comportamento como acharmos melhor.

Pensem nisso como o [Tailwind](https://tailwindcss.com/) para JavaScript.

> Nota: A sintaxe desta ferramenta é quase totalmente inspirada no [Vue](https://vuejs.org/) (e por extensão [Angular](https://angularjs.org/)). Estou eternamente agradecido pelo presente que estas são para a web.

## Instalação

**Via CDN:** Adicionem o seguinte script no final da seção `<head>`.

```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
```

E é isso. Ele vai se inicializar.

Para ambiente de produção, é recomendado fixar o número da versão específico no link para evitar problemas inesperadas das versões mais recentes.
Por exemplo, para usar a versão `2.8.0`:

```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.0/dist/alpine.min.js" defer></script>
```

**Via npm:** Instale o pacote pelo npm.

```js
npm i alpinejs
```

Incluir no script.

```js
import 'alpinejs';
```

**Para suportar IE11** Usar os seguintes scripts.

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
```

O padrão acima é o [padrão de módulo/nomodule](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/) que resulta num pacote moderno carregado automaticamente em browsers modernos e o pacote IE11 carregado automaticamente no IE11 e em outros browsers herdados.

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
_Pré pedido de conteudo para o HTML da dropdown ao passar com o rato_.

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
| [`x-data`](#x-data)             | Declara um novo scope do componente.                                                                                          |
| [`x-init`](#x-init)             | Executa uma expressão quando um componente é inicializado.                                                                    |
| [`x-show`](#x-show)             | Alterna `display: none;` no elemento dependendo da expressão (verdadeiro ou falso).                                           |
| [`x-bind`](#x-bind)             | Define o valor de um atributo para o resultado de uma expressão JS.                                                            |
| [`x-on`](#x-on)                 | Anexa um evento de escuta ao elemento. Executa a expressão JS quando emitida.                                                 |
| [`x-model`](#x-model)           | Adiciona "ligação de dados bidirecional" a um elemento. Mantém o elemento de entrada sincronizado com os dados do componente. |
| [`x-text`](#x-text)             | Funciona da mesma forma que o `x-bind`, mas atualiza o `innerText` de um elemento.                                             |
| [`x-html`](#x-html)             | Funciona de maneira semelhante ao `x-bind`, mas atualiza o `innerHTML` de um elemento.                                         |
| [`x-ref`](#x-ref)               | Maneira conveniente de recuperar elementos DOM fora do seu componente.                                                        |
| [`x-if`](#x-if)                 | Remove um elemento completamente na DOM. Precisa de usar uma tag `<template>`.                                           |
| [`x-for`](#x-for)               | Crie novos nós DOM para cada item em uma matriz. Precisa de usar uma tag `<template>`.                                   |
| [`x-transition`](#x-transition) | Diretrizes para aplicar classes a vários estágios da transição de um elemento.                                                 |
| [`x-spread`](#x-spread)         | Permite definir um objeto de diretivas Alpine, a um elemento para melhor reutilização.                                         |
| [`x-cloak`](#x-cloak)           | Este atributo é removido quando o Alpine é inicializado. Útil para ocultar a pré-inicialização da DOM.                       |

E 6 propriedades mágicas:

| Propriedades Mágicas     | Descrição                                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| [`$el`](#el)             | Recupere o nó DOM do componente raiz.                                                                            |
| [`$refs`](#refs)         | Recupera elementos DOM marcados com `x-ref` dentro do componente.                                                |
| [`$event`](#event)       | Recupera o objeto "Evento" do browser nativo em um evento que estejamos a escuta.                                   |
| [`$dispatch`](#dispatch) | Cria um `CustomEvent` e envio-o usando `.dispatchEvent ()` internamente.                                           |
| [`$nextTick`](#nexttick) | Execute uma determinada expressão APÓS o Alpine fazer suas atualizações reativas na DOM.                         |
| [`$watch`](#watch)       | Disparará um callback fornecida quando uma propriedade do componente que está a "escuta" for alterada. |

## Patrocinadores

<img width="33%" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" alt="Tailwind CSS">

**Queres o teu logótipo aqui? [Mensagem pelo Twitter](https://twitter.com/calebporzio)**

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

**Estrutura:** `<div x-data="[object literal]">...</div>`

`x-data` declara um novo scope do componente. Diz à estrutura para inicializar um novo componente com o seguinte objeto de dados.

Pensem nisso como a propriedade `data` de um componente Vue.

**Extrair Lógica dos Componentes**

Podemos extrair dados (e comportamentos) em funções reutilizáveis:

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

> **Para utilizadores do bundler**, observem que o Alpine.js assede a funções que estão no scope global (`window`), vamos necessitar atribuir explicitamente as suas funções à `window` para usá-las com `x- data`, por exemplo `window.dropdown = function () {}` (isso ocorre com Webpack, Rollup, Parcel etc. `function`'s que defenir serão padronizados para o scope do módulo, e não para `window`).

Também podemos misturar vários objetos de dados usando a desestruturação de objetos:

```html
<div x-data="{...dropdown(), ...tabs()}"></div>
```

---

### `x-init`

**Exemplo:** `<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`

**Estrutura:** `<div x-data="..." x-init="[expressão]"></div>`

`x-init` executa uma expressão quando um componente é inicializado.

Caso desejem executar o código ANTES do Alpine fazer as atualizações iniciais na DOM (algo como um gancho `mounted ()` no VueJS), podemos retornar um callback do `x-init`, e é executado após:

`x-init="() => { // temos acesso ao estado de pós-inicialização aqui // }"`

---

### `x-show`

**Exemplo:** `<div x-show="open"></div>`

**Estrutura:** `<div x-show="[expressão]"></div>`

`x-show` alterna o estilo `display: none;` no elemento, dependendo se a expressão for resolvida como `verdadeiro` ou `falso`.

**x-show.transition**

`x-show.transition` é uma API de conveniência para tornar o seu `x-show` mais agradável usando transições CSS.

```html
<div x-show.transition="open">
    Esses conteúdos serão transferidos para dentro e para fora.
</div>
```

| Diretivas                                               | Descrição                                                                                                                                           |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `x-show.transition`                                     | Desvanecer e escala em simultâneos. (opacity, scale: 0.95, timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), duration-in: 150ms, duration-out: 75ms) |
| `x-show.transition.in`                                  | Apenas transição de entrada.                                                                                                                        |
| `x-show.transition.out`                                 | Apenas transição de saída.                                                                                                                          |
| `x-show.transition.opacity`                             | Apenas transição de desvanecer.                                                                                                                     |
| `x-show.transition.scale`                               | Apenas transição de escala.                                                                                                                         |
| `x-show.transition.scale.75`                            | Personalizar a transformação de escala CSS `transform: scale(.75)`.                                                                                 |
| `x-show.transition.duration.200ms`                      | Define a transição "entrada" para 200ms. A saída é ajustada para metade disso (100ms).                                                           |
| `x-show.transition.origin.top.right`                    | Personalizar a origem da transformação CSS `transform-origin: top right`.                                                                           |
| `x-show.transition.in.duration.200ms.out.duration.50ms` | Durações diferentes para "entrada" e "saída".                                                                                                       |

> Nota: Todos esses modificadores de transição podem ser usados em conjunto. Isso é possível (apesar de não fazer sentido): `x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale.95`

> Nota: `x-show` espera que todas os filhos terminem a transição. Caso desejem ignorar esse comportamento, adicionem o modificador `.immediate`:

```html
<div x-show.immediate="open">
    <div x-show.transition="open"></div>
</div>
```

---

### `x-bind`

> Nota: Podemos usar uma sintaxe ":" mais curta: `:type =" ... "`

**Exemplo:** `<input x-bind:type="inputType">`

**Estrutura:** `<input x-bind:[attribute]="[expressão]">`

`x-bind` define o valor de um atributo para o resultado de uma expressão JavaScript. A expressão tem acesso a todas as chaves do objeto de dados do componente e é atualizada sempre que os dados forem atualizados.

> Nota: as ligações de atributo APENAS são atualizadas quando as dependências são atualizadas. A estrutura é inteligente o suficiente para observar alterações nos dados e detectar quais ligações se importam com elas.

**`x-bind` para atributos de classes**

`x-bind` comporta-se de maneira um pouco diferente ao definir o atributo`class`.

Para classes, passamos um objeto cujas as chaves são nomes de classe e valores são expressões booleanas para determinar se esses nomes de classe são aplicados ou não.

Por exemplo: `<div x-bind:class="{ 'hidden': foo }"></div>`

Neste exemplo, a classe "hidden" é aplicada apenas quando o valor do atributo de dados `foo` for `verdadeiro`.

**`x-bind` para atributos booleanos**

O `x-bind` suporta atributos booleanos da mesma maneira que os atributos de valor, usando uma variável como a condição ou qualquer expressão JavaScript que resolva como `verdadeiro` ou `falso`.

Por exemplo:

```html
<!-- Given: -->
<button x-bind:disabled="myVar">Clique em mim</button>

<!-- Quando myVar == true: -->
<button disabled="disabled">Clique em mim</button>

<!-- Quando myVar == false: -->
<button>Clique em mim</button>
```

Isso adicionará ou removerá o atributo `disabled` quando`myVar` for verdadeiro ou falso, respectivamente.

Os atributos booleanos são suportados de acordo com a [especificação HTML](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute), por exemplo `disabled`,`readonly`, `required`, `checked`,`hidden`, `selected`,`open` etc.

**`.camel` modificador**
**Exemplo:** `<svg x-bind:view-box.camel="viewBox">`

O modificador `camel` se ligará ao equivalente em maiúsculas e minúsculas do nome do atributo. No exemplo acima, o valor de `viewBox` é definido ao atributo`viewBox` em oposição ao atributo `viewbox`.

---

### `x-on`

> Nota: podemos usar a sintaxe "@" mais curta: `@click =" ... "

**Exemplo:** `<button x-on:click="foo = 'bar'"></button>`

**Estrutura:** `<button x-on:[event]="[expressão]"></button>`

O `x-on` anexa um evento de escuta ao elemento em que está declarado. Quando esse evento é emitido, a expressão JavaScript definida como seu valor é executada.

Caso algum dado for modificado na expressão, outros atributos do elemento "definidos" a esses dados serão atualizados.

> Nota: Também podemos especificar um nome de função JavaScript

**Exemplo:** `<button x-on:click="myFunction"></button>`

O equivalente é: `<button x-on:click="myFunction($event)"></button>`

**`keydown` modificadores**

**Exemplo:** `<input type="text" x-on:keydown.escape="open = false">`

Podemos especificar chaves específicas para escutar usando modificadores de keydown anexados à diretiva `x-on: keydown`. Observem que os modificadores são versões em kebab dos valores do `Event.key`.

Exemplos: `enter`, `escape`, `arrow-up`, `arrow-down`

> Nota: Também podemos ouvir a combinações de teclas do sistema como: `x-on:keydown.cmd.enter="foo"`.

**`.away` modificador**

**Exemplo:** `<div x-on:click.away="showModal = false"></div>`

Quando o modificador `.away` estiver presente, o evento handler é executado apenas quando o evento se originar de uma fonte que não seja ela própria ou seus filhos.

Isso é útil para ocultar dropdowns e modals quando um utilizador clicar longe deles.

**`.prevent` modificador**
**Exemplo:** `<input type="checkbox" x-on:click.prevent>`

Adicionar `.prevent` a um evento de escuta ira chamar o ` preventDefault` no evento acionado. No exemplo acima, isso significa que a caixa de seleção não é realmente verificada quando um utilizador clicar nela.

**`.stop` modificador**
**Exemplo:** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

Adicionar `.stop` a um evento de escuta ira chamar o ` stopPropagation` no evento acionado. No exemplo acima, isso significa que o evento "click" não borbulha do botão para o exterior `<div>`. Ou seja, quando um utilizador clicar no botão, `foo` não é definido como 'bar'.

**`.self` modificador**
**Exemplo:** `<div x-on:click.self="foo = 'bar'"><button></button></div>`

Adicionar `.self` a um evento de escuta só vai acionar o handler quando o `$event.target` for o próprio elemento. No exemplo acima, isso significa que o evento "click" que borbulha do botão para a `<div>` externo **não** executa o handler.

**`.window` modificador**
**Exemplo:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

Adicionar `.window` a um evento de escuta instalará a escutas no objeto na window global em vez do nó DOM no qual está declarado. Isso é útil para quando desejamos modificar o estado do componente quando algo muda com a window, como o evento de redimensionamento. Neste exemplo, quando a janela tiver mais de 768 pixels de largura, fechamos a modal/dropdown, caso contrário, manteremos o mesmo estado.

> Nota: Também podemos usar o modificador `.document` para anexar escutas ao` document` em vez de `window`

**`.once` modificador**
**Exemplo:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

Adicionar o modificador `.once` a um evento de escuta vai garantir que a escuta seja tratado apenas uma vez. Isso é útil para coisas que desejamos fazer apenas uma vez, como ir procurar parciais HTML e outras coisas.

**`.passive` modificador**
**Exemplo:** `<button x-on:mousedown.passive="interactive = true"></button>`

Adicionar o modificador `.passive` a um evento de escuta fará com que a escuta seja passiva, o que significa que o `preventDefault()` não vai funcionar em nenhum evento sendo processado, isso pode ajudar, por exemplo, com o desempenho do scroll em dispositivos touch.

**`.debounce` modificador**
**Exemplo:** `<input x-on:input.debounce="fetchSomething()">`

O modificador `debounce` permite fazer "debounce" a um evento handler. Em outras palavras, o evento handler NÃO será executado até que tenha decorrido um certo tempo desde o último evento que foi disparado. Quando o handler estiver pronto para ser chamado, a última chamada do handler será executada.

O tempo de espera de debounce padrão é de 250 milissegundos.

Caso desejem personalizar isso, pode especificar um tempo de espera personalizado da seguinte maneira:

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

**`.camel` modificador**
**Exemplo:** `<input x-on:event-name.camel="doSomething()">`

O modificador `camel` anexa um evento de escuta ao nome em camel case do evento equivalente. No exemplo acima, a expressão é avaliada quando o evento `eventName` for disparado no elemento.

---

### `x-model`

**Exemplo:** `<input type="text" x-model="foo">`

**Estrutura:** `<input type="text" x-model="[data item]">`

O `x-model` adiciona "ligação de dados bidirecional" a um elemento. Em outras palavras, o valor do elemento de entrada é mantido sincronizado com o valor do item de dados do componente.

> Nota: `x-model` é inteligente o suficiente para detectar alterações nos inputs, checkboxes, radio buttons, textareas, selects e multiplo selects. Devem comportar-se [como o Vue] (https://vuejs.org/v2/guide/forms.html) nesses casos.

**`.debounce` modificador**
**Exemplo:** `<input x-model.debounce="search">`

O modificador `debounce` permite adicionar um "debounce" a uma atualização de valor. Em outras palavras, o evento handler NÃO é executado até que tenha decorrido um certo tempo desde o último evento que foi disparado. Quando o handler estiver pronto para ser chamado, a última chamada do handler é executada.

O tempo de espera de debounce padrão é de 250 milissegundos.

Caso desejem personalizar isso, pode especificar um tempo de espera personalizado da seguinte maneira:

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

---

### `x-text`

**Exemplo:** `<span x-text="foo"></span>`

**Estrutura:** `<span x-text="[expressão]"`

O `x-text` funciona da mesma forma que o` x-bind`, exceto que, em vez de atualizar o valor de um atributo, ele atualiza o `innerText` de um elemento.

---

### `x-html`

**Exemplo:** `<span x-html="foo"></span>`

**Estrutura:** `<span x-html="[expressão]"`

O `x-html` funciona de maneira semelhante ao` x-bind`, exceto que, em vez de atualizar o valor de um atributo, ele atualiza o `innerHTML` de um elemento.

> :warning: **Usar apenas em conteúdo de confiança e nunca em conteúdo fornecido pelo utilizador.** :warning:
>
> A renderização dinâmica do HTML de terceiros pode levar facilmente às vulnerabilidades de [XSS] (https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting).
---

### `x-ref`

**Exemplo:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**Estrutura:** `<div x-ref="[ref name]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`

O `x-ref` fornece uma maneira conveniente de recuperar elementos DOM fora do seu componente. Ao definir um atributo `x-ref` em um elemento, torna-o disponível para todos os eventos handlers dentro de um objeto chamando `$refs`.

Esta é uma alternativa útil para definir ID's e usar o `document.querySelector` em todo o lago.

> Nota: também podemos definir valores dinâmicos no x-ref: `<span: x-ref =" item.id "> </span>` se necessário.

---

### `x-if`

**Exemplo:** `<template x-if="true"><div>Algum elemento</div></template>`

**Estrutura:** `<template x-if="[expressão]"><div>Algum elemento</div></template>`

Nos casos em que `x-show` não é suficiente (`x-show` define um elemento para `display: none` se for falso),`x-if` pode ser usado para remover um elemento completamente na DOM.

É importante que o `x-if` seja usado em uma tag `<template> </template>` porque o Alpine não usa um DOM virtual. Essa implementação permite que o Alpine permaneça robusto e use o DOM real para fazer sua mágia.

> Nota: `x-if` deve ter uma raiz de elemento único dentro da tag` <template> </template> `.

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

Caso desejem aceder ao índice atual da iteração, usem a seguinte sintaxe:

```html
<template x-for="(item, index) in items" :key="index">
    <!-- You can also reference "index" inside the iteration if you need. -->
    <div x-text="index"></div>
</template>
```

> Nota: `x-for` deve ter uma raiz de elemento único dentro da tag`<template> </template>`.

#### Encadeamento de `x-for`s

Podemos ter encadeamento de ciclos `x-for`, mas DEVEMOS envolver cada ciclo em um elemento. Por exemplo:

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

> O exemplo acima usa classes de [Tailwind CSS](https://tailwindcss.com).

Alpine oferece 6 diretivas de transição diferentes para aplicar classes a vários estágios da transição de um elemento entre os estados "oculto" e "mostrado". Essas diretivas funcionam tanto com `x-show` E`x-if`.

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

As chaves do objeto são as diretivas (pode ser qualquer diretiva, incluindo modificadores), e os valores são callback's a serem avaliados pelo Alpine.

> Nota: A única anomalia com propagação x é quando usada com `x-for`. Quando a diretiva "spread" é `x-for`, devemos retornar uma string de expressão normal a partir de um callback. Por exemplo: `['x-for'] () {return 'item in items'}`.
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
    <button @click="$el.innerHTML = 'foo'">Substitua-me por "foo"</button>
</div>
```

`$el` é uma propriedade mágica que pode ser usada para recuperar o nó DOM do componente raiz.

### `$refs`

**Exemplo:**

```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

`$refs` é uma propriedade mágica que pode ser usada para recuperar elementos DOM marcados com `x-ref` dentro do componente. Isso é útil quando necessitamos manipular manualmente os elementos na DOM.

---

### `$event`

**Exemplo:**

```html
<input x-on:input="alert($event.target.value)" />
```

`$event` é uma propriedade mágica que pode ser usada dentro de um evento de escuta para recuperar o objeto "Event" do browser nativo.

> Nota: A propriedade $event está disponível apenas nas expressões DOM.

Caso necessitem aceder ao $event dentro de uma função JavaScript, podemos passa-lo diretamente:

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

Observem que, devido ao [evento com bolhas](https://en.wikipedia.org/wiki/Event_bubbling), quando for preciso capturar eventos enviados pelos nós que estão sob a mesma hierarquia de encadeamento, usem o modificador [`.window`](https://github.com/alpinejs/alpine#x-on):

**Exemplo:**

```html
<div x-data>
    <span @custom-event="console.log($event.detail.foo)"></span>
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
        <div></div>
    </button>
</div>
```

> Isso não vai funcionar porque, quando o `custom-event` for executado, ele é propagado para seu ancestral comum, a `div`.

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

Caso necessitem aceder ao $dispatch dentro de uma função JavaScript, poderão transmiti-la diretamente:

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

Podemos "assistir" uma propriedade de componente com o método mágico `$watch`. No exemplo acima, quando o botão é clicado e o valor do `open` é alterado, e o callback fornecida é executada e o novo valor mostrado num `console.log`.

## Segurança

Caso encontrarem uma vulnerabilidade de segurança, envie um email para [calebporzio@gmail.com](mailto:calebporzio@gmail.com).

O Alpine conta com uma implementação personalizada usando o objeto `Function` para avaliar suas diretivas. Apesar de ser mais seguro que o `eval()`, o seu uso é proibido em alguns ambientes, como o Google Chrome App, usando a Política de Segurança de Conteúdo restritiva (CSP).

Caso usem o Alpine em uma página web que lida com dados confidenciais e exige [CSP](https://csp.withgoogle.com/docs/strict-csp.html), necessitam incluir `unsafe-eval` na sua política. Uma política robusta configurada corretamente ajudará a proteger os utilizadores ao usar dados pessoais ou financeiros.

Como uma política se aplica a todos os scripts da sua página, é importante que outras bibliotecas externas incluídas na página web estejam cuidadosamente revisadas para garantir que sejam confiáveis e não apresentem nenhuma vulnerabilidade de Cross Site Scripting usando a função `eval()` ou manipular o DOM para injetar código malicioso na sua página.

## Licença

Copyright © 2019-2020 Caleb Porzio e colaboradores

Licenciado sob a licença MIT, consulte [LICENSE.md](LICENSE.md) para obter detalhes.
