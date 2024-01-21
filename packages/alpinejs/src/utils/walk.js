export function walk(el, callback) {
    if (typeof ShadowRoot === 'function' && el instanceof ShadowRoot) {
        Array.from(el.children).forEach(el => walk(el, callback))

        return
    }

    let skip = false

    callback(el, () => skip = true)

    if (skip) return

    let node = el.firstElementChild

    while (node) {
        walk(node, callback, false)

        node = node.nextElementSibling
    }
}
