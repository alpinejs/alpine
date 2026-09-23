---
order: 10
title: HTML Safe
description: Render sanitized HTML through a fixed allowlist, without eval or new Function
---

# HTML Safe Plugin

Alpine's `x-html` directive sets `el.innerHTML` directly from an expression, with no sanitization. That's fine when you trust the content, but it also means `x-html` isn't available on the [CSP build](/advanced/csp), since rendering arbitrary HTML is exactly the kind of unrestricted capability a strict Content Security Policy is meant to prevent.

The HTML Safe plugin gives you a `x-html-safe` directive as an alternative: it renders HTML through a fixed tag and attribute allowlist, so you can still inject content without reintroducing the risk that `x-html` carries. It works in both the standard build and the CSP build.

<a name="installation"></a>
## Installation

You can use this plugin by either including it from a `<script>` tag or installing it via NPM:

### Via CDN

You can include the CDN build of this plugin as a `<script>` tag, just make sure to include it BEFORE Alpine's core JS file.

```alpine
<!-- Alpine Plugins -->
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/html-safe@3.x.x/dist/cdn.min.js"></script>

<!-- Alpine Core -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Via NPM

You can install HTML Safe from NPM for use inside your bundle like so:

```shell
npm install @alpinejs/html-safe
```

Then initialize it from your bundle:

```js
import Alpine from 'alpinejs'
import htmlSafe from '@alpinejs/html-safe'

Alpine.plugin(htmlSafe)

...
```

<a name="x-html-safe"></a>
## x-html-safe

The primary API for this plugin is the `x-html-safe` directive. Use it exactly like you'd use `x-html`:

```alpine
<div x-data="{ description: '<strong>Bold</strong> product details' }">
    <div x-html-safe="description"></div>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ description: '<strong>Bold</strong> product details' }">
        <div x-html-safe="description"></div>
    </div>
</div>
<!-- END_VERBATIM -->

Whatever the expression returns is sanitized and rendered as HTML. Reactive updates re-sanitize automatically, and identical input strings are served from an internal cache rather than re-parsed on every update.

<a name="how-it-works"></a>
## How it works

`x-html-safe` doesn't try to blocklist dangerous patterns. Instead, it rebuilds the output from scratch using an allowlist:

1. The input string is parsed as inert HTML via [`DOMParser`](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser). Nothing in it executes: no `onerror` or `onload` handlers fire, even for elements like `<img>` or `<svg>`.
2. The parsed tree is walked recursively. Each node is one of:
    - **Text**: copied as-is.
    - **An allowed tag**: a new element is created, allowed attributes are copied (with validation where relevant), and its children are recursed into.
    - **A disallowed tag**: the tag itself is dropped, but its children are still recursed into and attached to the surrounding parent. Text content survives; the wrapping tag doesn't.
3. Alpine directives (`x-*`, `:*`, `@*`) are never in the attribute allowlist, so they can't survive sanitization. Injected content can't introduce new Alpine behavior, even if this plugin is loaded on the page.

This means an unrecognized tag doesn't need a corresponding blocklist entry. "Not on the allowlist" is the entire contract. A `<script>` or `<iframe>` gets stripped the same way an unknown or future tag would, with no separate list of "known bad" tags to maintain.

<a name="allowed-tags"></a>
## Allowed tags

```
a, b, i, em, strong, s, u, span, small, mark, abbr, cite, q, sup, sub, br,
code, kbd, samp, var, wbr,
p, div, h1, h2, h3, h4, h5, h6,
ul, ol, li, dl, dt, dd,
blockquote, pre, hr,
table, thead, tbody, tfoot, tr, th, td, caption, colgroup, col
```

Tags such as `img`, `picture`, `time`, and `data` are intentionally left out for now. They need dedicated validation (resource loading, date and time formats) that hasn't been built yet.

`id`, `name`, and `style` are never allowed on any tag. `id` and `name` enable [DOM clobbering](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/DOM_Clobbering), and `style` is a layout-attack vector.

