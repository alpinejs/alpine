# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true)](https://alpinejs.codewithhugo.com/chat/)

Alpine.js bietet dir die gewohnte Reaktivität und deklarative Natur von Vue und React, verzichtet jedoch auf den gegebenen Ballast, der bei solchen Frameworks anfallen kann.

Du erweiterst dein DOM nur dort um zusätzliche Funktionalität, wo du es für richtig hältst.

Unsere Philosophie erinnert dich vielleicht an [Tailwind](https://tailwindcss.com/), nur eben für Javascript.

> Hinweis: Alpines Syntax baut fast gänzlich auf der Syntax von [Vue](https://vuejs.org/) auf (zum Teil auch von [Angular](https://angularjs.org/)). Ich bin für immer dankbar für den Mehrwert, den diese Frameworks der Entwicklung des Webs gebracht haben.

## Übersetzungen der Dokumentation

| Language | Link for documentation |
| --- | --- |
| Chinese Traditional | [**繁體中文說明文件**](./README.zh-TW.md) |
| German | [**Dokumentation in Deutsch**](./README.de.md) |
| Indonesian | [**Dokumentasi Bahasa Indonesia**](./README.id.md) |
| Japanese | [**日本語ドキュメント**](./README.ja.md) |
| Portuguese | [**Documentação em Português**](./README.pt.md) |
| Russian | [**Документация на русском**](./README.ru.md) |
| Spanish | [**Documentación en Español**](./README.es.md) |

## Installation

**Von einem CDN:** Erweitere deinen HTML-Kopf (`<head>`) um folgendes Skript.
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
```

Das wars. Die Initialisierung passiert automatisch.

Für die Produktionsumgebung wird empfohlen, den Link mit einer spezifischen Versionsnummer zu versehen. Somit kann präventiv sichergestellt werden, dass keine unerwarteten Fehler durch Versionsaktualisierungen zustande kommen.
Als Beispiel wird hier die (letzte) Version `2.8.2` spezifiziert:
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.2/dist/alpine.min.js" defer></script>
```

**Über npm:** Installiere das Paket über npm.
```js
npm i alpinejs
```

Inkludiere es in deinem Skript.
```js
import 'alpinejs'
```

**Für IE11 Support** Nutze stattdessen die folgenden Skripts.
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
```

Da obige Schema wird als [module/nomodule pattern](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/) bezeichnet. Dadurch wird bezweckt, dass in modernen Browsern automatisch das "modern"-Bundle geladen wird, und das IE11-spezifische Bundle automatisch in IE11 und anderen "legacy"-Browsern geladen wird.

## Use

*Dropdown/Modal*
```html
<div x-data="{ open: false }">
    <button @click="open = true">Öffne Dropdown</button>

    <ul
        x-show="open"
        @click.away="open = false"
    >
        Dropdown Inhalt
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

Du kannst es sogar für nicht-triviale Dinge verwenden:
*Pre-fetching a dropdown's HTML content on hover*
```html
<div x-data="{ open: false }">
    <button
        @mouseenter.once="
            fetch('/dropdown-partial.html')
                .then(response => response.text())
                .then(html => { $refs.dropdown.innerHTML = html })
        "
        @click="open = true"
    >Zeige Dropdown</button>

    <div x-ref="dropdown" x-show="open" @click.away="open = false">
        Lade Spinner...
    </div>
</div>
```

## Lerne

Es stehen 14 Direktiven zur Verfügung:

| Direktive | Beschreibung |
| --- | --- |
| [`x-data`](#x-data) | Deklariert einen neuen Komponenten-Geltungsbereich. |
| [`x-init`](#x-init) | Wertet einen Ausdruck aus, sobald die Komponente initialisiert wurde. |
| [`x-show`](#x-show) | Schaltet anhand des Ausdrucks (true oder false) das Element auf `display: none;`. |
| [`x-bind`](#x-bind) | Setzt den Wert eines Attributs auf das Ergebnis eines JS-Ausdrucks. |
| [`x-on`](#x-on) | Verbindet einen EventHandler mit einem HTML-Elemment. Der spezifizierte JS-Code wird nur dann aufgerufen, wenn das jeweilige Ereignis empfangen wird. |
| [`x-model`](#x-model) | Das Direktive sorgt für das Databinding mit Input-Elementen. Hierbei wird ein Databinding in beide Richtungen ermöglicht ("Two way databinding"). |
| [`x-text`](#x-text) | Funktioniert ähnlich wie `x-bind`, wobei hier das `innerText` eines Elements aktualisiert wird. |
| [`x-html`](#x-html) | Funktioniert ähnlich wie `x-bind`, wobei hier das `innerHTML` eines Elements aktualisiert wird. |
| [`x-ref`](#x-ref) | Ermöglicht es, die Elemente einer Komponente im DOM zu referenzieren. |
| [`x-if`](#x-if) | Entfernt ein Element aus dem DOM. Kann nur in Kombination mit `<template>`-Tags benutzt werden. |
| [`x-for`](#x-for) | Erstellt einen neuen DOM-Knoten (node) für jedes Element in einem Array. Kann nur in Kombination mit `<template>`-Tags benutzt werden. |
| [`x-transition`](#x-transition) | Ein Direktive zur Anwedung von Klassen auf unterschiedliche Phasen der Transition eines Elements. |
| [`x-spread`](#x-spread) | Ermöglicht die Bindung von einem Objekt aus Alpine Direktiven an ein Element. Dies erlaubt eine bessere Wiederverwendbarkeit von Direktiven. |
| [`x-cloak`](#x-cloak) | Dieses Attribut wird entfernt, sobald Alpine initalisiert wird. Das Direktive wird genutzt, um das pre-initalisierte DOM auszublenden. |


Und 6 magische Eigenschaften (englisch *magic properties*):

| Magische Eigenschaft | Beschreibung |
| --- | --- |
| [`$el`](#el) | Liefert den DOM-Knoten der Stammkomponente. |
| [`$refs`](#refs) | Liefert jene Elemente des DOM innerhalb der Komponente, welche mit `x-ref` markiert sind. |
| [`$event`](#event) | Liefert das native "Event"-Objekt innerhalb eines EventHandlers.  |
| [`$dispatch`](#dispatch) | Erstellt ein `CustomEvent`, welches intern via `.dispatchEvent()` versendet werden kann. |
| [`$nextTick`](#nexttick) | Führt den gegebenen Ausdruck aus, NACHDEM Alpine die reaktiven DOM-Aktualisierungen durchgeführt hat. |
| [`$watch`](#watch) | Wenn sich der Wert einer beobachteten (englisch *watched*) Eigenschaft einer Komponente ändert, wird die angegebene Callback-Funktion aufgerufen. |


## Sponsoren

<img width="33%" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" alt="Tailwind CSS">

**Du möchtest Sponsor werden? [Schreib mir auf Twitter](https://twitter.com/calebporzio)**

## Gemeinschaftsprojekte

* [AlpineJS Weekly Newsletter](https://alpinejs.codewithhugo.com/newsletter/)
* [Spruce (State Management)](https://github.com/ryangjchandler/spruce)
* [Turbolinks Adapter](https://github.com/SimoTod/alpine-turbolinks-adapter)
* [Alpine Magic Helpers](https://github.com/KevinBatdorf/alpine-magic-helpers)
* [Awesome Alpine](https://github.com/ryangjchandler/awesome-alpine)

### Direktiven

---

### `x-data`

**Beispiel:** `<div x-data="{ foo: 'bar' }">...</div>`

**Struktur:** `<div x-data="[JSON data object]">...</div>`

`x-data` deklariert einen neuen Komponenten-Geltungsbereich. Jede neu erstellte Komponente wird nun mit der angegebenen Datenquelle initialisiert.

Dies verhält sich ähnlich wie die `data`-Eigenschaft einer Vue-Komponente.

**Extrahieren von Komponenten-Logik**

Datenquellen und zugehörige Funktionalität können in wiederverwendbare Funktionen extrahiert werden.

```html
<div x-data="dropdown()">
    <button x-on:click="open">Öffne</button>

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

> **Für Nutzer von Modul-Packern**: Alpine.js ruft Funktionen auf, welche sich im globalen Geltungsbereich (`window`) befinden. Um Funktionen mit `x-data` zu benutzen, müssen sie daher explizit dem Geltungsbereich `window` zugewießen werden. Zum Beispiel `window.dropdown = function () {}` (Dieses Verhalten ist auf Webpack, Rollup, Parcel etc. zurückzuführen. Hier leben selbstdefinierte Funktionen defaultmäßig im Geltungsbereich des Moduls, und nicht `window`).

Durch Objektdestrukturierung können mehrere Datenobjekte an `x-data` übergeben werden:

```html
<div x-data="{...dropdown(), ...tabs()}">
```

---

### `x-init`
**Beispiel:** `<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`

**Struktur:** `<div x-data="..." x-init="[expression]"></div>`

`x-init` Wertet einen Ausdruck aus, sobald die Komponente initialisiert wurde.

Wenn der Code erst aufgerufen werden soll, NACHDEM Alpine die initialen Aktualisierungen des DOM vorgenommen hat (ähnlich zum `mounted()` Lebenszyklus in VueJS), kann eine Callback-Funktion von `x-init` retourniert werden:

`x-init="() => { // Im Funktionsblock haben wir Zugriff auf den Zustand nach der DOM-Initialisierung // }"`

---

### `x-show`
**Beispiel:** `<div x-show="open"></div>`

**Struktur:** `<div x-show="[expression]"></div>`

`x-show` schaltet die Eigenschaft `display: none;` des Elements, je nachdem ob der Ausdruck `true` oder `false` zurückliefert.

**x-show.transition**

`x-show.transition` ist eine convenience API, um Übergänge mit `x-show` durch CSS Transitionen ansprechender zu gestalten.

```html
<div x-show.transition="open">
    Die Inhalte werden mithilfe von Transitionen ein- und ausgeblendet.
</div>
```

| Direktive | Beschreibung |
| --- | --- |
| `x-show.transition` | Ein simultaner Fading- und Skalierungseffekt. (opacity, scale: 0.95, timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), duration-in: 150ms, duration-out: 75ms)
| `x-show.transition.in` | Die Transition gilt nur für den anfänglichen Übergang. |
| `x-show.transition.out` | Die Transition gilt nur für den abschließenden Übergang. |
| `x-show.transition.opacity` | Nur das Fading wird genutzt. |
| `x-show.transition.scale` | Nur die Skalierung wird genutzt. |
| `x-show.transition.scale.75` | Zur Anpassung des Skalierungswerts `transform: scale(.75)`. |
| `x-show.transition.duration.200ms` | Setzt den Wert der anfänglichen Transition auf 200ms. Der Wert der abschließenden Transition nimmt die Hälfte des angegebenen Werts an (in diesem Fall 100ms). |
| `x-show.transition.origin.top.right` | Zur Anpassung des Ursprungs der CSS-Transformation `transform-origin: top right`. |
| `x-show.transition.in.duration.200ms.out.duration.50ms` | Zur Spezifizierung der einzelnen Dauern einer Transition. |

> Hinweis: Alle oben genannten Modifikatoren können miteinander kombiniert werden. Auch solche Spielerein sind möglich (lol): `x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale.95`

> Hinweis: Defaultmäßig wartet `x-show`, bis jede untergeordnete Komponente seine Transition beendet hat. Um dieses Verhalten zu umgehen, kann der Modifikator `.immediate` eingesetzt werden:
```html
<div x-show.immediate="open">
    <div x-show.transition="open">
</div>
```
---

### `x-bind`

> Hinweis: Es kann auch folgende Kurzschreibweise genutzt werden: `:type="..."`

**Beispiel:** `<input x-bind:type="inputType">`

**Struktur:** `<input x-bind:[attribute]="[expression]">`

`x-bind` setzt den Wert eines Attributs auf das Ergebnis eines JavaScript Ausdrucks. Dabei hat der Ausdruck Zugang zu allen Datenquellen der Komponente und wird jedes Mal aktualisiert, wenn sich eine der Datenquellen ändert.

> Hinweis: Attributbindungen aktualisieren sich nur dann, WENN sich deren Abhängigkeiten aktualisieren. Das Framework erkennt solche Abhängigkeiten automatisch und führt dementsprechend Aktualisierungen durch.

**`x-bind` für Klassenattribute**

`x-bind` hat eine spezielle Verhaltensweise, wenn es mit dem Attribut `class` verknüpft wird.

Hierbei wird ein Objekt übergeben, dessen Namen die potenziellen Klassenselektoren sind. Die Werte dieser Paare sind boolesche Ausdrücke, durch welche determiniert wird, ob die Klasse auf das Element angewendet wird oder nicht.

Zum Beispiel:
`<div x-bind:class="{ 'hidden': foo }"></div>`

In diesem Beispiel wird die Klasse "hidden" nur dann angewendet, wenn `foo` den Wert `true` liefert.

**`x-bind` für boolesche Attribute**

`x-bind` unterstützt sowohl Variablen als auch JavaScript Ausdrücke in seiner Bedingung, wenn diese einen booleschen Wert (`true` oder `false`) zurückliefern.

Zum Beispiel:
```html
<!-- Gegeben: -->
<button x-bind:disabled="myVar">Klick mich</button>

<!-- Wenn myVar == true: -->
<button disabled="disabled">Klick mich</button>

<!-- Wenn myVar == false: -->
<button>Klick mich</button>
```

Hier wird das Attribut `disabled` je nach der Auswertung von `myVar` hinzugefügt oder entfernt.


Alle in der [HTML Spezifikation](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute) angeführten booleschen Attribute werden unterstützt. Dazu zählen `disabled`, `readonly`, `required`, `checked`, `hidden`, `selected`, `open`, etc.

**`.camel` Modifikator**
**Beispiel:** `<svg x-bind:view-box.camel="viewBox">`

Mithilfe des Modifikators `camel` kann die Bedingung an die camel-case Schreibweise des angegebenen Attributnamens gebunden werden. In obigen Beispiel wird der Wert von `viewBox` mit dem Attribut `viewBox` (anstelle von `view-box`) verknüpft.

---

### `x-on`

> Hinweis: Es kann auch folgende Kurzschreibweise genutzt werden: `@click="..."`

**Beispiel:** `<button x-on:click="foo = 'bar'"></button>`

**Struktur:** `<button x-on:[event]="[expression]"></button>`

`x-on` bindet einen EventHandler an das HTML-Element. Der spezifizierte JavaScript-Ausdruck wird genau dann ausgewertet, wenn das Ereignis ausgelöst wurde.

Andere Attribute des Elements welche an diese Datenquelle gebunden sind, werden aktualisiert, sobald Daten im Ausdruck modifiziert werden.

> Hinweis: Wahlweise kann auch der Name einer JavaScript-Funktion angegeben werden

**Beispiel:** `<button x-on:click="myFunction"></button>`

Ist äquivalent zu: `<button x-on:click="myFunction($event)"></button>`

**`keydown` Modifikator**

**Beispiel:** `<input type="text" x-on:keydown.escape="open = false">`

Um auf bestimmte Tastaturereignisse zu reagieren, können keydown-Modifikatoren an das Direktive `x-on:keydown` angehängt werden. Die Modifikatoren sind hierbei Werte von `Event.key`, jedoch in kebab-case-Schreibweise.

Beispiele: `enter`, `escape`, `arrow-up`, `arrow-down`

> Hinweis: Zusätzlich kann auch auf System-Modifikator-Tastenkombinationen reagiert werden: `x-on:keydown.cmd.enter="foo"`

**`.away` Modifikator**

**Beispiel:** `<div x-on:click.away="showModal = false"></div>`

Durch die Nutzung des Modifikators `.away`, wird der Ausdruck eines EventHandlers nur dann ausgewertet, wenn das Ereignis nicht vom Element selbst (oder dessen untergeordnete Komponenten) ausgelöst wird.

Dies kann zum Beispiel genutzt werden, um ein Dropdown-Menü oder ein Modal auszublenden, sobald der Nutzer außerhalb des Elements einen Mausklick durchführt.

**`.prevent` Modifikator**
**Beispiel:** `<input type="checkbox" x-on:click.prevent>`

Durch das Anhängen von `.prevent` an einen EventHandler, wir die Methode `preventDefault` auf dem ausgelösten Ereignis ausgeführt. Im obigen Beispiel wird somit die native Funktionalität des `<input>`-Elements unterdrückt, wenn der Nutzer das Element anklickt.

**`.stop` Modifikator**
**Beispiel:** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

Durch das Anhängen von `.stop` an einen EventHandler, wird die Methode `stopPropagation` auf dem ausgelösten Ereignis ausgeführt. Klickt ein Nutzer im obigen Beispiel auf das `<button>`-Element, wird das Ereignis "click" nicht an das übergeordnete Element `<div>` gesendet. Anders gesagt wird im Falle eine Klicks `foo` nicht auf `'bar'` gesetzt.

**`.self` Modifikator**
**Beispiel:** `<div x-on:click.self="foo = 'bar'"><button></button></div>`

Durch das Anhängen von `.self` an einen EventHandler, wird das Ergeinis nur dann behandelt, wenn das `$event.target` das Element selbst ist. Klickt ein Nutzer im obigen Beispiel auf das `<button>`-Element, wird das Ereignis "click" somit **NICHT** im übergeordnete Element `<div>` behandelt.

**`.window` Modifikator**
**Beispiel:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

Durch das Anhängen von `.window` an einen EventHandler, wird der Listener auf das globale Window-Objekt anstelle des zugrundeliegenden DOM-Knotens registriert. Dieses Vorgehen ist beispielsweise hilfreich, wenn du den Zustand einer Komponente modifizieren willst, sobald sich die Eigenschaften des Window-Objekts ändern (zB das Event "resize"). Im obigen Beispiel wird das Modal/Dropdown genau dann geschlossen, wenn die Breite des Window-Objekts 768 Pixel überschreitet. Andernfalls bleibt der momentante Zustand bestehen.

> Hinweis: Nach dem selben Prinzup kann der Modifikator `.document` genutzt werden, um auf Änderungen im Document-Objekt zu reagieren.

**`.once` Modifikator**
**Beispiel:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

Durch das Anhängen von `.once` an einen EventHandler wird sichergestellt, dass das Ereignis nur ein einziges Mal behandelt wird.

**`.passive` Modifikator**
**Beispiel:** `<button x-on:mousedown.passive="interactive = true"></button>`

Durch das Anhängen von `.passive` an einen EventHandler, wird der gegebene Listener passiv. Dadurch wird verhindert, dass das spezifizierte Ereignis abgebrochen werden kann (`preventDefault()` wird ignoriert). Dieses Vorgehen ist zum Beispiel für die Bildlaufleistung auf Touch-Geräten relevant.

**`.debounce` Modifikator**
**Beispiel:** `<input x-on:input.debounce="fetchSomething()">`

Mithilfe des Modifikators `debounce` kann ein EventHandler "debounced" werden. Hiermit wird sichergestellt, dass das spezifierte Ereignis nur dann behandelt wird, wenn eine gewisse Zeitspanne zum letzten Vorkommnis des Ereignisses vergangen ist. Erst wenn der Handler bereit ist, wird die Ereignisbehandlung ausgeführt.

Die defaultmäßige Wartezeit beträgt 250 Millisekunden.

Die Wartezeit kann folgendermaßen individualisiert werden:

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

**`.camel` Modifikator**
**Beispiel:** `<input x-on:event-name.camel="doSomething()">`

Mithilfe des Modifikators `camel` kann ein EventHandler an die camel-case Schreibweise des angegebenen Ereignisnamens gebunden werden. Im obigen Beispiel wird der Ausdruck ausgewertet, sobald ein Ereignis namens `eventName` auf dem Element empfangen wird.

---

### `x-model`
**Beispiel:** `<input type="text" x-model="foo">`

**Struktur:** `<input type="text" x-model="[data item]">`

`x-model` erweitert ein Element um ein "two-way data binding" (d.h. Databinding ist in beide Richtungen möglich). Der Wert des `<input>`-Elements wird mit dem Wert der Komponenten-Datenquelle `item` synchronisiert.

> Hinweis: `x-model` erkennt automatisch Änderungen auf den folgenen Elementen: text inputs, checkboxes, radio buttons, textareas, selects, multiple selects. In den genannten Szenarien sollte die Funktionsweise von `x-model` das [Verhalten von Vue](https://vuejs.org/v2/guide/forms.html) widerspiegeln.

**`.number` Modifikator**
**Beispiel:** `<input x-model.number="age">`

Durch die Nutzung des Modifikators `number` wird der Wert des `<input>`-Elements in eine Zahl umgewandelt. Wenn der Wert hierbei nicht als valide Zahl ausgelesen werden kann, wird der ursprüngliche Wert retourniert.

**`.debounce` Modifikator**
**Beispiel:** `<input x-model.debounce="search">`

Mithilfe des Modifikators `debounce` kann der Aktualisierung eines Wertes ein "debounce" hinzugefügt werden. Hiermit wird sichergestellt, dass das spezifierte Ereignis nur dann behandelt wird, wenn eine gewisse Zeitspanne zum letzten Vorkommnis des Ereignisses vergangen ist. Erst wenn der Handler bereit ist, wird die Ereignisbehandlung ausgeführt.

Die defaultmäßige Wartezeit beträgt 250 Millisekunden.

Die Wartezeit kann folgendermaßen individualisiert werden:

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

---

### `x-text`
**Beispiel:** `<span x-text="foo"></span>`

**Struktur:** `<span x-text="[expression]"`

`x-text` funktioniert ähnlich wie `x-bind`, außer dass anstelle des Wertes eine Attributs, das `innerText` eines Elements aktualisiert wird.

---

### `x-html`
**Beispiel:** `<span x-html="foo"></span>`

**Struktur:** `<span x-html="[expression]"`

`x-html` funktioniert ähnlich wie `x-bind`, außer dass anstelle des Wertes eine Attributs, das `innerHTML` eines Elements aktualisiert wird.

> :warning: **Es wird empfohlen, in diesem Fall nur vertrauenswürdige bzw. selbsterstellte Inhalte zu nutzen und auf nutzererstellte Inhalte zu verzichten.** :warning:
>
> Dynamisch gerendertes HTML von Drittparteien kann leicht zu Sicherheitslücken wie [XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) führen.

---

### `x-ref`
**Beispiel:** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**Struktur:** `<div x-ref="[ref name]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`

`x-ref` Ermöglicht es, die Elemente einer Komponente im DOM zu referenzieren. Wird das Attribut `x-ref` auf ein Element gesetzt, wird das Element durch das `$refs`-Objekt für alle EventHandler verfügbar geemacht.

Dieses Vorgehen präsentiert sich als hilfreiche Alternative, wenn vermehrt der Befehl `document.querySelector` zur Referenzierung von Elementen eingesetzt werden muss.

> Hinweis: Auch dynamische Werte können an x-ref gebunden werden: `<span :x-ref="item.id"></span>`.

---

### `x-if`
**Beispiel:** `<template x-if="true"><div>Some Element</div></template>`

**Struktur:** `<template x-if="[expression]"><div>Some Element</div></template>`

Falls die Funktionalität von `x-show` (`x-show` setzt ein Element auf `display: none`, wenn die Bedingung `false` liefert) nicht ausreichen sollte, kann stattdessen `x-if` genutzt werden, um ein Element vollständig aus dem DOM zu entfernen.

Da Alpine über kein virtuelles DOM verfügt, muss `x-if` unbedingt mit `<template></template>`-Tags genutzt werden. Diese Implementierung erlaubt es Alpine stabil zu bleiben und auf das echte DOM zuzugreifen.

> Hinweis: Im Zuge der Nutzung von `x-if` muss der HTML-Stammknoten innerhalb des `<template></template>`-Tags ein einzelnes Element sein.

> Hinweis: Im Zuge der Nutzung von `template` innerhalb eines `svg`-Tags, muss auf ein [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) zurückgegriffen werden. Die Ausführung des polyfills sollte vor der Initialisierung von Alpine.js stattfinden.

---

### `x-for`
**Beispiel:**
```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

> Hinweis: Das `:key`-Binding ist optional, wird jedoch DRINGEND empfohlen.

`x-for` ist sinnvoll für Fälle, in denen für jedes Element in einem Array ein DOM-Knoten erstellt werden soll. Zwar erinnert die Funktionsweise an `v-for` in Vue, jedoch kann `x-for` nur in Kombination mit `template`-Tags eingesetzt werden (d.h. es besteht keine Kompatibilität mit regulären DOM-Elementen).

Wird Zugriff auf den Index des momentanten Schleifendurchgangs benötigt, kann die folgende Schreibweise eingesetzt werden:

```html
<template x-for="(item, index) in items" :key="index">
    <!-- Bei Bedarf kann "index" innerhalb der Schleife referenziert werden. -->
    <div x-text="index"></div>
</template>
```

Wird Zugriff auf das Array-Ojekt (colletion) des momentanten Schleifendurchgangs benötigt, kann die folgende Schreibweise eingesetzt werden:

```html
<template x-for="(item, index, collection) in items" :key="index">
    <!-- Bei Bedarf kann "collection" innerhalb der Schleife referenziert werden. -->
    <!-- Momentantes Element (item). -->
    <div x-text="item"></div>
    <!-- Selbiges Elemenet wie oben. -->
    <div x-text="collection[index]"></div>
    <!-- Element an der vorherigen Position. -->
    <div x-text="collection[index - 1]"></div>
</template>
```

> Hinweis: Im Zuge der Nutzung von `x-for` muss der HTML-Stammknoten innerhalb des `<template></template>`-Tags ein einzelnes Element sein.

> Hinweis: Im Zuge der Nutzung von `template` innerhalb eines `svg`-Tags, muss auf ein [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) zurückgegriffen werden. Die Ausführung des polyfills sollte vor der Initialisierung von Alpine.js stattfinden.

#### Verschachteln von `x-for`-Schleifen
`x-for`-Schleifen können verschachtelt werden, jedoch MUSS jede Schleife innerhalb eines regulären Elements liegen. Zum Beispiel:

```html
<template x-for="item in items">
    <div>
        <template x-for="subItem in item.subItems">
            <div x-text="subItem"></div>
        </template>
    </div>
</template>
```

#### Iterieren über einen Bereich

Alpine unterstützt die `i in n` Syntax, wobei `n` eine Ganzzahl ist. Dies ermöglicht es, über einen bestimmten Bereich an Elementen zu iterieren.

```html
<template x-for="i in 10">
    <span x-text="i"></span>
</template>
```

---

### `x-transition`
**Beispiel:**
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

> Das obenstehende Beispiel nutzt Klassen aus [Tailwind CSS](https://tailwindcss.com)

Alpine bietet 6 verschiedene Transitionen-Direktiven, um den verschiedenen Phasen einer Transition einen Elements Klassen hinzuzufügen, während sich diese zwischen den Zuständen "hidden" und "shown" befindet. Die Direktiven sind sowohl mit `x-show` als auch mit `x-if` kompatibel.

Sieht man über die Differenzen in der Namensgebung hinweg, verhalten sie sich exakt gleich wie die Transitionen-Direktiven von VueJs. 

| Direktive | Beschreibung |
| --- | --- |
| `:enter` | Wird während der gesamten Eintrittsphase angewendet. |
| `:enter-start` | Wird hinzugefügt, bevor das Element eingefügt wurde. Wird entfernt, ein Frame nachdem das Element eingefügt wurde. |
| `:enter-end` | Wird hinzugefügt, ein Frame nachdem das Element eingefügt wurde (zum selben Zeitpunkt, an dem `enter-start` entfernt wird). Wird enfernt, sobald der Übergang/die Animation beendet ist.
| `:leave` | Wird während der gesamten Austrittsphase angewendet. |
| `:leave-start` |  Wird sofort hinzugefügt, sobald eine ausgehende Transition ausgelöst wird. Wird nach einem Frame entfernt. |
| `:leave-end` | Wird hinzugefügt, ein Frame nachdem eine ausgehende Transition ausgelöst wurde (zum selben Zeitpunkt, an dem `leave-start` entfernt wird). Wird enfernt, sobald der Übergang/die Animation beendet ist. |

---

### `x-spread`
**Beispiel:**
```html
<div x-data="dropdown()">
    <button x-spread="trigger">Öffne Dropdown</button>

    <span x-spread="dialogue">Dropdown Inhalt</span>
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

`x-spread` ermöglicht es, die Alpine-Bindings eines Elements in ein wiederverwendbares Objekt auszulagern.

Die Namen des Objekts sind die Direktiven (jedes mögliche Direktive inklusive Modifikatoren). Die Werte sind Callback-Funktionen, welche von Alpine ausgewertet werden.

> Hinweis: Der einzige Sonderfall von `x-spread` ist dessen Nutzung in Kombination mit `x-for`. Wenn es auf das Direktive `x-for` angewendet wird, sollte ein normaler String-Ausdruck von der Callback-Funktion retourniert werden. Zum Beispiel: `['x-for']() { return 'item in items' }`.

---

### `x-cloak`
**Beispiel:** `<div x-data="{}" x-cloak></div>`

`x-cloak`-Attribute werden vom Element entfernt, sobald Alpine initialisiert wird. Das Direktive wird genutzt, um das pre-initalisierte DOM auszublenden. Typischerweise wird das folgende Styling im globalen Geltungsbereich gesetzt, um die Funktionalität von `x-cloak` sicherzustellen:

```html
<style>
    [x-cloak] { display: none; }
</style>
```

### Magische Eigenschaften

> Mit der Ausnahme von `$el`, sind magische Eigenschaften **nicht innerhalb von `x-data` verfügbar**, da die Komponente noch nicht initialisiert wurde.

---

### `$el`
**Beispiel:**
```html
<div x-data>
    <button @click="$el.innerHTML = 'foo'">Tausch mich mit "foo" aus</button>
</div>
```

`$el` ist eine magische Eigenschaft, um auf den DOM-Knoten der Stammkomponente zuzugreifen.

### `$refs`
**Beispiel:**
```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

`$refs` ist eine magische Eigenschaft, um jene DOM-Elemente innerhalb einer Komponente aufzurufen, welche mit `x-ref` markiert sind. Dies ist nützlich, wenn DOM-Elemente manuell bearbeitet werden müssen.

---

### `$event`
**Beispiel:**
```html
<input x-on:input="alert($event.target.value)">
```

`$event` ist eine magische Eigenschaft, um innerhalb eines EventHandlers auf das native Event-Objekt des Browsers zuzugreifen.

> Hinweis: Die Eigenschaft $event ist nur in DOM-Ausdrücken verfügbar.

Um innerhalb einer JavaScript-Funktion auf $event zuzugreifen, kann dieses als Argument an die Funktion übergeben werden.

`<button x-on:click="myFunction($event)"></button>`

---

### `$dispatch`
**Beispiel:**
```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
    <!-- Wenn geklickt, wird "bar" in der Konsole ausgegeben -->
</div>
```

**Hinweise bezüglich der Ereignisverbreitung (engl. "Event Propagation")**

Wenn Ereignisse abgefangen werden sollen, welche von HTML-Knoten innerhalb derselben Verschachtelungshierarchie ausgelöst werden, muss der Modifikator [`.window`](https://github.com/alpinejs/alpine#x-on) eingesetzt werden. Dieses Verhalten ist auf das [Bubbling von Ereignissen](https://en.wikipedia.org/wiki/Event_bubbling) zurückzuführen:

**Beispiel:**

```html
<div x-data>
    <span @custom-event="console.log($event.detail.foo)"></span>
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
<div>
```

> Das oben beschriebene Konstrukt wird nicht die gewünschte Funktionsweise erfüllen. Wird das Ereignis `custom-event` ausgelöst, wird es an das gemeinsame übergeordnete Element `div` propagiert.

**Versand von Ereignissen an Komponenten**

Die oben beschriebene Methode kann auch dazu verwendet werden, um die Kommunikation zwischen Komponenten zu ermöglichen:

**Beispiel:**

```html
<div x-data @custom-event.window="console.log($event.detail)"></div>

<button x-data @click="$dispatch('custom-event', 'Hello World!')">
<!-- Wenn geklickt, wird "Hello World!" in der Konsole ausgegeben. -->
```

`$dispatch` ist eine Kurzschreibweise für die Erstellung von `CustomEvent` und dessen interner Versand mittels `.dispatchEvent()`. Es gibt zahlreiche Anwendungsfälle, in welchen der Versand von Daten durch benutzerdefinierten Ereignisse zwischen Komponenten eine sinnvolle Option darstellt. [Hier](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) gibt es weitere Informationen bezüglich dem zugrundenliegenden `CustomEvent`-System in Browsern.

Jegliche Datenquelle, welche als zweiter Parameter an `$dispatch('some-event', { some: 'data' })` weitergegeben wird, kann mithilfe der Eigenschaft "detail" aufgerufen werden: `$event.detail.some`. Das Hinzufügen von benutzerdefinierten Ereignis-Daten zur `.detail`-Eigenschaft ist Standard für `CustomEvent`s in Browsern. [Hier](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail) gibt es mehr Informationen dazu.

`$dispatch()` kann zusätzlich genutzt werden, um die Aktualisierung von Daten von `x-model`-Bindings auszulösen. Zum Beispiel:

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')">
        <!-- Nachdem das Element `<button>` angeklickt wurde, wird `x-model` das durch Bubbling verbreitete "input"-Ereignis abfangen und foo auf "baz" setzen. -->
    </span>
</div>
```

> Hinweis: Die Eigenschaft $dispatch ist nur innerhalb von DOM-Ausdrücken verfügbar.

Um innerhalb einer JavaScript-Funktion auf $dispatch zuzugreifen, kann dieses als Argument an die Funktion übergeben werden:

`<button x-on:click="myFunction($dispatch)"></button>`

---

### `$nextTick`
**Beispiel:**
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

`$nextTick` ist eine magische Eigenschaft, durch welche der gegebene Ausdruck erst dann ausgeführt wird, NACHDEM Alpine die reaktiven DOM-Aktualisierungen durchgeführt hat. Dieses Verhalten ist nützlich, wenn mit dem DOM erst interagiert werden soll, NACHDEM alle Datenaktualisierungen durchgeführt wurden.

---

### `$watch`
**Beispiel:**
```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```

Die Eigenschaft einer Komponente kann mithilfe der magischen Methode `$watch` "beobachtet" werden. Erst wenn das `<button>`-Element im obigen Beispiel angeklickt wird und die Eigenschaft `open` aktualisiert wurde, wird die angegebene Callback-Funktion ausgelöst. Der neue Wert wird dann in der Konsole ausgegeben.

## Sicherheit
Wenn du eine Sicherheitslücke findest, sende bitte eine E-mail an [calebporzio@gmail.com]().

Alpine basiert auf einer benutzerdefinierten Implementierung, welche das `Function`-Objekt nutzt, um seine Direktiven auszuwerten. Obwohl dieses Vorgehen sicherer ist als die Auswertung mittels `eval()`, ist dessen Nutzung in manchen Umgebungen nicht gestattet (z.B. in der Google Chrome App, aufgrund der restriktiven Content Security Policy (CSP)).

Wenn du Alpine innerhalb einer Website nutzt, welche sensible Daten verarbeitet und auf [CSP](https://csp.withgoogle.com/docs/strict-csp.html) angewiesen ist, muss die Eigenschaft `unsafe-eval` in die policy eingefügt werden. Eine korrekt konfigurierte policy ist ein sinnvoller Mechanismus, um die persönlichen und finanziellen Daten von Nutzern zu schützen.

Da sich die policy auf alle Skripts einer Seite auswirkt, ist es wichtig sicherzustellen, dass alle benutzten externen Bibliotheken und Pakete auf ihre Sicherheit geprüft wurden. Somit soll verhindert werden, dass deine Webiste Opfer von Cross Site Scripting Attacken (durch `eval()` oder DOM-Manipulation) wird.

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

Copyright © 2019-2021 Caleb Porzio and contributors

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
