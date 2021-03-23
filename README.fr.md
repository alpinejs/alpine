# Alpine.js

![npm bundle size](https://img.shields.io/bundlephobia/minzip/alpinejs)
![npm version](https://img.shields.io/npm/v/alpinejs)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true)](https://alpinejs.codewithhugo.com/chat/)

Alpine.js offre les propriétés déclaratives et réactives des grands frameworks tels que Vue ou React à un coût bien moindre.

Le DOM est préservé, et vous pouvez lui attribuer les comportements comme bon vous semble.

C'est un peu le [Tailwind](https://tailwindcss.com/) du JavaScript.

> Note : La syntaxe de cet outil est presque entièrement inspirée de [Vue](https://vuejs.org/) (et par extension [Angular](https://angularjs.org/)). Je suis à jamais reconnaissant pour ce qu'ils ont apporté au web.

## Documentations traduites

| Langue | Lien vers la documentation |
| --- | --- |
| Chinois Traditionel | [**繁體中文說明文件**](./README.zh-TW.md) |
| Allemand | [**Dokumentation in Deutsch**](./README.de.md) |
| Indonesien | [**Dokumentasi Bahasa Indonesia**](./README.id.md) |
| Japonais | [**日本語ドキュメント**](./README.ja.md) |
| Portuguais | [**Documentação em Português**](./README.pt.md) |
| Russe | [**Документация на русском**](./README.ru.md) |
| Espagnol | [**Documentación en Español**](./README.es.md) |
| Français | [**Documentation en Français**](./README.fr.md) |

## Installation

**Avec CDN :** Ajoutez le script suivant à la fin de votre section `<head>`.
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
```

C'est tout. L'initialisation est automatique.

Dans les environnements de production, il est recommandé d'inscrire un numéro de version spécifique dans le lien, afin d'éviter qu'une nouvelle version ne provoque un comportement inattendu.
Par exemple, pour utiliser la version `2.8.2` (la dernière) :
```html
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.2/dist/alpine.min.js" defer></script>
```

**Avec npm :** Installer le paquet avec npm.
```js
npm i alpinejs
```

Importez-le dans votre script.
```js
import 'alpinejs'
```

**Pour la compatibilité IE11** utilisez plutôt les scripts suivants.
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
```

Le schéma ci-dessus représente le [schéma module/nomodule](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/). Il permet  de faire en sorte que le pack soit automatiquement chargé dans les navigateurs modernes, mais aussi pour IE11 et les autres navigateurs anciens.

## Utilisation

*Menu déroulant/Modal*
```html
<div x-data="{ open: false }">
    <button @click="open = true">Ouvrir le menu</button>

    <ul
        x-show="open"
        @click.away="open = false"
    >
        Elément de menu
    </ul>
</div>
```

*Onglets*
```html
<div x-data="{ tab: 'foo' }">
    <button :class="{ 'active': tab === 'foo' }" @click="tab = 'foo'">Foo</button>
    <button :class="{ 'active': tab === 'bar' }" @click="tab = 'bar'">Bar</button>

    <div x-show="tab === 'foo'">Onglet Foo</div>
    <div x-show="tab === 'bar'">Onglet Bar</div>
</div>
```

Vous pouvez même l'utiliser pour faire des choses moins courantes:
*Précharger le HTML d'un élément de menu lors du survol.*
```html
<div x-data="{ open: false }">
    <button
        @mouseenter.once="
            fetch('/dropdown-partial.html')
                .then(response => response.text())
                .then(html => { $refs.dropdown.innerHTML = html })
        "
        @click="open = true"
    >Afficher Menu</button>

    <div x-ref="dropdown" x-show="open" @click.away="open = false">
        Chargement Spinner...
    </div>
</div>
```

## Apprentissage

Il existe 14 directives disponibles:

| Directive | Description |
| --- | --- |
| [`x-data`](#x-data) | Déclare la portée d'un nouveau composant. |
| [`x-init`](#x-init) | Exécute une expression lors de l'initialisation d'un composant. |
| [`x-show`](#x-show) | Alterne `display: none;` sur l'élément selon l'expression (true ou false). |
| [`x-bind`](#x-bind) | Fixe la valeur d'un attribut au résultat d'une expression JS. |
| [`x-on`](#x-on) | Attache un écouteur d'évènement à l'élément. Exécute une expression JS lorsque l'évènement est déclenché. |
| [`x-model`](#x-model) | Ajoute une liaison de données bidirectionnelle (two-way data binding) à un élément. Conserve la synchronisation de l'élément d'entrée avec les données du composant. |
| [`x-text`](#x-text) | Fonctionne de manière similaire à `x-bind`, mais avec mise à jour du `innerText` d'un élément. |
| [`x-html`](#x-html) | Fonctionne de manière similaire à `x-bind`, mais avec mise à jour du `innerHTML` d'un élément. |
| [`x-ref`](#x-ref) | Un moyen pratique de récupérer des éléments bruts du DOM de votre composant. |
| [`x-if`](#x-if) | Supprime totalement un élément du DOM. Doit s'utiliser avec la balise `<template>`. |
| [`x-for`](#x-for) | Crée de nouveaux noeuds DOM pour chaque élément d'un tableau. Doit s'utiliser avec la balise `<template>`. |
| [`x-transition`](#x-transition) | Directives pour renseigner les classes aux différentes étapes de transition d'un élément. |
| [`x-spread`](#x-spread) | Permet de lier l'objet de directives d'Alpine à un élément pour une meilleure réutilisation. |
| [`x-cloak`](#x-cloak) | Cet attribut est supprimé lorsque Alpine s'initialise. Utile pour masquer les DOM pré-initialisés. |

Et 6 propriétés magiques:

| Propriétés magiques | Description |
| --- | --- |
| [`$el`](#el) |  Récupère le nœud DOM du composant racine. |
| [`$refs`](#refs) | Récupère les éléments du DOM marqués par `x-ref` à l'intérieur du composant. |
| [`$event`](#event) | Récupère l'objet natif "Event" du navigateur dans un écouteur d'évènements.  |
| [`$dispatch`](#dispatch) | Crée un `CustomEvent` et le distribue à l'aide de `.dispatchEvent()` en interne. |
| [`$nextTick`](#nexttick) | Exécute une expression donnée APRES qu'Alpine ait fait ses mises à jour réactives du DOM. |
| [`$watch`](#watch) | Effectue un rappel (callback) préalablement défini lorsque la propriété d'un composant "surveillé" (watch) est modifiée. |


## Sponsors

<img width="33%" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" alt="Tailwind CSS">

**Votre logo ici ? [DM sur Twitter](https://twitter.com/calebporzio)**

## Projets Communautaires

* [AlpineJS Weekly Newsletter](https://alpinejs.codewithhugo.com/newsletter/)
* [Spruce (State Management)](https://github.com/ryangjchandler/spruce)
* [Turbolinks Adapter](https://github.com/SimoTod/alpine-turbolinks-adapter)
* [Alpine Magic Helpers](https://github.com/KevinBatdorf/alpine-magic-helpers)
* [Awesome Alpine](https://github.com/ryangjchandler/awesome-alpine)

### Directives

---

### `x-data`

**Exemple :** `<div x-data="{ foo: 'bar' }">...</div>`

**Structure :** `<div x-data="[object literal]">...</div>`

`x-data` déclare la portée d'un nouveau composant. Indique au framework d'initialiser un nouveau composant avec le prochain objet de données.

Il faut voir cela comme la propriété de `données` d'un composant Vue.

**Extraction de la Logique des Composants**

Vous pouvez extraire les données (et le comportement) en fonctions réutilisables :

```html
<div x-data="dropdown()">
    <button x-on:click="open">Ouvrir</button>

    <div x-show="isOpen()" x-on:click.away="close">
        // Menu déroulant
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

> **Pour les utilisateurs de modules bundler**, notez que Alpine.js accède à des fonctions qui sont dans la portée globale (`window`). Vous devrez explicitement assigner vos fonctions à `window` pour les utiliser avec `x-data`. Par exemple `window.dropdown = function () {}` ( c'est parce qu'avec Webpack, Rollup, Parcel etc. les fonctions que vous écrivez sont par défaut dans la portée du module et non dans celle de la page - `window`).


Vous pouvez également mélanger plusieurs objets de données en utilisant la décomposition d'objet :

```html
<div x-data="{...dropdown(), ...tabs()}">
```

---

### `x-init`
**Exemple :** `<div x-data="{ foo: 'bar' }" x-init="foo = 'baz'"></div>`

**Structure :** `<div x-data="..." x-init="[expression]"></div>`

`x-init` exécute une expression lorsqu'un composant est initialisé.

Si vous souhaitez exécuter du code APRES qu'Alpine ait effectué ses mises à jour initiales dans le DOM (un peu comme le hook `mounted()` de VueJS), vous pouvez retourner un callback depuis `x-init`, et il sera ensuite exécuté :

`x-init="() => { // on a ici accès à l'état du DOM post-initialisation // }"`

---

### `x-show`
**Exemple :** `<div x-show="open"></div>`

**Structure :** `<div x-show="[expression]"></div>`

`x-show` alterne le style `display: none;` sur l'élément selon que l'expression retourne `true` ou `false`.

**x-show.transition**

`x-show.transition` est une API de commodité pour rendre vos `x-show` plus agréables en utilisant des transitions CSS.

```html
<div x-show.transition="open">
    Le contenu ici fera l'objet de transitions "in" et "out".
</div>
```

| Directive | Description |
| --- | --- |
| `x-show.transition` | Fondu et échelle simultanés. (opacity, scale: 0.95, timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), duration-in: 150ms, duration-out: 75ms)
| `x-show.transition.in` | Transition `in` seule. |
| `x-show.transition.out` | Transition `out` seule. |
| `x-show.transition.opacity` |Fondu seul. |
| `x-show.transition.scale` | Echelle seule. |
| `x-show.transition.scale.75` | Personnalise la modification CSS de l'échelle `transform: scale(.75)`. |
| `x-show.transition.duration.200ms` | Fixe la transition "in" à 200 ms. La transition "out" sera fixée à la moitié de cette valeur (100 ms). |
| `x-show.transition.origin.top.right` | Personnalise l'origine de la transformation CSS `transform-origin: top right`. |
| `x-show.transition.in.duration.200ms.out.duration.50ms` | Durées différentes pour "in" et "out". |

> Note : Tous ces modificateurs de transition peuvent être utilisés conjointement les uns avec les autres. Il est même possible de faire ceci (bien que ridicule lol) : `x-show.transition.in.duration.100ms.origin.top.right.opacity.scale.85.out.duration.200ms.origin.bottom.left.opacity.scale.95`

> Note : `x-show` attendra que les objets enfants aient terminé leur transition. Si vous voulez contourner ce comportement, ajoutez le modificateur `.immediate` :
```html
<div x-show.immediate="open">
    <div x-show.transition="open">
</div>
```
---

### `x-bind`

> Note : vous êtes libre d'utiliser la syntaxe ":" plus courte: `:type="..."`.

**Exemple :** `<input x-bind:type="inputType">`

**Structure :** `<input x-bind:[attribute]="[expression]">`

`x-bind` fixe la valeur d'un attribut au résultat d'une expression JavaScript. Cette expression a accès à toutes les clés de l'objet de données du composant, et se met à jour à chaque fois que ses données changent.

> Note : les liaisons d'attributs (attribute bindings) ne se mettent à jour QUE lorsque leurs dépendances changent. Le framework est suffisamment intelligent pour observer les changements de données et détecter les liens qui les concernent.

**`x-bind` pour les attributs de classe**

`x-bind` se comporte un peu différemment lorsqu'il est lié à l'attribut `class`.

En ce qui concerne les classes, vous passez un objet dont les clés sont des noms de classe, et les valeurs sont des expressions booléennes pour déterminer si ces noms de classe sont appliqués ou non.

Par exemple :
`<div x-bind:class="{ 'hidden': foo }"></div>`

Dans cet exemple, la classe "hidden" ne sera appliquée que si la valeur de l'attribut de données `foo` est `true`.

**`x-bind` pour les attributs booléens**

`x-bind` supporte les attributs booléens de la même manière que les attributs de valeur, en utilisant une variable comme condition ou toute expression JavaScript qui se résout en `true` ou `false`.

Par exemple :
```html
<!-- Soit: -->
<button x-bind:disabled="myVar">Cliquez moi</button>

<!-- Lorsque myVar == true: -->
<button disabled="disabled">Cliquez moi</button>

<!-- Lorsque myVar == false: -->
<button>Cliquez moi</button>
```

Cela ajoute ou supprime l'attribut `disabled` lorsque la valeur de `myVar` est respectivement vraie ou fausse.

Les attributs booléens sont pris en charge conformément à la [spécification HTML](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute), par exemple `disabled`, `readonly`, `required`, `checked`, `hidden`, `selected`, `open`, etc.

> Note : Si vous avez besoin d'un état `false` pour afficher un attribut, comme par exemple `aria-*`, chainez `.toString()` à la valeur tout en liant l'attribut (bind). Par exemple : `:aria-expanded="isOpen.toString()"` va persister, que `isOpen` soit `true` ou `false`.

**Modificateur `.camel`**
**Exemple :** `<svg x-bind:view-box.camel="viewBox">`

Le modificateur `camel` liera l'équivalent "camel case" au nom de l'attribut. Dans l'exemple ci-dessus, la valeur de `viewBox` sera liée à l'attribut `viewBox` par opposition à l'attribut  `view-box`.

---

### `x-on`

> Note : Vous êtes libre d'utiliser la syntaxe "@" plus courte : `@click="..."`.

**Exemple :** `<button x-on:click="foo = 'bar'"></button>`

**Structure :** `<button x-on:[event]="[expression]"></button>`

`x-on` rattache un écouteur d'événement à l'élément sur lequel il est déclaré. Lorsque cet événement est émis, l'expression JavaScript définie comme sa valeur est exécutée. Vous pouvez utiliser `x-on` avec tout événement disponible pour l'élément sur lequel vous ajoutez la directive. Pour une liste complète des événements, voir [la référence des événements sur le MDN](https://developer.mozilla.org/fr/docs/Web/Events).

Si une donnée est modifiée dans l'expression, les attributs des autres éléments "liés" à cette donnée seront mis à jour.

> Note : Vous pouvez également spécifier un nom de fonction JavaScript.

**Exemple :** `<button x-on:click="myFunction"></button>`

C'est la même chose que : `<button x-on:click="myFunction($event)"></button>`

**Modificateurs `keydown`**

**Exemple :** `<input type="text" x-on:keydown.escape="open = false">`

Vous pouvez indiquer des clés spécifiques à écouter à l'aide des modificateurs keydown rajoutés à la directive `x-on:keydown`. Notez que les modificateurs sont des versions kebab-case des valeurs de `Event.key`.

Exemples : `enter`, `escape`, `arrow-up`, `arrow-down`

> Note : Vous pouvez également écouter des combinaisons de commandes système comme : `x-on:keydown.cmd.enter="foo"`

**Modificateur `.away`**

**Exemple :** `<div x-on:click.away="showModal = false"></div>`

Lorsque le modificateur `.away` est présent, le gestionnaire d'événement ne sera exécuté que lorsque l'événement provient d'une source externe à lui-même ou ses enfants.

Cela s'avère utile pour masquer des menus déroulants ou des fenêtres modales lorsque l'utilisateur clique ailleurs.

**Modificateur `.prevent`**
**Exemple :** `<input type="checkbox" x-on:click.prevent>`

L'ajout de `.prevent` à un écouteur d'événement appelle `preventDefault` sur l'événement déclenché. Dans l'exemple ci-dessus, cela signifie que la case à cocher ne sera pas réellement cochée lorsqu'un utilisateur cliquera dessus.

**Modificateur `.stop`**
**Exemple :** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

L'ajout de `.stop` à un écouteur d'événement appelle `stopPropagation` sur l'événement déclenché. Dans l'exemple ci-dessus, cela signifie que l'évènement "click" ne se propage pas à l'élément `<div>`. En d'autres termes, lorqu'un utilisateur clique sur le bouton, `foo` ne prend pas la valeur `'bar'`.

**Modificateur `.self`**
**Exemple :** `<div x-on:click.self="foo = 'bar'"><button></button></div>`

L'ajout de `.self` à un écouteur d'évènement déclenchera une action seulement si `$event.target` est lui-même l'élément. Dans l'exemple ci-dessus, cela signifie que lorsqu'on clique sur le bouton, **aucune** action ne sera déclenchée.

**Modificateur `.window`**
**Exemple :** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

L'ajout de `.window` à un écouteur d'événement installera l'écouteur sur l'objet global "window" au lieu du noeud DOM sur lequel il est déclaré. Ceci est utile quand vous souhaitez modifier l'état d'un composant lorsque quelque chose change dans la fenêtre, comme l'événement de redimensionnement. Dans l'exemple ci-dessus, lorsque la fenêtre s'agrandit de plus de 768 pixels de large, nous fermons le modal/dropdown, sinon nous maintenons le même état.

>Note : Vous pouvez également utiliser le modificateur `.document` pour rattacher des écouteurs d'évènements à `document` au lieu de `window`

**Modificateur `.once`**
**Exemple :** `<button x-on:mouseenter.once="fetchSomething()"></button>`

L'ajout du modificateur `.once` à un écouteur d'événement garantira que l'écouteur ne sera traité qu'une seule fois. C'est utile pour les choses que vous ne voulez faire qu'une seule fois, comme la récupération de morceaux de HTML et autres.

**Modificateur `.passive`**
**Exemple :** `<button x-on:mousedown.passive="interactive = true"></button>`

L'ajout du modificateur `.passive` à un écouteur d'événement rendra l'écouteur passif, ce qui signifie que `preventDefault()` ne fonctionnera pas sur les événements en cours de traitement, cela peut aider, par exemple pour les performances de défilement sur les périphériques tactiles.

**Modificateur `.debounce`**
**Exemple :** `<input x-on:input.debounce="fetchSomething()">`

Le modificateur `debounce` vous permet de limiter la fréquence d'exécution d'un gestionnaire d'événements. En d'autres termes, le gestionnaire d'événements ne fonctionnera PAS avant qu'un certain temps ne se soit écoulé depuis le dernier événement qui s'est déclenché. Lorsque le gestionnaire est prêt à être appelé, le dernier appel du gestionnaire s'exécutera.

Le temps d'attente par défaut de la fonction de rétention ("debounce") est de 250 millisecondes.

Pour personnaliser cette fonction, vous pouvez définir un temps d'attente :

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

**Modificateur `.camel`**
**Exemple :** `<input x-on:event-name.camel="doSomething()">`

Le modificateur `camel` attache un écouteur d'évènement en version "camel case" du nom d'un évènement. Dans l'exemple ci-dessus, l'expression est évaluée lorsque l'évènement `eventName` est déclenché sur l'élément.

---

### `x-model`
**Exemple :** `<input type="text" x-model="foo">`

**Structure :** `<input type="text" x-model="[data item]">`

`x-model` ajoute à un élément une liaison de données à double sens ("two-way data binding"). En d'autres termes, la valeur de l'élément d'entrée sera maintenue en synchronisation avec la valeur de l'élément de données du composant.

> Note : `x-model` est assez intelligent pour détecter les changements sur les entrées de texte, les cases à cocher, les boutons radio, les textareas, les sélections et les sélections multiples. Il devrait se comporter [comme le ferait Vue](https://fr.vuejs.org/v2/guide/forms.html) dans ces scénarios.

**Modificateur `.number`**
**Exemple :** `<input x-model.number="age">`

Le modificateur `number` convertira la valeur de l'entrée en un nombre. Si la valeur ne peut pas être analysée comme un nombre valide, la valeur originale est renvoyée.

**Modificateur `.debounce`**
**Exemple :** `<input x-model.debounce="search">`

Le modificateur `debounce` vous permet d'émettre un temps de réponse sur la mise à jour d'une valeur. En d'autres termes, le gestionnaire d'événements ne fonctionnera PAS avant qu'un certain temps ne se soit écoulé depuis le dernier événement qui s'est déclenché. Lorsque le gestionnaire est prêt à être appelé, le dernier appel du gestionnaire s'exécutera.

Le temps d'attente par défaut de la fonction de rétention ("debounce") est de 250 millisecondes.

Pour personnaliser cette fonction, vous pouvez définir un temps d'attente :

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

---

### `x-text`
**Exemple :** `<span x-text="foo"></span>`

**Structure :** `<span x-text="[expression]"`

`x-text` fonctionne comme `x-bind`, sauf qu'au lieu de mettre à jour la valeur d'un attribut, il mettra à jour le `innerText` d'un élément.

---

### `x-html`
**Exemple :** `<span x-html="foo"></span>`

**Structure :** `<span x-html="[expression]"`

`x-html` fonctionne comme `x-bind`, sauf qu'au lieu de mettre à jour la valeur d'un attribut, il mettra à jour le `innerHTML` d'un élément.

> :warning: **A n'utiliser uniquement sur du contenu de confiance et jamais sur du contenu fourni par l'utilisateur.** :warning:
>
> Le rendu dynamique de HTML provenant de tiers peut facilement conduire à des vulnérabilités [XSS](https://developer.mozilla.org/fr/docs/Glossaire/Cross-site_scripting).

---

### `x-ref`
**Exemple :** `<div x-ref="foo"></div><button x-on:click="$refs.foo.innerText = 'bar'"></button>`

**Structure :** `<div x-ref="[ref name]"></div><button x-on:click="$refs.[ref name].innerText = 'bar'"></button>`

La fonction `x-ref` offre un moyen pratique de récupérer les éléments DOM bruts de votre composant. En plaçant un attribut `x-ref` sur un élément, vous le rendez disponible à tous les gestionnaires d'événements à l'intérieur d'un objet appelé `$refs`.

C'est une alternative utile à la mise en place d'identifiants et à l'utilisation de `document.querySelector` partout.

> Note : si vous en avez besoin, vous pouvez également lier des valeurs dynamiques pour x-ref : `<span :x-ref="item.id"></span>`.

---

### `x-if`
**Exemple :** `<template x-if="true"><div>Quelques éléments</div></template>`

**Structure :** `<template x-if="[expression]"><div>Quelques éléments</div></template>`

Pour les cas où `x-show` n'est pas suffisant (`x-show` met un élément à `display : none` s'il est faux), `x-if` peut être utilisé pour supprimer complètement un élément du DOM.

Il est important que `x-if` soit utilisé sur des balises `<template></template>` car Alpine n'utilise pas de DOM virtuel. Cette implémentation permet à Alpine de rester robuste et d'utiliser le DOM réel pour opérer sa magie.

> Note : `x-if` doit avoir une racine d'élément unique (root element) à l'intérieur des balises `<template></template>`.

> Note : Lorsque vous utilisez un `template` dans une balise `svg`, vous devez ajouter un [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) qui doit être exécuté avant que Alpine.js ne soit initialisé.

---

### `x-for`
**Exemple :**
```html
<template x-for="item in items" :key="item">
    <div x-text="item"></div>
</template>
```

> Note : la liaison `:key` est facultative, mais FORTEMENT recommandée.

La fonction `x-for` est disponible dans les cas où vous souhaitez créer de nouveaux nœuds DOM pour chaque élément d'un tableau. Cela devrait ressembler à `v-for` dans Vue, à l'exception de la nécessité d'exister sur une balise `template`, et non sur un élément DOM ordinaire.

Si vous voulez accéder à l'index actuel de l'itération, utilisez la syntaxe suivante :

```html
<template x-for="(item, index) in items" :key="index">
    <!-- Vous pouvez également faire référence à un "index" à l'intérieur de l'itération si vous le souhaitez. -->
    <div x-text="index"></div>
</template>
```

Si vous voulez accéder à l'objet tableau (collection) de l'itération, utilisez la syntaxe suivante :

```html
<template x-for="(item, index, collection) in items" :key="index">
    <!-- Vous pouvez également faire référence à la "collection" à l'intérieur de l'itération si vous le souhaitez. -->
    <!-- Elément actuel. -->
    <div x-text="item"></div>
    <!-- Même chose que ci-dessus. -->
    <div x-text="collection[index]"></div>
    <!-- Elément précédent. -->
    <div x-text="collection[index - 1]"></div>
</template>
```

> Note : `x-for` doit avoir une racine d'élément unique (root element) à l'intérieur des balises `<template></template>`.

> Note : Lorsque vous utilisez un `template` dans une balise `svg`, vous devez ajouter un [polyfill](https://github.com/alpinejs/alpine/issues/637#issuecomment-654856538) qui doit être exécuté avant que Alpine.js ne soit initialisé.

#### Imbriquer les `x-for`
Vous pouvez imbriquer des boucles `x-for`, mais vous DEVEZ envelopper chaque boucle dans un élément. Par exemple :

```html
<template x-for="item in items">
    <div>
        <template x-for="subItem in item.subItems">
            <div x-text="subItem"></div>
        </template>
    </div>
</template>
```

#### Itération sur une gamme (range)

Alpine supporte la syntaxe `i in n`, où `n` est un entier, ce qui vous permet d'itérer sur une gamme fixe d'éléments.

```html
<template x-for="i in 10">
    <span x-text="i"></span>
</template>
```

---

### `x-transition`
**Exemple :**
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

> L'exemple ci-dessus utilise des classes provenant de [Tailwind CSS](https://tailwindcss.com).

Alpine propose 6 directives de transition différentes pour appliquer des classes aux différentes étapes de la transition d'un élément entre les états "caché" et "montré". Ces directives fonctionnent à la fois avec `x-show` ET `x-if`.

Celles-ci se comportent exactement comme les directives de transition de VueJS, sauf qu'elles portent des noms différents et plus sensés :

| Directive | Description |
| --- | --- |
| `:enter` | Appliqué pendant toute la phase d'entrée. |
| `:enter-start` | Ajouté avant l'insertion de l'élément, retiré un bloc après l'insertion de l'élément. |
| `:enter-end` | Ajout d'un bloc après l'insertion d'un élément (en même temps que la suppression de `enter-start`), suppression lorsque la transition/animation se termine.
| `:leave` | Appliqué pendant toute la phase de sortie. |
| `:leave-start` | Ajouté immédiatement lorsqu'une transition de sortie est déclenchée, supprimé au bloc suivant. |
| `:leave-end` | Ajout d'un bloc après le déclenchement d'une transition de sortie (en même temps que la suppression du `leave-start`), suppression lorsque la transition/animation se termine.

---

### `x-spread`
**Exemple :**
```html
<div x-data="dropdown()">
    <button x-spread="trigger">Ouvrir Menu</button>

    <span x-spread="dialogue">Contenu du Menu</span>
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

`x-spread` permet d'extraire les liaisons d'Alpine (bindings) d'un élément pour en faire un objet réutilisable.

Les clés d'objet sont les directives (peut être n'importe quelle directive y compris les modificateurs), et les valeurs sont des callbacks à évaluer par Alpine.

> Note : l y a quelques restrictions à x-spread :
> - Lorsque la directive en cours de diffusion ("spread") est `x-for`, vous devez renvoyer une chaîne d'expression normale à partir du callback. Par exemple : `['x-for']() { return 'item in items' }`.
> - `x-data` et `x-init` ne peuvent pas être utilisés à l'intérieur d'un objet "spread".

---

### `x-cloak`
**Exemple :** `<div x-data="{}" x-cloak></div>`

Les attributs `x-cloak` sont retirés des éléments lorsque Alpine s'initialise. Ceci est utile pour masquer les DOM pré-initialisés. Il est typique d'ajouter le style global suivant pour que cela fonctionne :

```html
<style>
    [x-cloak] { display: none; }
</style>
```

### Propriétés magiques

> À l'exception de `$el`, les propriétés magiques ne sont **pas disponibles dans `x-data`** car le composant n'est pas encore initialisé.

---

### `$el`
**Exemple :**
```html
<div x-data>
    <button @click="$el.innerHTML = 'foo'">Remplacez-moi par "foo".</button>
</div>
```

`$el` est une propriété magique qui peut être utilisée pour récupérer le nœud DOM du composant racine.

### `$refs`
**Exemple :**
```html
<span x-ref="foo"></span>

<button x-on:click="$refs.foo.innerText = 'bar'"></button>
```

`$refs` est une propriété magique qui peut être utilisée pour récupérer les éléments du DOM marqués avec `x-ref` à l'intérieur du composant. C'est utile lorsque vous devez manipuler manuellement des éléments du DOM.

---

### `$event`
**Exemple :**
```html
<input x-on:input="alert($event.target.value)">
```

`$event` est une propriété magique qui peut être utilisée dans un écouteur d'événement pour récupérer l'objet "Event" du navigateur natif.

> Note : La propriété $event n'est disponible que dans les expressions DOM.

Si vous avez besoin d'accéder à $event à l'intérieur d'une fonction JavaScript, vous pouvez le passer directement :

`<button x-on:click="myFunction($event)"></button>`

---

### `$dispatch`
**Exemple :**
```html
<div @custom-event="console.log($event.detail.foo)">
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
    <!-- Lorsque cliqué, enregistre "bar" dans console.log  -->
</div>
```

**Note sur la propagation des événements**

Notez que, en raison du [event bubbling](https://en.wikipedia.org/wiki/Event_bubbling), lorsque vous devez capturer des événements envoyés par des nœuds qui sont sous la même hiérarchie d'imbrication, vous devrez utiliser le modificateur [`.window`](https://github.com/alpinejs/alpine#x-on) :

**Exemple :**

```html
<div x-data>
    <span @custom-event="console.log($event.detail.foo)"></span>
    <button @click="$dispatch('custom-event', { foo: 'bar' })">
<div>
```

> Cela ne fonctionnera pas, car lorsque le `custom-event` sera dispatché, il se propagera à son ancêtre commun, le `div`.

**Envoi (dispatch) aux composants**

Vous pouvez également profiter de la technique précédente pour faire communiquer vos composants entre eux :

**Exemple :**

```html
<div x-data @custom-event.window="console.log($event.detail)"></div>

<button x-data @click="$dispatch('custom-event', 'Hello World!')">
<!-- Lorsque cliqué, enregistre "Hello World!" dans console.log. -->
```

`$dispatch` est un raccourci pour créer un `CustomEvent` et l'envoyer en utilisant `.dispatchEvent()` en interne. Il existe de nombreux cas d'utilisation pour faire circuler des données entre les composants en utilisant des événements personnalisés. [Voir ici](https://developer.mozilla.org/fr/docs/Web/Guide/DOM/Events/Creating_and_triggering_events) pour plus d'informations sur le système `CustomEvent` sous-jacent dans les navigateurs.

Vous remarquerez que toute donnée passée comme deuxième paramètre à `$dispatch('some-event', { some : 'data' })`, devient disponible grâce à la nouvelle propriété "detail" des événements : `$event.detail.some`. Attacher des données d'événements personnalisés à la propriété `.detail` est une pratique standard pour les `CustomEvent` dans les navigateurs. Pour plus d'informations, [cliquez ici](https://developer.mozilla.org/fr/docs/Web/API/CustomEvent/detail).

Vous pouvez également utiliser `$dispatch()` pour déclencher des mises à jour de données pour les liaisons `x-model`. Par exemple :

```html
<div x-data="{ foo: 'bar' }">
    <span x-model="foo">
        <button @click="$dispatch('input', 'baz')">
        <!-- Après avoir cliqué sur le bouton, `x-model` captera l'événement "input" et remplacera foo par "baz". -->
    </span>
</div>
```

> Note : La propriété $dispatch n'est disponible que dans les expressions DOM.

Si vous avez besoin d'accéder à $dispatch à l'intérieur d'une fonction JavaScript, vous pouvez le passer directement :

`<button x-on:click="myFunction($dispatch)"></button>`

---

### `$nextTick`
**Exemple :**
```html
<div x-data="{ fruit: 'pomme' }">
    <button
        x-on:click="
            fruit = 'poire';
            $nextTick(() => { console.log($event.target.innerText) });
        "
        x-text="fruit"
    ></button>
</div>
```

`$nextTick` est une propriété magique qui vous permet de n'exécuter une expression donnée qu'APRÈS qu'Alpine ait fait ses mises à jour réactives du DOM. Ceci est utile pour les fois où vous voulez interagir avec l'état DOM APRÈS qu'il ait reflété les mises à jour de données que vous avez faites.

---

### `$watch`
**Exemple :**
```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Alterne Ouvrir</button>
</div>
```

Vous pouvez surveiller ("watch") une propriété d'un composant avec la méthode magique `$watch`. Dans l'exemple ci-dessus, lorsque l'on clique sur le bouton et que `open` change, le callback indiqué se déclenche et `console.log` enregistre la nouvelle valeur.

## Sécurité
Si vous trouvez une faille de sécurité, veuillez envoyer un courriel à [calebporzio@gmail.com]().

Alpine s'appuie sur une mise en œuvre personnalisée utilisant l'objet `Function` pour évaluer ses directives. Bien qu'il soit plus sûr que `eval()`, son utilisation est interdite dans certains environnements, comme Google Chrome App, qui utilise une politique de sécurité de contenu (Content Security Policy - CSP) restrictive.

Si vous utilisez Alpine sur un site web traitant des données sensibles et nécessitant un [CSP](https://csp.withgoogle.com/docs/strict-csp.html), vous devez inclure la mention `unsafe-eval` dans votre politique. Une politique solide et correctement configurée contribuera à protéger vos utilisateurs lors de l'utilisation de données personnelles ou financières.

Étant donné qu'une politique s'applique à tous les scripts de votre page, il est important que les autres bibliothèques externes incluses dans le site web soient soigneusement examinées pour s'assurer qu'elles sont dignes de confiance et qu'elles n'introduiront aucune vulnérabilité de Cross Site Scripting, que ce soit en utilisant la fonction `eval()` ou en manipulant le DOM pour injecter du code malveillant dans votre page.

## Feuille de route V3
* Passer de `x-ref` à `ref` pour la parité de Vue ?
* Ajouter `Alpine.directive()`
* Ajouter `Alpine.component('foo', {...})` (Avec la méthode magique `__init()`)
* Dispatcher des évènements d'Alpine pour "loaded", "transition-start", etc... ([#299](https://github.com/alpinejs/alpine/pull/299)) ?
* Supprimer la syntaxe "objet" (et tableau) de `x-bind:class="{ 'foo': true }"` ([#236](https://github.com/alpinejs/alpine/pull/236) pour ajouter le support de la syntaxe d'objet pour l'attribut `style`)
* Améliorer la réactivité des mutations `x-for` ([#165](https://github.com/alpinejs/alpine/pull/165))
* Ajouter le support de "deep watching" dans la V3 ([#294](https://github.com/alpinejs/alpine/pull/294))
* Ajouter le raccourci `$el`
* Remplacer `@click.away` par `@click.outside`?

## License

Copyright © 2019-2021 Caleb Porzio et contributeurs

Licencié sous la licence du MIT, voir [LICENSE.md](LICENSE.md) pour plus de détails.