`class` is allowed and copied through unvalidated, same as `data-*`. Note that on sites using a CSS framework with a build-time class scanner (for example a utility-CSS framework with arbitrary-value syntax like `class="bg-[url(...)]"`), an attacker-controlled `class` value can act as a resource-loading vector — but only when that scanner is actually active, in which case the same risk exists anywhere else user content reaches a `class` attribute on the page, independent of this plugin. This plugin does not special-case any particular CSS framework's scanner behavior.

For the full reasoning behind every tag and attribute decision above — including what's deliberately left out and why — see [`DECISIONS.md`](https://github.com/alpinejs/alpine/blob/main/packages/html-safe/DECISIONS.md) in the package source.

<a name="allowed-attributes"></a>
## Allowed attributes

These attributes are available on every allowed tag:

| Attribute | Notes |
|---|---|
| `title` | |
| `aria-label` | |
| `hidden` | Hides content from display and the accessibility tree in one attribute, with no value to inject |
| `role` | |
| `lang`, `dir` | |
| `class` | Copied unvalidated. See the note above about CSS-framework class scanners. |
| `data-*` | Copied via the browser's `dataset` API. The plugin copies the values; validating them is your component's responsibility. |

These attributes are available only on specific tags, each with its own validation:

| Tag | Attribute | Validation |
|---|---|---|
| `a` | `href` | Must resolve to `https:`, `http:`, `mailto:`, or `tel:`. `javascript:` and `data:` URLs are rejected. |
| `a` | `target` | Restricted to `_blank`, `_self`, `_parent`, `_top` |
| `a` | `rel` | Passed through as authored |
| `blockquote`, `q` | `cite` | Same URL validation as `href` |
| `li` | `value` | Any valid integer, no spec-defined bound |
| `ol` | `start` | Any valid integer, including negative |
| `ol` | `reversed` | Boolean presence attribute |
| `td`, `th` | `colspan` | 1-1000 ([WHATWG cap](https://html.spec.whatwg.org/multipage/tables.html#attr-tdth-colspan)) |
| `td`, `th` | `rowspan` | 1-65534 ([WHATWG cap](https://html.spec.whatwg.org/multipage/tables.html#attr-tdth-rowspan), deliberately distinct from `colspan`'s) |
| `col` | `span` | 1-1000 |

<a name="tabnabbing-guard"></a>
### Cross-origin links get rel="noopener noreferrer" automatically

Any `<a>` whose `href` resolves to a different origin than the current page gets `noopener noreferrer` added to its `rel` attribute, regardless of what `target` is set to (or left unset).

This closes [reverse tabnabbing](https://owasp.org/www-community/attacks/Reverse_Tabnabbing). A user can open any link in a new browsing context through ctrl/cmd-click, middle-click, or a context-menu "open in new tab", independent of the link's own `target` value, so the guard can't be conditioned on `target="_blank"` alone. Same-origin links are left untouched, since there's no trust boundary to protect from a page linking to itself.

<a name="what-is-not-handled"></a>
## What's not handled

- **No developer configuration.** The allowlist is fixed. A misconfigured `allowTags: ['script']`-style escape hatch would defeat the plugin's entire premise, so there isn't one. If you need a tag or attribute that isn't covered, that's a change to the plugin itself, not a runtime option.
- **No Alpine directives in injected content.** `x-*`, `:*`, and `@*` attributes are stripped unconditionally. There's no "safe subset" of Alpine directives allowed through.
- **This plugin doesn't touch `x-html`.** Installing it registers a new `x-html-safe` directive. It doesn't alias, override, or otherwise change what `x-html` does (or doesn't do) elsewhere on your page. `x-html`'s behavior stays exactly what [its own docs](/directives/html) say, on every build, everywhere.

<a name="using-the-sanitize-function-directly"></a>
## Using the sanitize function directly

The plugin also exports its underlying `sanitize` function, in case you want to sanitize a string without going through the `x-html-safe` directive, for example to build your own directive that maps a different name onto the same sanitized behavior:

```js
import htmlSafe, { sanitize } from '@alpinejs/html-safe'

let fragment = sanitize('<strong>Bold</strong> text')
```

`sanitize` returns a `DocumentFragment` containing the sanitized nodes, ready to append into the DOM.
