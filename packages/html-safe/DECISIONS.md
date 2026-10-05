# Allowlist design decisions

This document explains why `x-html-safe`'s tag and attribute allowlist looks
the way it does — what's included, what's deliberately left out, and the
reasoning behind each call. It's meant to answer the natural first question
anyone reviewing a sanitizer allowlist asks: "why these, and not others?"

It's a companion to the source (`src/index.js`), not a replacement for it —
when this document and the code disagree, the code is right and this file is
stale.

## Why an allowlist, not a blocklist

A blocklist is a losing game. You block `script`, then someone finds `svg`
with an event handler, then `math`, then some obscure legacy tag nobody
thought to check. There will always be a dangerous tag or attribute the list
doesn't yet know about, and the failure mode is a security hole.

An allowlist inverts the contract: everything is denied by default, and only
what's explicitly trusted is permitted. A new dangerous tag invented tomorrow
can't sneak through, because "not on the list" is the entire rejection
criterion — no separate reasoning needed per tag.

## Why unknown tags drop their whole subtree, not just their own wrapper

When the walker meets a tag that isn't allowed, two behaviors are possible:

- **Keep text**: strip the tag, keep its children (`<div>hello</div>` →
  `hello`)
- **Drop entirely**: discard the tag and everything inside it
  (`<div>hello</div>` → `""`)

Keep-text feels right for something like a stray `<div>`, but it creates an
inconsistency: `<script>alert(1)</script>` clearly shouldn't preserve
`alert(1)` as visible text, yet both cases would otherwise go through the
same code path. Handling that exception would mean a second, `DROPPED_TAGS`-style
list — which reintroduces the exact whack-a-mole problem the allowlist exists
to avoid.

Dropping the whole subtree keeps the rule uniform: not on the list means it
does not exist, full stop, no exceptions to remember. The cost is that
content nested inside an unrecognized wrapper is lost, not just unwrapped —
that's treated as a content-authoring problem (use an allowed tag), not a
sanitizer bug.

## Tags

**Inline**: `a`, `b`, `i`, `em`, `strong`, `s`, `u`, `span`, `small`, `mark`,
`abbr`, `cite`, `q`, `sup`, `sub`, `br`, `code`, `kbd`, `samp`, `var`, `wbr` —
standard text-level semantics, all inert on their own.

**Block / structural**: `p`, `div`, `h1`–`h6`, `ul`, `ol`, `li`, `dl`, `dt`,
`dd`, `blockquote`, `pre`, `hr` — the common WYSIWYG-editor set.

