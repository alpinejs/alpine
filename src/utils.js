
// Thanks @stimulus:
// https://github.com/stimulusjs/stimulus/blob/master/packages/%40stimulus/core/src/application.ts
export function domReady() {
    return new Promise(resolve => {
        if (document.readyState == "loading") {
            document.addEventListener("DOMContentLoaded", resolve)
        } else {
            resolve()
        }
    })
}

export function arrayUnique(array) {
    return Array.from(new Set(array))
}

export function isTesting() {
    return navigator.userAgent, navigator.userAgent.includes("Node.js")
        || navigator.userAgent.includes("jsdom")
}

export function kebabCase(subject) {
    return subject.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[_\s]/, '-').toLowerCase()
}

export function walk(el, callback) {
    if (callback(el) === false) return

    let node = el.firstElementChild

    while (node) {
        walk(node, callback)

        node = node.nextElementSibling
    }
}

export function debounce(func, wait) {
    var timeout
    return function () {
        var context = this, args = arguments
        var later = function () {
            timeout = null
            func.apply(context, args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

export function saferEval(expression, dataContext, additionalHelperVariables = {}) {
    if (typeof expression === 'function') {
        return expression.call(dataContext)
    }

    return (new Function(['$data', ...Object.keys(additionalHelperVariables)], `var __alpine_result; with($data) { __alpine_result = ${expression} }; return __alpine_result`))(
        dataContext, ...Object.values(additionalHelperVariables)
    )
}

export function saferEvalNoReturn(expression, dataContext, additionalHelperVariables = {}) {
    if (typeof expression === 'function') {
        return expression.call(dataContext)
    }

    // For the cases when users pass only a function reference to the caller: `x-on:click="foo"`
    // Where "foo" is a function. Also, we'll pass the function the event instance when we call it.
    if (Object.keys(dataContext).includes(expression)) {
        let methodReference = (new Function(['dataContext', ...Object.keys(additionalHelperVariables)], `with(dataContext) { return ${expression} }`))(
            dataContext, ...Object.values(additionalHelperVariables)
        )

        if (typeof methodReference === 'function') {
            return methodReference.call(dataContext, additionalHelperVariables['$event'])
        }
    }

    return (new Function(['dataContext', ...Object.keys(additionalHelperVariables)], `with(dataContext) { ${expression} }`))(
        dataContext, ...Object.values(additionalHelperVariables)
    )
}

const xAttrRE = /^x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref)\b/

export function isXAttr(attr) {
    const name = replaceAtAndColonWithStandardSyntax(attr.name)
    return xAttrRE.test(name)
}

export function getXAttrs(el, component, type) {
    return Array.from(el.attributes)
        .filter(isXAttr)
        .map(parseHtmlAttribute)
        .flatMap(i => {
            if (i.type === 'bind' && i.value === null) {
                let directiveBindings = saferEval(i.expression, component.$data)

                return Object.entries(directiveBindings).map(([name, value]) => parseHtmlAttribute({ name, value }))
            } else {
                return i
            }
        })
        .filter(i => {
            // If no type is passed in for filtering, bypass filter
            if (! type) return true

            return i.type === type
        })
}

function parseHtmlAttribute({ name, value }) {
    const normalizedName = replaceAtAndColonWithStandardSyntax(name)

    const typeMatch = normalizedName.match(xAttrRE)
    const valueMatch = normalizedName.match(/:([a-zA-Z\-:]+)/)
    const modifiers = normalizedName.match(/\.[^.\]]+(?=[^\]]*$)/g) || []

    return {
        type: typeMatch ? typeMatch[1] : null,
        value: valueMatch ? valueMatch[1] : null,
        modifiers: modifiers.map(i => i.replace('.', '')),
        expression: value,
    }
}

export function isBooleanAttr(attrName) {
    // As per HTML spec table https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute
    // Array roughly ordered by estimated usage
    const booleanAttributes = [
        'disabled', 'checked', 'required', 'readonly', 'hidden', 'open', 'selected',
        'autofocus', 'itemscope', 'multiple', 'novalidate', 'allowfullscreen',
        'allowpaymentrequest', 'formnovalidate', 'autoplay', 'controls', 'loop',
        'muted', 'playsinline', 'default', 'ismap', 'reversed', 'async', 'defer',
        'nomodule'
    ]

    return booleanAttributes.includes(attrName)
}

export function replaceAtAndColonWithStandardSyntax(name) {
    if (name.startsWith('@')) {
        return name.replace('@', 'x-on:')
    } else if (name.startsWith(':')) {
        return name.replace(':', 'x-bind:')
    }

    return name
}

export function isNumeric(subject) {
    return ! isNaN(subject)
}

export function showElement(el) {
    if (el.style.length === 1 && el.style.display === 'none') {
        el.removeAttribute('style')
    } else {
        el.style.removeProperty('display')
    }
}

export function hideElement(el) {
    el.style.display = 'none'
}

/**
 * Thanks to @Vue
 * Ensure a function is called only once.
 */
export function once(fn) {
    let called = false
    return function () {
        if (!called) {
            called = true
            fn.apply(this, arguments)
        }
    }
}