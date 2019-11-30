
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

export function isTesting() {
    return navigator.userAgent, navigator.userAgent.includes("Node.js")
        || navigator.userAgent.includes("jsdom")
}

export function walk(el, callback) {
    callback(el)

    let node = el.firstElementChild

    while (node) {
        walk(node, callback)
        node = node.nextElementSibling
    }
}

export function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

export function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

export function saferEval(expression, dataContext, additionalHelperVariables = {}) {
    return (new Function(['$data', ...Object.keys(additionalHelperVariables)], `var result; with($data) { result = ${expression} }; return result`))(
        dataContext, ...Object.values(additionalHelperVariables)
    )
}

export function saferEvalNoReturn(expression, dataContext, additionalHelperVariables = {}) {
    return (new Function(['$data', ...Object.keys(additionalHelperVariables)], `with($data) { ${expression} }`))(
        dataContext, ...Object.values(additionalHelperVariables)
    )
}

export function isXAttr(attr) {
    const xAttrRE = /x-(on|bind|data|text|model)/

    return xAttrRE.test(attr.name)
}

export function getXAttrs(el, type) {
    return Array.from(el.attributes)
        .filter(isXAttr)
        .map(attr => {
            const typeMatch = attr.name.match(/x-(on|bind|data|text|model)/)
            const valueMatch = attr.name.match(/:([a-zA-Z\-]+)/)
            const modifiers = attr.name.match(/\.[^.\]]+(?=[^\]]*$)/g) || []

            return {
                type: typeMatch ? typeMatch[1] : null,
                value: valueMatch ? valueMatch[1] : null,
                modifiers: modifiers.map(i => i.replace('.', '')),
                expression: attr.value,
            }
        })
        .filter(i => {
            // If no type is passed in for filtering, bypassfilter
            if (! type) return true

            return i.type === name
        })
}
