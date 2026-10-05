const ALLOWED_TAGS = new Set([
    // Inline
    'a', 'b', 'i', 'em', 'strong', 's', 'u', 'span', 'small', 'mark', 'abbr', 'cite', 'q', 'sup', 'sub', 'br',
    'code', 'kbd', 'samp', 'var', 'wbr',
    // Block / structural
    'p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'blockquote', 'pre', 'hr',
    // Tables
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
])

const ALLOWED_PROTOCOLS = new Set(['https:', 'http:', 'mailto:', 'tel:'])

const TARGET_KEYWORDS = new Set(['_blank', '_self', '_parent', '_top'])

// Generates a validator, not a validator itself — used below to build the
// named numeric entries in Validators, each with its own real bound.
const isNumberBetween = (min, max) => value => {
    const n = Number(value)
    return Number.isInteger(n) && n >= min && n <= max
}

// Every entry is a plain value => boolean — used bare in TAG_ATTRS, no calls.
const Validators = {
    safeUrl: value => {
        try {
            return ALLOWED_PROTOCOLS.has(new URL(value, location.href).protocol)
        } catch {
            return false
        }
    },
    // Presence-only attribute (e.g. `reversed`) — any value means "on".
    isBoolean: () => true,
    targetKeyword: value => TARGET_KEYWORDS.has(value),
    isSameOrigin: value => {
        try {
            return new URL(value, location.href).origin === location.origin
        } catch {
            return false
        }
    },
    // Bounds below are the WHATWG spec's actual processing-model caps —
    // colspan/span and rowspan are NOT the same limit.
    colspan: isNumberBetween(1, 1000),
    rowspan: isNumberBetween(1, 65534),
    span: isNumberBetween(1, 1000),
    // li[value] / ol[start] are plain valid integers with no spec-defined
    // bound — capped at MAX_SAFE_INTEGER purely so a pathological value
    // can't reach a downstream numeric parser unbounded.
    unboundedInt: isNumberBetween(-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
}

const GENERIC_ATTRS = new Set(['title', 'aria-label', 'hidden', 'role', 'lang', 'dir', 'class'])

const TAG_ATTRS = {
    a: { href: [Validators.safeUrl], target: [Validators.targetKeyword], rel: [] },
    q: { cite: [Validators.safeUrl] },
    blockquote: { cite: [Validators.safeUrl] },
    li: { value: [Validators.unboundedInt] },
    ol: { start: [Validators.unboundedInt], reversed: [Validators.isBoolean] },
    td: { colspan: [Validators.colspan], rowspan: [Validators.rowspan] },
    th: { colspan: [Validators.colspan], rowspan: [Validators.rowspan] },
    col: { span: [Validators.span] },
}

// Tag-specific fixups, run after attributes are copied. Keeps walk() generic —
// tag-specific behavior lives here, not as branches in the tree-rebuilder.
const PostProcess = {
    // Reverse-tabnabbing guard. A user can open ANY link in a new browsing
    // context (ctrl/cmd-click, middle-click, "open in new tab") regardless of
    // its target attribute — so this can't be conditioned on target="_blank";
    // only origin is the real gate. Same-origin links are trusted (no
    // opener/Referer to hide from ourselves); cross-origin links get
    // noopener/noreferrer so a malicious destination can't rewrite this tab
    // via window.opener if the user opens it in a new context.
    a: el => {
        const href = el.getAttribute('href')
        if (!href || Validators.isSameOrigin(href)) return

        const rel = new Set((el.getAttribute('rel') || '').split(/\s+/).filter(Boolean))
        rel.add('noopener').add('noreferrer')
        el.setAttribute('rel', [...rel].join(' '))
    },
}

// Map<string, DocumentFragment>
const cache = new Map()
const parser = new DOMParser()

function sanitize(html) {
    if (cache.has(html)) return cache.get(html).cloneNode(true)

    const source = parser.parseFromString(html, 'text/html').body

    const fragment = document.createDocumentFragment()
    walk(source, fragment)

    cache.set(html, fragment.cloneNode(true))
    return fragment
}

function walk(source, target) {
    for (const node of source.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            target.appendChild(document.createTextNode(node.textContent))
            continue
        }

        if (node.nodeType !== Node.ELEMENT_NODE) continue

        const tag = node.tagName.toLowerCase()

        if (!ALLOWED_TAGS.has(tag)) continue

        const el = document.createElement(tag)
        walk(node, el)

        for (const name of GENERIC_ATTRS) {
            if (node.hasAttribute(name)) el.setAttribute(name, node.getAttribute(name))
        }

        Object.assign(el.dataset, node.dataset)

        const tagAttrs = TAG_ATTRS[tag]
        if (tagAttrs) {
            for (const [name, validators] of Object.entries(tagAttrs)) {
                if (!node.hasAttribute(name)) continue
                const value = node.getAttribute(name)
                if (validators.every(fn => fn(value))) el.setAttribute(name, value)
            }
        }

        PostProcess[tag]?.(el)
        target.appendChild(el)
    }
}

export { sanitize }

export default function (Alpine) {
    Alpine.directive('html-safe', (el, { expression }, { evaluateLater, effect }) => {
        let evaluate = evaluateLater(expression)

        effect(() => {
            evaluate(value => {
                Alpine.mutateDom(() => {
                    el.innerHTML = ''
                    el.appendChild(sanitize(value ?? ''))

                    el._x_ignoreSelf = true
                    Alpine.initTree(el)
                    delete el._x_ignoreSelf
                })
            })
        })
    })
}
