# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true)](https://alpinejs.codewithhugo.com/chat/)

Alpine.js gir deg den reaktive og deklarative kvaliteten til store rammeverk som Vue og React, men til en mye lavere kostnad.

Du beholder din DOM og kan drysse over adferd slik du selv finner passende.

Tenk på det som [Tailwind](https://tailwindcss.com/) for JavaScript.

> Merk: Dette verktøyets syntaks er omtrent i sin helhet lånt fra [Vue](https://vuejs.org/) (og i forlengelsen [Angular](https://angularjs.org/)). Jeg er for evig og alltid takknemlig for den gaven disse er til webben.

## Oversatt dokumentasjon

| Språk | Lenke til dokumentasjon |
| --- | --- |
| Arabisk | [**التوثيق باللغة العربية**](./README.ar.md) |
| Kinesisk, forenklet | [**简体中文文档**](./README.zh-CN.md) |
| Kinesisk, tradisjonell | [**繁體中文說明文件**](./README.zh-TW.md) |
| Tysk | [**Dokumentation in Deutsch**](./README.de.md) |
| Indonesisk | [**Dokumentasi Bahasa Indonesia**](./README.id.md) |
| Japansk | [**日本語ドキュメント**](./README.ja.md) |
| Portugisisk | [**Documentação em Português**](./README.pt.md) |
| Russisk | [**Документация на русском**](./README.ru.md) |
| Spansk | [**Documentación en Español**](./README.es.md) |
| Tyrkisk | [**Türkçe Dokümantasyon**](./README.tr.md) |
| Fransk | [**Documentation en Français**](./README.fr.md) |
| Koreansk | [**한국어 문서**](./README.ko.md) |

## Installasjon

**Fra CDN:** Legg til følgende skript på slutten av ditt `<head>`-område.
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
```
Det er alt du trenger å gjøre. Resten initialiserer seg automatisk.

For produksjonsmiljø anbefales det å benytte et spesifikt versjonsnummer i lenken for å unngå uventede feil som følge av nyere versjoner.
For eksempel, for å bruke versjon `2.8.2` (nyeste):
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.2/dist/alpine.min.js" defer></script>
```

**Fra npm:** Installer pakken fra npm.
```js
npm i alpinejs
```
Inkluder den i skriptet ditt.
```js
import 'alpinejs'
```

**For kompabilitet med IE11** Bruk de følgende skriptene i stedet.
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
```
Mønsteret vist her over er det såkalte [module/nomodule pattern](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/), som vil resultere at den moderne bunten lastes i moderne nettlesere, og at bunten til IE11 lastes automatisk i IE11 og andre eldre nettlesere.

## Bruk

*Rullegardinmeny/Modal*
```html
<div x-data="{ open: false }">
    <button @click="open = true">Åpne rullegardinmeny</button>

    <ul
        x-show="open"
        @click.away="open = false"
    >
        Innhold i rullegardinmenyen
    </ul>
</div>
```

*Faner*
```html
<div x-data="{ tab: 'foo' }">
    <button :class="{ 'active': tab === 'foo' }" @click="tab = 'foo'">Foo</button>
    <button :class="{ 'active': tab === 'bar' }" @click="tab = 'bar'">Bar</button>

    <div x-show="tab === 'foo'">Fane Foo</div>
    <div x-show="tab === 'bar'">Fane Bar</div>
</div>
```

Du kan til og med benytte dette for ikke-trivielle ting:
*Forhåndshenting av HTML for en rullegardinmeny ved sveving.*
```html
<div x-data="{ open: false }">
    <button
        @mouseenter.once="
            fetch('/dropdown-partial.html')
                .then(response => response.text())
                .then(html => { $refs.dropdown.innerHTML = html })
        "
        @click="open = true"
    >Vis rullegardinmeny</button>

    <div x-ref="dropdown" x-show="open" @click.away="open = false">
        Lastespinner...
    </div>
</div>
```

## Lære

Det finnes 14 direktiver du kan benytte:

| Direktiv | Beskrivelse |
| --- | --- |
| [`x-data`](#x-data) | Deklarerer et nytt komponentvirkefelt. |
| [`x-init`](#x-init) | Utfører et uttrykk når komponenten er initialisert. |
| [`x-show`](#x-show) | Slår av eller på `display: none;` på elementet avhengig av uttrykket (sant eller usant). |
| [`x-bind`](#x-bind) | Setter verdien av en egenskap til resultatet av et JS-uttrykk. |
| [`x-on`](#x-on) | Kobler en hendelseslytter på elementet. Utfører et JS-uttrykk når den avgis. |
| [`x-model`](#x-model) | Legger til "toveis databinding" til et element. Holder inndataelementet synkronisert med komponentdataene. |
| [`x-text`](#x-text) | Fungerer tilsvarende som `x-bind`, men oppdaterer elementets `innerText`. |
| [`x-html`](#x-html) | Fungerer tilsvarende som `x-bind`, men oppdaterer elementets `innerHTML`. |
| [`x-ref`](#x-ref) | En praktisk måte å hente ut rå DOM-elementer fra komponenten din . |
| [`x-if`](#x-if) | Fjerner et element fullstendig fra DOM. Må brukes på en `<template>`-tagg. |
| [`x-for`](#x-for) | Lager nye DOM-noder for hvert element i en matrise. Må brukes på en `<template>`-tagg. |
| [`x-transition`](#x-transition) | Direktiver for å legge til klasser på forskjellige stadier i et elements overgang. |
| [`x-spread`](#x-spread) | Lar deg binde et objekt med Alpine-direktiver til et element for bedre gjenbrukbarhet. |
| [`x-cloak`](#x-cloak) | Denne egenskapen fjernes i det Alpine initialiseres. Nyttig for å skjule forhåndsinitialisert DOM. |

Og 6 magiske egenskaper:

| Magisk egenskap | Beskrivelse |
| --- | --- |
| [`$el`](#el) |  Henter rot-komponentens DOM-node. |
| [`$refs`](#refs) | Henter DOM-elementer som er markert med `x-ref` inne i komponenten. |
| [`$event`](#event) | Henter det lokale nettleserobjektet "Event" inne i en hendelseslytter.  |
| [`$dispatch`](#dispatch) | Lager en `CustomEvent` og sender den internt ved hjelp av `.dispatchEvent()`. |
| [`$nextTick`](#nexttick) | Utfører et gitt utrykk ETTER AT Alpine har utført sine reaktive oppdateringer i DOM. |
| [`$watch`](#watch) | Gjennomfører det oppgitte tilbakekallet i det øyeblikket en komponentegenskap du har observert ("watched"), har blitt endret. |


## Sponsorer

<img width="33%" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" alt="Tailwind CSS">

**Vil du se din logo her? [DM på Twitter](https://twitter.com/calebporzio)**

## Fellesskapsprosjekter

* [Alpine Devtools](https://github.com/HugoDF/alpinejs-devtools)
* [Alpine Magic Helpers](https://github.com/KevinBatdorf/alpine-magic-helpers)
* [Alpine Weekly Newsletter](https://alpinejs.codewithhugo.com/newsletter/)
* [Spruce (State Management)](https://github.com/ryangjchandler/spruce)
* [Awesome Alpine](https://github.com/ryangjchandler/awesome-alpine)
* [Turbolinks Adapter](https://github.com/SimoTod/alpine-turbolinks-adapter)

### Direktiver

---

### `x-data`

**Eksempel:** `<div x-data="{ foo: 'bar' }">...</div>`

**Struktur:** `<div x-data="[object literal]">...</div>`

`x-data` deklarerer et nytt komponentvirkefelt. Den forteller rammeverket at det skal initialisere en ny komponent med det følgende dataobjektet.

Tenk på det som `data` egenskapen i en Vue-komponent.

**Trekke ut logikk fra komponenten**

Du trekke ut data (og adferd) til gjenbrukbare funksjoner:

```html
<div x-data="dropdown()">
    <button x-on:click="open">Open</button>

    <div x-show="isOpen()" x-on:click.away="close">
        // Rullegardinmeny
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

> **For buntbrukere**, noter deg at Alpine.js benytter funksjoner som er i det globale virkefeltet (`window`). Du må derfor eksplisitt tildele dine funksjoner til `window` for å kunne bruke dem med `x-data`. For eksempel `window.dropdown = function () {}` (dette er fordi du med Webpack, Rollup, Parcel etc. sine `function` som du definerer som standard vil benytte komponentens virkeområde og ikke `window`).

Du kan også mikse inn flere dataobjekter ved å benytte objektdestrukturering:

```html
<div x-data="{...dropdown(), ...tabs()}">
```

---

### `x-init`
**Eksempel:** `<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`

**Struktur:** `<div x-data="..." x-init="[uttrykk]"></div>`

`x-init` utfører et uttrykk når en komponent er initialisert.

Dersom du ønsker å kjøre kode ETTER AT Alpine har utført sine initielle oppdateringer til DOM (slik som en `mounted()`-krok i VueJS), kan du returnere et tilbakekall fra `x-init`, og det vil bli utført etter:

`x-init="() => { // her har vi tilgang tilstanden etter initialisering av DOM // }"`

---

### `x-show`
**Eksempel:** `<div x-show="open"></div>`

**Struktur:** `<div x-show="[uttrykk]"></div>`

`x-show` slår av eller på `display: none;`-stilen på elementet avhengig av om uttrykket løses som `true` eller `false`.

**x-show.transition**

`x-show.transition` er et bekvemmelighets-API for å gjøre dine `x-show` mer behagelig ved å bruke CSS-overganger.

```html
<div x-show.transition="open">
    Dette innholdet vil få en overgang inn og ut.
</div>
```

| Direktiv | Beskrivelse |
| --- | --- |
| `x-show.transition` | En samtidig fadings- og skaleringseffekt. (opacity, scale: 0.95, timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), duration-in: 150ms, duration-out: 75ms)
| `x-show.transition.in` | Kun overgang inn. |
| `x-show.transition.out` | Kun overgang ut. |
| `x-show.transition.opacity` | Kun fading. |
| `x-show.transition.scale` | Kun skalering. |
| `x-show.transition.scale.75` | Tilpass CSS-skaleringen for overgangen `transform: scale(.75)`. |
| `x-show.transition.duration.200ms` | Setter "in"-overgangen til 200ms. Ut vil bli satt til halvparten av det (100ms). |
| `x-show.transition.origin.top.right` | Tilpass utgangspunktet for CSS-overgangen `transform-origin: top right`. |
| `x-show.transition.in.duration.200ms.out.duration.50ms` | Forskjellig varighet for "in" og "out". |

> Merk: Alle disse overgangene kan brukes i sammenheng med hverandre. Dette er mulig (selv om det er tullete lol): `x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale.95`

> Merk: `x-show` venter på at eventuelle barn fullfører sine overganger ut. Hvis du ønsker overstyre denne adferden, legg til modifikatoren `.immediate`:
```html
<div x-show.immediate="open">
    <div x-show.transition="open">
</div>
```
---

### `x-bind`

> Merk: Du står fritt til å bruke den kortere syntaksen ":" `:type="..."`.

**Eksempel:** `<input x-bind:type="inputType">`

**Struktur:** `<input x-bind:[attribute]="[uttrykk]">`

`x-bind` setter verdien for en egenskap til resultatet av et JavaScript-uttrykk. Uttrykket har tilgang til alle nøklene i komponentens dataobjekt, og vil oppdateres hver gang dens data blir oppdatert.

> Merk: egenskapsbindinger oppdateres KUN når deres avhengigheter oppdateres. Rammeverket er smart nok til å observere dataendringer og oppdage hvilke bindinger som er interessert i dem.

**`x-bind` for klasseegenskaper**

`x-bind` oppfører seg litt anderledes når det bindes til `class` egenskapen.

For klasser må du sende inn et objekt hvor nøklene er klassenavn og hvor verdiene er boolske uttrykk for å avgjøre om disse klassenavnene skal anvendes eller ikke.

For eksempel:
`<div x-bind:class="{ 'hidden': foo }"></div>`

I dette eksempelet vil klassen "hidden" kun anvendes dersom verdien av dataegenskapen `foo` er `true`.

**`x-bind` for boolske egenskaper**

`x-bind` støtter boolske egenskaper på samme måte som verdiegenskaper ved å bruke en variabel som betingelse eller et annet JavaScript-uttrykk som løses til enten `true` eller `false`.

For eksempel:
```html
<!-- Gitt at: -->
<button x-bind:disabled="myVar">Klikk meg</button>

<!-- Når myVar == true (sann):  -->
<button disabled="disabled">Klikk meg</button>

<!-- Når myVar == false (usann): -->
<button>Klikk meg</button>
```

Dette legger til eller fjerner egenskapen `disabled` når `myVar` henholdsvis er sann eller usann.

Boolske egenskaper støttes slik de fremkommer i [HTML-spesifikasjonen](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute), for eksempel `disabled`, `readonly`, `required`, `checked`, `hidden`, `selected`, `open`, etc.

> Merk: Hvis du trenger at en usann tilstand vises for egenskapen din, slik som `aria-*`, kjed `.toString()` til verdien når du binder til egenskapen. For eksempel: `:aria-expanded="isOpen.toString()"` vil vedvare uansett om `isOpen` er `true` eller `false`.

**`.camel` modifikator**

**Eksempel:** `<svg x-bind:view-box.camel="viewBox">`

Modifikatoren `camel` binder til et egenskapsnavn med tilsvarende pukkelOrd. I eksempelet over vil verdien av `viewBox` bli bundet til egenskapen `viewBox` i stedet for egenskapen `view-box`.

---

### `x-on`

> Merk: Du står fritt til bruke den kortere syntaksen "@" : `@click="..."`.

**Eksempel:** `<button x-on:click="foo = 'bar'"></button>`

**Struktur:** `<button x-on:[event]="[uttrykk]"></button>`

`x-on` kobler en hendelseslytter til elementet det deklareres på. I det hendelsen avgis vil JavaScript-uttrykket som er satt som dens verdi bli utført. Du kan bruke `x-on` med hvilken som helst hendelse som er tilgjengelig for det elementet du deklarerer direktivet på. For en fullstendig oversikt over hendelser, se [the Event reference on MDN](https://developer.mozilla.org/en-US/docs/Web/Events).

Hvis noen data er modifisert i uttrykket, så vil andre elementegenskaper som er "bundet" til disse dataene bli oppdatert.

> Merk: Du kan også spesifisere navnet på en JavaScript-funksjon.
**Eksempel:** `<button x-on:click="myFunction"></button>`

Dette er tilsvarende til: `<button x-on:click="myFunction($event)"></button>`

**`keydown` modifikatorer**
**Eksempel:** `<input type="text" x-on:keydown.escape="open = false">`

Du kan spesifisere spesifikke taster å lytte etter ved å bruke `keydown`modifikatorer lagt til på direktivet `x-on:keydown`. Merk at modifikatorene er kebabnotasjonen av `Event.key`-verdier.

Eksempler: `enter`, `escape`, `arrow-up`, `arrow-down`

> Merk: Du kan også lytte etter systemmodfiserende tastekombinasjoner som: `x-on:keydown.cmd.enter="foo"`

**`.away` modifikator**
**Eksempel:** `<div x-on:click.away="showModal = false"></div>`

Når modifikatoren `.away` er tilstede, så vil hendelsesbehandlere kun utføres når hendelsen kommer fra en annen kilde enn seg selv, eller dens barn.

Dette er nyttig for å skjule rullegardinmenyer eller modaler i det en bruker klikker seg bort fra dem.

**`.prevent` modifikator**
**Eksempel:** `<input type="checkbox" x-on:click.prevent>`

Legger du til `.prevent` til en hendelseslytter, så vil `preventDefault` bli kalt på den utløste hendelsen. I eksempelet over vil dette bety at avkrysningsruten faktisk ikke blir avkrysset når brukeren klikker på den.

**`.stop` modifikator**
**Eksempel:** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

Legger du til `.stop` til en hendelseslytter, så vil `stopPropagation`bli kalt på den utløste hendelsen. I eksempelet over vil dette bety at hendelsen "click" ikke vil boble fra knappen til det ytre `<div>`. Med andre ord, når en bruker klikker på knappen så vil ikke `foo` bli satt til `'bar'`.

**`.self` modifikator**
**Eksempel:** `<div x-on:click.self="foo = 'bar'"><button></button></div>`

Legger du til `.self`  til en hendelseslytter, så vil hendelsesbehandleren kun bli trigget hvis `$event.target` er det samme elementet. I eksempelet over vil dette bety at hendelsen "click", som bobler fra knappen til det ytre `<div>`  **ikke** utfører hendelsesbehandleren.

**`.window` modifikator**
**Eksempel:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

Legger du til `.window` til en hendelseslytter, så vil lytteren festes på det globale vindusobjektet i stedet for på den DOM-noden som den ble deklarert på. Dette er nyttig i tilfeller hvor du ønsker å modifisere komponentens tilstand når noe endres i vinduet, eksempelvis hendelsen for endring av vinduets størrelse. I dette eksempelet betyr det at hvis viduet økes til en bredde større enn 768 piksler, så stenger vi modalen/rullegardinmenyen, eller i motsatt fall opprettholder vi samme tilstand.

>Merk: Du kan også bruke modifikatoren `.document` for å legge til lyttere til `document` i stedet for `window`

**`.once` modifikator**
**Eksempel:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

Legger du til modifikatoren `.once` til en hendelseslytter, så sikrer det at lytteren kun blir behandlet én gang. Dette er nytt for ting du ønsker gjort én gang, som å hente HTML-partieller og lignende.

**`.passive` modifikator**
**Eksempel:** `<button x-on:mousedown.passive="interactive = true"></button>`

Legger du til modifikatoren `.passive`til en hendelseslytter, blir den passiv, hvilket betyr at `preventDefault()` ikke vil fungere for hendelser som blir behandlet. Dette kan for eksempel bidra til bedre ytelse ved rulling på berøringsenheter.

**`.debounce` modifikator**
**Eksempel:** `<input x-on:input.debounce="fetchSomething()">`

Modifikatoren `debounce` lar deg midlertidig "avvise" en hendelseslytter. Med andre ord, hendelseslytteren vil IKKE behandles inntil en bestemt mengde tid har forløpt siden hendelsen sist ble fyrt av. Når behandleren er klar til å bli kallet, så vil den siste behandleren blir utført.

Standard "ventetid" er 250 millisekunder.

Hvis du ønsker å tilpasse dette, så kan du spesifisere en tilpasset ventetid på denne måten:

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

**`.camel` modifikator**
**Eksempel:** `<input x-on:event-name.camel="doSomething()">`

Modifikatoren `camel` fester en hendelseslytter med et camelCase-navn som samsvarer med navnet på hendelsen. I eksempelet over, så vil uttrykket over bli evaluert når hendelsen ´eventName´ fyres av på elementet.

---

### `x-model`
**Eksempel:** `<input type="text" x-model="foo">`

**Struktur:** `<input type="text" x-model="[data item]">`

`x-model` legger til "toveis databinding" til et element. Med andre ord, verdien til et inndataelement vil bli holdt synkronisert ved verdien til dataelementet i komponenten.

> Merk: `x-model` er smart nok til å oppdage endringer i tekstinndataelement, avkrysningsbokser, radioknapper, tekstområde, selects, and multiple selects. I slike scenario oppfører den seg [slik Vue ville gjort](https://vuejs.org/v2/guide/forms.html).

**`.number` modifikator**
**Eksempel:** `<input x-model.number="age">`

Modifikatoren `number` konverterer en inndataverdi til et nummer. Hvis verdien ikke kan parses som et gyldig nummer, returneres den originale verdien.

**`.debounce` modifikator**
**Eksempel:** `<input x-model.debounce="search">`

Modifikatoren `debounce` lar deg legge til en "avviser" til oppdateringen av en verdi. Med andre ord, hendelsesbehandleren vil IKKE behandles inntil en bestemt mengde tid siden hendelsen sist ble fyrt av. Når behandleren er klar til å bli kallet, så vil den siste behandleren bli utført.

Standard "ventetid" er 250 millisekunder.

Hvis du ønsker å tilpasse dette, så kan du spesifisere en tilpasset ventetid på denne måten:

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

---

### `x-text`
**Eksempel:** `<span x-text="foo"></span>`

**Struktur:** `<span x-text="[uttrykk]"`

`x-text` fungerer tilsvarende som  `x-bind`, men i stedet for å oppdatere verdien til en egenskap, så oppdaterer den elementets `innerText`.

---

### `x-html`
**Eksempel:** `<span x-html="foo"></span>`

**Struktur:** `<span x-html="[uttrykk]"`

`x-html` fungerer tilsvarende som `x-bind`, men i stedet for å oppdatere verdien til en egenskap, så oppdaterer den elementets `innerHTML`.

> :warning: **Bruk kun innhold du kan stole på, og aldri innhold som kommer fra brukere.** :warning:
>
> HTML som blir gjengitt dynamisk fra tredjepart kan lett føre til [XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting)-sårbarheter.

---

### `x-ref`
**Eksempel:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**Struktur:** `<div x-ref="[ref name]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`

Med `x-ref` får du en praktisk måte å hente ut rå DOM-elementer fra dine komponenter. Setter du en `x-ref`-egenskap på et element, så gjør du det tilgjengelig for alle hendelsesbehandlere inne i et objekt kalt `$refs`.

Dette er et nyttig alternativ til å sette id-er og så bruke `document.querySelector` over alt.

> Merk: du kan også binde dynamiske verdier til x-ref: `<span :x-ref="item.id"></span>`.

---

### `x-if`
**Eksempel:** `<template x-if="true"><div>Et element</div></template>`

**Struktur:** `<template x-if="[expression]"><div>Et element</div></template>`

For de tilfeller hvor `x-show` ikke er tilstrekkelig (`x-show` setter et element til `display: none` dersom den er usann), så kan `x-if` brukes til å fullstendig fjerne et element fra DOM.

Det er viktig at `x-if` brukes på en `<template></template>`-tagg, fordi Alpine ikke bruker en virtuell DOM. Denne implementasjonen holder Alpine robust og gjør at den kan bruke den ekte DOM for sin magi.

> Merk: `x-if` må ha ett enkelt rotelement inne i `<template></template>`-taggen.

> Merk: Ved bruk av `template` i en `svg`-tagg, må du legge til en [polyfyll](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538), som må kjøres før Alpine.js er initialisert.

---

### `x-for`
**Eksempel:**
```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

> Merk: bindingen `:key` er valgfri, men HØYST anbefalt.

`x-for` er tilgjengelig for tilfeller der du vil opprette nye DOM-noder for hvert element i en matrise. Dette skal se ut som `v-for` i Vue, med det unntak at den må eksistere på en `template`-tagg, og ikke et vanlig DOM-element.

Hvis du vil ha tilgang til gjeldende indeks for iterasjonen, bruker du følgende syntaks:

```html
<template x-for="(item, index) in items" :key="index">
    <!-- Du kan også referere til "index" inne i iterasjonen om du behøver det. -->
    <div x-text="index"></div>
</template>
```

Hvis du vil ha tilgang til arrayobjektet ("collection") av iterasjonen, bruker du følgende syntaks:

```html
<template x-for="(item, index, collection) in items" :key="index">
    <div>
        <!-- Du kan også referere til "collection" inne i iterasjonen om du behøver det. -->
        <!-- Current item. -->
        <div x-text="item"></div>
        <!-- Samme som over. -->
        <div x-text="collection[index]"></div>
        <!-- Forrige enhet. -->
        <div x-text="collection[index - 1]"></div>
    </div>
</template>
```

> Merk: `x-for` må ha ett enkelt rotelement inne i `<template></template>`-taggen.

> Merk: Ved bruk av `template` i en `svg`-tagg, må du legge til en [polyfyll](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538), som må kjøres før Alpine.js er initialisert.

#### Nøsting av `x-for`
Du kan nøste `x-for`-løkker, med du MÅ pakke inn hver løkke i et element. For eksempel:

```html
<template x-for="item in items">
    <div>
        <template x-for="subItem in item.subItems">
            <div x-text="subItem"></div>
        </template>
    </div>
</template>
```

#### Iterere over et område

Alpine støtter syntaksen `i in n`, hvor `n` er et heltall, slik at du kan iterere over et fastsatt område med elementer.

```html
<template x-for="i in 10">
    <span x-text="i"></span>
</template>
```

---

### `x-transition`
**Eksempel:**
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

> Eksempelet over bruker klasser fra [Tailwind CSS](https://tailwindcss.com).

Alpine tilbyr 6 forskjellige overgangsdirektiver for å anvende klasser på forskjellige stadier av et elementets overgang mellom "skjulte" og "viste" stater. Disse direktivene fungerer både med `x-show` og `x-if`.

Disse oppfører seg akkurat slik som VueJS' overgangsdirektiver, bortsett fra at de har forskjellige, mer fornuftige navn:

| Direktiv | Beskrivelse |
| --- | --- |
| `:enter` | Brukes i løpet av hele inngangsfasen. |
| `:enter-start` | Legges til før elementet settes inn, fjernes én ramme etter at elementet er satt inn. |
| `:enter-end` | Legges til én ramme etter at elementet er satt inn (samtidig fjernes `enter-start`). Fjernes når overgangen / animasjonen er ferdig.
| `:leave` | Brukes i løpet av hele utgangsfasen. |
| `:leave-start` | Legges til umiddelbart når en utgående overgang utløses, fjernes etter én ramme. |
| `:leave-end` | Legges til én ramme etter at en utgangsovergang er utløst (samtidig fjernes `leave-start`). Fjernes når overgangen / animasjonen er ferdig.


---

### `x-spread`
**Eksempel:**
```html
<div x-data="dropdown()">
    <button x-spread="trigger">Åpne rullegardinmeny</button>

    <span x-spread="dialogue">Innhold i rullegardinmenyen</span>
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

`x-spread` lar deg trekke ut elementets Alpine-bindinger til et gjenbrukbart objekt.

Objektnøklene er direktivene (kan være et hvilket som helst direktiv inkludert modifikatorer), og verdiene er tilbakekallinger som skal evalueres av Alpine.

> Merk: Det er et par forbehold å legge merke til ved bruk av x-spread:
> - Dersom direktivet som blir "spredt" er `x-for`, bør du returnere en vanlig uttrykksstreng fra tilbakekallet. For eksempel: `['x-for']() { return 'item in items' }`.
> - `x-data` og `x-init` kan ikke benyttes inne i et "spread"-object.

---

### `x-cloak`
**Eksempel:** `<div x-data="{}" x-cloak></div>`

`x-cloak`-egenskaper fjernes fra elementene når Alpine initialiseres. Dette er nyttig for å skjule forhåndsinitialisert DOM. For at dette skal fungere legger man typisk til følgende globale stil:

```html
<style>
    [x-cloak] {
        display: none !important;
    }
</style>
```

### Magiske egenskaper

> Med unntak av `$el`, så er magiske egenskaper **ikke tilgjengelig inne i `x-data`** da komponenten der ennå ikke er initialisert.

---

### `$el`
**Eksempel:**
```html
<div x-data>
    <button @click="$el.innerHTML = 'foo'">Erstatt meg med "foo"</button>
</div>
```

`$el` er en magisk egenskap som kan benyttes til å hente ut rotkomponentens DOM-node.

### `$refs`
**Eksempel:**
```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

`$refs` er en magisk egenskap som kan benyttes til å hente ut DOM-elementer markert med `x-ref` inne i komponenten. Dette er nyttig når du har behov for å endre DOM-elementer manuelt.

---

### `$event`
**Eksempel:**
```html
<input x-on:input="alert($event.target.value)">
```

`$event`  er en magisk egenskap som kan benyttes inne i en hendelseslytter for å hente ut nettleserens lokale "Event"-objekt.

> Merk: Egenskapen $event er kun tilgjengelig i DOM-uttrykk.

Hvis du trenger tilgang til $event inne i en JavaScript-funksjon, så kan du sende den inn direkte:

`<button x-on:click="myFunction($event)"></button>`

---

### `$dispatch`
**Eksempel:**
```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
    <!-- Når knappen klikkes, så skrives "bar" til console.log -->
</div>
```

**Merknad om hendelsesforplantning**

Vær oppmerksom på at som følge av [hendelsesbobling](https://en.wikipedia.org/wiki/Event_bubbling) må du bruke modifikatoren [`.window`](https://github.com/alpinejs/alpine#x-on) når du skal fange hendelser under samme nøstede hierarki:

**Eksempel:**

```html
<div x-data>
    <span @custom-event="console.log($event.detail.foo)"></span>
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
<div>
```

> Dette vil ikke fungere fordi når `custom-event` sendes, så vil den forplante seg til dens felles forfar, som her er `div`.

**Avsending til komponenter**

Du kan også dra nytte av den forrige teknikken for å få komponentene til å snakke med hverandre:

**Eksempel:**

```html
<div x-data @custom-event.window="console.log($event.detail)"></div>

<button x-data @click="$dispatch('custom-event', 'Hello World!')">
<!-- Når knappen klikkes, så skrives "Hello World!" til console.log. -->
```

`$dispatch` er en forkortelse for å lage en `CustomEvent` og sende den internt ved hjelp av `.dispatchEvent()`. Det er mange gode bruksområder for å formidle data rundt og mellom komponenter ved hjelp av tilpassede hendelser. [Les her](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) for mer informasjon om det underliggende `CustomEvent`-systemet i nettlesere.

Du vil legge merke til at data som sendes som den andre parameteren til `$dispatch('some-event', { some: 'data' })`, blir tilgjengelig gjennom den nye hendelsen "detail"-egenskapen: `$event.detail.some`. Å legge til egendefinerte hendelsesdata til egenskapen `.detail` er standard praksis for `CustomEvent` i nettlesere. [Les her](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail) for mer informasjon.

Du kan også bruke `$dispatch()` for å trigge dataoppdateringer `x-model`-bindinger. For eksempel:

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')">
            <!-- Etter at knappen her blir klikket, så vil `x-model` fange den boblende "input"-hendelsen og oppdatere foo til "baz". -->
    </span>
</div>
```

> Merk: Egenskapen $dispatch er kun tilgjengelig i DOM-uttrykk.

Hvis du trenger tilgang til $dispatch inne i en JavaScript-funksjon, så kan du sende den inn direkte:

`<button x-on:click="myFunction($dispatch)"></button>`

---

### `$nextTick`
**Eksempel:**
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

`$nextTick` er en magisk egenskap som lar deg bare utføre et gitt uttrykk etter at Alpine har gjort sine reaktive DOM-oppdateringer. Dette er nyttig når du vil samhandle med DOM-tilstanden ETTER at den gjenspeiler dataoppdateringer du har gjort.

---

### `$watch`
**Eksempel:**
```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```
Du kan observere ("watch") en komponentegenskap med den magiske metoden `$watch`. I eksempelet over betyr det at når du klikker på knappen og `open` endres, så vil det oppgitte tilbakekallet bli avfyrt og den nye verdien skrives til `console.log`.

## Sikkerhet
Hvis du finner et sikkerhetsavvik, vennligst send en e-post til [calebporzio@gmail.com]().

Alpine benytter seg av en tilpasset implementasjon i form av `Function`-objektet for å evaluere sine direktiver. Til tross for at den er mer sikker enn `eval()`, så er den ikke tillatt i alle miljøer, slik som Google Chrome App, når den bruker restriktiv Content Security Policy (CSP).

Hvis du benytter Alpine på et nettsted hvor sensitive data håndeteres og hvor [CSP](https://csp.withgoogle.com/docs/strict-csp.html) er påkrevd, må du inkludere `unsafe-eval` i din policy. En robust policy, riktig konfigurert, vil bidra til å beskytte brukerne dine når du håndterer personlige eller økonomiske data.

Siden en policy gjelder alle skript på siden din, er det viktig at andre eksterne biblioteker som er inkludert på nettstedet, blir nøye gjennomgått for å sikre at de er pålitelige og at de ikke vil innføre noen Cross Site Scripting-sårbarheter enten ved å bruke `eval()`-funksjonen eller ved å manipulere DOM for å injisere skadelig kode på siden din.

## Veikart til V3
* Endre fra `x-ref` til `ref` for Vue-paritet?
* Legge til `Alpine.directive()`
* Legge til `Alpine.component('foo', {...})` (Med magisk `__init()`-metode)
* Sende Alpine-hendelser for "loaded", "transition-start", etc... ([#299](https://github.com/alpinejs/alpine/pull/299)) ?
* Fjerne "object" (og matrise) syntaks fra `x-bind:class="{ 'foo': true }"` ([#236](https://github.com/alpinejs/alpine/pull/236) for å legge til støtte for objektsyntaks for `style`-egenskapen)
* Forbedre `x-for` mutasjonsreaktivitet ([#165](https://github.com/alpinejs/alpine/pull/165))
* Legge til "deep watching" støtte i V3 ([#294](https://github.com/alpinejs/alpine/pull/294))
* Legge til `$el` snarvei
* Endre `@click.away` til `@click.outside`?

## Lisens

Opphavsrettslig beskyttet © 2019-2021 Caleb Porzio og bidragsytere.

Lisensiert under MIT-lisensen, se [LICENSE.md](LICENSE.md) for detaljer.
