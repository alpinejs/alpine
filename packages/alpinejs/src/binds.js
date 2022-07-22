import { attributesOnly, directives } from "./directives"

let binds = {}

export function bind(name, bindings) {
    let getBindings = typeof bindings !== 'function' ? () => bindings : bindings

    if (name instanceof Element) {
        applyBindingsObject(name, getBindings())
    } else {
        binds[name] = getBindings
    }
}

export function injectBindingProviders(obj) {
    Object.entries(binds).forEach(([name, callback]) => {
        Object.defineProperty(obj, name, {
            get() {
                return (...args) => {
                    return callback(...args)
                }
            }
        })
    })

    return obj
}

export function addVirtualBindings(el, bindings) {
    let getBindings = typeof bindings !== 'function' ? () => bindings : bindings

    el._x_virtualDirectives = getBindings()
}

export function applyBindingsObject(el, obj, original) {
    let cleanupRunners = []

    while (cleanupRunners.length) cleanupRunners.pop()()

    let attributes = Object.entries(obj).map(([name, value]) => ({ name, value }))

    let staticAttributes = attributesOnly(attributes)

    // Handle binding normal HTML attributes (non-Alpine directives).
    attributes = attributes.map(attribute => {
        if (staticAttributes.find(attr => attr.name === attribute.name)) {
            return {
                name: `x-bind:${attribute.name}`,
                value: `"${attribute.value}"`,
            }
        }

        return attribute
    })

    directives(el, attributes, original).map(handle => {
        cleanupRunners.push(handle.runCleanups)

        handle()
    })
}
