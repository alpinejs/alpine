# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true)](https://alpinejs.codewithhugo.com/chat/)

Alpine.js ti offre la natura reattiva e dichiarativa di grandi framework come Vue o React a un costo molto inferiore.

Puoi mantenere il tuo DOM e cospargere il comportamento come ritieni opportuno.

Pensalo come [Tailwind] (https://tailwindcss.com/) per JavaScript.

> Nota: la sintassi di questo strumento è quasi interamente presa in prestito da [Vue] (https://vuejs.org/) (e per estensione [Angular] (https://angularjs.org/)). Sono per sempre grato per il dono che fanno al web.

## Translated documentation

| Language | Link for documentation |
| --- | --- |
| Japanese | [**日本語ドキュメント**](./README.ja.md) |
| Chinese Traditional | [**繁體中文說明文件**](./README.zh-TW.md) |
| Russian | [**Документация на русском**](./README.ru.md) |
| Portuguese | [**Documentação em Português**](./README.pt.md) |
| Spanish | [**Documentación en Español**](./README.es.md) |
| German | [**Dokumentation in Deutsch**](./README.de.md) |
| Italian | [**Documento in italiano**](./README.it.md) |

## Install

**Da CDN:** Aggiungi il seguente script alla fine della sezione `<head>`.

```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
```

Questo è tutto. Si inizializzerà da solo.

Per gli ambienti di produzione, si consiglia di aggiungere un numero di versione specifico nel collegamento per evitare interruzioni impreviste dalle versioni più recenti.
Ad esempio, per utilizzare la versione "2.7.0" (la più recente):
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.7.0/dist/alpine.min.js" defer></script>
```

**Da NPM:** Installa il pacchetto da NPM.
```js
npm i alpinejs
```

Includilo nel tuo copione.
```js
import 'alpinejs'
```

**Per il supporto di IE11** Utilizza invece i seguenti script.
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
```

Lo schema sopra è il [pattern module / nomodule] (https://philipwalton.com/articles/deploying-es2015-code-in-production-today/) che risulterà nel bundle moderno caricato automaticamente sui browser moderni e il Bundle IE11 caricato automaticamente su IE11 e altri browser legacy.

## Uso

*Dropdown/Modal*
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

*Tabs*
```html
<div x-data="{ tab: 'foo' }">
    <button :class="{ 'active': tab === 'foo' }" @click="tab = 'foo'">Foo</button>
    <button :class="{ 'active': tab === 'bar' }" @click="tab = 'bar'">Bar</button>

    <div x-show="tab === 'foo'">Tab Foo</div>
    <div x-show="tab === 'bar'">Tab Bar</div>
</div>
```

Puoi anche usarlo per cose non banali:
*Precaricamento del contenuto HTML di un menu a discesa al passaggio del mouse*
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

## Imparare

Sono disponibili 14 direttive:

| Direttiva | Descrizione |
| --- | --- |
| [`x-data`] (# x-data) | Dichiara un nuovo ambito del componente. |
| [`x-init`] (# x-init) | Esegue un'espressione quando un componente viene inizializzato. |
| [`x-show`] (# x-show) | Alterna `display: none;` sull'elemento a seconda dell'espressione (true o false). |
| [`x-bind`] (# x-bind) | Imposta il valore di un attributo sul risultato di un'espressione JS |
| [`x-on`] (# x-on) | Collega un listener di eventi all'elemento. Esegue l'espressione JS quando viene emessa. |
| [`x-model`] (# x-model) | Aggiunge "associazione dati bidirezionale" a un elemento. Mantiene l'elemento di input sincronizzato con i dati del componente. |
| [`x-text`] (# x-text) | Funziona in modo simile a "x-bind", ma aggiornerà "innerText" di un elemento. |
| [`x-html`] (# x-html) | Funziona in modo simile a "x-bind", ma aggiornerà "innerHTML" di un elemento. |
| [`x-ref`] (# x-ref) | Modo conveniente per recuperare gli elementi DOM grezzi dal tuo componente. |
| [`x-if`] (# x-if) | Rimuovi completamente un elemento dal DOM. Deve essere utilizzato su un tag "<template>". |
| [`x-for`] (# x-for) | Crea nuovi nodi DOM per ogni elemento in un array. Deve essere utilizzato su un tag "<template>". |
| [`x-transizione`] (# x-transizione) | Direttive per l'applicazione delle classi alle varie fasi della transizione di un elemento |
| [`x-spread`] (# x-spread) | Consente di legare un oggetto delle direttive Alpine a un elemento per una migliore riutilizzabilità |
| [`x-cloak`] (# x-cloak) | Questo attributo viene rimosso durante l'inizializzazione di Alpine. Utile per nascondere DOM pre-inizializzato. |

E 6 proprietà magiche:

| Proprietà magiche | Descrizione |
| --- | --- |
| [`$ el`] (# el) | Recupera il nodo DOM del componente radice. |
| [`$ refs`] (# refs) | Recupera gli elementi DOM contrassegnati con "x-ref" all'interno del componente. |
| [`$ evento`] (# evento) | Recupera l'oggetto "Evento" del browser nativo all'interno di un listener di eventi. |
| [`$ dispatch`] (# invio) | Creare un `CustomEvent` e inviarlo utilizzando internamente` .dispatchEvent () `. |
| [`$ nextTick`] (# nexttick) | Eseguire una determinata espressione DOPO che Alpine ha effettuato gli aggiornamenti DOM reattivi. |
| [`$ watch`] (# watch) | Attiverà un callback fornito quando una proprietà del componente che hai "guardato" viene modificata. |


## Sponsor

<img width="33%" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" alt="Tailwind CSS">

**Vuoi il tuo logo qui? [DM on Twitter](https://twitter.com/calebporzio)**

## Progetti comunitari

* [Newsletter settimanale AlpineJS] (https://alpinejs.codewithhugo.com/newsletter/)
* [Spruce (State Management)] (https://github.com/ryangjchandler/spruce)
* [Adattatore Turbolinks] (https://github.com/SimoTod/alpine-turbolinks-adapter)
* [Alpine Magic Helpers] (https://github.com/KevinBatdorf/alpine-magic-helpers)
* [Awesome Alpine] (https://github.com/ryangjchandler/awesome-alpine)

### Direttive

---

### `x-data`

**Esempio:** `<div x-data="{ foo: 'bar' }">...</div>`

**Struttura:** `<div x-data="[object literal]">...</div>`

`x-data` dichiara un nuovo ambito del componente. Indica al framework di inizializzare un nuovo componente con il seguente oggetto dati.


Pensala come la proprietà `data` di un componente Vue.

**Estrai logica componente**

Puoi estrarre dati (e comportamento) in funzioni riutilizzabili:

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

> ** Per gli utenti di bundler **, nota che Alpine.js accede alle funzioni che sono nell'ambito globale (`window`), dovrai assegnare esplicitamente le tue funzioni a` window` per usarle con `x- data` per esempio `window.dropdown = function () {}` (questo perché con Webpack, Rollup, Parcel ecc. le `function` che definisci saranno predefinite come ambito del modulo e non` window`).


È inoltre possibile combinare più oggetti dati utilizzando la destrutturazione degli oggetti:

```html
<div x-data="{...dropdown(), ...tabs()}">
```

---

### `x-init`
**Esempio:** `<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`

**Struttura:** `<div x-data="..." x-init="[expression]"></div>`

`x-init` esegue un'espressione quando un componente viene inizializzato.

Se desideri eseguire il codice DOPO che Alpine ha effettuato i suoi aggiornamenti iniziali al DOM (qualcosa come un hook `mounted ()` in VueJS), puoi restituire un callback da `x-init`, e verrà eseguito dopo:

`x-init="() => { // we have access to the post-dom-initialization state here // }"`

---

### `x-show`
**Esempio:** `<div x-show="open"></div>`

**Struttura:** `<div x-show="[expression]"></div>`

`x-show` alterna lo stile` display: none; `sull'elemento a seconda che l'espressione si risolva in` true` o `false`.

**x-show.transition**

`x-show.transition` è una comoda API per rendere il tuo` x-show` più piacevole usando le transizioni CSS.

```html
<div x-show.transition="open">
    These contents will be transitioned in and out.
</div>
```

| Direttiva | Descrizione |
| --- | --- |
| `x-show.transition` | Dissolvenza e scala simultanee. (opacità, scala: 0,95, funzione di temporizzazione: cubic-bezier (0,4, 0,0, 0,2, 1), durata in entrata: 150 ms, durata in uscita: 75 ms)
| `x-show.transition.in` | Solo transizione in. |
| `x-show.transition.out` | Solo transizione fuori. |
| `x-show.transition.opacity` | Usa solo la dissolvenza. |
| `x-show.transition.scale` | Usa solo la bilancia. |
| `x-show.transition.scale.75` | Personalizza la trasformazione della scala CSS `transform: scale (.75)`. |
| `x-show.transition.duration.200ms` | Imposta la transizione "in" a 200 ms. L'uscita sarà impostata a metà (100 ms). |
| `x-show.transition.origin.top.right` | Personalizza l'origine della trasformazione CSS `transform-origin: top right`. |
| `x-show.transition.in.duration.200ms.out.duration.50ms` | Diverse durate per "in" e "out". |

> Nota: tutti questi modificatori di transizione possono essere usati insieme tra loro. Questo è possibile (anche se ridicolo lol): `x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale. 95`

> Nota: `x-show` aspetterà che tutti i bambini finiscano la transizione. Se vuoi bypassare questo comportamento, aggiungi il modificatore `.immediate`:
```html
<div x-show.immediate="open">
    <div x-show.transition="open">
</div>
```
---

### `x-bind`

> Nota: sei libero di usare il più corto ":" syntax: `:type="..."`

**Esempio:** `<input x-bind:type="inputType">`

**Struttura:** `<input x-bind:[attribute]="[expression]">`

`x-bind` imposta il valore di un attributo sul risultato di un'espressione JavaScript. L'espressione ha accesso a tutte le chiavi dell'oggetto dati del componente e si aggiornerà ogni volta che i suoi dati vengono aggiornati.


> Nota: le associazioni di attributi si aggiornano SOLO quando si aggiornano le loro dipendenze. Il framework è abbastanza intelligente da osservare le modifiche ai dati e rilevare quali binding si preoccupano di loro.

**`x-bind` per attributi di classe**

`x-bind` si comporta in modo leggermente diverso quando si lega all'attributo` class`.

Per le classi, si passa un oggetto le cui chiavi sono nomi di classi e i valori sono espressioni booleane per determinare se tali nomi di classe vengono applicati o meno.

Per esempio:
`<div x-bind: class =" {'hidden': foo} "> </div>`

In questo esempio, la classe `nascosta` verrà applicata solo quando il valore dell'attributo di dati `foo` è `true`.

**`x-bind` per attributi booleani**

`x-bind` supporta gli attributi booleani allo stesso modo degli attributi value, utilizzando una variabile come condizione o qualsiasi espressione JavaScript che si risolva in` true` o `false`.

Per esempio:
```html
<!-- Given: -->
<button x-bind:disabled="myVar">Click me</button>

<!-- When myVar == true: -->
<button disabled="disabled">Click me</button>

<!-- When myVar == false: -->
<button>Click me</button>
```

Questo aggiungerà o rimuoverà il file `disabled` attributo quando `myVar` è rispettivamente vero o falso.

Gli attributi booleani sono supportati in base a [HTML specification](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute), for example `disabled`, `readonly`, `required`, `checked`, `hidden`, `selected`, `open`, etc.

> Nota: se hai bisogno di uno stato falso da mostrare per il tuo attributo, come `aria-*`, catena `.toString()` al valore durante l'associazione all'attributo. Per esempio:
 `:aria-expanded="isOpen.toString()"` persisterebbe se  `isOpen` era `true` or `false`.

**`.camel` modifier**
**Esempio:** `<svg x-bind:view-box.camel="viewBox">`

Il modificatore `camel` si legherà all'equivalente in maiuscolo e minuscolo del nome dell'attributo. Nell'esempio sopra, il valore di `viewBox` sarà vincolato all'attributo` viewBox` invece dell'attributo `view-box`.

---

### `x-on`

> Nota: sei libero di utilizzare la sintassi "@" più breve: `@click="..."`

**Esempio:** `<button x-on:click="foo = 'bar'"></button>`

**Struttura:** `<button x-on:[event]="[expression]"></button>`

`x-on` allega un listener di eventi all'elemento su cui è dichiarato. Quando viene emesso quell'evento, viene eseguita l'espressione JavaScript impostata come valore.


Se qualche dato viene modificato nell'espressione, gli altri attributi dell'elemento "legati" a questi dati verranno aggiornati.

> Nota: è anche possibile specificare un nome di funzione JavaScript

**Esempio:** `<button x-on:click="myFunction"></button>`

Questo è equivalente a: `<button x-on:click="myFunction($event)"></button>`

**`keydown` modifiers**

**Esempio:** `<input type="text" x-on:keydown.escape="open = false">`

Puoi specificare chiavi specifiche da ascoltare usando i modificatori di keydown aggiunti alla direttiva `x-on: keydown`. Notare che i modificatori sono versioni in maiuscolo kebab dei valori `Event.key`.

Esempi: `enter`, `escape`, `arrow-up`, `arrow-down`

> Nota: puoi anche ascoltare le combinazioni di tasti di modifica del sistema come:`x-on:keydown.cmd.enter="foo"`

**`.away` modifier**

**Esempio:** `<div x-on:click.away="showModal = false"></div>`

Quando è presente il modificatore `.away`, il gestore di eventi verrà eseguito solo quando l'evento ha origine da una fonte diversa da se stesso o dai suoi figli.

Ciò è utile per nascondere i menu a discesa e le modali quando un utente fa clic per allontanarli.

**`.prevent` modifier**
**Esempio:** `<input type="checkbox" x-on:click.prevent>`

L'aggiunta di `.prevent` a un listener di eventi chiamerà `preventDefault` sull'evento attivato. Nell'esempio sopra, ciò significa che la casella di controllo non verrà effettivamente selezionata quando un utente fa clic su di essa.


**`.stop` modifier**
**Esempio:** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

L'aggiunta di `.stop` a un listener di eventi chiamerà `stopPropagation` sull'evento attivato. Nell'esempio sopra, ciò significa che l'evento "clic" non verrà visualizzato dal pulsante al `<div>` esterno. O in altre parole, quando un utente fa clic sul pulsante, `foo` non verrà impostato su `bar`.


**`.self` modifier**
**Esempio:** `<div x-on:click.self="foo = 'bar'"><button></button></div>`

Aggiunta `.self` a un listener di eventi attiverà il gestore solo se il file `$event.target` è l'elemento stesso. Nell'esempio sopra, questo significa l'evento "clic" che bolle dal pulsante verso l'esterno
 `<div>` will **not** eseguire il gestore.

**`.window` modifier**
**Esempio:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

L'aggiunta di `.window` a un listener di eventi installerà il listener sull'oggetto finestra globale invece che sul nodo DOM su cui è dichiarato. Ciò è utile quando si desidera modificare lo stato del componente quando qualcosa cambia con la finestra, come l'evento resize. In questo esempio, quando la finestra diventa più grande di 768 pixel di larghezza, chiuderemo il menu a discesa / modale, altrimenti manterremo lo stesso stato.


>Note: You can also use the `.document` modifier to attach listeners to `document` instead of `window`

**`.once` modifier**
**Esempio:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

L'aggiunta del modificatore `.once` a un listener di eventi assicurerà che il listener verrà gestito solo una volta. Questo è utile per le cose che vuoi fare solo una volta, come il recupero di parziali HTML e simili.

**`.passive` modifier**
**Esempio:** `<button x-on:mousedown.passive="interactive = true"></button>`

L'aggiunta del modificatore `.passive` a un listener di eventi renderà l'ascoltatore passivo, il che significa che` preventDefault () `non funzionerà su nessun evento in elaborazione, questo può aiutare, per esempio con le prestazioni di scorrimento sui dispositivi touch.

**`.debounce` modifier**
**Esempio:** `<input x-on:input.debounce="fetchSomething()">`

Il modificatore `debounce` ti permette di" debounce "un gestore di eventi. In altre parole, il gestore di eventi NON verrà eseguito fino a quando non sarà trascorso un certo periodo di tempo dall'ultimo evento che si è verificato. Quando il gestore è pronto per essere chiamato, verrà eseguita l'ultima chiamata del gestore.

Il tempo di "attesa" antirimbalzo predefinito è 250 millisecondi.

Se desideri personalizzarlo, puoi specificare un tempo di attesa personalizzato in questo modo:

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

**`.camel` modifier**
**Esempio:** `<input x-on:event-name.camel="doSomething()">`

Il modificatore `camel` attaccherà un listener di eventi per il nome dell'evento equivalente a camel case. Nell'esempio sopra, l'espressione verrà valutata quando l'evento `eventName` viene attivato sull'elemento.

---

### `x-model`
**Esempio:** `<input type="text" x-model="foo">`

**Struttura:** `<input type="text" x-model="[data item]">`

`x-model` aggiunge "associazione dati bidirezionale" a un elemento. In altre parole, il valore dell'elemento di input verrà mantenuto sincronizzato con il valore dell'elemento di dati del componente.

> Nota: "x-model" è abbastanza intelligente da rilevare le modifiche su input di testo, caselle di controllo, pulsanti di opzione, aree di testo, selezioni e selezioni multiple. Dovrebbe comportarsi [come farebbe Vue] (https://vuejs.org/v2/guide/forms.html) in quegli scenari.

**`.number` modifier**
**Esempio:** `<input x-model.number="age">`

Il modificatore "numero" convertirà il valore dell'input in un numero. Se il valore non può essere analizzato come un numero valido, viene restituito il valore originale.

**`.debounce` modifier**
**Esempio:** `<input x-model.debounce="search">`

Il modificatore `debounce` ti permette di aggiungere un" debounce "a un aggiornamento di valore. In altre parole, il gestore di eventi NON verrà eseguito fino a quando non sarà trascorso un certo periodo di tempo dall'ultimo evento che si è verificato. Quando il gestore è pronto per essere chiamato, verrà eseguita l'ultima chiamata del gestore.

Il tempo di "attesa" antirimbalzo predefinito è 250 millisecondi.

Se desideri personalizzarlo, puoi specificare un tempo di attesa personalizzato in questo modo:

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

---

### `x-text`
**Esempio:** `<span x-text="foo"></span>`

**Struttura:** `<span x-text="[expression]"`

`x-text` funziona in modo simile a` x-bind`, eccetto che invece di aggiornare il valore di un attributo, aggiornerà il `innerText` di un elemento.

---

### `x-html`
**Esempio:** `<span x-html="foo"></span>`

**Struttura:** `<span x-html="[expression]"`

`x-html` funziona in modo simile a` x-bind`, eccetto che invece di aggiornare il valore di un attributo, aggiornerà `innerHTML` di un elemento.

> :avvertimento: **Utilizzare solo su contenuti affidabili e mai su contenuti forniti dall'utente.** :avvertimento:
>
> Il rendering dinamico di HTML da terze parti può facilmente portare a[XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) vulnerabilità.

---

### `x-ref`
**Esempio:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**Struttura:** `<div x-ref="[ref name]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`

`x-ref` fornisce un modo conveniente per recuperare elementi DOM grezzi dal tuo componente. Impostando un attributo `x-ref` su un elemento, lo rendi disponibile a tutti i gestori di eventi all'interno di un oggetto chiamato` $ refs`.

Questa è un'utile alternativa all'impostazione degli ID e all'utilizzo di `document.querySelector` ovunque.

> Nota: puoi anche associare valori dinamici per x-ref: `<span: x-ref =" item.id "> </span>` se necessario.

---

### `x-if`
**Esempio:** `<template x-if="true"><div>Some Element</div></template>`

**Struttura:** `<template x-if="[expression]"><div>Some Element</div></template>`

Per i casi in cui `x-show` non è sufficiente (` x-show` imposta un elemento su `display: none` se è falso),` x-if` può essere utilizzato per rimuovere effettivamente un elemento completamente dal DOM.

È importante che `x-if` sia usato su un tag` <template> </template> `perché Alpine non usa un DOM virtuale. Questa implementazione consente ad Alpine di rimanere robusto e di utilizzare il vero DOM per far funzionare la sua magia.

> Nota: `x-if` deve avere una radice di un singolo elemento all'interno del tag `<template> </template>`.

> Note: When using `template` in a `svg` tag, you need to add a [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) that should be run before Alpine.js is initialized.

---

### `x-for`
**Esempio:**
```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

> Nota: l'associazione `: key` è facoltativa, ma ALTAMENTE consigliata.

`x-for` è disponibile per i casi in cui desideri creare nuovi nodi DOM per ogni elemento in un array. Questo dovrebbe apparire simile a `v-for` in Vue, con un'eccezione che deve esistere su un tag` template` e non su un normale elemento DOM.

Se vuoi accedere all'indice corrente dell'iterazione, usa la seguente sintassi:

```html
<template x-for="(item, index) in items" :key="index">
    <!-- You can also reference "index" inside the iteration if you need. -->
    <div x-text="index"></div>
</template>
```

Se desideri accedere all'oggetto array (raccolta) dell'iterazione, utilizza la seguente sintassi:

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

> Nota: `x-for` deve avere una radice di un singolo elemento all'interno del tag `<template> </template>`.

> Nota: quando si utilizza `template` in un tag` svg`, è necessario aggiungere un [polyfill] (https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) che dovrebbe essere eseguito prima di Alpine .js viene inizializzato.

#### Nesting `x-for`s
Puoi annidare i cicli `x-for`, ma DEVI avvolgere ogni ciclo in un elemento. Per esempio:

```html
<template x-for="item in items">
    <div>
        <template x-for="subItem in item.subItems">
            <div x-text="subItem"></div>
        </template>
    </div>
</template>
```

#### Iterazione su un intervallo

Alpine supporta la sintassi `i in n`, dove `n` è un numero intero, che consente di iterare su un intervallo fisso di elementi.

```html
<template x-for="i in 10">
    <span x-text="i"></span>
</template>
```

---

### `x-transition`
**Esempio:**
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

> L'esempio sopra utilizza classi da [Tailwind CSS] (https://tailwindcss.com)

Alpine offre 6 diverse direttive di transizione per applicare le classi alle varie fasi della transizione di un elemento tra gli stati "nascosto" e "mostrato". Queste direttive funzionano sia con `x-show` CHE` x-if`.

Si comportano esattamente come le direttive di transizione di VueJ, tranne per il fatto che hanno nomi diversi e più sensati:

| Direttiva | Descrizione |
| --- | --- |
| `: enter` | Applicato durante tutta la fase di inserimento. |
| `: enter-start` | Aggiunto prima dell'inserimento dell'elemento, rimosso un frame dopo l'inserimento dell'elemento. |
| `: enter-end` | Aggiunto un fotogramma dopo che l'elemento è stato inserito (allo stesso tempo "enter-start" viene rimosso), rimosso al termine della transizione / animazione.
| `: leave` | Applicato durante tutta la fase di uscita. |
| `: leave-start` | Aggiunto immediatamente quando viene attivata una transizione in uscita, rimosso dopo un fotogramma. |
| `: leave-end` | Aggiunto un fotogramma dopo l'attivazione di una transizione in uscita (allo stesso tempo viene rimosso "leave-start"), rimosso quando termina la transizione / animazione.


---

### `x-spread`
**Esempio:**
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

`x-spread` ti permette di estrarre le associazioni Alpine di un elemento in un oggetto riutilizzabile.
           
  Le chiavi dell'oggetto sono le direttive (possono essere qualsiasi direttiva inclusi i modificatori) ei valori sono callback che devono essere valutati da Alpine.

> Nota: ci sono un paio di avvertimenti per x-spread:
> - Quando la direttiva "diffusa" è `x-for`, dovresti restituire una normale stringa di espressione dal callback. Per esempio: `['x-for']() { return 'item in items' }`.
> - `x-data` and `x-init` can't be used inside a "spread" object

---

### `x-cloak`
**Esempio:** `<div x-data="{}" x-cloak></div>`

`x-cloak` gli attributi vengono rimossi dagli elementi durante l'inizializzazione di Alpine. Ciò è utile per nascondere il DOM preinizializzato. È tipico aggiungere il seguente stile globale affinché funzioni:

```html
<style>
    [x-cloak] { display: none; }
</style>
```

### Proprietà magiche

> Con l'eccezione di `$ el`, le proprietà magiche **non sono disponibili all'interno di` x-data`** poiché il componente non è ancora inizializzato.

---

### `$el`
**Esempio:**
```html
<div x-data>
    <button @click="$el.innerHTML = 'foo'">Replace me with "foo"</button>
</div>
```

`$el` è una proprietà magica che può essere utilizzata per recuperare il nodo DOM del componente radice.

### `$refs`
**Esempio:**
```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

`$refs` è una proprietà magica che può essere utilizzata per recuperare gli elementi DOM contrassegnati con `x-ref` all'interno del componente. Ciò è utile quando è necessario manipolare manualmente gli elementi DOM.

---

### `$event`
**Esempio:**
```html
<input x-on:input="alert($event.target.value)">
```

`$event` è una proprietà magica che può essere utilizzata all'interno di un listener di eventi per recuperare l'oggetto "Evento" del browser nativo.

> Nota: la proprietà $ event è disponibile solo nelle espressioni DOM.

Se devi accedere a $ event all'interno di una funzione JavaScript puoi passarlo direttamente:

`<button x-on:click="myFunction($event)"></button>`

---

### `$dispatch`
**Esempio:**
```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
    <!-- When clicked, will console.log "bar" -->
</div>
```

**Nota sulla propagazione degli eventi**

Si noti che, a causa di [event bubbling](https://en.wikipedia.org/wiki/Event_bubbling), quando è necessario acquisire eventi inviati da nodi che si trovano sotto la stessa gerarchia di nidificazione, è necessario utilizzare il [ Modificatore `.window`](https://github.com/alpinejs/alpine#x-on):

**Esempio:**

```html
<div x-data>
    <span @custom-event="console.log($event.detail.foo)"></span>
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
<div>
```

> This won't work because when `custom-event` is dispatched, it'll propagate to its common ancestor, the `div`.

**Invio ai componenti**

Puoi anche sfruttare la tecnica precedente per far dialogare i tuoi componenti tra loro:

**Esempio:**

```html
<div x-data @custom-event.window="console.log($event.detail)"></div>

<button x-data @click="$dispatch('custom-event', 'Hello World!')">
<!-- When clicked, will console.log "Hello World!". -->
```

`$dispatch` è una scorciatoia per creare un "CustomEvent" e inviarlo utilizzando internamente `.dispatchEvent()`. Esistono molti buoni casi d'uso per il passaggio di dati tra i componenti utilizzando eventi personalizzati. [Leggi qui](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) per maggiori informazioni sul sistema sottostante `CustomEvent` nei browser.

Noterai che qualsiasi dato passato come secondo parametro a `$ dispatch ('some-event', {some: 'data'})`, diventa disponibile attraverso la nuova proprietà "detail" degli eventi: `$ event.detail.some ". Allegare dati di eventi personalizzati alla proprietà `.detail` è una pratica standard per` CustomEvent` nei browser. [Leggi qui](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail) per maggiori informazioni.

Puoi anche usare `$ dispatch ()` per attivare gli aggiornamenti dei dati per i collegamenti `x-model`. Per esempio:

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')">
        <!-- After the button is clicked, `x-model` will catch the bubbling "input" event, and update foo to "baz". -->
    </span>
</div>
```

> Nota: la proprietà $ dispatch è disponibile solo nelle espressioni DOM.

Se devi accedere a $ dispatch all'interno di una funzione JavaScript puoi passarlo direttamente:

`<button x-on:click="myFunction($dispatch)"></button>`

---

### `$nextTick`
**Se devi accedere a $ dispatch all'interno di una funzione JavaScript puoi passarlo direttamente::**
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

`$nextTick` è una proprietà magica che consente di eseguire una determinata espressione solo DOPO che Alpine ha effettuato gli aggiornamenti DOM reattivi. Ciò è utile per le volte in cui desideri interagire con lo stato DOM DOPO che ha riflesso gli aggiornamenti dei dati che hai effettuato.

---

### `$watch`
**Esempio:**
```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```

Puoi "sorvegliare" una proprietà del componente con il metodo magico `$ watch`. Nell'esempio sopra, quando si fa clic sul pulsante e si cambia `open`, verrà attivato il callback fornito e `console.log` il nuovo valore.

## Sicurezza
Se trovi una vulnerabilità di sicurezza, invia un'e-mail a [calebporzio@gmail.com] ()

Alpine fa affidamento su un'implementazione personalizzata che utilizza l'oggetto `Function` per valutare le sue direttive. Nonostante sia più sicuro di "eval ()", il suo utilizzo è vietato in alcuni ambienti, come l'app Google Chrome, utilizzando il Content Security Policy (CSP) restrittivo.

Se utilizzi Alpine in un sito web che tratta dati sensibili e richiede [CSP](https://csp.withgoogle.com/docs/strict-csp.html), devi includere "unsafe-eval" nella tua politica. Una solida politica configurata correttamente aiuterà a proteggere i tuoi utenti quando utilizzano dati personali o finanziari.

Poiché una politica si applica a tutti gli script nella tua pagina, è importante che altre librerie esterne incluse nel sito web siano attentamente esaminate per garantire che siano affidabili e non introducano alcuna vulnerabilità Cross Site Scripting usando la funzione `eval ()` o manipolare il DOM per iniettare codice dannoso nella tua pagina.

## V3 Roadmap
* Spostarsi da `x-ref` a` ref` per la parità di Vue?
* Aggiungi `Alpine.directive ()`
* Aggiungi `Alpine.component ('foo', {...})` (con il metodo magico `__init ()`)
* Invia eventi alpini per "caricato", "inizio transizione", ecc ... ([# 299](https://github.com/alpinejs/alpine/pull/299))?
* Rimuovi la sintassi "object" (e array) da `x-bind: class =" {'foo': true} "` ([# 236](https://github.com/alpinejs/alpine/pull/236) per aggiungere il supporto per la sintassi degli oggetti per l'attributo `style`)
* Migliora la reattività alla mutazione `x-for` ([# 165](https://github.com/alpinejs/alpine/pull/165))
* Aggiungi il supporto "deep watching" nella V3 ([# 294](https://github.com/alpinejs/alpine/pull/294))
* Aggiungi la scorciatoia "$ el"
* Modificare `@ click.away` in` @ click.outside`?

## Licenza

Copyright © 2019-2020 Caleb Porzio e collaboratori

Concesso in licenza con la licenza MIT, vedere [LICENSE.md](LICENSE.md) per i dettagli.