**Tables**: `table`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`, `caption`,
`colgroup`, `col` — no meaningful attack surface beyond the numeric
attributes (`colspan`/`rowspan`/`span`) they carry, which are bounds-checked
(see Attributes below).

### Deliberately left out

- **`img`, `picture`, `source`, `figure`, `figcaption`.** `img` is the
  highest-value addition for real-world use (product descriptions lean on
  images heavily) and also the highest-risk single tag to add: `src`/`srcset`
  need real validation, resource loading fires even on a detached node before
  anything is inserted into the page, and getting the origin/protocol policy
  wrong is a one-way door once shipped. Left out until that validation story
  is designed properly, rather than shipped half-considered.
- **`time`, `data`.** Both need attribute-level format validation
  (`datetime`, `value`) that doesn't exist yet. Structurally similar to the
  `img` situation — better to add later with real validation than half-support
  now.
- **`details`.** Depends on the `open` boolean attribute, which is easy
  enough, but was bundled with the same "add validated-attribute tags
  together" batch as `img`/`time` rather than shipped alone.

None of these are blocked for a specific security reason on their own — they're
withheld because the attribute validation they need wasn't built at ship time,
not because the tags themselves are dangerous. Adding one is a scoped,
reviewable change: extend `ALLOWED_TAGS`, add the tag's specific attribute
validators to `TAG_ATTRS`, extend the test scenarios.

### Why the allowlist isn't developer-configurable

There's no `Alpine.plugin(HtmlSafe.configure({ allowTags: [...] }))` escape
hatch, and that's deliberate. Configurability reintroduces the whack-a-mole
problem the allowlist exists to eliminate — a misconfigured
`allowTags: ['script']` defeats the sanitizer's entire premise. If a real
project needs a tag or attribute this list doesn't cover, the right path is a
pull request against the plugin with the same scrutiny every other entry
here got, not a runtime knob that silently widens the trust boundary per
deployment.

## Attributes

### Generic (allowed on every tag)

| Attribute | Notes |
|---|---|
| `title` | Plain text, no execution surface. |
| `aria-label` | Accessibility. |
| `hidden` | Hides from display and the accessibility tree in one boolean attribute, with no value to inject. Preferred over `aria-hidden` for that reason — see below. |
| `role` | Accessibility. |
| `lang`, `dir` | Inert language/direction hints. |
| `class` | Copied through unvalidated, same as `data-*`. See "Why `class` is allowed" below. |
| `data-*` | Copied via the browser's `dataset` API, which handles name normalization in both directions — no attribute-name parsing needed. Values are plain strings and can't execute on their own; validating them is the responsibility of whatever Alpine component reads `$el.dataset.*`, not the sanitizer's. |

### Per-tag, each with its own validation

| Tag | Attribute | Validation |
|---|---|---|
| `a` | `href` | Must resolve (via `new URL(value, location.href)`) to `https:`, `http:`, `mailto:`, or `tel:`. Handles relative paths and fragments; protocol normalization closes case/whitespace bypass tricks automatically. |
| `a` | `target` | Restricted to the four spec keywords (`_blank`, `_self`, `_parent`, `_top`) — unrestricted, it could redirect an arbitrary same-page named `<iframe>`. |
| `a` | `rel` | Passed through as authored, no keyword restriction. |
| `blockquote`, `q` | `cite` | Same URL/protocol validation as `href`. |
| `li` | `value` | Any valid integer, including negative — there's no spec-defined bound. |
| `ol` | `start` | Same — any valid integer, negative allowed (`<ol start="-3">` is legal HTML). |
| `ol` | `reversed` | Boolean presence attribute. |
| `td`, `th` | `colspan` | 1–1000 (the real WHATWG processing-model cap). |
| `td`, `th` | `rowspan` | 1–65534 — **not** the same cap as `colspan`; an early implementation pass wrongly shared one bound across both before the discrepancy was caught against the actual spec text. |
| `col` | `span` | 1–1000, same cap as `colspan`. |

`target`/`rel`/`start`/`reversed` are scoped to their one real tag rather than
added to the generic set — a `<span target="_blank">` or `<table reversed>`
has no meaning, and a generic allowlist entry would pass it through anyway
with nothing to give it semantics.

### Cross-origin links get `rel="noopener noreferrer"` automatically

Any `<a>` whose `href` resolves to a different origin than the current page
gets `noopener noreferrer` added to `rel`, regardless of what `target` is set
to — including when `target` isn't set at all.

This is deliberately **not** gated on `target === '_blank'`. A user can force
any link into a new browsing context — ctrl/cmd-click, middle-click, "open
link in new tab" from the context menu — independent of the link's own
`target` value, and the browser honors the user's gesture over the link's
stated target. A `target`-gated guard would miss a plain
`<a href="https://cross-origin.example">` with no `target` at all, which is
exposed to exactly the same `window.opener` risk. Origin is the real trust
boundary here; `target` isn't.

### Blocked outright

`id` and `name` are never allowed — both let injected content be targeted
from the page's own JS or CSS (`document.getElementById`,
`document.getElementsByName`), which is the core mechanism behind DOM
clobbering attacks. `style` is blocked as a layout-attack vector (and would
be blocked by a strict CSP anyway, but the sanitizer doesn't assume CSP is
in place).

`aria-hidden` isn't on the list either — not because it's dangerous, but
because `hidden` covers the same need more safely: it's a boolean with no
value to inject, versus `aria-hidden`'s string value and its common
authoring misuse.

### Why `class` is allowed

This wasn't the original decision — `class` started out blocked. The
concern was real: on a site using a CSS framework with a build-time class
scanner (Tailwind's arbitrary-value syntax, `class="bg-[url(...)]"`, is the
concrete example), an attacker-controlled `class` value can make the
scanner emit real CSS that triggers a cross-origin resource load.

On reconsideration, that risk doesn't justify singling `class` out. It only
exists when such a scanner is actually active in the build — and if it is,
the same exposure exists anywhere else on the page where user-influenced
content reaches a `class` attribute, entirely independent of this plugin. A
sanitizer-level carve-out for one CSS framework's build-time behavior would
protect against nothing a real attacker couldn't route around, while
permanently costing every legitimate use of `class` for markup a consuming
project renders through this plugin (price displays, required-field
indicators, anything that depends on a stylesheet class for its correct
appearance — in at least one real-world case this turned out to be a
functional dependency, not just cosmetic, where JS code queried for the
class to patch content in place, not only styled by it). `x-html-safe`
doesn't special-case any particular framework's scanner behavior; if that
risk matters to a given deployment, it needs to be addressed at the
framework/build level, not papered over here.

### Alpine attributes: stripped unconditionally

`x-*`, `:*`, and `@*` are never in the attribute allowlist, on any tag —
sanitized content can't introduce new Alpine behavior even when the plugin
runs on a page that has Alpine loaded. This is the most sensitive category
by far: an expression-bearing directive in injected content (`x-on`,
`x-init`, `x-bind`, `x-data`, `x-model`, `x-effect`, ...) is arbitrary JS
execution or component-state manipulation with no meaningful way to make it
safe short of a full expression sandbox, which doesn't exist here.

A handful of Alpine directives take no expression at all and are inert by
construction — `x-cloak` (a display helper), `x-ignore` (tells Alpine to
skip a subtree, actively useful), `x-transition` (CSS transition class
hookup, no expression). These are the only plausible candidates for a future
safe subset, and even they aren't allowed today — there's no concrete use
case pulling for them yet, and "stripped unconditionally" is a much easier
invariant to reason about and keep correct than "stripped, except this
specific expression-free subset."

## What this document is not

It's not a claim that the current allowlist is final. Tags and attributes get
added when there's a concrete, validated need and the validation work to
support them safely — not preemptively. If something you need isn't listed
above, the fastest path is a pull request against `src/index.js` that adds
it with the same explicit reasoning and test coverage every existing entry
has, not a request to loosen the allowlist's shape.
