# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true)](https://alpinejs.codewithhugo.com/chat/)

Alpine.js ofrece las propiedades reactivas y declarativas de grandes *frameworks* como Vue o React con un coste mucho menor.

Mantiene el DOM, pudiendo mejorar y perfeccionar el comportamiento como más convenga.

Podríamos considerarlo como un [Tailwind](https://tailwindcss.com/) para JavaScript.

> Nota: La sintaxis de esta herramienta está mayormente inspirada por [Vue](https://vuejs.org/) (y por extensión, de [Angular](https://angularjs.org/))). Estaré agradecido eternamente por lo que han aportado al desarrollo web.

## Instalación

**Desde CDN:** Añade el siguiente script al final de tu sección `<head>`.
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
```

Eso es todo. Se inicializará solo.

Para entornos de producción, se recomienda especificar una número de versión en concreto en el enlace para evitar comportamientos inesperados que puedan romper las nuevas versiones. Por ejemplo, para usar la versión `2.8.2` (la última):
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.2/dist/alpine.min.js" defer></script>
```

**Desde npm:** Instalar el paquete desde npm.
```js
npm i alpinejs
```

Incluir en tu script.
```js
import 'alpinejs'
```

**Para soporte en IE11** Utilizar los siguientes scripts.
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
```

El patrón de arriba es el [module/nomodule pattern](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/), que resultará en un empaquetado moderno cargado automáticamente en navegadores modernos, y el empaquetado para IE11 cargado automáticamente en IE11 y otros navegadores de legado.

## Usar

*Desplegable/Modal*
```html
<div x-data="{ open: false }">
    <button @click="open = true">Abrir Desplegable</button>

    <ul
        x-show="open"
        @click.away="open = false"
    >
        Cuerpo del Desplegable
    </ul>
</div>
```

*Pestañas*
```html
<div x-data="{ tab: 'foo' }">
    <button :class="{ 'active': tab === 'foo' }" @click="tab = 'foo'">Foo</button>
    <button :class="{ 'active': tab === 'bar' }" @click="tab = 'bar'">Bar</button>

    <div x-show="tab === 'foo'">Pestaña Foo</div>
    <div x-show="tab === 'bar'">Pestaña Bar</div>
</div>
```

También se puede utilizar para fines no-triviales:
*Pre-fetching del contenido de un desplegable HTML al pasar el cursor por encima*
```html
<div x-data="{ open: false }">
    <button
        @mouseenter.once="
            fetch('/dropdown-partial.html')
                .then(response => response.text())
                .then(html => { $refs.dropdown.innerHTML = html })
        "
        @click="open = true"
    >Mostrar Desplegable</button>

    <div x-ref="dropdown" x-show="open" @click.away="open = false">
        Cargando Ruleta...
    </div>
</div>
```

## Aprender

Hay 14 directivas disponibles:

| Directiva | Descripción |
| --- | --- |
| [`x-data`](#x-data) | Declara un nuevo *scope* del componente. |
| [`x-init`](#x-init) | Ejecuta una expresión cuando un componente se inicializa. |
| [`x-show`](#x-show) | Alterna `display: none;` en el elemento dependiendo de la expresión booleana (true o false). |
| [`x-bind`](#x-bind) | Asigna el valor de un atributo a partir de el resultado de una expresión de JS. |
| [`x-on`](#x-on) | Adjunta un evento *listener* al elemento. Ejecuta una expresión de JS cuando se emite el evento. |
| [`x-model`](#x-model) | Añade *"two-way data binding"* al elemento. Mantiene la entrada del elemento sincronizado con los datos del componente. |
| [`x-text`](#x-text) | Funciona similar a `x-bind`, pero actualiza el `innerText` del elemento. |
| [`x-html`](#x-html) | Funciona similar a `x-bind`, pero actualiza el `innerHTML` del elemento. |
| [`x-ref`](#x-ref) | Forma conveniente de extraer elementos crudos del DOM del componente. |
| [`x-if`](#x-if) | Elimina totalmente un elemento del DOM. Debe ser utilizado en una etiqueta `<template>`. |
| [`x-for`](#x-for) | Crea nuevos nodos en el DOM por cada elemento en un arreglo. Debe ser utilizado en una etiqueta `<template>`. |
| [`x-transition`](#x-transition) | Directivas para aplicar clases a varias etapas de la transición del elemento. |
| [`x-spread`](#x-spread) | Permite hacer *bind* de un objeto de las directivas de Alpine a un elemento para mejor reusabilidad. |
| [`x-cloak`](#x-cloak) | Este atributo se elimina cuando Alpine se inicializa. Útil para ocultar el DOM pre-inicializado. |

Y 6 propiedades mágicas:

| Propiedades Mágicas | Descripción |
| --- | --- |
| [`$el`](#el) | Extrae el componente raíz de un nodo del DOM. |
| [`$refs`](#refs) | Extrae elementos del DOM marcados con `x-ref` dentro del componente. |
| [`$event`](#event) | Extrae el objeto "Event" del navegador nativo de dentro de un evento *listener*. |
| [`$dispatch`](#dispatch) | Crea un `CustomEvent` y hace *dispatch* utilizando `.dispatchEvent()` internamente. |
| [`$nextTick`](#nexttick) | Ejecuta la expresión dada DESPUÉS que Alpine ha hecho los cambios reactivos en las actualizaciones del DOM. |
| [`$watch`](#watch) | Ejecuta la *callback* provista cuando una propiedad del componente al cual se ha hecho `watch` cambia. |


## Sponsors

<img width="33%" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" alt="Tailwind CSS">

**¿Quieres tu logo aquí? [Escríbe MP en Twitter](https://twitter.com/calebporzio)**

## Proyectos de la Comunidad

* [AlpineJS Weekly Newsletter](https://alpinejs.codewithhugo.com/newsletter/)
* [Spruce (State Management)](https://github.com/ryangjchandler/spruce)
* [Turbolinks Adapter](https://github.com/SimoTod/alpine-turbolinks-adapter)
* [Alpine Magic Helpers](https://github.com/KevinBatdorf/alpine-magic-helpers)
* [Awesome Alpine](https://github.com/ryangjchandler/awesome-alpine)

### Directivas

---

### `x-data`

**Ejemplo:** `<div x-data="{ foo: 'bar' }">...</div>`

**Estructura:** `<div x-data="[object literal]">...</div>`

`x-data` declara un nuevo *scope* del componente. Indica al *framework* que debe inicializar un nuevo componente con el objeto especificado.

Es análogo a la propiedad `data` de un componente en Vue.

**Extraer Lógica del Componente**

Se pueden extraer datos (y comportamiento) en funciones reutilizables:

```html
<div x-data="dropdown()">
    <button x-on:click="open">Abrir</button>

    <div x-show="isOpen()" x-on:click.away="close">
        // Desplegable
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

> **Para usuarios de bundler**, notad que Alpine.js accede a funciones que están en el *scope* global (`window`), es necesario asignar explicitamente las funciones a `window` para poder usarlas con `x-data`. Por ejemplo, `window.dropdown = function () {}` (eso pasa porque Webpack, Rollup, Parcel etc. pone las funciones que defines en el *scope* del módulo y no de `window`).


También puedes mezclar múltiples tipos de datos usando desestructuración de objetos:

```html
<div x-data="{...dropdown(), ...tabs()}">
```

---

### `x-init`
**Ejemplo:** `<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`

**Estructura:** `<div x-data="..." x-init="[expression]"></div>`

`x-init` ejecuta una expresión cuando se inicializa un componente.

Si deseas ejecutar código DESPUÉS que Alpine haga las actualizaciones iniciales al DOM (similar al *hook* de `mounted()` en VueJS), puedes devolver un *callback* en `x-init`, y se ejecutará después:

`x-init="() => { // aquí tenemos acceso al estado de post-inicialización del DOM // }"`

---

### `x-show`
**Ejemplo:** `<div x-show="open"></div>`

**Estructura:** `<div x-show="[expression]"></div>`

`x-show` alterna el estilo `display: none;` del elemento dependiendo de si la expresión evalúa a `true` o `false`.

**x-show.transition**

`x-show.transition` es una API de conveniencia para hacer `x-show`s más agradables utilizando transiciones de CSS.

```html
<div x-show.transition="open">
    Estos contenidos entraran y saldrán de transición.
</div>
```

| Directiva | Descripción |
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

> Nota: Todas esos modificadores de transiciones se pueden usar conjuntamente con cualquiera de los otros. Esto es posible (aunque ridículo lol): `x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale.95`

> Nota: `x-show` espera a que cualquier hijo acabe de salir de la transición. Si quieres evitar este comportamiento, añade el modificador `.immediate`:
```html
<div x-show.immediate="open">
    <div x-show.transition="open">
</div>
```
---

### `x-bind`

> Nota: Eres libre de usar la sintaxis abreviada ":": `:type="..."`

**Ejemplo:** `<input x-bind:type="inputType">`

**Estructura:** `<input x-bind:[attribute]="[expression]">`

`x-bind` asigna el valor de un atributo como el resultado de evaluar una expresión de Javascript. La expresión tiene acceso a todos las claves del objeto de datos del componente, y se actualizará cada vez que se actualizan los datos.

> Nota: *bindings* de atributos SÓLO se actualizan cuando se actualizan las dependencias. El *framework* es lo suficientemente inteligente para observar cambios en los datos y detectar que *bindings* se encargan de esos.

**`x-bind` para atributos de clase**

`x-bind` se comporta un poco distinto cuando hacemos *binding* de un atributo `class`.

Para clases, es necesario pasar un objeto cuyas claves sean los nombres de la clase, y los valores sean expresiones booleanas que determinan si las clases se aplican o no.

Por ejemplo:
`<div x-bind:class="{ 'hidden': foo }"></div>`

En este ejemplo, la clase "hidden" solo se aplicará cuando el valor del atributo `foo` sea `true`.

**`x-bind` para atributos booleanos**

`x-bind` da soporte a atributos booleanos del mismo modo que funciona para atributos valuables, utilizando una variable como condicion o cualquier expresión de JavaScript que resuelve a `true` o `false`.

Por ejemplo:
```html
<!-- Given: -->
<button x-bind:disabled="myVar">Hazme click</button>

<!-- When myVar == true: -->
<button disabled="disabled">Hazme click</button>

<!-- When myVar == false: -->
<button>Click me</button>
```

Esto añadirá o eliminará el atributo `disabled` cuando `myVar` sea `true` o `false` respectivamente.

Se soportan atributos booleanos de la [especificación de HTML](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute), por ejemplo `disabled`, `readonly`, `required`, `checked`, `hidden`, `selected`, `open`, etc.

**Modificador `.camel`**
**Ejemplo:** `<svg x-bind:view-box.camel="viewBox">`

El modificador `camel` hace *binding* del equivalente al nombre del atributo en *camel case*. En el ejemplo de arriba, el valor de `viewBox` se asignará al atributo `viewBox` y no al atributo `view-box`.

---

### `x-on`

> Nota: Eres libre de usar la sintaxis abreviada "@": `@click="..."`

**Ejemplo:** `<button x-on:click="foo = 'bar'"></button>`

**Structure:** `<button x-on:[event]="[expression]"></button>`

`x-on` adjunta un evento *listener* al elemento en el cual se declara. Cuando se emite el evento, se ejecuta la expresion de JavaScript especificada.

Si cualquier dato es modificado en la expresión, otros atributos de elementos "vinculados" con dicho dato, se actualizarán.

> Nota: También se puede especificar el nombre de una función de JavaScript

**Ejemplo:** `<button x-on:click="myFunction"></button>`

Eso es equivalente a: `<button x-on:click="myFunction($event)"></button>`

**Modificador `keydown`**

**Ejemplo:** `<input type="text" x-on:keydown.escape="open = false">`

Puedes especificar teclas en conreto a escuchar utilizando modificadores *keydown* anexados a la directiva `x-on:keydown`. Nótese que los modificadores son versiones *kebab-cased* de los valores de `Event.key`.

Ejemplos: `enter`, `escape`, `arrow-up`, `arrow-down`

> Nota: También puedes escuchar combinaciones de teclas de sistema como: `x-on:keydown.cmd.enter="foo"`

**Modificador `.away`**

**Ejemplo:** `<div x-on:click.away="showModal = false"></div>`

Cuando el modificador `.away` está presente, el evento solo se ejecutara cuando el evento se origina de una fuente distinta al propio elemento o sus hijos.

**Modificador `.prevent`**
**Ejemplo:** `<input type="checkbox" x-on:click.prevent>`

Añadir `.prevent` en un *listener* de eventos llama a `preventDefault` sobre el evento disparado. En el ejemplo de arriba, esto significa que realmente la casilla no se marcará cuando el usuario haga click en ella.

**Modificador `.stop`**
**Ejemplo:** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

Añadir `.stop` en un *listener* de eventos llama a `stopPropagation` sobre el evento disparado. En el ejemplo de arriba, esto significa que el evento de "click" no saltará hacia el `<div>` exterior. En otras palabras, cuando un usuario pulse el botón, no se asignará `'bar'` a `foo`.

**Modificador `.self`**
**Ejemplo:** `<div x-on:click.self="foo = 'bar'"><button></button></div>`

Añadir `.self` en un *listener* de eventos hará que el evento solo se dispare si `$event.target` es el propio elemento. En el ejemplo de arriba, esto significa que el evento de "click" que propaga el evento hacia el `<div>`exterior **no** correrá el código indicado.

**Modificador `.window`**
**Ejemplo:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

Añadir `.window` en un *listener* de eventos instalará el *listener* en el objeto global `window` y no en el nodo del DOM en el que se declara. Esto es útil cuando quieres modificar el estado de un componente cuando algo cambia en `window`, como un evento de redimensión. En este ejemplo, cuando la ventana supera los 768 píxeles de anchura, cierra el modal/desplegable, y en el caso contrario mantiene el mismo estado.

>Nota: También se puede usar el modificador `.document` para adjuntar *listeners* a `document` y no en `window`

**Modificador `.once`**
**Ejemplo:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

Añadir el modificador `.once` en un *listener* de eventos asegura que el *listener* solo se ejecute una sola vez. Esto es útil para tareas que solo quieres realizar una vez, como un *fetch* parcial de un HTML o similares.

**Modificador `.passive`**
**Ejemplo:** `<button x-on:mousedown.passive="interactive = true"></button>`

Añadir el modificador `.passive` en un *listener* de eventos hará que el *listener* sea pasivo, lo que significa que `preventDefault()` no funcionará en ninguno de los eventos procesados. Esto puede ayudar, por ejemplo, con el buen desempeño del desplazamiento en dispositivos táctiles.

**Modificador `.debounce`**
**Ejemplo:** `<input x-on:input.debounce="fetchSomething()">`

El modificador `debounce` permite hacer "debounce" de un evento. En otras palabras, la respuesta al evento NO se ejecutará hasta que haya pasado una cierta cantidad de tiempo desde que el evento se lanzó por última vez. Cuando está listo para ser llamado, se ejecutará la última respuesta.

El valor de "espera" por defecto es de 250 milisegundos.

Para personalizar este valor, es posible especificar una cifra en concreto de la siguiente forma:

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

**Modificador `.camel`**
**Ejemplo:** `<input x-on:event-name.camel="doSomething()">`

El modificador `camel` hace *binding* del equivalente al nombre del evento en *camel case*. En el ejemplo de arriba, la expresión se evaluara cuando se dispare el evento `eventName`.

---

### `x-model`
**Ejemplo:** `<input type="text" x-model="foo">`

**Estructura:** `<input type="text" x-model="[data item]">`

`x-model` añade *"two-way data binding"* en un elemento. En otras palabras, el valor del elemento de entrada estara sincronizado con el valor del dato en el componente.

> Nota: `x-model` es lo suficientemente inteligente para detectar cambios en inputs de texto, checkboxes, radio buttons, radio buttons, textareas, selects, y multiple selects. Debería comportarse [igual que lo hace Vue](https://vuejs.org/v2/guide/forms.html) en esos escenarios.

**Modificador `.number`**
**Ejemplo:** `<input x-model.number="age">`

El modificador `number` convierte el valor de entrada a un número. En caso que no se pueda convertir a número, devuelve el valor original.

**Modificador `.debounce`**
**Ejemplo:** `<input x-model.debounce="search">`

El modificador `debounce` permite añadir "debounce" en la actualización de un valor. En otras palabras, la respuesta al evento NO se ejecutará hasta que haya pasado una cierta cantidad de tiempo desde que se disparó el último evento. Cuando la respuesta está lista para ser llamada, se ejecutará la respuesta al último evento.

El valor de "espera" por defecto es de 250 milisegundos.

Para personalizar este valor, es posible especificar una cifra en concreto de la siguiente forma:

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

---

### `x-text`
**Ejemplo:** `<span x-text="foo"></span>`

**Estructura:** `<span x-text="[expression]"`

`x-text` funciona similar a `x-bind`, pero actualiza el `innerText` del elemento en lugar del valor del atributo.

---

### `x-html`
**Ejemplo:** `<span x-html="foo"></span>`

**Estructura:** `<span x-html="[expression]"`

`x-html` funciona similar a `x-bind`, pero actualiza el `innerHTML` del elemento en lugar del valor del atributo.

> :warning: **Utiliza solo contenido confiable y no elementos introducidos por el usuario.** :warning:
>
> Renderizar HTML de terceros dinamicamente puede facilmente llevarnos a vulnerabilidades [XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting).

---

### `x-ref`
**Ejemplo:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**Estructura:** `<div x-ref="[ref name]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`

`x-ref` permite una forma conveniente de extraer elementos crudos del DOM del componente. Colocando el atributo `x-ref` en un elemento, pasa a estar disponible para todas las respuestas de eventos dentro de un objeto llamado `$refs`.

Esta es una alternativa útil para evitar tener ids y utilizar `document.querySelector` en todos lados.

> Nota: También se puede hacer *bind* dinámico de valores para x-ref: `<span :x-ref="item.id"></span>` en caso de ser necesario.

---

### `x-if`
**Ejemplo:** `<template x-if="true"><div>Some Element</div></template>`

**Estructura:** `<template x-if="[expression]"><div>Some Element</div></template>`

En casos donde `x-show` no es suficiente (`x-show` pone el elemento con `display: none` si es false) `x-if` se puede utilizar para eliminar un elemento del DOM completamente.

Es importante que `x-if` se use en una etiqueta `<template></template>` porque Alpine no utiliza un DOM virtual. Esta implementación permite a Alpine a ser robusto usando el DOM real y hacer su magia.

> Nota: `x-if` debe tener un único elemento raíz dentro de la etiqueta `<template></template>`.

> Nota: Cuando se usa `template` dentro de una etiqueta `svg`, es necesario añadir un [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) que debe ejecutarse antes que Alpine.js se inicialice.

---

### `x-for`
**Ejemplo:**
```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

> Nota: El *binding* `:key` es opcional, pero es ALTAMENTE recomendado.

`x-for` está disponible para casos donde se requiere de crear nuevos nodos en el DOM por cada elemento en un arreglo. Actua similar a `v-for` en Vue, con la exepción que es necesario usarlo con una etiqueta `template` y no un elemento cualquiera.

Si quieres acceder al indice actual de la iteración, utiliza la siguiente sintaxis:

```html
<template x-for="(item, index) in items" :key="index">
    <!-- También se puede referenciar a "index" dentro de la iteración si es necesario. -->
    <div x-text="index"></div>
</template>
```

> Nota: `x-for` debe tener un único elemento raíz dentro de la etiqueta `<template></template>`.

> Nota: Cuando se usa `template` dentro de una etiqueta `svg`, es necesario añadir un [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) que debe ejecutarse antes que Alpine.js se inicialice.


#### Anidando `x-for`s
Se pueden anidar bucles `x-for`, pero se debe envolver cada bucle en un elemento. Por ejemplo:

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
**Ejemplo:**
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

> El ejemplo de arriba utiliza clases de [Tailwind CSS](https://tailwindcss.com)

Alpine ofrece 6 formas distintas de directivas de transición para aplicar clases en varias etapas de transición de un elemento, entre los estados "hidden" y "shown". Estas directivas funcionan con ambos `x-show` y `x-if`.

Estas, funcionan exactamente igual que las directivas de transición de VueJS con la diferencia de que tienen distintos nombres y más sensibles:

| Directiva | Descripción |
| --- | --- |
| `:enter` | Se aplica durante toda la fase de entrada. |
| `:enter-start` | Se añade antes que el elemento se inserte y se elimina un fotograma después de que se inserte el elemento. |
| `:enter-end` | Añadido un fotograma después se inserir el elemento (al mismo tiempo que se elimina `enter-start`), y se elimina cuando la transición/animación finaliza. |
| `:leave` | Aplicado durante toda la fase de abandono. |
| `:leave-start` | Añadido inmediatamente cuando se dispara el abandono de la transición, y eliminado después de un fotograma. |
| `:leave-end` | Añadido un fotograma después de que se dispare el dejar la transición (al mismo tiempo que se elimina `leave-start`), y se elimina cuando la transición/animación finaliza.

---

### `x-spread`
**Ejemplo:**
```html
<div x-data="dropdown()">
    <button x-spread="trigger">Abrir Desplegable</button>

    <span x-spread="dialogue">Desplegar Contenidos</span>
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

`x-spread` permite extraer los *bindings* de Alpine de un elemento en un objeto reutilizable.

Las claves del objeto son las directivas (puede ser cualquiera, incluyendo modificadores), y los valores son *callbacks* a evaluar por Alpine.

> Note: Excepciónes con `x-spread`:
> - Cuando la directiva a extender es `x-for`, es necesario retornar una expresion en formato de *string* en el *callback*. Por ejemplo: `['x-for']() { return 'item in items' }`.
> - `x-init` y `x-data` no se pueden usar dentro de un objeto para "spread".

---

### `x-cloak`
**Ejemplo:** `<div x-data="{}" x-cloak></div>`

Los atributos de `x-cloak` se eliminan de los elementos cuando Alpine se inicializa. Esto es util para ocultar elementos pre-inicializados del DOM. Es recomendado añadir el siguiente estilo global para que esto funcione:

```html
<style>
    [x-cloak] { display: none; }
</style>
```

### Propiedades Mágicas

> Con la excepción de `$el`, las propiedades mágicas **no están disponibles junto a `x-data`** ya que el componente aún no ha sido inicializado.

---

### `$el`
**Ejemplo:**
```html
<div x-data>
    <button @click="$el.innerHTML = 'foo'">Reemplázame con "foo"</button>
</div>
```

`$el` es una propiedad mágica que puede ser utilizada para extraer el nodo DOM del componente raíz.

### `$refs`
**Ejemplo:**
```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

`$refs` es una propiedad mágica que puede ser utilizada para extraer elementos DOM marcados con `x-ref` dentro del componente. Esto es útil cuando es necesario manipular manualmente elementos del DOM.

---

### `$event`
**Ejemplo:**
```html
<input x-on:input="alert($event.target.value)">
```

`$event` es una propiedad mágica que puede ser utilizada junto un a un *listener* de eventos para extraer el objeto nativo "Event" del navegador.

> Nota: La propiedad $event sólo está disponible en expresiones del DOM.

Si se requiere acceder a $event dentro de una función de JavaScript puedes pasar el objecto directamente como parámetro:

`<button x-on:click="myFunction($event)"></button>`

---

### `$dispatch`
**Ejemplo:**
```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
    <!-- Al hacer click, hará console.log de "bar" -->
</div>
```

**Nota en la Propagación de Eventos**

Nótese que, por el [event bubbling](https://en.wikipedia.org/wiki/Event_bubbling), cuando se necesita capturar eventos enviados desde nodes que están anidado bajo el mismo nivel de jerarquía, es necesario usar el modificador [`.window`](https://github.com/alpinejs/alpine#x-on):

**Ejemplo:**

```html
<div x-data>
    <span @custom-event="console.log($event.detail.foo)"></span>
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
<div>
```

> Esto no funcionará porqué cuando se dispara `custom-event`, se propagará hacia el antepasado común, el `div`.

**_Dispatching_ Componentes**

También se puede aprovechar la técnica anterior para hacer que los componentes se comuniquen entre ellos:

**Ejemplo:**

```html
<div x-data @custom-event.window="console.log($event.detail)"></div>

<button x-data @click="$dispatch('custom-event', 'Hello World!')">
<!-- Al hacer click, hará console.log de "Hello World!". -->
```

`$dispatch` es un atajo para crear un evento personalizado `CustomEvent` y enviarlo utilizando `.dispatchEvent()` internamente. Hay muchos casos de uso buenos en donde se requiere pasar los datos entre componentes utilizando eventos personalizados. [Leer esto](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) para mas información sobre el sistema de `CustomEvent` en los navegadores.

Nótese que cualquier dato que se pasa como segundo parametro de `$dispatch('some-event', { some: 'data' })`, pasa a estar disponible a través de la propiedad "detail" de los nuevos eventos: `$event.detail.some`. Añadir datos de eventos personalizados a la propiedad `.detail` es la práctica estándar para usar `CustomEvent` en navegadores. [Leer esto](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail) para mas información.

También se puede utilizar `$dispatch()` para disparar actualizaciones de los datos para bindings con `x-model`. Por ejemplo:

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')">
        <!-- Después de pulsar el botón, `x-model` captura el evento "input", y actualiza foo a "baz". -->
    </span>
</div>
```

> Nota: La propiedad $dispatch sólo está disponible en expresiones del DOM.

Si necesitas acceder a $dispatch desde dentro de una función de JavaScript, puedes pasarlo como parámetro:

`<button x-on:click="myFunction($dispatch)"></button>`

---

### `$nextTick`
**Ejemplo:**
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

`$nextTick` es una propiedad mágica que permite ejecutar la expresión indicada sólo DESPUÉS que Alpine haga las actualizaciones reactivas del DOM. Esto es útil para las veces que se necesita interactuar con el DOM DESPUÉS que se reflejen todas las actualizaciones que has hecho de los datos.

---

### `$watch`
**Ejemplo:**
```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```

Puedes hacer "watch" a la propiedad de un componente con el método mágico `$watch`. En el ejemplo de arriba, cuando se pulsa el botón y `open` cambia, la retrollamada provista ejecutara el `console.log` con el nuevo valor.

## Seguridad
Si encuentras una brecha de seguridad, por favor envía un email a [calebporzio@gmail.com]().

Alpine depende de una implementación personalizada utilizando el objeto `Function` para evaluar las directivas. A pesar de ser más seguro que `eval()`, su uso está prohibido en algunos entornos, tels como Google Chrome App, utilizando Content Security Policy restrictivas (CSP).

Si utilizas Alpine en un sitio web que maneja datos sensibles y requiere [CSP](https://csp.withgoogle.com/docs/strict-csp.html), necesitas incluir `unsafe-eval` en tu política. Una política robusta configurada correctamente ayudará a proteger a tus usuarios cuando utilizan datos personales o financieros.

Ya que la política se aplica a todos los scripts de tu página, es improtante que otras bibliotecas externas incluidas en el sitio web sean revisadas cuidadosamente para asegurar que son confiables y que no intrudicen ninguna vulnerabilidad de Cross Site Scripting ni usando `eval()`ni manipulando el DOM para inyectar código malicioso en tu página.

## V3 Roadmap
* Migrar de `x-ref` a `ref` para paridad con Vue?
* Añadir `Alpine.directive()`
* Añadir `Alpine.component('foo', {...})` (Con el método mágico `__init()`)
* Enviar eventos de Alpine para "loaded", "transition-start", etc... ([#299](https://github.com/alpinejs/alpine/pull/299)) ?
* Eliminar síntaxis de "object" (y array) de `x-bind:class="{ 'foo': true }"` ([#236](https://github.com/alpinejs/alpine/pull/236) para añadir soporte a sintaxis de objeto para el atributo `style`)
* Mejorar `x-for` para reactividad con mutaciones ([#165](https://github.com/alpinejs/alpine/pull/165))
* Añadir soporte "deep watching" en V3 ([#294](https://github.com/alpinejs/alpine/pull/294))
* Añadir atajo `$el`
* Cambiar `@click.away` a `@click.outside`?

## Licencia

Copyright © 2019-2021 Caleb Porzio y colaboradores

Licenciado bajo la licencia MIT, ve [LICENSE.md](LICENSE.md) para más detalles.
