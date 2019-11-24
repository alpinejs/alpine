
export function walk(el, callback) {
    callback(el)

    let node = el.firstElementChild

    while (node) {
        walk(node, callback)
        node = node.nextElementSibling
    }
}

export function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

export function saferEval(expression, scope = {}) {
    return (new Function(Object.keys(scope), `"use strict"; return ${expression}`))(
        ...Object.values(scope)
    )
}

export function hasXAttr(el, name) {
    return !! Array.from(el.attributes)
        .map(i => i.name)
        .filter(i => i.search(new RegExp(`^x-${name}`)) > -1)
        .length
}

export function getXAttrs(el, name) {
    return Array.from(el.attributes)
        .filter(i => i.name.search(new RegExp(`^x-${name}`)) > -1)
}
